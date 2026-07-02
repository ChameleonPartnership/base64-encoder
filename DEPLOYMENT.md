# Deployment Guide - Base64 Encoder/Decoder

Complete step-by-step guide to deploy the Base64 Encoder/Decoder to production.

## Prerequisites

- GitHub account (for source control)
- Vercel account (free tier available)
- Custom domain (optional, but recommended)
- Git installed locally

## Quick Start (5 minutes)

### 1. Push to GitHub

```bash
# Navigate to project directory
cd /Users/paulodonnell/.openclaw/workspace/codex/base64-encoder

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/base64-encoder.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /Users/paulodonnell/.openclaw/workspace/codex/base64-encoder
vercel --prod

# Follow prompts:
# - Confirm project name
# - Set as production deployment
# - Accept defaults for settings
```

#### Option B: Using Vercel Web Dashboard

1. Visit https://vercel.com
2. Sign in with GitHub account
3. Click "Add New..." → "Project"
4. Select your GitHub repository
5. Click "Import"
6. Keep default settings (Vercel auto-detects static site)
7. Click "Deploy"

### 3. Access Your Deployment

```
https://base64-encoder-[random].vercel.app
```

## Setting Up Custom Domain

### 1. Purchase Domain

- GoDaddy, Namecheap, Google Domains, or your preferred registrar
- Example: `base64-encoder.pro`

### 2. Configure in Vercel

1. Go to Vercel Project Settings
2. Navigate to "Domains" tab
3. Add your custom domain
4. Choose DNS provider:
   - **Vercel DNS** (simplest): Follow on-screen instructions
   - **External DNS**: Update nameservers at your registrar

### 3. Update HTML/SEO

Update canonical URL in `index.html`:

```html
<!-- Change from placeholder to your domain -->
<link rel="canonical" href="https://your-domain.com/">
<meta property="og:url" content="https://your-domain.com/">
```

Update `sitemap.xml`:

```xml
<loc>https://your-domain.com/</loc>
```

Deploy changes:

```bash
git add .
git commit -m "Update canonical URL and sitemap for custom domain"
git push origin main
```

Vercel auto-deploys on push.

## SEO Configuration After Deployment

### 1. Google Search Console

1. Visit https://search.google.com/search-console
2. Add property:
   - URL prefix: `https://your-domain.com`
   - Verify with DNS record or HTML tag
3. Submit sitemap: `https://your-domain.com/sitemap.xml`
4. Monitor indexing and search performance

### 2. Bing Webmaster Tools

1. Visit https://www.bing.com/webmasters
2. Add site
3. Submit sitemap
4. Verify ownership

### 3. Google Analytics (Optional)

1. Create property in Google Analytics 4
2. Add tracking code to `index.html` in `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual ID.

## AdSense Setup (Optional Monetization)

### 1. Apply for AdSense

1. Visit https://adsense.google.com
2. Submit application
3. Wait for approval (usually 3-7 days)
4. Verify site ownership

### 2. Configure Ad Placements

Once approved, replace placeholder divs in `index.html`:

```html
<!-- Top Banner Ad (728x90) -->
<div id="ad-top">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
    crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
       data-ad-slot="YOUR_AD_SLOT"
       data-ad-format="leaderboard"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### 3. Update CSS

Set `display: block` in `assets/css/styles.css`:

```css
.ad-placeholder {
    display: block;  /* Changed from display: none */
    /* ... other styles ... */
}
```

## Performance Verification

### Lighthouse Score Check

```bash
# Using Google PageSpeed Insights
# https://pagespeed.web.dev/?url=https://your-domain.com

# Expected Scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 90+
# SEO: 100
```

### WebPageTest

1. Visit https://www.webpagetest.org
2. Enter your domain
3. Run test
4. Verify:
   - First Contentful Paint: < 1s
   - Largest Contentful Paint: < 2.5s
   - Cumulative Layout Shift: < 0.1

## SSL/TLS Certificate

Vercel automatically provides free SSL/TLS certificate. Verify:

```bash
# Check HTTPS works
curl -I https://your-domain.com

# Should show: HTTP/2 200 with "Strict-Transport-Security" header
```

## Maintenance & Updates

### Updating Content

