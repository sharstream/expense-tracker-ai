# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expense Tracker AI - A modern, professional NextJS expense tracking application that helps users manage their personal finances. Built with NextJS 14, TypeScript, Tailwind CSS, and localStorage for data persistence.

## Technology Stack

- **Framework**: NextJS 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Data Persistence**: localStorage (browser-based)

## Development Commands

### Setup and Installation
```bash
npm install
```

### Running the Application
```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Project Structure

```
expense-tracker-ai/
├── app/                    # NextJS App Router
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Main application page (home)
│   └── globals.css        # Global styles and Tailwind imports
├── components/            # React components
│   ├── ExpenseForm.tsx   # Form for adding/editing expenses
│   ├── ExpenseList.tsx   # List view of expenses
│   ├── ExpenseFilters.tsx # Filter controls
│   ├── SummaryCards.tsx  # Dashboard summary cards
│   ├── CategoryChart.tsx # Category breakdown visualization
│   └── ExportButton.tsx  # CSV export functionality
├── lib/                   # Utility functions
│   ├── expenses.ts       # Expense operations and calculations
│   └── storage.ts        # localStorage wrapper
├── types/                 # TypeScript definitions
│   └── expense.ts        # Expense-related types
└── [config files]        # NextJS, TypeScript, Tailwind configs
```

### Key Components

**Main Page (app/page.tsx)**
- Central hub that orchestrates all functionality
- Manages global state for expenses, filters, and UI modes
- Handles CRUD operations via storage utility
- Renders dashboard, forms, filters, and expense list

**ExpenseForm Component**
- Dual-mode: create new or edit existing expenses
- Client-side validation for all fields
- Real-time error display
- Supports date picker (max: today), amount input, category selection

**ExpenseList Component**
- Displays expenses with category icons and color coding
- Edit and delete actions per expense
- Confirmation dialog for deletions
- Empty state handling

**Storage Layer (lib/storage.ts)**
- Abstraction over localStorage
- CRUD operations: add, update, delete, get all expenses
- Safe error handling for localStorage failures
- SSR-safe (checks for window object)

**Expense Utilities (lib/expenses.ts)**
- Filter expenses by category, date range, search query
- Calculate summaries: total spending, monthly spending, category breakdown
- Sort expenses by date or amount
- CSV export functionality
- Currency formatting

### Data Flow

1. **Initial Load**: Page loads → storage.getExpenses() → setState
2. **Add Expense**: Form submit → storage.addExpense() → update state → re-render
3. **Edit Expense**: Click edit → populate form → submit → storage.updateExpense() → update state
4. **Delete Expense**: Click delete → confirm → storage.deleteExpense() → update state
5. **Filter**: Change filter → filterExpenses() → update filteredExpenses → re-render list
6. **Export**: Click export → downloadCSV() → browser downloads CSV file

### Categories

The app supports six predefined categories:
- Food 🍔
- Transportation 🚗
- Entertainment 🎬
- Shopping 🛍️
- Bills 📄
- Other 📌

Each category has an associated color (used in UI) and emoji icon.

## Development Guidelines

### Adding New Features

When adding features, maintain the separation of concerns:
- **Components**: UI presentation and user interactions
- **lib/**: Business logic and data operations
- **types/**: TypeScript interfaces and types
- **State management**: React hooks in page.tsx

### Styling Conventions

- Use Tailwind utility classes
- Primary color scheme: blue (primary-500, primary-600, etc.)
- Consistent spacing: 4-6 padding for cards, 3-4 gap for grids
- Mobile-first responsive design with md: and lg: breakpoints

### Type Safety

All components use TypeScript with strict mode enabled. Key types:
- `Expense`: Core expense object with id, date, amount, category, description
- `ExpenseCategory`: Union type of allowed categories
- `ExpenseFilters`: Filter criteria object
- `ExpenseSummary`: Calculated summary statistics

### localStorage Schema

Data is stored as a JSON array under the key `expense-tracker-data`:
```typescript
Expense[] = [
  {
    id: "timestamp-randomstring",
    date: "YYYY-MM-DD",
    amount: 50.00,
    category: "Food",
    description: "Lunch at restaurant",
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  }
]
```

## Testing the Application

### Manual Testing Checklist

1. **Add Expense**: Fill form → submit → verify appears in list
2. **Edit Expense**: Click edit → modify → submit → verify changes
3. **Delete Expense**: Click delete → confirm → verify removed
4. **Filters**: Test category, date range, and search filters
5. **Summary Cards**: Verify calculations update correctly
6. **Category Chart**: Check percentages and amounts
7. **Export CSV**: Download and verify CSV format
8. **Responsive**: Test on mobile, tablet, and desktop sizes
9. **Validation**: Try submitting invalid data (empty fields, negative amounts)
10. **Persistence**: Refresh page → verify data persists

## Common Issues

- **Data not persisting**: Check browser localStorage is enabled
- **TypeScript errors**: Run `npm install` to ensure all types are installed
- **Build errors**: Clear `.next` folder and rebuild
- **Styling issues**: Ensure Tailwind config includes all content paths
