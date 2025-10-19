# Expense Tracker

A modern, professional expense tracking web application built with NextJS 14, TypeScript, and Tailwind CSS.

## Features

- **Add & Edit Expenses**: Easy-to-use form with validation for managing expenses
- **Smart Filtering**: Filter by category, date range, and search by keywords
- **Visual Dashboard**: Summary cards showing total spending, monthly spending, and top category
- **Category Breakdown**: Visual chart showing spending distribution across categories
- **Export to CSV**: Download your expenses as a CSV file
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All data persists in your browser

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding an Expense

1. Click the "Add Expense" button in the top right
2. Fill in the date, amount, category, and description
3. Click "Add Expense" to save

### Editing an Expense

1. Click the pencil icon on any expense
2. Modify the fields as needed
3. Click "Update Expense" to save changes

### Filtering Expenses

Use the filters section to:
- Search expenses by description, category, or amount
- Filter by category (Food, Transportation, Entertainment, Shopping, Bills, Other)
- Filter by date range (From/To dates)
- Click "Clear all" to reset filters

### Exporting Data

Click the "Export CSV" button in the top right to download all your expenses as a CSV file.

## Technologies Used

- **NextJS 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **date-fns**: Date manipulation and formatting
- **localStorage**: Browser-based data persistence

## Project Structure

- `/app` - NextJS app router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and business logic
- `/types` - TypeScript type definitions

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

## Contributing

This is a demonstration project. Feel free to fork and modify for your needs!
