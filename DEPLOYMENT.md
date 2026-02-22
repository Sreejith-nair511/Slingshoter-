# Deployment Guide

## Push to GitHub

The codebase is ready to be pushed to GitHub. Follow these steps:

### Option 1: If Repository Already Exists

1. Make sure you have access to the repository at:
   https://github.com/Sreejith-nair511/Slingshoter

2. The git repository is already initialized and committed. Just push:
   ```bash
   git push -u origin main
   ```

3. If you get authentication errors, you may need to:
   - Use a Personal Access Token (PAT) instead of password
   - Or use SSH authentication

### Option 2: If Repository Doesn't Exist Yet

1. Go to GitHub and create a new repository:
   - Repository name: Slingshoter
   - Description: Verification-first AI trust intelligence platform
   - Keep it public or private as needed
   - Do NOT initialize with README (we already have one)

2. After creating the repository, push the code:
   ```bash
   git push -u origin main
   ```

### Option 3: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create Sreejith-nair511/Slingshoter --public --source=. --remote=origin --push
```

### Authentication Methods

#### Using Personal Access Token (PAT)

1. Generate a PAT at: https://github.com/settings/tokens
2. Select scopes: `repo` (full control of private repositories)
3. When prompted for password, use the PAT instead

#### Using SSH

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add to GitHub: https://github.com/settings/keys

3. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:Sreejith-nair511/Slingshoter.git
   git push -u origin main
   ```

## Verify Push

After pushing, verify at:
https://github.com/Sreejith-nair511/Slingshoter

You should see:
- All source files
- README.md with full documentation
- 130 files committed

## Next Steps

1. Enable GitHub Pages (optional) for documentation
2. Set up GitHub Actions for CI/CD (optional)
3. Configure branch protection rules
4. Add collaborators if needed
5. Create issues/project board for tracking

## Deploy to Vercel

Once pushed to GitHub:

1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: Sreejith-nair511/Slingshoter
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
5. Click "Deploy"

Your app will be live at: `https://slingshoter.vercel.app`

## Environment Variables

If you need environment variables in production:

1. In Vercel dashboard, go to Settings > Environment Variables
2. Add any required variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.trustcalib.ai
   ```

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned
