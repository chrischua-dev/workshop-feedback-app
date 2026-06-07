# Workshop Feedback App

A beginner-friendly React + TypeScript + Vite app for a 90-minute AWS Amplify workshop.

## What learners build

Users can:

- enter their name
- choose a rating from 1 to 5
- type a short comment
- submit feedback
- see submitted feedback entries on the page

The first version keeps feedback in React state so learners can focus on the UI. The project also includes an AWS Amplify Gen 2 Data schema so the workshop can later save and reload feedback from the cloud.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build check

```bash
npm run build
```

## Project structure

```text
src/App.tsx                 Feedback form and submitted feedback list
src/styles.css              Beginner-friendly styling
amplify/backend.ts          Amplify Gen 2 backend entry point
amplify/data/resource.ts    Feedback data model for Amplify Data
```

## Amplify Data model

The included model is intentionally small:

```ts
Feedback: {
  name: string;
  rating: integer;
  comment: string;
}
```

It uses API key authorization for workshop simplicity. Do not use this public API key setup for sensitive production data.

## Suggested 90-minute workshop flow

1. Create the Vite React app.
2. Build the feedback form with React state.
3. Render submitted feedback entries on the page.
4. Add the Amplify Gen 2 Data schema.
5. Deploy/sandbox with Amplify.
6. Replace local React state with Amplify Data create/list calls.

## Later: connect the UI to Amplify Data

After running an Amplify sandbox/deploy and generating `amplify_outputs.json`, configure Amplify in `src/main.tsx`:

```ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

Then create a typed client in `src/App.tsx`:

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();
```

Use `client.models.Feedback.create(...)` when submitting, and `client.models.Feedback.list()` when loading entries.

Keep this as a second workshop step so beginners first understand the React version before adding the cloud backend.
