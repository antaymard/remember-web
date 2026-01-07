/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as moments from "../moments.js";
import type * as persons from "../persons.js";
import type * as places from "../places.js";
import type * as things from "../things.js";
import type * as uploads from "../uploads.js";
import type * as utils_r2 from "../utils/r2.js";
import type * as utils_requireAuth from "../utils/requireAuth.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  moments: typeof moments;
  persons: typeof persons;
  places: typeof places;
  things: typeof things;
  uploads: typeof uploads;
  "utils/r2": typeof utils_r2;
  "utils/requireAuth": typeof utils_requireAuth;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
