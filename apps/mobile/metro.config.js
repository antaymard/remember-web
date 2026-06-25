// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo so changes in packages/backend (shared
//    Convex types) and other workspaces trigger reloads.
config.watchFolders = [monorepoRoot];

// 2. Resolve modules from the app first, then from the monorepo root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Enable package.json "exports" so subpath imports like
//    `@remember/backend/api` and `@remember/backend/dataModel` resolve.
//    (Default-on in RN 0.79, set explicitly for clarity.)
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./global.css" });
