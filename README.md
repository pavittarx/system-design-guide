# System Design Basics

A seven-part illustrated field guide to how real systems get fast, hold their data, distribute work, stay up, and stay correct — closing with a capstone that designs one whole system end to end. Each guide opens with a real-world disaster and hangs every concept on a war story: Knight Capital, the AWS S3 typo, GitHub's 43-second partition, Figma, Discord, and more. Roughly 48,000 words, with worked numbers, failure traces, and self-check questions throughout.

**Live site:** `https://pavittarx.github.io/system-design-guide/`

## Contents

| # | Guide | File |
|---|-------|------|
| — | **Hub / index** | `index.html` |
| 1 | Understanding Caching | `understanding-caching.html` |
| 2 | Scaling Databases | `database-scaling.html` |
| 3 | Load Balancing | `load-balancing.html` |
| 4 | Message Queues & Async | `message-queues.html` |
| 5 | The Reliability Toolkit | `reliability-toolkit.html` |
| 6 | Consistency & the CAP Theorem | `consistency-cap.html` |
| 7 | Design the Checkout (capstone) | `design-the-checkout.html` |

All pages are self-contained static HTML (inline CSS, no build step, no dependencies), responsive, and adapt automatically to light/dark mode.

## Publish to GitHub Pages

1. **Create a repository** on GitHub (public is simplest for Pages).
2. **Add these files** to the repo root — either:
   - drag-and-drop the folder contents into the GitHub web uploader, or
   - from this folder:
     ```bash
     git init
     git add .
     git commit -m "System Design Basics"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git push -u origin main
     ```
3. **Enable Pages:** repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick **`main`** and folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute. Your site goes live at `https://pavittarx.github.io/system-design-guide/`, opening on the hub page.

The included `.nojekyll` file tells GitHub Pages to serve the HTML as-is (skipping Jekyll processing) — no configuration needed.

## Notes

- `index.html` is the landing page (the hub). Every guide links back to it via the "← All guides" link at the top.
- To use a custom domain, add a `CNAME` file with your domain and configure DNS per GitHub's docs.
- Sources are cited at the foot of every guide.
