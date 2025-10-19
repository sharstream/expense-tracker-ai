#!/bin/bash

# GitHub Setup Script for Expense Tracker AI
# Run this after creating the repository on GitHub

echo "🚀 Setting up GitHub remote..."
echo ""
echo "Make sure you've created the repository on GitHub first!"
echo "Visit: https://github.com/new"
echo ""
read -p "Have you created 'expense-tracker-ai' on GitHub? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please create the repository on GitHub first, then run this script again."
    exit 1
fi

# Add remote
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/sharstream/expense-tracker-ai.git

# Verify
echo ""
echo "✅ Remote added! Verifying..."
git remote -v

# Push main branch
echo ""
echo "📤 Pushing main branch..."
git push -u origin main

# Push development branch
echo ""
echo "📤 Pushing development branch..."
git push -u origin development

echo ""
echo "🎉 Success! Your repository is now on GitHub!"
echo ""
echo "View it at: https://github.com/sharstream/expense-tracker-ai"
echo ""
echo "Next steps:"
echo "  1. Visit your repository on GitHub"
echo "  2. Set 'main' as the default branch (Settings → Branches)"
echo "  3. Add a repository description"
echo "  4. Start developing with: git checkout development"
echo ""
