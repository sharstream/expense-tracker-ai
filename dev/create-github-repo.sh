#!/bin/bash

# Automated GitHub Repository Creation Script
# This script will create the repository on GitHub and push your code

set -e  # Exit on any error

echo "🚀 Expense Tracker AI - GitHub Setup"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Install it with: brew install gh"
    exit 1
fi

echo "✅ GitHub CLI found"
echo ""

# Check authentication
echo "Checking GitHub authentication..."
if ! gh auth status -h github.com &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to github.com${NC}"
    echo ""
    echo "Let's authenticate with GitHub..."
    echo ""
    gh auth login -h github.com -w
    echo ""
fi

echo -e "${GREEN}✅ Authenticated to github.com${NC}"
echo ""

# Confirm repository creation
echo "This will create a repository at:"
echo "  https://github.com/sharstream/expense-tracker-ai"
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "📝 Creating repository on GitHub..."
echo ""

# Check if remote already exists and remove it temporarily
if git remote | grep -q "^origin$"; then
    echo "ℹ️  Remote 'origin' already exists, will be reconfigured..."
    REMOTE_URL=$(git remote get-url origin)
    git remote remove origin
fi

# Create repository using gh CLI
# Note: --remote=origin will add it back
if gh repo create sharstream/expense-tracker-ai \
    --public \
    --description "Modern expense tracking app with tax reporting for small businesses" \
    --source=. \
    --remote=origin \
    --push; then
    echo "✅ Repository created successfully"
else
    # If creation fails, restore the remote
    if [ ! -z "$REMOTE_URL" ]; then
        echo "⚠️  Restoring original remote..."
        git remote add origin "$REMOTE_URL"
    fi
    echo ""
    echo -e "${RED}❌ Failed to create repository${NC}"
    echo ""
    echo "Possible reasons:"
    echo "  1. Repository already exists on GitHub"
    echo "  2. Network connection issue"
    echo "  3. Authentication problem"
    echo ""
    echo "Try manual creation:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Create 'expense-tracker-ai' repository"
    echo "  3. Run: git push -u origin main"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Success!${NC}"
echo ""
echo "Your repository is now live at:"
echo "  https://github.com/sharstream/expense-tracker-ai"
echo ""
echo "Branches pushed:"
echo "  ✓ main"
echo "  ✓ development (pushing now...)"
echo ""

# Push development branch
git push -u origin development

echo ""
echo -e "${GREEN}✅ All done!${NC}"
echo ""
echo "Next steps:"
echo "  1. Visit: https://github.com/sharstream/expense-tracker-ai"
echo "  2. Star your own repo ⭐"
echo "  3. Add topics: nextjs, typescript, expense-tracker"
echo "  4. Start developing: git checkout development"
echo ""
