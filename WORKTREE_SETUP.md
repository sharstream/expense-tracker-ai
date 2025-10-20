# Git Worktrees Setup Guide

**Created**: 2025-10-19
**Purpose**: Enable parallel feature development without branch switching

---

## 🎯 What Are Git Worktrees?

Git worktrees allow you to have multiple working directories attached to the same repository. This means you can work on multiple features simultaneously without:
- Switching branches
- Stashing changes
- Waiting for long builds
- Risking merge conflicts

Think of it as having multiple copies of your project, each on a different branch, but all sharing the same Git history.

---

## 📁 Current Worktree Structure

### Main Repository (Current Location)
```
/Users/dperezalvarez/Documents/pocs/expense-tracker-ai/
├── Branch: feature-data-export-v3
├── Commit: 791d797
└── Purpose: Primary development location (V3 cloud export work)
```

### Worktree #1: Data Export Feature
```
/Users/dperezalvarez/Documents/pocs/expense-tracker-export/
├── Branch: feature/data-export
├── Based on: main (commit b72ece4)
├── Purpose: Develop comprehensive data export system
└── Features to implement:
    ├── CSV export
    ├── PDF export with formatting
    ├── JSON export
    ├── Export configuration UI
    └── Format selection
```

### Worktree #2: Analytics Dashboard
```
/Users/dperezalvarez/Documents/pocs/expense-tracker-analytics/
├── Branch: feature/analytics-dashboard
├── Based on: main (commit b72ece4)
├── Purpose: Build analytics and insights dashboard
└── Features to implement:
    ├── Spending charts (line, bar, pie)
    ├── Category breakdown visualization
    ├── Trend analysis
    ├── Monthly/yearly comparisons
    └── Budget insights
```

---

## 🔍 How Worktrees Are Isolated

