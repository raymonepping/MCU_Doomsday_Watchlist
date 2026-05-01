# Deploying to GitHub Pages

This guide explains how to deploy the MCU Doomsday Reader to GitHub Pages so others can access it online.

## Quick Setup

### Option 1: Manual Deployment (Easiest)

1. **Enable GitHub Pages in your repository:**
   - Go to your GitHub repository
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select branch: **main**
   - Select folder: **/ (root)**
   - Click **Save**

2. **Create a `.nojekyll` file** (tells GitHub Pages not to use Jekyll):
   ```bash
   cd /Users/raymon.epping/Documents/VSC/Personal/MCU
   touch .nojekyll
   git add .nojekyll
   git commit -m "Add .nojekyll for GitHub Pages"
   git push
   ```

3. **Your site will be live at:**
   ```
   https://raymonepping.github.io/MCU_Doomsday_Watchlist/reader/
   ```

### Option 2: Automated Deployment with GitHub Actions

This creates a workflow that automatically deploys when you push to main.

1. **Create the workflow file** (already created at `.github/workflows/deploy.yml`)

2. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**

3. **Push your changes:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push
   ```

4. **Your site will be live at:**
   ```
   https://raymonepping.github.io/MCU_Doomsday_Watchlist/
   ```

## What Gets Deployed

The deployment includes:
- ✅ All HTML, CSS, and JavaScript files
- ✅ 33 cached Marvel poster images
- ✅ JSON data files (English and Dutch)
- ✅ Marvel and Avengers logos
- ✅ All reader functionality (no server needed!)

## Custom Domain (Optional)

If you want to use your own domain:

1. **Add a CNAME file:**
   ```bash
   echo "mcu.yourdomain.com" > reader/CNAME
   git add reader/CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS:**
   - Add a CNAME record pointing to `raymonepping.github.io`

3. **Enable HTTPS in GitHub Pages settings**

## Testing Locally

Before deploying, test that everything works:

```bash
cd reader
npm start
# Visit http://localhost:4173
```

## Troubleshooting

### Images not loading?
- Check that `reader/assets/posters/` contains all 33 images
- Run `npm run cache:images` to re-download if needed

### Data not loading?
- Ensure `reader/data/watchlist.en.json` and `watchlist.nl.json` exist
- Run `npm run build:data` to regenerate from markdown

### 404 errors?
- Make sure `.nojekyll` file exists in the root
- Check that all paths in the code are relative (no absolute paths)

## Notes

- **No server required** — GitHub Pages serves static files directly
- **Free hosting** — No cost for public repositories
- **Automatic HTTPS** — GitHub provides SSL certificates
- **Global CDN** — Fast loading worldwide
- **Personal progress** — Each user's watch state is stored in their browser's LocalStorage

---

*Your MCU Doomsday Reader will be accessible to anyone with the link!*