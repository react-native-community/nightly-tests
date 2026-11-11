# Getting Started

Install the workspace dependencies from the repository root, then start the website from its directory:

```bash
bun install --frozen-lockfile
cd website
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To fetch the latest results and refresh `public/data.json`, configure the Firebase credentials below, then run `bun run data:fetch` from the `website` directory. You can also build the static site there with `bun run build`.

## Stack

- React
- Next.js
- Tailwind

## Directory Structure

The high-level overview of relevant files and folders.

```text
website/
├── app/            # Next.js App Router pages and layout
├── components/     # Shared UI components
├── context/        # Search and display-mode state
├── public/
│   ├── data.json   # Fetched results used by the website
│   └── ...         # Icons, fonts, and other static assets
├── scripts/
│   └── fetch-data.mjs
├── styles/
│   └── globals.css
├── types/          # Shared TypeScript types
└── utils/          # Shared utilities
```

## Credentials

To fetch data, add a `.env` file in the `website` directory with `FIREBASE_APP_PROJECTNAME` and `FIREBASE_APP_SERVICE_KEY`. The service key must be the Base64-encoded Firebase service-account JSON. For example:

```bash
FIREBASE_APP_PROJECTNAME=[my-nightly-tests-project]
FIREBASE_APP_SERVICE_KEY=[Base64 encoded Firebase Service Key JSON]
```