### File System Isolation
Each worktree has its own **complete working directory**:
- ✅ Separate `node_modules/` (can install different dependencies)
- ✅ Separate `package.json` (can modify independently)
- ✅ Separate source files (changes don't affect other worktrees)
- ✅ Separate build outputs (`.next/` directories)

### Git Isolation
- ✅ Each worktree is on a **different branch**
- ✅ Changes in one worktree don't affect others
- ✅ Can commit independently
- ✅ Can run different Git commands simultaneously

### Shared Resources
What IS shared (efficiently):
- ✅ Git history (`.git` folder - only one copy)
- ✅ Commits (visible across all worktrees)
- ✅ Branches (can see all branches from any worktree)
- ✅ Remote tracking (push/pull from any worktree)

---

## 🚀 Working with Worktrees

### Switching Between Worktrees

**Option 1: Use `cd`**
```bash
# Go to export feature
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-export

# Go to analytics feature
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-analytics

# Go back to main repo
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-ai
```

**Option 2: Open in separate editors**
```bash
# VS Code
code /Users/dperezalvarez/Documents/pocs/expense-tracker-export
code /Users/dperezalvarez/Documents/pocs/expense-tracker-analytics

# Or use Claude Code in each directory
```

### Development Workflow

#### Working on Export Feature
```bash
cd ../expense-tracker-export

# You're now on branch: feature/data-export
git branch --show-current
# Output: feature/data-export

# Make changes
# ... develop export functionality

# Commit
git add .
git commit -m "feat: add CSV export functionality"

# Push
git push -u origin feature/data-export
```

#### Working on Analytics Feature (Simultaneously!)
```bash
# Open another terminal
cd ../expense-tracker-analytics

# You're on: feature/analytics-dashboard
git branch --show-current
# Output: feature/analytics-dashboard

# Make changes
# ... develop analytics dashboard

# Commit
git add .
git commit -m "feat: add spending trends chart"

# Push
git push -u origin feature/analytics-dashboard
```

### Key Advantages

**No Branch Switching:**
```bash
# OLD WAY (without worktrees):
git stash                    # Save work
git checkout other-feature   # Switch branch
# ... work on other feature
git checkout original-feature # Switch back
git stash pop               # Restore work

# NEW WAY (with worktrees):
# Just cd to the other directory!
# All your work stays exactly as you left it
```

**No Rebuild Delays:**
- Each worktree maintains its own `node_modules/`
- Changes in one don't trigger rebuilds in others
- Can run dev servers simultaneously on different ports

**Parallel Testing:**
```bash
# Terminal 1 - Export feature
cd ../expense-tracker-export
npm run dev -- -p 3000

# Terminal 2 - Analytics feature
cd ../expense-tracker-analytics
npm run dev -- -p 3001

# Both running at the same time!
```

---

## 📋 Useful Commands

### List All Worktrees
```bash
git worktree list
```

**Output:**
```
/Users/.../expense-tracker-ai         791d797 [feature-data-export-v3]
/Users/.../expense-tracker-analytics  b72ece4 [feature/analytics-dashboard]
/Users/.../expense-tracker-export     b72ece4 [feature/data-export]
```

### Check Worktree Status
```bash
# From any worktree
git worktree list --porcelain
```

### Add a New Worktree
```bash
git worktree add -b <new-branch-name> <path> <base-branch>

# Example:
git worktree add -b feature/user-auth ../expense-tracker-auth main
```

### Remove a Worktree
```bash
# When done with a feature:
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-ai  # Go to main repo

# Remove the worktree
git worktree remove ../expense-tracker-export

# Or if it's already deleted:
git worktree prune
```

### Move a Worktree
```bash
# Move the directory
mv ../expense-tracker-export ../new-location

# Update Git's tracking
git worktree repair
```

---

## 🔄 Synchronizing Work

### Merging Features Back to Main

**When Export Feature is Complete:**
```bash
cd ../expense-tracker-export

# Ensure everything is committed
git status

# Push to remote
git push origin feature/data-export

# Create pull request on GitHub
# OR merge locally:
git checkout main
git merge feature/data-export
git push origin main
```

**When Analytics Feature is Complete:**
```bash
cd ../expense-tracker-analytics

# Same process
git status
git push origin feature/analytics-dashboard

# Create pull request or merge
```

### Keeping Features Up-to-Date with Main

If main branch gets updates while you're working:

```bash
cd ../expense-tracker-export

# Fetch latest from main
git fetch origin main

# Rebase your feature on top of main
git rebase origin/main

# Or merge if you prefer
git merge origin/main
```

---

## ⚠️ Important Considerations

### Branch Checkout Restrictions
- ❌ **Cannot checkout the same branch in multiple worktrees**
- ✅ Each worktree must be on a different branch
- ℹ️ Git prevents this to avoid conflicts

### Node Modules
```bash
# Each worktree needs its own dependencies
cd ../expense-tracker-export
npm install

cd ../expense-tracker-analytics
npm install
```

### Build Outputs
- Each worktree has its own `.next/` directory
- Builds are independent
- Can run `npm run build` in each without conflicts

### Git Operations
- ✅ Can commit in any worktree
- ✅ Can push from any worktree
- ✅ Can fetch/pull from any worktree
- ⚠️ Be careful with `git push --force` (affects all worktrees)

---

## 🎯 Best Practices

### 1. **Clean Separation**
Keep features truly independent:
```bash
# Export feature - touches:
- lib/export.ts
- components/ExportModal.tsx
- types/export.ts

# Analytics feature - touches:
- lib/analytics.ts
- components/Dashboard.tsx
- components/Charts.tsx
```

### 2. **Regular Commits**
Commit frequently in each worktree:
```bash
# Small, focused commits
git commit -m "feat: add CSV export function"
git commit -m "feat: add export preview"
```

### 3. **Descriptive Branch Names**
```bash
feature/data-export           # ✅ Clear
feature/analytics-dashboard   # ✅ Clear
fix-bug                       # ❌ Too vague
```

### 4. **Cleanup When Done**
Remove worktrees after merging:
```bash
# After feature is merged
git worktree remove ../expense-tracker-export
git branch -d feature/data-export  # Delete local branch
```

---

## 🔧 Troubleshooting

### Problem: "Cannot checkout branch, already checked out"
```bash
# This means the branch is used in another worktree
# Solution: Use a different branch or remove the other worktree
git worktree list  # Find which worktree has the branch
```

### Problem: "Worktree not found"
```bash
# If you manually deleted a worktree directory
git worktree prune  # Clean up orphaned entries
```

### Problem: "node_modules conflicts"
```bash
# Each worktree has its own node_modules
# If you see conflicts, just reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Changes appear in wrong worktree"
```bash
# This shouldn't happen - verify you're in the right directory
pwd                        # Check current directory
git branch --show-current  # Check current branch
```

---

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────┐
│           Main Repository (Any Branch)          │
│       /pocs/expense-tracker-ai/                 │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐
│   Worktree #1    │    │     Worktree #2      │
│   Export Feature │    │ Analytics Dashboard  │
│                  │    │                      │
│ Branch:          │    │ Branch:              │
│ feature/         │    │ feature/analytics-   │
│ data-export      │    │ dashboard            │
│                  │    │                      │
│ Work on:         │    │ Work on:             │
│ • CSV export     │    │ • Charts             │
│ • PDF export     │    │ • Trends             │
│ • JSON export    │    │ • Insights           │
└──────────────────┘    └──────────────────────┘
        │                          │
        │    Commit & Push         │
        │    Independently         │
        │                          │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   GitHub (Remote)      │
        │                        │
        │ • PR for Export        │
        │ • PR for Analytics     │
        │                        │
        │ Merge when ready!      │
        └────────────────────────┘
```

---

## 🎓 Advanced Tips

### Running Tests in Parallel
```bash
# Terminal 1
cd ../expense-tracker-export
npm test -- --watch

# Terminal 2
cd ../expense-tracker-analytics
npm test -- --watch

# Both test suites run independently!
```

### Different Dependency Versions (If Needed)
```bash
# Export worktree - try new library version
cd ../expense-tracker-export
npm install jspdf@latest

# Analytics worktree - keep stable version
cd ../expense-tracker-analytics
npm install chart.js@3.0.0

# No conflicts!
```

### Comparing Features Side-by-Side
```bash
# Open both in VS Code
code ../expense-tracker-export &
code ../expense-tracker-analytics &

# Or use split terminal in Claude Code
```

---

## 📝 Quick Reference

### Common Commands
```bash
# List worktrees
git worktree list

# Add worktree
git worktree add -b <branch> <path> <base>

# Remove worktree
git worktree remove <path>

# Clean up deleted worktrees
git worktree prune

# Check which branch is in a worktree
git -C <path> branch --show-current
```

### Navigation
```bash
# Export feature
cd ../expense-tracker-export

# Analytics feature
cd ../expense-tracker-analytics

# Main repo
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-ai
```

### Your Current Setup
```bash
Main:      expense-tracker-ai         (feature-data-export-v3)
Worktree1: expense-tracker-export     (feature/data-export)
Worktree2: expense-tracker-analytics  (feature/analytics-dashboard)
```

---

## ✅ Summary

**You now have:**
- ✅ Two isolated development environments
- ✅ Ability to work on both features simultaneously
- ✅ No branch switching needed
- ✅ Independent node_modules and builds
- ✅ Clean separation of concerns

**Next Steps:**
1. `cd ../expense-tracker-export` - Start building export system
2. `cd ../expense-tracker-analytics` - Start building analytics
3. Develop both features at your own pace
4. Merge back to main when ready!

**Happy Parallel Development! 🚀**
