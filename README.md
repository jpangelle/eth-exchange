# Ethereum Exchange

This is an app to buy Ethereum with USD. It allows users to create an account, connect their bank account via the Plaid, and submit a transaction to buy Ethereum. The project is bootstrapped with Next.js and written in TypeScript using React, clerk, viem, react-query, plaid, and mantine.

The app is deployed on Vercel and can be accessed [here]().

## Instructions to run

### Install dependencies

```bash
$ yarn install
```

### Set up environment variables

1. Create a `.env.local` file in the root of the project:
2. Copy the contents of `.env.example` into `.env.local`
3. Fill in the environment variables with the appropriate values

### Run the development server

```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
