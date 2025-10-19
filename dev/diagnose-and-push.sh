#!/bin/bash

# Diagnostic and Push Script
# Detects your situation and recommends the best approach

echo "🔍 Git & GitHub Diagnostic Tool"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check 1: Git initialized?
echo "Checking Git setup..."
if [ -d .git ]; then
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${RED}❌ Not a git repository${NC}"
    echo "Run: git init"
    exit 1
fi

# Check 2: Commits exist?
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
echo -e "   Commits: $COMMIT_COUNT"

if [ "$COMMIT_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}⚠️  No commits yet${NC}"
    echo "   Make your first commit:"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check 3: Remote configured?
echo ""
echo "Checking remote configuration..."
if git remote | grep -q "^origin$"; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ Remote 'origin' configured${NC}"
    echo -e "   URL: ${BLUE}$REMOTE_URL${NC}"

    # Extract repo name from URL
    REPO_NAME=$(echo $REMOTE_URL | sed -n 's#.*/\([^/]*\)\.git$#\1#p')
    if [ -z "$REPO_NAME" ]; then
        REPO_NAME=$(echo $REMOTE_URL | sed -n 's#.*/\([^/]*\)$#\1#p')
    fi

    # Check 4: Repository exists on GitHub?
    echo ""
    echo "Checking if repository exists on GitHub..."
    if git ls-remote --exit-code origin HEAD &> /dev/null; then
        echo -e "${GREEN}✅ Repository exists on GitHub${NC}"
        REPO_EXISTS=true

        # Check if local is behind
        git fetch origin --quiet 2>/dev/null
        LOCAL=$(git rev-parse @)
        REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")

        if [ -z "$REMOTE" ]; then
            echo -e "${YELLOW}⚠️  Branch not tracking remote${NC}"
            NEEDS_PUSH=true
        elif [ "$LOCAL" = "$REMOTE" ]; then
            echo -e "${GREEN}✅ Up to date with remote${NC}"
            NEEDS_PUSH=false
        else
            echo -e "${YELLOW}⚠️  Local has unpushed commits${NC}"
            NEEDS_PUSH=true
        fi
    else
        echo -e "${RED}❌ Repository not found on GitHub${NC}"
        REPO_EXISTS=false
        NEEDS_PUSH=true
    fi
else
    echo -e "${RED}❌ No remote configured${NC}"
    echo ""
    echo "Add remote with:"
    echo "  git remote add origin https://github.com/USERNAME/REPO.git"
    exit 1
fi

# Check 5: GitHub CLI available?
echo ""
echo "Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI installed${NC}"
    GH_AVAILABLE=true

    # Check auth
    if gh auth status -h github.com &> /dev/null 2>&1; then
        echo -e "${GREEN}✅ Authenticated to github.com${NC}"
        GH_AUTHENTICATED=true
    else
        echo -e "${YELLOW}⚠️  Not authenticated to github.com${NC}"
        GH_AUTHENTICATED=false
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed${NC}"
    GH_AVAILABLE=false
fi

# Check 6: Branches
echo ""
echo "Checking branches..."
CURRENT_BRANCH=$(git branch --show-current)
echo -e "   Current: ${BLUE}$CURRENT_BRANCH${NC}"

ALL_BRANCHES=$(git branch | sed 's/^..//' | tr '\n' ', ' | sed 's/, $//')
echo -e "   Local: $ALL_BRANCHES"

# Summary and Recommendation
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 SUMMARY & RECOMMENDATION${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$REPO_EXISTS" = true ]; then
    if [ "$NEEDS_PUSH" = true ]; then
        echo -e "${YELLOW}Your repository exists on GitHub but has unpushed commits${NC}"
        echo ""
        echo -e "${GREEN}✅ RECOMMENDED ACTION:${NC}"
        echo "   Run: ./push-existing-repo.sh"
        echo ""
        echo "Or manually:"
        echo "   git push -u origin main"
        echo "   git push -u origin development"
    else
        echo -e "${GREEN}✅ Everything is up to date!${NC}"
        echo ""
        echo "No action needed. Your code is on GitHub."
        echo "View it: $REMOTE_URL"
    fi
else
    echo -e "${RED}Repository doesn't exist on GitHub yet${NC}"
    echo ""
    if [ "$GH_AVAILABLE" = true ] && [ "$GH_AUTHENTICATED" = true ]; then
        echo -e "${GREEN}✅ RECOMMENDED ACTION:${NC}"
        echo "   Run: ./create-github-repo.sh"
        echo ""
        echo "This will:"
        echo "   • Create repository on GitHub"
        echo "   • Push all branches"
        echo "   • Open in browser"
    else
        echo -e "${YELLOW}⚠️  MANUAL STEPS REQUIRED:${NC}"
        echo ""
        echo "1. Create repository on GitHub:"
        echo "   → Go to: https://github.com/new"
        echo "   → Name: $REPO_NAME"
        echo "   → Don't initialize with README"
        echo "   → Click 'Create repository'"
        echo ""
        echo "2. Then run: ./push-existing-repo.sh"
        echo ""
        if [ "$GH_AVAILABLE" = false ]; then
            echo "TIP: Install GitHub CLI for easier setup:"
            echo "     brew install gh"
        elif [ "$GH_AUTHENTICATED" = false ]; then
            echo "TIP: Authenticate GitHub CLI:"
            echo "     gh auth login -h github.com"
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask if user wants to proceed
if [ "$REPO_EXISTS" = false ]; then
    read -p "Do you want to create the repository now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$GH_AVAILABLE" = true ] && [ "$GH_AUTHENTICATED" = true ]; then
            echo ""
            echo "Launching create-github-repo.sh..."
            ./create-github-repo.sh
        else
            echo ""
            echo "Please follow the manual steps above."
        fi
    fi
elif [ "$NEEDS_PUSH" = true ]; then
    read -p "Do you want to push now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Launching push-existing-repo.sh..."
        ./push-existing-repo.sh
    fi
fi
