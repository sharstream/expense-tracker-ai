# Git Workflow & Version Control Guide

## Repository Setup

This repository follows a branching strategy to maintain code quality and avoid conflicts.

### Branch Structure

```
main (production-ready code)
  └── development (integration branch)
       └── feature/* (feature branches)
       └── bugfix/* (bug fix branches)
       └── hotfix/* (urgent fixes)
```

## Current Setup

- **Repository**: Ready to push to GitHub
- **GitHub Username**: sharstream
- **Suggested Repository Name**: `expense-tracker-ai`
- **Main Branch**: `main` (production-ready)
- **Development Branch**: `development` (active development)

## Getting Started with GitHub

### 1. Create the Repository on GitHub

Visit: https://github.com/new

Repository settings:
- **Repository name**: `expense-tracker-ai`
- **Description**: Modern expense tracking app with tax reporting for small businesses
- **Visibility**: Public or Private (your choice)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/sharstream/expense-tracker-ai.git

# Verify remote was added
git remote -v

# Push main branch to GitHub
git push -u origin main

# Push development branch to GitHub
git push -u origin development
```

### 3. Set Default Branch (Optional)

On GitHub, go to Settings → Branches and set `main` as the default branch.

## Daily Development Workflow

### Starting a New Feature

```bash
# Switch to development branch
git checkout development

# Pull latest changes
git pull origin development

# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes...
# Add files
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Push to GitHub
git push -u origin feature/your-feature-name
```

### Committing Changes

Follow conventional commit format:

```bash
# Feature
git commit -m "feat: add tax year comparison feature"

# Bug fix
git commit -m "fix: resolve calculation error in quarterly totals"

# Documentation
git commit -m "docs: update README with tax export instructions"

# Style/UI changes
git commit -m "style: improve mobile responsiveness for forms"

# Refactoring
git commit -m "refactor: extract tax calculation logic"

# Performance
git commit -m "perf: optimize expense filtering algorithm"
```

### Merging Back to Development

```bash
# Switch to development
git checkout development

# Merge your feature branch
git merge feature/your-feature-name

# Push to GitHub
git push origin development

# Delete local feature branch (optional)
git branch -d feature/your-feature-name

# Delete remote feature branch (optional)
git push origin --delete feature/your-feature-name
```

### Releasing to Main (Production)

```bash
# Make sure development is up to date
git checkout development
git pull origin development

# Switch to main
git checkout main
git pull origin main

# Merge development into main
git merge development

# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push main and tags
git push origin main
git push origin --tags
```

## Branching Guidelines

### Feature Branches (`feature/*`)

For new features or enhancements:
```bash
git checkout -b feature/export-to-pdf
git checkout -b feature/recurring-expenses
git checkout -b feature/budget-tracking
```

### Bugfix Branches (`bugfix/*`)

For non-urgent bug fixes:
```bash
git checkout -b bugfix/fix-date-picker-validation
git checkout -b bugfix/resolve-category-filter-issue
```

### Hotfix Branches (`hotfix/*`)

For urgent production fixes (branch from `main`):
```bash
git checkout main
git checkout -b hotfix/critical-tax-calculation-bug
# Fix the issue
git commit -m "hotfix: fix critical tax calculation bug"
# Merge to main
git checkout main
git merge hotfix/critical-tax-calculation-bug
git push origin main
# Also merge to development
git checkout development
git merge hotfix/critical-tax-calculation-bug
git push origin development
```

## Avoiding Conflicts

### Best Practices

1. **Pull Before You Push**
   ```bash
   git pull origin development
   git push origin development
   ```

2. **Keep Branches Short-Lived**
   - Merge feature branches within 1-2 days
   - Don't let branches diverge too much

3. **Communicate with Team**
   - Let others know what files you're working on
   - Use GitHub Issues to track work

4. **Small, Focused Commits**
   - One logical change per commit
   - Makes it easier to resolve conflicts

### Resolving Conflicts

If you encounter a merge conflict:

```bash
# Pull latest changes
git pull origin development

# Git will mark conflicts in files
# Open the conflicted files and look for:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Resolve by choosing which code to keep
# Remove conflict markers
# Save the file

# Add resolved files
git add resolved-file.tsx

# Complete the merge
git commit -m "merge: resolve conflicts with development"

# Push
git push origin your-branch
```

## Useful Git Commands

### Status and Information

```bash
# Check current status
git status

# View commit history
git log --oneline --graph --all

# See what branches exist
git branch -a

# Check which branch you're on
git branch
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- filename

# Unstage a file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - DANGEROUS!
git reset --hard HEAD~1
```

### Stashing Changes

```bash
# Save current work without committing
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

## GitHub Integration

### Creating Pull Requests

1. Push your feature branch to GitHub
2. Go to https://github.com/sharstream/expense-tracker-ai
3. Click "Pull requests" → "New pull request"
4. Base: `development`, Compare: `feature/your-feature`
5. Add title and description
6. Request review if working with team
7. Merge when approved

### Using GitHub Issues

Track bugs and features:
```bash
# Reference issues in commits
git commit -m "feat: add export feature (closes #5)"
```

## Backup Strategy

### Regular Backups

```bash
# Push all branches regularly
git push origin --all

# Push tags
git push origin --tags
```

### Clone Repository (Recovery)

```bash
# Clone to a new location
git clone https://github.com/sharstream/expense-tracker-ai.git

# List all branches
git branch -a

# Switch to a branch
git checkout development
```

## Tips for Productivity

1. **Use Git Aliases** (add to ~/.gitconfig):
   ```
   [alias]
       st = status
       co = checkout
       br = branch
       cm = commit -m
       lg = log --oneline --graph --all
   ```

2. **Git GUI Tools**:
   - GitKraken
   - SourceTree
   - GitHub Desktop
   - VS Code Git integration

3. **Pre-commit Checks**:
   ```bash
   # Always run before committing
   npm run build
   npm run lint
   ```

## Emergency Recovery

### Lost Work?

```bash
# Git stores everything, even "deleted" commits
git reflog

# Find your lost commit
# Restore it
git checkout <commit-hash>
git checkout -b recovery-branch
```

## Next Steps

1. ✅ Repository initialized locally
2. ✅ Initial commit created
3. ✅ Development branch created
4. ⏳ Create repository on GitHub
5. ⏳ Push to GitHub
6. ⏳ Start using feature branches

---

**Remember**:
- Commit early, commit often
- Write meaningful commit messages
- Pull before you push
- Test before you merge
- Keep `main` branch always deployable