1. Make changes locally
2. Test with `python -m http.server 8000`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update: describe changes"
   git push origin main
   ```
4. Vercel automatically redeploys within 1 minute

### Monitoring

#### Vercel Dashboard
- Visit https://vercel.com/dashboard
- Monitor deployment status
- Check real-time analytics
- View error logs

#### Performance Monitoring
- Set up Sentry.io (error tracking)
- Use Google Analytics (traffic tracking)
- Monitor with UptimeRobot (uptime monitoring)

## Backup & Version Control

### Local Backup

```bash
# Clone existing deployment to new machine
git clone https://github.com/YOUR_USERNAME/base64-encoder.git
cd base64-encoder
```

### Create Release Tags

```bash
# Tag version 1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# View all tags
git tag -l
```

## Security Checklist

- ✅ HTTPS enforced (Vercel default)
- ✅ No external dependencies (no supply chain risk)
- ✅ No user data collection (privacy-first)
- ✅ No server-side processing (client-side only)
- ✅ Content Security Policy headers configured in `vercel.json`
- ✅ X-Frame-Options header prevents clickjacking
- ✅ XSS protection enabled

### Additional Security (Optional)

Add to `vercel.json`:

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Strict-Transport-Security",
        "value": "max-age=31536000; includeSubDomains; preload"
      },
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'"
      }
    ]
  }
]
```

## Troubleshooting

### Site Not Deploying

```bash
# Check deployment logs
vercel logs --tail

# Verify git remote
git remote -v

# Force redeploy
vercel --prod --force
```

### Slow Performance

1. Check Vercel Analytics dashboard
2. Verify no large uncompressed files
3. Check browser cache settings
4. Run Lighthouse audit

### SSL Certificate Issues

```bash
# Verify certificate
curl -v https://your-domain.com 2>&1 | grep "SSL"

# Purge Vercel cache
# Vercel Dashboard → Settings → Git → Redeploy
```

### Domain Not Resolving

1. Verify DNS propagation: https://dnschecker.org
2. Check nameserver configuration
3. Wait 24-48 hours for full propagation
4. Contact domain registrar support if issues persist

## Monitoring Dashboard

### Create Monitoring Setup

1. **Vercel Analytics** (built-in)
   - Visit Vercel dashboard → Analytics tab
   - Monitor real-time traffic

2. **UptimeRobot** (uptime monitoring)
   - Create account at https://uptimerobot.com
   - Add monitor for `https://your-domain.com`
   - Get alerts if site goes down

3. **Google Analytics** (traffic analysis)
   - Set up property
   - Monitor visitor behavior
   - Track feature usage

## Scaling & Advanced

### CDN Optimization

Vercel includes built-in global CDN. Assets are automatically distributed worldwide.

### Analytics Events (Optional)

Add to `assets/js/app.js` for tracking feature usage:

```javascript
function trackEvent(action, category) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category
        });
    }
}

// Usage
this.encodeBase64 = (text) => {
    trackEvent('encode', 'feature');
    // ... encode logic ...
};
```

## Deployment Timeline

| Step | Time | Notes |
|------|------|-------|
| GitHub setup | 5 min | One-time |
| Vercel deployment | 3 min | Automatic |
| Domain DNS propagation | 24-48 hr | May be instant |
| Google Search Console indexing | 1-7 days | Submit sitemap to speed up |
| SEO ranking | 1-3 months | Monitor search console |

## Production Checklist

Before launching publicly:

- [ ] Custom domain configured
- [ ] HTTPS verified working
- [ ] Google Search Console property created
- [ ] Sitemap submitted to Google
- [ ] robots.txt verified (robots.txt checker tool)
- [ ] Meta tags accurate (title, description, OG tags)
- [ ] Lighthouse score 85+
- [ ] Mobile responsiveness tested (320px+)
- [ ] Keyboard navigation works
- [ ] All features tested on target browsers
- [ ] Analytics enabled (optional)
- [ ] AdSense approved and configured (optional)
- [ ] Backups configured in GitHub
- [ ] Git tags created for version tracking

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- robots.txt Checker: https://www.seobility.net/en/robotschecker/
- SSL Test: https://www.ssllabs.com/ssltest/

**Last Updated**: 2026-07-02
