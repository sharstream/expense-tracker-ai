import { Expense, ExpenseCategory } from '@/types/expense';
import {
  SpendingTrend,
  CategoryTrend,
  TimeComparisonData,
  SpendingInsight,
  TopExpense,
  AnalyticsSummary,
  BudgetItem,
} from '@/types/analytics';
import {
  parseISO,
  format,
  subDays,
  isWithinInterval,
  differenceInDays,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { CATEGORIES } from './expenses';

/**
 * Calculate spending trends over time
 */
export function calculateSpendingTrends(
  expenses: Expense[],
  days: number | null = 30
): SpendingTrend[] {
  const now = new Date();
  const filteredExpenses =
    days === null
      ? expenses
      : expenses.filter((exp) => {
          const expDate = parseISO(exp.date);
          return isWithinInterval(expDate, {
            start: subDays(now, days),
            end: now,
          });
        });

  // Group by date
  const groupedByDate: Record<string, { amount: number; count: number }> = {};

  filteredExpenses.forEach((exp) => {
    const dateKey = format(parseISO(exp.date), 'yyyy-MM-dd');
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = { amount: 0, count: 0 };
    }
    groupedByDate[dateKey].amount += exp.amount;
    groupedByDate[dateKey].count += 1;
  });

  // Convert to array and sort by date
  return Object.entries(groupedByDate)
    .map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate spending trends by category
 */
export function calculateCategoryTrends(
  expenses: Expense[],
  days: number | null = 30
): CategoryTrend[] {
  const now = new Date();
  const filteredExpenses =
    days === null
      ? expenses
      : expenses.filter((exp) => {
          const expDate = parseISO(exp.date);
          return isWithinInterval(expDate, {
            start: subDays(now, days),
            end: now,
          });
        });

  return CATEGORIES.map((category) => {
    const categoryExpenses = filteredExpenses.filter((exp) => exp.category === category);
    const trends = calculateSpendingTrends(categoryExpenses, days);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = categoryExpenses.length > 0 ? total / categoryExpenses.length : 0;

    return {
      category,
      trends,
      total,
      average,
    };
  });
}

/**
 * Compare spending between two time periods
 */
export function compareTimePeriods(
  expenses: Expense[],
  periodDays: number = 30
): TimeComparisonData {
  const now = new Date();
  const currentStart = subDays(now, periodDays);
  const previousStart = subDays(currentStart, periodDays);
  const previousEnd = subDays(currentStart, 1);

  const currentExpenses = expenses.filter((exp) => {
    const expDate = parseISO(exp.date);
    return isWithinInterval(expDate, { start: currentStart, end: now });
  });

  const previousExpenses = expenses.filter((exp) => {
    const expDate = parseISO(exp.date);
    return isWithinInterval(expDate, { start: previousStart, end: previousEnd });
  });

  const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousTotal = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const currentAverage = currentExpenses.length > 0 ? currentTotal / currentExpenses.length : 0;
  const previousAverage =
    previousExpenses.length > 0 ? previousTotal / previousExpenses.length : 0;

  const changeAmount = currentTotal - previousTotal;
  const changePercentage =
    previousTotal > 0 ? ((changeAmount / previousTotal) * 100) : 0;

  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  if (changePercentage > 5) trend = 'up';
  else if (changePercentage < -5) trend = 'down';

  return {
    current: {
      period: `Last ${periodDays} days`,
      total: currentTotal,
      average: currentAverage,
      count: currentExpenses.length,
    },
    previous: {
      period: `Previous ${periodDays} days`,
      total: previousTotal,
      average: previousAverage,
      count: previousExpenses.length,
    },
    change: {
      amount: changeAmount,
      percentage: changePercentage,
      trend,
    },
  };
}

/**
 * Generate spending insights and recommendations
 */
export function generateInsights(
  expenses: Expense[],
  budgets?: Record<ExpenseCategory, number>
): SpendingInsight[] {
  const insights: SpendingInsight[] = [];
  const now = new Date();
  const last30Days = expenses.filter((exp) => {
    const expDate = parseISO(exp.date);
    return isWithinInterval(expDate, { start: subDays(now, 30), end: now });
  });

  // Check for overspending by category
  if (budgets) {
    CATEGORIES.forEach((category) => {
      const categorySpent = last30Days
        .filter((exp) => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      if (budgets[category] > 0 && categorySpent > budgets[category]) {
        const overage = categorySpent - budgets[category];
        const percentage = ((overage / budgets[category]) * 100).toFixed(0);
        insights.push({
          id: `overspend-${category}`,
          type: 'warning',
          title: `${category} Budget Exceeded`,
          message: `You've spent $${overage.toFixed(2)} (${percentage}%) over your ${category} budget this month.`,
          category,
          impact: 'high',
        });
      } else if (
        budgets[category] > 0 &&
        categorySpent > budgets[category] * 0.8
      ) {
        const remaining = budgets[category] - categorySpent;
        insights.push({
          id: `warning-${category}`,
          type: 'warning',
          title: `${category} Budget Alert`,
          message: `You're at ${((categorySpent / budgets[category]) * 100).toFixed(0)}% of your ${category} budget. $${remaining.toFixed(2)} remaining.`,
          category,
          impact: 'medium',
        });
      }
    });
  }

  // Compare to previous month
  const comparison = compareTimePeriods(expenses, 30);
  if (comparison.change.trend === 'up') {
    insights.push({
      id: 'spending-increase',
      type: 'info',
      title: 'Spending Increased',
      message: `Your spending is up ${Math.abs(comparison.change.percentage).toFixed(1)}% compared to the previous month ($${Math.abs(comparison.change.amount).toFixed(2)} increase).`,
      impact: 'medium',
    });
  } else if (comparison.change.trend === 'down') {
    insights.push({
      id: 'spending-decrease',
      type: 'success',
      title: 'Great Job!',
      message: `Your spending is down ${Math.abs(comparison.change.percentage).toFixed(1)}% compared to the previous month. You saved $${Math.abs(comparison.change.amount).toFixed(2)}!`,
      impact: 'high',
    });
  }

  // Check for high-frequency spending
  const frequentCategories = CATEGORIES.map((cat) => ({
    category: cat,
    count: last30Days.filter((exp) => exp.category === cat).length,
  }))
    .filter((item) => item.count > 15)
    .sort((a, b) => b.count - a.count);

  if (frequentCategories.length > 0) {
    const top = frequentCategories[0];
    insights.push({
      id: 'frequent-spending',
      type: 'info',
      title: 'Frequent Expenses',
      message: `You've made ${top.count} ${top.category} expenses in the last 30 days. Consider if any of these could be reduced.`,
      category: top.category,
      impact: 'low',
    });
  }

  // Check for unusual large expenses
  const avgExpense =
    last30Days.length > 0
      ? last30Days.reduce((sum, exp) => sum + exp.amount, 0) / last30Days.length
      : 0;
  const largeExpenses = last30Days.filter((exp) => exp.amount > avgExpense * 3);

  if (largeExpenses.length > 0) {
    const total = largeExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    insights.push({
      id: 'large-expenses',
      type: 'info',
      title: 'Large Expenses Detected',
      message: `You had ${largeExpenses.length} unusually large expense${largeExpenses.length > 1 ? 's' : ''} totaling $${total.toFixed(2)} this month.`,
      impact: 'medium',
    });
  }

  // Positive reinforcement
  if (last30Days.length > 0 && insights.length === 0) {
    insights.push({
      id: 'on-track',
      type: 'success',
      title: 'You\'re On Track!',
      message: 'Your spending is within normal ranges. Keep up the good financial habits!',
      impact: 'low',
    });
  }

  // Tip for saving
  if (Math.random() > 0.7) {
    const tips = [
      'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
      'Small daily expenses add up. Consider tracking coffee and snack purchases.',
      'Set up automatic transfers to savings on payday.',
      'Review subscriptions monthly - cancel unused services.',
      'Use the 24-hour rule for non-essential purchases over $50.',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    insights.push({
      id: 'saving-tip',
      type: 'tip',
      title: 'Money Saving Tip',
      message: randomTip,
      impact: 'low',
    });
  }

  return insights;
}

/**
 * Calculate top expenses
 */
export function getTopExpenses(expenses: Expense[], limit: number = 5): TopExpense[] {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return expenses
    .map((exp) => ({
      id: exp.id,
      date: exp.date,
      category: exp.category,
      description: exp.description,
      amount: exp.amount,
      percentageOfTotal: total > 0 ? (exp.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Calculate comprehensive analytics summary
 */
export function calculateAnalyticsSummary(
  expenses: Expense[],
  days: number | null = 30
): AnalyticsSummary {
  const now = new Date();
  const filteredExpenses =
    days === null
      ? expenses
      : expenses.filter((exp) => {
          const expDate = parseISO(exp.date);
          return isWithinInterval(expDate, {
            start: subDays(now, days),
            end: now,
          });
        });

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const count = filteredExpenses.length;
  const average = count > 0 ? total / count : 0;

  // Calculate median
  const sortedAmounts = filteredExpenses
    .map((exp) => exp.amount)
    .sort((a, b) => a - b);
  const median =
    sortedAmounts.length > 0
      ? sortedAmounts.length % 2 === 0
        ? (sortedAmounts[sortedAmounts.length / 2 - 1] +
            sortedAmounts[sortedAmounts.length / 2]) /
          2
        : sortedAmounts[Math.floor(sortedAmounts.length / 2)]
      : 0;

  const topExpenses = getTopExpenses(filteredExpenses, 5);

  // Calculate averages by time period
  const actualDays = days || (filteredExpenses.length > 0
    ? differenceInDays(
        parseISO(filteredExpenses[0].date),
        parseISO(filteredExpenses[filteredExpenses.length - 1].date)
      ) + 1
    : 1);

  const dailyAverage = actualDays > 0 ? total / actualDays : 0;
  const weeklyAverage = dailyAverage * 7;
  const monthlyAverage = dailyAverage * 30;

  const lowestExpenseData = sortedAmounts.length > 0
    ? filteredExpenses.find((exp) => exp.amount === sortedAmounts[0])
    : null;

  const lowestExpense: TopExpense | null = lowestExpenseData
    ? {
        id: lowestExpenseData.id,
        date: lowestExpenseData.date,
        category: lowestExpenseData.category,
        description: lowestExpenseData.description,
        amount: lowestExpenseData.amount,
        percentageOfTotal: total > 0 ? (lowestExpenseData.amount / total) * 100 : 0,
      }
    : null;

  return {
    totalExpenses: total,
    averageExpense: average,
    medianExpense: median,
    highestExpense: topExpenses[0] || null,
    lowestExpense,
    topExpenses,
    dailyAverage,
    weeklyAverage,
    monthlyAverage,
  };
}

/**
 * Calculate budget items with current spending
 */
export function calculateBudgetItems(
  expenses: Expense[],
  budgets: Record<ExpenseCategory, number>
): BudgetItem[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = parseISO(exp.date);
    return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
  });

  return CATEGORIES.map((category) => {
    const spent = monthlyExpenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const limit = budgets[category] || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const isOverBudget = spent > limit && limit > 0;

    return {
      category,
      limit,
      spent,
      percentage,
      isOverBudget,
    };
  });
}

/**
 * Get formatted date range label
 */
export function getDateRangeLabel(days: number | null): string {
  if (days === null) return 'All Time';
  if (days === 7) return 'Last 7 Days';
  if (days === 30) return 'Last 30 Days';
  if (days === 90) return 'Last 90 Days';
  if (days === 365) return 'Last Year';
  return `Last ${days} Days`;
}
