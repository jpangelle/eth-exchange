export {};

declare global {
  export interface UserPublicMetadata {
    ethereumPublicAddress?: `0x${string}`;
    isPlaidLinked?: boolean;
  }
  export interface UserPrivateMetadata {
    plaidAccessToken?: string;
  }
  export interface ProcessEnv {
    WEBHOOK_SECRET: string;
  }

  export namespace NodeJS {
    export interface ProcessEnv {
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
      NEXT_PUBLIC_PLAID_CLIENT_ID: string;
      PLAID_SECRET_ID: string;
      WEBHOOK_SECRET: string;
      NEXT_PUBLIC_RPC_URL: string;
      FUNDER_PRIVATE_KEY: `0x${string}`;
      FUNDER_PUBLIC_KEY: `0x${string}`;
    }
  }
}
