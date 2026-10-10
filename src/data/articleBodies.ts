/**
 * Full article texts (lazy chunk). Body format: blank-line separated blocks —
 * "## " = section heading, "- " lines = bullet list, anything else = paragraph.
 * No invented statistics: claims are practical engineering guidance only.
 */
export const ARTICLE_BODIES: Record<string, string> = {
  'how-businesses-can-integrate-ai-without-sacrificing-data-security': `Most business owners I speak with want the same two things from AI: take repetitive work off their team, and never become the company that leaked its customers' data into a chatbot. Those goals are compatible. The difference between a safe AI feature and a risky one is rarely the model you choose — it is the architecture around it.

This guide walks through the decisions we make before we write a single prompt, so you can ask the right questions of any team building AI into your product.

## Start with the data, not the model

Before choosing a provider, list the data the feature will touch. For each item, write down where it lives today, who is allowed to see it, and whether it contains personal data, financial data or trade secrets.

This exercise usually reveals that a feature needs far less data than people assume. A support assistant that answers questions about your return policy does not need access to your order database. An assistant that checks the status of an order needs one order, for one verified customer — not the whole table.

- Classify data into public, internal, confidential and regulated.
- Decide which classes the AI feature may read, and which it must never see.
- Write that decision down. It becomes a requirement your engineers can test.

## Keep the model behind your own server

The single most important rule: the browser or mobile app should never talk to an AI provider directly, and your API key should never be shipped to a user's device. Every request goes through a small server function you control.

That server is where security actually happens:

- It authenticates the user and decides which records they may access.
- It strips or masks fields the model does not need (card numbers, national ID numbers, internal notes).
- It limits input length, output length and request rate, so a single user cannot run up your bill or abuse the system.
- It logs what was asked and which tools were used, without logging secrets.

If a vendor demo shows an AI widget calling the provider straight from JavaScript, treat it as a prototype, not a production design.

## Retrieval instead of retraining

Many teams think they need to "train the AI on our documents". In most business cases you do not, and you should not. Fine-tuning bakes your data into a model you cannot easily inspect or delete from.

Retrieval-augmented generation (RAG) is usually the better pattern. Your documents stay in your own database or storage. When a question comes in, your server searches those documents, picks the few passages that are relevant, and sends only those passages to the model together with the question. If a document is removed or a user's access changes, the next answer reflects it immediately.

Retrieval also lets you enforce permissions properly: the search runs with the same access rules as the rest of your application, so a sales rep never receives a passage from an HR file.

## Choose providers and settings deliberately

AI providers offer different terms for how they handle the data you send. Before going live, check in writing:

- Whether prompts and outputs are used to train or improve their models on the plan you are using.
- How long they retain requests and logs, and where they are processed geographically.
- Whether they sign a data processing agreement, which matters if you serve customers in the EU or UK.

Free tiers and paid tiers often have different data terms. Pick the plan that matches the sensitivity of the data, and record the decision in your privacy policy so customers know which processors you use.

## Treat prompts as untrusted input

A model follows instructions it finds in its input — including instructions hidden inside a customer's message, an uploaded PDF or a web page it was asked to summarise. This is called prompt injection, and it is the AI equivalent of SQL injection.

You cannot fully prevent it with clever wording, so you design for it:

- Give the model the minimum tools it needs. An assistant that only reads order status cannot be tricked into issuing refunds.
- Require human confirmation for anything irreversible: sending an email, changing a record, moving money.
- Validate the model's output before acting on it. If it proposes a database update, your code checks the update against business rules first.
- Keep system instructions on the server, never in the client.

## Make actions auditable

As soon as AI can take actions — create a CRM record, draft an invoice, send a message — you need a record of what happened and why. A simple audit log with the user, the request, the tools called and the result is enough for most businesses. It turns "the AI did something strange" into a question you can actually answer, and it gives you evidence if a customer disputes an outcome.

## Plan for failure and cost

AI services have outages, rate limits and price changes. A production feature needs a graceful fallback: a clear message, a contact option, or a non-AI path through the same task. It also needs a budget guard — a daily or monthly spending cap enforced on your server, plus alerts when usage spikes.

## A practical rollout plan

For most growing businesses, this sequence keeps risk low while delivering value early:

- Pick one narrow, high-volume task, such as answering policy questions or extracting fields from standard documents.
- Build it behind your own server with retrieval, strict tool permissions and logging.
- Launch to internal staff first and review a sample of conversations every week.
- Add actions only after the read-only version is reliable, and keep a human approval step for anything that changes data.
- Update your privacy policy and data processing records before opening it to customers.

## Questions to ask any AI vendor or agency

- Where does my API key live, and can a user ever see it?
- Which of my data does the model receive for each request, and how is the rest excluded?
- What stops one user from reading another user's data through the assistant?
- What happens if someone types "ignore your instructions" or uploads a malicious file?
- How do we cap cost, and what does the user see when the AI is unavailable?

If the answers are vague, the architecture probably is too. Done properly, AI becomes one more well-guarded part of your system — useful, measurable and under your control.`,
  'flutter-vs-native-apps-2026': `"Should we build in Flutter or go native?" is one of the first questions founders ask us, and it is a good question to ask early, because it shapes your budget, your hiring and how fast you can ship updates. There is no universal answer. There is, however, a clear way to decide.

I build most of our client apps in Flutter, so I will be upfront about the bias — and equally clear about when I recommend against it.

## What the choice actually means

A native app is built twice: Swift (or SwiftUI) for iOS and Kotlin (or Jetpack Compose) for Android. Each platform gets its own codebase, its own developers and its own release cycle.

A Flutter app is built once in Dart and compiled to native machine code for both platforms. Flutter draws its own interface rather than wrapping the platform's buttons and lists, which is why the UI looks the same on every device. When you need a platform feature — Bluetooth, background location, payments, health data — Flutter calls into native code through plugins, and you can write your own native code where no plugin exists.

So the real question is not "cross-platform or native", but "how much of this product is shared logic and custom UI, and how much is deep platform-specific behaviour?"

## Where Flutter is the strong choice

- **Product-led apps with custom design.** Marketplaces, booking apps, education products, dashboards and internal tools are mostly screens, forms, lists, maps and API calls. One codebase serves both platforms with the same behaviour.
- **MVPs and early-stage products.** You will change the product many times in the first year. Making each change once, not twice, is the biggest saving.
- **Small teams.** One team that understands the whole app beats two half-teams that drift apart in features and quality.
- **Consistent brand experience.** Because Flutter renders its own UI, your design system looks identical on iOS and Android, and on the web or desktop if you need them later.

Our own products follow this pattern. An AI-assisted IELTS preparation app and an on-demand services marketplace both combine custom interfaces, authentication, real-time data, maps or audio, and AI calls — exactly the mix Flutter handles well.

## Where native still wins

- **Heavy platform integration.** Apps built around advanced camera pipelines, AR, background audio processing, Bluetooth hardware or deep OS extensions (widgets, watch apps, car integrations) spend most of their effort in platform code anyway.
- **Platform-first experiences.** If your product must feel exactly like a stock iOS app and adopt every new system control on day one, native frameworks get there first.
- **Very tight performance or size budgets.** Flutter is fast for typical business apps, but games, real-time media editors or apps where every megabyte of download size matters may justify native or specialised engines.
- **An existing native codebase and team.** Rewriting a healthy native app in Flutter is rarely worth it. Flutter can be added module by module if you want to share new features.

## The costs people forget

The build cost is only the beginning. Over the life of an app, most money goes into change: new features, OS updates, bug fixes and store releases. A single codebase reduces the number of places a change has to be made and tested, but it does not remove testing — you still test on real iOS and Android devices.

With native, plan for two of everything: two implementations of each feature, two sets of bugs, and coordination so that both apps ship together. With Flutter, plan for occasional native work when a plugin is missing or out of date, and for keeping the framework and plugins upgraded.

## Performance, honestly

For the vast majority of business apps, users cannot tell a well-built Flutter app from a native one. Performance problems almost always come from the same places in both approaches: oversized images, too much work on the main thread, unpaginated lists and chatty network calls. A good team avoids these in either stack; a weak team produces a slow app in either stack.

## A simple decision checklist

Answer these for your product:

- Is most of the app custom screens, forms, lists, maps and API data? → Flutter is a strong default.
- Do we depend on advanced device hardware or OS extensions for the core value? → lean native.
- Will we change the product often in the next 12 months? → favour one codebase.
- Do we already have a healthy native app and team? → keep native, consider Flutter only for new modules.
- Do we need web or desktop later? → Flutter keeps that option open.

If you answered "Flutter" to most, start there and isolate the few platform-specific features behind clean interfaces. If the core value is in the hardware or OS, go native and do not apologise for it.

## What to ask your development partner

- Which parts of our app will need native code, and who will write it?
- How will you test on real iOS and Android devices before each release?
- How do you handle store submission, signing keys and release notes for both stores?
- What is the plan for upgrading the framework and plugins after launch?

The right choice is the one that lets you ship a reliable product to both app stores, learn from real users and keep improving it at a cost you can sustain. For most product-led businesses, that is Flutter. For hardware-heavy or platform-first products, it is native.`,
  'api-first-approach-prevents-costly-rebuilds': `A pattern we see again and again: a business launches a website, it works, and a year later they want a mobile app, a partner integration or an AI assistant. Then they discover that their business logic is tangled inside the website's pages, and the "small" new feature means rebuilding the backend.

An API-first approach is how you avoid that rebuild. It is not a technology choice; it is a decision about where your business rules live.

## What API-first means

In an API-first product, the core of the system is a set of well-defined endpoints — create a booking, list a customer's orders, update a job's status — that hold all the business rules. Every client uses those same endpoints: the website, the iOS and Android apps, the admin dashboard, partner systems and AI tools.

The API is designed and documented before the screens are built. Front-end and back-end teams agree on the contract (what goes in, what comes out, which errors are possible) and then build in parallel.

## Why it prevents rebuilds

When the rules live in one place, adding a new client is mostly front-end work. A mobile app does not need its own version of "how a refund is calculated"; it calls the same endpoint the website calls. A partner integration gets an API key and the same well-tested operations, with stricter permissions.

Compare that with a website where pricing logic sits in page templates, validation sits in form scripts and database queries are scattered across files. Every new channel means copying those rules — and copies drift. Customers then see different prices or behaviour depending on where they come from, and fixing a bug means fixing it in several places.

## The benefits beyond new apps

- **Security in one place.** Authentication, authorisation, rate limiting and input validation are enforced at the API, so a new client cannot accidentally bypass them.
- **Faster parallel development.** With an agreed contract and a mock server, the app team does not wait for the backend to be finished.
- **Easier testing.** Business rules can be tested directly at the API level, independent of any screen.
- **Ready for AI.** An AI assistant that can take actions is just another client. If your operations are already exposed as clean, permission-checked endpoints, giving an assistant a narrow, safe set of tools is straightforward.
- **Replaceable front ends.** You can redesign the website or rewrite an app without touching the core.

## An example: one booking operation, four clients

Imagine a services marketplace. A customer books a job on the website, a worker accepts it in the mobile app, an admin reassigns it from a dashboard, and later an AI assistant answers "when is my electrician arriving?".

In an API-first design, all four use the same small set of operations: create booking, accept booking, reassign booking, get booking status. The rules — who may accept, what happens to the price when a job is reassigned, which status changes send a notification — exist exactly once. The assistant is given read access to "get booking status" for the signed-in customer and nothing else. When the business later changes its cancellation policy, one change on the server updates every channel at the same time.

## What good API design looks like

You do not need a large team to do this well. You need consistency:

- **Resource-oriented endpoints** with predictable names, such as \`/customers/{id}/orders\`.
- **A written contract** — an OpenAPI specification is the common standard — that documents every request, response and error.
- **Versioning** from day one, so you can improve the API without breaking apps that users have not updated.
- **Clear errors** with machine-readable codes, so clients can show helpful messages.
- **Pagination and filtering** for every list, so performance does not collapse as data grows.
- **Idempotency** for operations like payments and bookings, so a retried request does not charge or book twice.
- **Authentication and scoped permissions**, so each client and partner can do only what it should.

## When to be pragmatic

API-first does not mean building a large microservice platform for an MVP. For an early product, a single well-structured backend — a modular monolith — with a clean API is usually the right size. You can split parts out later if a specific area needs to scale independently.

Managed backends such as Firebase are also a valid starting point, especially for mobile-first products. The principle still applies: keep sensitive business rules in server-side functions and security rules, not in the app, so the next client inherits them instead of reimplementing them.

## Signs your product needs this now

- You are planning a mobile app, partner integration or AI feature in the next year.
- The same business rule is implemented in more than one place.
- Small changes regularly break unrelated features.
- You cannot easily answer "which systems can change this data?"

## A step-by-step path for existing products

If you already have a tightly coupled product, you rarely need a big-bang rewrite:

- Map the core operations your business performs and the data each one touches.
- Introduce an API for the most valuable operation first — often orders, bookings or accounts — and move its rules behind it.
- Switch the existing website to use that endpoint, then build the new client on it.
- Repeat for the next operation, retiring the old logic as you go.

Each step delivers value on its own, and by the time the new app launches, the backend it needs already exists.

## The takeaway

Software becomes expensive when every new channel requires rebuilding the core. Designing your API first — with clear contracts, security in one place and room to version — turns your backend into an asset that each new website, app, partner or AI tool can build on, rather than a constraint you eventually have to replace.`,
};
