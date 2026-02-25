# Getting Started

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stack

- React
- Next.js
- Tailwind

## Directory Structure

The high-level overview of relevant files and folders.

```text
website/
├── app/
│   └── [Next App Router]
├── components/
│   └── [Shareable Components]
├── public/
│   │   // Pre-fetched results data for development.
│   ├── data.json
│   └── [Other App Static Data]
├── scripts/
│   │   // Node script for fetching and reformatting latest data from Firebase.
│   │   // Requires Firebase Service Key in `.env` file.
│   └── fetch-data.mjs
├── styles/
│   │   // Global Styles and Tailwind Setup.
│   └── global.css
└── types/
    └── [Shareable Type Definitions]
```

## Credentials

To set up credentials for data fetching you will need to add `.env` file in `website` directory, which includes `FIREBASE_APP_PROJECTNAME` and `FIREBASE_APP_SERVICE_KEY` environment variables. For example:

```bash
FIREBASE_APP_PROJECTNAME=[my-nightly-tests-project]
FIREBASE_APP_SERVICE_KEY=[Base64 encoded Firebase Service Key JSON]
```
