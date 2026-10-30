/** Full legal texts (lazy chunk; see legal.ts for metadata). TODO(Rashid): lawyer review. */
const CONTACT = 'info@korvenzatech.com';

export const LEGAL_BODIES: Record<string, string> = {
  privacy: `This policy explains how KorvenzaTech ("we", "us") handles personal data when you visit korvenzatech.com, send us an enquiry, or use the Ask Korvenza AI assistant. It does not cover software we build for clients; those projects are governed by the agreement with each client.

## Who we are

KorvenzaTech is a founder-led software and AI product studio based in Islamabad, Pakistan, working with clients internationally. For the purposes of the EU and UK General Data Protection Regulation (GDPR), we are the controller of the personal data described here. Contact: ${CONTACT}.

## What we collect

- **Enquiry and project forms:** your name, work email, company, country, enquiry type, the service you are interested in, budget range, preferred contact method and the project details you write. If you ask for WhatsApp or a call, we also use the number you give us.
- **AI scope analysis on the project form:** if you click "Analyze idea with AI scope engine", the idea you wrote is sent to our AI provider to generate a suggested scope.
- **Ask Korvenza AI:** the messages you type and the assistant's replies. Do not share passwords, payment details or confidential information in the chat.
- **Emails and calls:** what you send us when you contact us directly.
- **Technical data:** our hosting provider processes standard request logs (IP address, browser type, requested page, time) to deliver and protect the website.

- **Website analytics (Google Analytics 4):** which pages are viewed, how visitors arrive (for example a LinkedIn link or campaign tag), approximate location (country/city derived by Google from the IP address), device and browser type, and anonymous interaction events such as clicking a contact link or submitting the enquiry form. We never send your name, email, phone number or form contents to Google Analytics.

We do not use advertising trackers or advertising cookies, and we do not buy personal data.

## Why we use it and our legal basis

- **To reply to your enquiry and prepare a proposal** — steps taken at your request before a contract (GDPR Art. 6(1)(b)).
- **To answer questions in the AI assistant** — our legitimate interest in helping visitors understand our services (Art. 6(1)(f)), and your request.
- **To keep the website secure and working** — legitimate interest (Art. 6(1)(f)).
- **To measure and improve the website (Google Analytics)** — your consent in the EEA, UK and Switzerland (Art. 6(1)(a)), which you can withdraw at any time through "Cookie preferences" in the footer; elsewhere our legitimate interest in understanding how the site is used, and you can opt out the same way.
- **To meet legal, tax and accounting obligations** once we work together (Art. 6(1)(c)).

We only send marketing emails if you ask for them, and every such email lets you unsubscribe.

## Who processes data for us

We use a small number of service providers ("processors") who handle data on our behalf under their own data protection terms:

- **Vercel** — website hosting and serverless functions (request logs, form and chat requests in transit).
- **Google Analytics 4** — website usage statistics, as described above (advertising features are switched off).
- **Google** — Google Workspace (email and storage of enquiries) and the Google Gemini API, which generates the AI assistant's replies from the messages you send.
- **Google Fonts** — delivers the website's fonts; your browser requests them from Google's servers.

We never sell, rent or trade your personal data. We share it with others only if the law requires it or with your permission.

## International transfers

We are based in Pakistan and our providers operate globally, including in the United States. When personal data from the EU or UK is transferred, we rely on our providers' transfer safeguards (such as the European Commission's Standard Contractual Clauses and the UK addendum) and limit what is transferred to what is needed.

## How long we keep it

- Enquiries that do not lead to a project: up to 24 months after our last contact, then deleted.
- Client project correspondence and records: for the duration of the engagement and as long as required by law afterwards.
- AI assistant: our server does not keep a transcript database. Your conversation is stored in your own browser (local storage) so it survives a page reload; you can clear it at any time with the assistant's reset option or by clearing site data. Requests pass through our hosting and AI providers, which keep limited logs under their own retention policies.
- Hosting request logs: kept by Vercel for a short period under its retention policy.
- Google Analytics event data: up to 14 months (our Google Analytics retention setting), then deleted automatically; reports only show aggregated statistics.

## Security

The website is served only over HTTPS. Our API keys stay on the server and are never sent to your browser. Access to enquiries is limited to the KorvenzaTech team. No system is perfectly secure, but we review our setup regularly and fix issues promptly.

## Your rights

Depending on where you live, you can ask us to:

- give you a copy of the personal data we hold about you;
- correct inaccurate data;
- delete your data;
- restrict or object to certain processing;
- transfer your data to you or another provider in a portable format;
- withdraw consent where we rely on it.

Email ${CONTACT} and we will respond within one month. If you are in the EU or UK and are unhappy with our response, you can complain to your local data protection authority (in the UK, the Information Commissioner's Office).

## Children

Our website and services are intended for businesses and adults. We do not knowingly collect data from children under 16.

## Changes

We will update this page when our practices change and show the date of the latest version at the top.`,
  terms: `These terms apply to your use of korvenzatech.com and the Ask Korvenza AI assistant. By using the website you agree to them. Software development projects are governed by a separate written agreement (proposal, statement of work or contract) between KorvenzaTech and the client; if anything in that agreement differs from these terms, the agreement wins.

## Information on this website

We aim to keep the website accurate and up to date, but its content is general information about our services, not an offer or a binding quote. Timelines, prices and scope are only agreed in writing for a specific project.

## Ask Korvenza AI

- The assistant is an automated tool. Its answers, estimates and suggestions can be incomplete or wrong.
- Estimates from the assistant are ranges to help you plan — they are not quotes, commitments or professional advice.
- Do not enter passwords, payment details or confidential information.
- You may not use the assistant to generate unlawful, harmful or abusive content, to probe for security weaknesses, or to overload the service. We may limit or block access to protect the service.

## Intellectual property

The website's design, text, graphics, code and the KorvenzaTech name and logo belong to KorvenzaTech or its licensors. You may view and share pages for personal or internal business use. Do not copy, republish or reuse substantial parts without our written permission. Ownership of software we build for clients is set out in each client agreement.

## Acceptable use

Do not misuse the website: no attempts to gain unauthorised access, introduce malicious code, scrape it in a way that degrades the service, or submit false or misleading enquiries.

## Links to other websites

We link to third-party sites (for example app stores, social profiles and providers). We are not responsible for their content or practices.

## Disclaimer and limitation of liability

The website is provided "as is". To the extent permitted by law, KorvenzaTech is not liable for any indirect or consequential loss, or for any loss arising from reliance on website content or AI assistant output. Nothing in these terms limits liability that cannot be limited by law.

## Governing law

These terms are governed by the laws of Pakistan. If you are a consumer, you also keep any protections given to you by the law of the country where you live.

## Changes and contact

We may update these terms; the date at the top shows the latest version. Questions: ${CONTACT}.`,
  cookies: `Short version: korvenzatech.com uses Google Analytics cookies to understand how the site is used — and nothing for advertising. In the EEA, UK and Switzerland they are only set after you click "Accept analytics"; elsewhere analytics is on by default and you can decline at any time with "Cookie preferences" in the footer.

## Analytics cookies (Google Analytics 4)

- **_ga** — distinguishes visitors (a random ID, not your name or email). Set by Google Analytics, expires after 2 years.
- **_ga_QB25ZM8KNL** — keeps the state of your visit (session). Set by Google Analytics, expires after 2 years.

They tell us which pages are read, how people find us (for example a LinkedIn post or a campaign link) and which contact options are used. Google processes this data for us; advertising features, Google signals and ad personalisation are not used. If you decline, these cookies are not set and Google receives only cookieless, aggregate signals under Google's Consent Mode.

## Your choice

Use **Cookie preferences** in the footer of any page to accept or decline analytics, or to change your earlier choice. Your choice is remembered in your browser (local storage item **kz-consent**).

## Other browser storage we use

These items are strictly necessary for features you use and never leave your device unless you send a message:

- **korvenza-theme** — remembers whether you chose the light or dark theme.
- **Ask Korvenza AI conversation** — keeps your chat, a short summary of it and suggested follow-up questions, so the conversation survives a page reload. Use the assistant's reset option to delete it.

## Third parties

- **Google Analytics** — see above.
- **Google Fonts** delivers the website's fonts. Your browser requests the font files from Google; Google does not set cookies for this.
- **Vercel** hosts the website and may process technical request data to deliver and protect it, as described in our Privacy Policy.

## How to clear cookies and storage

You can delete cookies and everything the site has stored through your browser settings (site data for korvenzatech.com). Questions: ${CONTACT}.`,
};
