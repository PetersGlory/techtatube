declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
      STRIPE_PRICE_ID: string;
      STRIPE_WEBHOOK_SECRET: string;
      CLAUDE_API_KEY: string;
      NEXT_PUBLIC_CONVEX_URL: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      YOUTUBE_API_KEY: string;
    }
  }
}

export {}; 