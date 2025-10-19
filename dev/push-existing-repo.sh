#!/bin/bash

# Simple Push Script - Use when remote already exists
# This bypasses repository creation and just pushes

set -e  # Exit on any error

echo "🚀 Pushing to GitHub"
echo "==================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if remote exists
if ! git remote | grep -q "^origin$"; then
    echo -e "${RED}❌ No remote 'origin' configured${NC}"
    echo ""
    echo "Add remote first:"
    echo "  git remote add origin https://github.com/sharstream/expense-tracker-ai.git"
    exit 1
fi

echo "✅ Remote 'origin' found"
REMOTE_URL=$(git remote get-url origin)
echo "   URL: $REMOTE_URL"
echo ""

# Check if repository exists on GitHub
echo "🔍 Checking if repository exists on GitHub..."
if git ls-remote --exit-code origin &> /dev/null; then
    echo -e "${GREEN}✅ Repository exists on GitHub${NC}"
    REPO_EXISTS=true
else
    echo -e "${YELLOW}⚠️  Repository not found on GitHub${NC}"
    echo ""
    echo "You need to create it first:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Name: expense-tracker-ai"
    echo "  3. Don't initialize with README"
    echo "  4. Click 'Create repository'"
    echo ""
    read -p "Have you created the repository? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. Create the repository first."
        exit 1
    fi
    REPO_EXISTS=false
fi

echo ""
echo "📤 Pushing branches to GitHub..."
echo ""

# Push main branch
echo "Pushing main branch..."
if git push -u origin main; then
    echo -e "${GREEN}✅ main branch pushed${NC}"
else
    echo -e "${RED}❌ Failed to push main branch${NC}"
    echo ""
    echo "Authentication might be required."
    echo "Try: gh auth login -h github.com"
    exit 1
fi

echo ""

# Push development branch
echo "Pushing development branch..."
if git push -u origin development; then
    echo -e "${GREEN}✅ development branch pushed${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to push development branch${NC}"
    echo "You can push it later with: git push -u origin development"
fi

echo ""
echo -e "${GREEN}🎉 Success!${NC}"
echo ""
echo "Your repository is now live at:"
echo "  $REMOTE_URL"
echo ""

# Try to open in browser
if command -v gh &> /dev/null; then
    echo "Opening in browser..."
    gh repo view sharstream/expense-tracker-ai --web 2>/dev/null || true
fi

echo ""
echo "Next steps:"
echo "  1. Verify branches: git branch -r"
echo "  2. Start developing: git checkout development"
echo "  3. Create feature branch: git checkout -b feature/my-feature"
echo ""
