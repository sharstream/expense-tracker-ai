# Expense Tracker - Setup and Testing Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### 3. Build for Production (Optional)

```bash
npm run build
npm start
```

## Complete Feature Testing Guide

### Test 1: Add Your First Expense

1. Open http://localhost:3000 in your browser
2. Click the **"Add Expense"** button (blue button, top right)
3. Fill in the form:
   - **Date**: Select today's date
   - **Amount**: Enter `50.00`
   - **Category**: Select "Food"
   - **Description**: Enter "Lunch at restaurant"
4. Click **"Add Expense"**
5. ✅ **Verify**: Expense appears in the list below

### Test 2: Add Multiple Expenses

Add these expenses to see the app in action:

```
1. Date: Today, Amount: 15.50, Category: Transportation, Description: "Uber to office"
2. Date: Yesterday, Amount: 120.00, Category: Shopping, Description: "New shoes"
3. Date: Today, Amount: 45.00, Category: Entertainment, Description: "Movie tickets"
4. Date: 2 days ago, Amount: 85.00, Category: Bills, Description: "Internet bill"
```

5. ✅ **Verify**: All expenses appear in the list, sorted by date (newest first)

### Test 3: Dashboard Summary Cards

After adding expenses above, check the summary cards at the top:

- **Total Spending**: Should show sum of all expenses (~$315.50)
- **This Month**: Should show sum of current month expenses
- **Top Category**: Should show the category with highest spending

✅ **Verify**: All numbers are calculated correctly

### Test 4: Category Breakdown Chart

On the right sidebar, you should see:
- A chart showing spending by category
- Each category with a colored bar
- Percentage and dollar amount for each category
- Categories sorted by amount (highest to lowest)

✅ **Verify**: The chart displays correctly with proper percentages

### Test 5: Edit an Expense

1. Find any expense in the list
2. Click the **pencil icon** (blue edit button)
3. The form will populate with that expense's data
4. Change the amount to a different value
5. Click **"Update Expense"**
6. ✅ **Verify**:
   - The expense updates in the list
   - Summary cards update with new totals
   - Category chart reflects the change

### Test 6: Delete an Expense

1. Find any expense in the list
2. Click the **trash icon** (red delete button)
3. Confirm the deletion in the popup dialog
4. ✅ **Verify**:
   - Expense is removed from the list
   - Summary cards update
   - Category chart updates

### Test 7: Search Functionality

1. In the filters section, type in the **Search** box:
   - Try "food" - should show food-related expenses
   - Try "50" - should show expenses with 50 in amount
   - Try "uber" - should show transportation expenses
2. ✅ **Verify**: Results update in real-time as you type

### Test 8: Category Filter

1. In the filters section, change **Category** dropdown:
   - Select "Food" - should show only food expenses
   - Select "All Categories" - should show all expenses
2. ✅ **Verify**: List filters correctly

### Test 9: Date Range Filter

1. In the filters section:
   - Set **From** date to 3 days ago
   - Set **To** date to today
2. ✅ **Verify**: Only expenses within that range are shown
3. Click **"Clear all"** to reset filters
4. ✅ **Verify**: All expenses show again

### Test 10: Export to CSV

1. With some expenses visible, click **"Export CSV"** button (green button)
2. A file named `expenses-YYYY-MM-DD.csv` will download
3. Open the CSV file in Excel or a text editor
4. ✅ **Verify**:
   - Contains headers: Date, Category, Amount, Description
   - All visible expenses are included
   - Data is properly formatted

### Test 11: Data Persistence

1. Add a few expenses
2. **Refresh the browser page** (F5 or Cmd+R)
3. ✅ **Verify**: All expenses are still there (stored in localStorage)

### Test 12: Form Validation

Test that validation works properly:

1. Click "Add Expense"
2. Try to submit the form **without** filling anything:
   - ✅ Should show "Amount must be greater than 0"
   - ✅ Should show "Description is required"
3. Enter a **negative amount**: -10
   - ✅ Should show error
4. Enter amount `0`:
   - ✅ Should show "Amount must be greater than 0"
5. Leave description empty:
   - ✅ Should show "Description is required"
6. Fill all fields correctly:
   - ✅ Form submits successfully

### Test 13: Responsive Design

Test on different screen sizes:

1. **Desktop** (>1024px):
   - 3-column summary cards
   - 2-column layout (list + sidebar)
   - 4-column filter grid
   - ✅ Everything looks spacious and organized

2. **Tablet** (~768px):
   - Resize browser window to ~800px width
   - ✅ Layout adjusts smoothly
   - ✅ Sidebar moves below main content

3. **Mobile** (<768px):
   - Resize browser window to ~400px width
   - ✅ Single column layout
   - ✅ Buttons stack vertically
   - ✅ Forms are easy to use

### Test 14: Empty States

1. Delete all expenses (or start fresh)
2. ✅ **Verify**:
   - Summary cards show $0.00
   - Expense list shows "No expenses found" message
   - Category chart shows "No expenses to display"
   - Export button is disabled

### Test 15: Multiple Concurrent Edits

1. Click edit on an expense
2. While the form is populated, click edit on a **different** expense
3. ✅ **Verify**: Form switches to the new expense's data

### Test 16: Cancel Edit

1. Click edit on any expense
2. Make some changes to the form
3. Click **"Cancel"** button
4. ✅ **Verify**: Form closes and expense remains unchanged

## Browser Compatibility

Test in multiple browsers if possible:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Performance Check

With 50+ expenses:
- ✅ Filtering should be instant
- ✅ Scrolling should be smooth
- ✅ No lag when adding/editing

## Known Limitations

- Data is stored in **browser localStorage** (not synced across devices)
- Maximum localStorage size varies by browser (~5-10MB)
- No user authentication
- No backend/database
- No data sync across browsers/devices

## Troubleshooting

### Issue: Expenses not persisting
**Solution**: Check if localStorage is enabled in your browser

### Issue: Build fails
**Solution**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Issue: Styles not loading
**Solution**: Make sure Tailwind CSS is properly configured and PostCSS is running

### Issue: Can't add negative dates
**Solution**: This is intentional - the date picker maximum is set to today

## Next Steps

Ideas for extending the application:
- Add income tracking
- Create monthly/yearly reports
- Add budget limits per category
- Implement recurring expenses
- Add charts and visualizations
- Connect to a backend API
- Add user authentication
- Implement data export to PDF
- Add receipt photo attachments
- Create mobile app version

## Success Criteria

Your application is working correctly if:
- ✅ All 16 tests above pass
- ✅ Build completes without errors
- ✅ No console errors in browser
- ✅ Data persists after refresh
- ✅ Responsive on all screen sizes
- ✅ Forms validate properly
- ✅ Calculations are accurate

Congratulations! You now have a fully functional expense tracking application! 🎉
