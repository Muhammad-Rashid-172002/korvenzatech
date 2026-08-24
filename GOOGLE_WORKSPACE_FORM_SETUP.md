# KorvenzaTech Website Form → Google Workspace Setup

The website now routes contact submissions by inquiry type:

- **Project / Sales** → `sales@korvenzatech.com`
- **General Inquiry** → `info@korvenzatech.com`
- **Partnership** → `info@korvenzatech.com`
- **Careers** → `info@korvenzatech.com`

The public form never exposes Google credentials. Delivery is handled by a small Google Apps Script web app.

## 1. Create the Google Apps Script

1. Sign in to the Google Workspace account that should send website notifications.
2. Open Google Apps Script and create a new project.
3. Copy the contents of `scripts/google-workspace-contact-webhook.gs` into `Code.gs`.
4. Save the project as `KorvenzaTech Website Contact Router`.

## 2. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy and copy the Web App URL.

The script only accepts a small JSON payload and always forces delivery to either `info@korvenzatech.com` or `sales@korvenzatech.com`.

## 3. Add the URL in Vercel

Vercel → KorvenzaTech project → Settings → Environment Variables:

```text
CONTACT_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
PUBLIC_SITE_URL=https://korvenzatech.com
PUBLIC_CONTACT_EMAIL=info@korvenzatech.com
PUBLIC_SALES_EMAIL=sales@korvenzatech.com
PUBLIC_CONTACT_PHONE=+923701691701
PUBLIC_WHATSAPP_URL=https://wa.me/923701691701
```

Add the values to **Production** (and Preview if desired), then redeploy.

## 4. Test routing

- Submit the form with **Project / Sales** → verify it arrives in `sales@korvenzatech.com`.
- Submit **General Inquiry** → verify it arrives in `info@korvenzatech.com`.
- Click Reply in Gmail → the visitor's email is set as Reply-To.
- Select WhatsApp or Video Call in the form → the preference is included in the notification.

## 5. Search Console after deployment

The updated sitemap includes dedicated case-study URLs. Google will periodically re-read the existing sitemap. You can optionally inspect these URLs after deployment:

- `https://korvenzatech.com/work/ielts-ai-master`
- `https://korvenzatech.com/work/skilllink`

Do not repeatedly submit the same URL for indexing; it does not increase crawl priority.
