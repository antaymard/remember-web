# Remember — Monorepo

Monorepo Remember : un backend **Convex** partagé, une app **web** (Vite/React) et une app **mobile native** (Expo/React Native). Le typage circule de bout en bout — le même `api` et les mêmes `Doc`/`Id` générés par Convex sont consommés par le web **et** le natif.

## Structure

```
remember-web/
├── apps/
│   ├── web/            # Vite + React 19 + TanStack Router + Tailwind v4 (PWA)
│   └── mobile/         # Expo (Expo Router) + NativeWind, auth Convex via SecureStore
└── packages/
    └── backend/        # Backend Convex (schéma, fonctions, types générés) → @remember/backend
```

## Prérequis

- Node 18+ (testé sur Node 22)
- **Yarn 4** via Corepack : `corepack enable` (Corepack récupère la version définie par le champ `packageManager`)

## Installation

```bash
yarn install   # à la racine — installe tous les workspaces
```

## Variables d'environnement

Les trois pointent vers le **même** déploiement Convex :

| Fichier                          | Variable                  |
| -------------------------------- | ------------------------- |
| `packages/backend/.env.local`    | `CONVEX_DEPLOYMENT` (géré par `convex dev`) |
| `apps/web/.env.local`            | `VITE_CONVEX_URL`         |
| `apps/mobile/.env`               | `EXPO_PUBLIC_CONVEX_URL`  (cf. `apps/mobile/.env.example`) |

## Développement

```bash
# Backend Convex (codegen + watch) — à lancer en premier
yarn workspace @remember/backend dev      # = npx convex dev

# Web
yarn workspace @remember/web dev          # http://localhost:3000

# Mobile (Expo dev server : i = iOS, a = Android)
yarn workspace @remember/mobile start
```

Raccourcis à la racine : `yarn backend:dev`, `yarn web:dev`, `yarn mobile:start`, ou `yarn dev` (Turborepo, tout en parallèle).

## Partage de types

`packages/backend` expose ses types générés via le champ `exports`. Web et mobile importent exactement la même chose :

```ts
import { api } from "@remember/backend/api";
import type { Doc, Id } from "@remember/backend/dataModel";
```

## Build / déploiement

- **Web** : `yarn workspace @remember/web build`
- **Backend** : `yarn workspace @remember/backend deploy`
- **Mobile** : EAS Build (`eas build`) — à configurer ultérieurement

## Note sur les versions Expo

Les versions dans `apps/mobile/package.json` ciblent **Expo SDK 53** (React 19 / RN 0.79). Après le premier `yarn install`, lance `npx expo install --fix` dans `apps/mobile` pour aligner précisément les versions natives sur ton SDK.
