# Recipe App

A recipe discovery app built with Next.js, React, TypeScript, Redux, and Tailwind CSS.

## Features

- Create an account and sign in
- Browse meals and search recipes
- View detailed meal instructions
- Save favorite meals per account
- Create and manage personal recipes
- Protect application pages for signed-in users

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit
- Tailwind CSS
- TheMealDB API

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Local Development

To run the project using the Vercel CLI:

```bash
npx vercel dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Production Build

Check that the project builds successfully:

```bash
npm run build
```

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Keep the default Next.js build settings.
3. Click **Deploy**.

You can also deploy from the terminal:

```bash
npx vercel
```

## Data Storage

This project currently stores account data, personal recipes, and saved recipe IDs in the browser's `localStorage`. Data is local to each browser and is not yet connected to a production database.
