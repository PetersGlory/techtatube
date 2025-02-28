/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analysis from "../analysis.js";
import type * as api_analysis from "../api/analysis.js";
import type * as api_entitlements from "../api/entitlements.js";
import type * as api_generationJobs from "../api/generationJobs.js";
import type * as api_index from "../api/index.js";
import type * as api_transcripts from "../api/transcripts.js";
import type * as api_usage from "../api/usage.js";
import type * as api_videos from "../api/videos.js";
import type * as config from "../config.js";
import type * as content from "../content.js";
import type * as index from "../index.js";
import type * as init from "../init.js";
import type * as subscriptions from "../subscriptions.js";
import type * as transcripts from "../transcripts.js";
import type * as types from "../types.js";
import type * as usage from "../usage.js";
import type * as users from "../users.js";
import type * as videos from "../videos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analysis: typeof analysis;
  "api/analysis": typeof api_analysis;
  "api/entitlements": typeof api_entitlements;
  "api/generationJobs": typeof api_generationJobs;
  "api/index": typeof api_index;
  "api/transcripts": typeof api_transcripts;
  "api/usage": typeof api_usage;
  "api/videos": typeof api_videos;
  config: typeof config;
  content: typeof content;
  index: typeof index;
  init: typeof init;
  subscriptions: typeof subscriptions;
  transcripts: typeof transcripts;
  types: typeof types;
  usage: typeof usage;
  users: typeof users;
  videos: typeof videos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
