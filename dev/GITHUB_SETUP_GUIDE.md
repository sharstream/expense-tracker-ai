# GitHub Setup Guide - Step by Step

## Current Status ✅

- ✅ Git repository initialized locally
- ✅ All files committed (2 commits, 26 files)
- ✅ Branches created: `main`, `development`
- ✅ Remote configured: `https://github.com/sharstream/expense-tracker-ai.git`
- ⏳ **Next Step**: Create repository on GitHub

## Repository Status Check

```bash
# Your local repository is ready!
Repository: /Users/dperezalvarez/Documents/pocs/expense-tracker-ai
Branches: main (current), development
Remote: origin -> https://github.com/sharstream/expense-tracker-ai.git
Status: Remote repository not found (needs to be created)
```

---

## Step-by-Step Setup

### ⚠️ IMPORTANT: You Need to Create the Repository First!

The repository `https://github.com/sharstream/expense-tracker-ai` doesn't exist yet on GitHub. Follow these exact steps:

---

### Step 1: Create Repository on GitHub (Web Browser)

1. **Open your web browser** and go to: **https://github.com/new**

2. **Sign in** to GitHub with username: `sharstream`

3. **Fill in repository details**:
   ```
   Repository name: expense-tracker-ai
   Description: Modern expense tracking app with tax reporting for small businesses

   Visibility:
   ○ Public   (anyone can see)
   ○ Private  (only you can see) ← Choose this if you want it private

   ⚠️ IMPORTANT - Leave these UNCHECKED:
   ☐ Add a README file
   ☐ Add .gitignore
   ☐ Choose a license

   Reason: We already have all these files locally!
   ```

4. **Click "Create repository"** button

5. You'll see a page with setup instructions - **IGNORE THEM**, we have our own!

---

### Step 2: Push to GitHub (Terminal)

After creating the repository on GitHub, run these commands:

#### Option A: Quick Push (All at once)

```bash
# Navigate to your project
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-ai

# Push main branch
git push -u origin main

# Push development branch
git push -u origin development
```

#### Option B: Use the Setup Script

```bash
cd /Users/dperezalvarez/Documents/pocs/expense-tracker-ai
./setup-github.sh
```

---

### Step 3: Verify on GitHub

1. Go to: **https://github.com/sharstream/expense-tracker-ai**

2. You should see:
   - ✅ 26 files
   - ✅ README.md displayed
   - ✅ 2 branches dropdown showing `main` and `development`
   - ✅ 2 commits
   - ✅ Green "Code" button for cloning

---

## Troubleshooting Common Issues

### Issue 1: "Repository not found"

**Error:**
```
remote: Repository not found.
fatal: repository 'https://github.com/sharstream/expense-tracker-ai.git/' not found
```

**Solution:**
- The repository doesn't exist on GitHub yet
- Go to https://github.com/new and create it
- Make sure you're signed in as `sharstream`

---

### Issue 2: "Authentication failed"

**Error:**
```
remote: Support for password authentication was removed
fatal: Authentication failed
```

**Solution - Use Personal Access Token (PAT):**

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: "expense-tracker-local"
   - Select scopes:
     - ✅ `repo` (Full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Update remote to use token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/sharstream/expense-tracker-ai.git
   ```

   Replace `YOUR_TOKEN` with the token you just copied.

3. **Or use GitHub CLI (recommended):**
   ```bash
   # Install GitHub CLI
   brew install gh  # macOS

   # Login
   gh auth login

   # Push will now work automatically
   git push -u origin main
   ```

---

### Issue 3: "Permission denied (publickey)"

**Error:**
```
Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Solution - Set up SSH Key:**

1. **Generate SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter for default location
   # Enter a passphrase (or leave blank)
   ```

2. **Add key to ssh-agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copy public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```

4. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "Local Development Mac"
   - Paste the key
   - Click "Add SSH key"

5. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:sharstream/expense-tracker-ai.git
   ```

---

### Issue 4: "Updates were rejected"

**Error:**
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
```

**Solution:**
```bash
# This happens if you initialized the repo with README on GitHub
# Force push (only safe on first push!)
git push -u origin main --force

# Or if you want to keep GitHub changes
git pull origin main --rebase
git push -u origin main
```

---

## Verification Commands

After pushing, verify everything worked:

```bash
# Check remote branches
git branch -r

# Expected output:
#   origin/development
#   origin/main

# Check connection
git remote show origin

# Expected output should show:
#   * remote origin
#   Fetch URL: https://github.com/sharstream/expense-tracker-ai.git
#   Push  URL: https://github.com/sharstream/expense-tracker-ai.git
#   HEAD branch: main
#   Remote branches:
#     development tracked
#     main        tracked
```

---

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Sign in** with your GitHub account
3. **Add repository**: File → Add Local Repository
4. **Browse to**: `/Users/dperezalvarez/Documents/pocs/expense-tracker-ai`
5. **Publish repository** button will appear
6. **Choose visibility** (Public/Private)
7. **Click "Publish repository"**

Done! ✅

---

## Quick Reference

### Check Status
```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a

# Current status
git status

# Remote info
git remote -v
```

### Common Commands
```bash
# Push changes
git push origin main

# Pull changes
git pull origin main

# Switch branch
git checkout development

# Create and switch
git checkout -b feature/new-feature

# See commit history
git log --oneline --graph --all
```

---

## What Happens After First Push?

Once successfully pushed:

1. **Repository is live** on GitHub
2. **Backup is automatic** - your code is safe in the cloud
3. **Can clone anywhere**:
   ```bash
   git clone https://github.com/sharstream/expense-tracker-ai.git
   ```
4. **Can collaborate** - invite team members
5. **Can deploy** - connect to Vercel, Netlify, etc.

---

## Next Steps After Successful Push

1. **Set default branch on GitHub:**
   - Go to: Settings → Branches
   - Default branch: `main`

2. **Add branch protection rules:**
   - Settings → Branches → Add rule
   - Branch name: `main`
   - ✅ Require pull request reviews before merging

3. **Enable GitHub Actions** (optional):
   - Automated testing on every push
   - Automated deployments

4. **Add repository topics:**
   - Click ⚙️ next to "About"
   - Add tags: `nextjs`, `typescript`, `expense-tracker`, `tax-reporting`

---

## Support

If you're still having issues:

1. **Check GitHub Status**: https://www.githubstatus.com/
2. **GitHub Docs**: https://docs.github.com/
3. **Review this guide**: All common issues covered above

---

## Summary

**Current State:**
- ✅ Local repository fully configured
- ✅ 2 branches ready (main, development)
- ✅ 26 files committed
- ✅ Remote configured

**You Need To:**
1. Create repository on GitHub: https://github.com/new
2. Run: `git push -u origin main`
3. Run: `git push -u origin development`

**Expected Result:**
- 🎉 Code visible on GitHub
- 🎉 Automatic backups
- 🎉 Collaboration ready
- 🎉 Version control active

Good luck! 🚀
