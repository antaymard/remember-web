# Remember - Présentation Produit

## Le Problème

Les gens prennent des milliers de photos qui restent enfouies dans leurs téléphones. Les réseaux sociaux ne sont pas la solution car ils imposent une logique de partage et de validation sociale qui dénature la vraie raison pour laquelle on capture des moments : **se souvenir pour soi-même**.

Il manque un espace personnel et intime pour **préserver, enrichir et revivre ses souvenirs** sans la pression du regard des autres.

### La Solution Remember

Remember est un **anti-réseau social** : une application privée où chaque souvenir est capturé pour l'utilisateur lui-même, comme un journal visuel intelligent. L'objectif n'est pas le partage ou les likes, mais la **contemplation personnelle** et la **redécouverte** de moments significatifs de sa vie.

## L'expérience centrale&#x20;

### Ce qu'on enregistre

#### Les personnes & animaux

Ex : Oréo (mon chat), Dominique (mon père) etc

Ces fiches sont créées par l'utilisateur, et visibles par lui seulement. Il peut y écrire des descriptions, anecdotes, date de rencontre, photos…

Les souvenirs sont rattachables à ces fiches `persons`.

Les fiches `persons` peuvent être liées au compte utilisateur de la personne, si celle-ci se créer un compte sur Remember. **Ex** : mon père Dominique s'inscrit sur Remember et m'ajoute en ami. Je lie sa fiche à son compte. Il n'a pas accès à la fiche, mais la fiche est liée aux informations publiques qu'il poste (contexte de vie, souvenirs partagés).

#### Les lieux

Ex : maison de grand-mère, lieu de demande en mariage…

Ces fiches `lieu` sont pour des lieux significatifs et importants pour l'utilisateur. Il peut y ajouter photo, description, personnes liées, objets…

La vocation de cette fiche n'est pas de sauvegarder un bon restaurant qu'on a découvert. Un bon restaurant serait plutôt un souvenir. Mais si c'est un restaurant auquel on a l'habitude d'aller, dans lequel on a vécu des choses, alors on peut en créer une fiche `lieu`.

#### Les objets inanimés

Ex : le Minolta de mon grand-père, ma première guitare, un film que j'ai vu 100 fois ou qui m'a marqué, un morceau qui m'a marqué, un livre…

#### Les contextes de vie

Le `contexte` de vie a pour objectif de donner de la perspective et du sens aux dates.&#x20;

Dire seulement “il y a 5 ans”, ça n'aide pas beaucoup. Mais dire “3 mois après votre demande en mariage, 1 an avant la naissance de X, vous étiez alors au chômage etc”, ça met en perspective un souvenir passé.

Les `contexte`s sont donc renseignés par l'utilisateur. Ils peuvent être publics ou privés. Ils peuvent être un changement d'état (ex : marié), ou des états (ex : employé chez X).

Certains contextes sont automatiquement générés (rencontre ou mort d'une personne, âge, acquisition d'un objet)…

#### Les souvenirs

Chaque souvenir dans Remember peut contenir :

**Base**

- Titre
- Photo(s) ou média visuel
- Description
  - Une partie publique, rédigée par le créateur et visible par tous les utilisateurs ayant accès au souvenir
  - Une partie privée, que tout utilisateur qui a accès au souvenir peut rédiger et visible seulement par lui

- Un espace commentaires/anecdotes, où tous les utilisateurs avec qui le souvenir est partagé peuvent discuter

**Détails spatio-temporels**

- La date et l'heure
- Le lieu : coordonnées/adresse ou fiche `lieu` enregistrée (maison de grand-mère)
- La météo au moment du souvenir

**Personnes (ou animaux) présentes & contexte humain et objets liés**

- Les personnes présentes (fiches `personne`)
- Leurs `contextes` de vie respectifs au moment du souvenir (si publics)
- Le contexte de vie du créateur du souvenir
- Objets significatifs (fiche `objet`)

### Pourquoi tout ce contexte ?

Parce qu'un souvenir n'est jamais juste une image. C'est un **moment de vie entier** avec ses personnes, ses lieux, ses émotions, son contexte. Remember permet de capturer cette richesse pour pouvoir la revivre authentiquement des années plus tard.

### Rechercher

La recherche peut se faire par langage naturel + RAG. Ex : "souvenirs avec mon chat", "voyages en montagne l'année dernière"…

Mais également par toute propriété d'un souvenir (date, lieu, personnes présentes, objet…).

Les fiches `personne`, `objet`, `lieu` etc sont également recherchables.

### Parcourir et se perdre

Comme on peut mentalement se perdre dans ses souvenirs, et passer de l'un à l'autre par des liens (personnes, émotion, lieu), Remember invite à passer d'un souvenir à l'autre de multiples façons :

- Thématique : vacances au ski, pointent vers d'autres vacances au ski
- Personnes : souvenir avec Marie → d'autres souvenirs avec Marie
- Lieu
- Emotion / météo

## Flow général d'utilisation

### Capturer un Moment

1. Photo prise (dans l'app ou importée)
2. Ajout immédiat possible mais optionnel de contexte :&#x20;
   - Qui était là ?
   - Où étais-je ? Cela peut se remplir par géolocalisation du téléphone et horodatage
   - Que s'est-il passé de spécial ? Cela peut se remplir par dictée, en vrac, avec NLP dans la foulée pour synthétiser et rédiger.

3. Le souvenir est sauvegardé, enrichissable plus tard

**Principe** : Pas de friction au moment de capture. On peut enrichir dans un second temps, au calme.

### Revivre ses Souvenirs

1. Ouvrir l'app → arriver sur le mur infini
2. Scroller et se laisser porter par la redécouverte
3. Cliquer sur un souvenir → voir le détail avec tout son contexte
4. Explorer les connexions : autres moments au même lieu, avec les mêmes personnes...

**Alternative** : Rechercher activement

- Barre de recherche sémantique
- Filtres par personne, lieu, période
- Navigation par thématiques (voyages, famille, travail...)

### Enrichir Rétrospectivement

Remember encourage à revenir sur ses souvenirs pour les enrichir :

- Ajouter des détails oubliés
- Compléter les personnes présentes
- Noter une anecdote qui revient en mémoire
- Connecter à d'autres moments

C'est un **journal vivant** qui grandit avec le temps.

### Mécaniques sociales et de partage

#### Partager consciemment

Par défaut, tout est privé sur Remember. Mais il est possible de partager les souvenirs avec ceux qui les ont vécus par exemple. Le partage est volontaire, actif (opt-in) et nominatif.

#### Rappeler à la mémoire

Il est possible de rappeler à la mémoire un souvenir, auprès des personnes avec qui on a vécu le souvenir. Ce faisant, le souvenir remonte en haut du feed des autres utilisateurs, et une notification leur est envoyée.

#### Rem Sessions

Remember propose des Rem Sessions. Plusieurs utilisateurs rejoignent une room synchronisée, sur laquelle est diffusée en live sur tous les téléphones une playlist de souvenirs choisie par les participants.

Une sorte de diaporama de vacances collaboratif et dynamique.

#### Commentaires et anecdotes

L'espace commentaire permet à tous les utilisateurs ayant accès au souvenir, de partager, commenter, rigoler et préciser des anecdotes sur le souvenir, à tout moment. De parler, répondre etc.

### Versions de souvenirs

Certains moments sont vécus différemment par les différentes personnes présentes. Ex : un mariage est vécu différemment par le marié, son témoin, ses parents… Chacun vivra au même moment des choses différentes.

Les versions de souvenirs permettent de lier ensemble ces différentes versions d'un même moment, et de naviguer entre elles facilement.

## Spécificités Différenciantes

### 1. Anti-Social par Design

Pas de feed des autres, pas de likes, pas de pression sociale. C'est **votre** espace mental, pas une scène publique.

### 2. Contextualisation Profonde

Les autres apps stockent des photos. Remember stocke des **moments de vie complets** avec leur contexte humain, spatial, temporel et émotionnel.

### 3. Redécouverte Contemplative

Le mur infini invite à la sérendipité et à la contemplation plutôt qu'à la recherche utilitaire.

### 4. Intelligence Sémantique

Recherche qui comprend ce que vous cherchez vraiment, pas juste ce que vous écrivez.

### 5. Relations Fluides

Pas de dossiers rigides ou de tags obligatoires. Les connexions émergent naturellement du contexte partagé.

### 6. Héritage Numérique

Vision future : créer des comptes pour ses enfants et leur transférer à leur majorité, leur offrant leur histoire capturée par leurs parents.

## Pour Qui ?

Remember s'adresse aux personnes qui :

- Prennent beaucoup de photos mais ne les regardent jamais
- Sont fatiguées de la pression des réseaux sociaux
- Veulent **vraiment se souvenir**, pas juste archiver
- Cherchent un espace personnel et intime pour leur mémoire visuelle
- Apprécient la contemplation et la réflexion personnelle

C'est pour ceux qui veulent **vivre leurs souvenirs**, pas les performer.

## L'Essence de Remember

Remember transforme le téléphone d'un cimetière de photos en un **jardin de mémoires vivantes**. C'est un espace où chaque moment capturé devient un souvenir enrichi, contextualisé, vivant, accessible non pas par date mais par sens, par émotion, par connexion.

C'est le journal intime du 21ème siècle : visuel, intelligent, et profondément personnel.

# Points techniques

## Architecture

```
remember-web/
├── src/              # Frontend React + TypeScript
│   ├── routes/       # Routes TanStack Router
│   ├── hooks/        # Custom React hooks
│   └── assets/       # Assets statiques
├── convex/           # Backend Convex
│   ├── auth.ts       # Configuration authentification
│   ├── schema.ts     # Schéma de base de données
│   ├── persons.ts    # API persons
│   └── utils/        # Utilitaires backend
└── public/           # Fichiers statiques publics
```

## Stack Technique

### Frontend

- **React 19.2** avec TypeScript
- **Vite 7** - Bundler et dev server
- **TanStack Router 1.144** - Routing avec auto code-splitting
- **Tailwind CSS v4** - Framework CSS avec plugin Vite
- **Yarn 4** - Gestionnaire de packages

### Backend

- **Convex** - Backend as a Service (BaaS)
- **@convex-dev/auth** - Authentification
- **convex-helpers** - Utilitaires Convex

### Déploiement

- **Cloudflare R2** - Hébergement des assets
- **Cloudflare Workers** - Déploiement de l'application

## Commandes Principales

```bash
# Installation
yarn install

# Développement
yarn dev                    # Lance Vite dev server sur http://localhost:3000
npx convex dev             # Lance Convex en mode développement

# Build
yarn build                 # Compile TypeScript + build Vite de production
tsc -b                     # Type checking uniquement

# Qualité de code
yarn lint                  # Lint avec ESLint
yarn preview              # Preview du build de production
```

## Configuration Environnement

Variables d'environnement requises (`.env.local`) :

```
VITE_CONVEX_URL=<your-convex-deployment-url>
```

## Conventions de Code

### TypeScript

- Mode strict activé
- Utiliser les types explicites pour les props et les retours de fonction
- Préférer `interface` pour les objets, `type` pour les unions/intersections

### React

- **Composants fonctionnels uniquement** (pas de class components)
- **Hooks customs** dans `src/hooks/`
- **Nommage** :
  - Composants : PascalCase (`UserProfile.tsx`)
  - Hooks : camelCase avec préfixe `use` (`useQueryWithStatus.ts`)
  - Utilitaires : camelCase

### Routing (TanStack Router)

- Routes basées sur les fichiers dans `src/routes/`
- `__root.tsx` : Layout racine
- Auto-génération du routeTree dans `src/routeTree.gen.ts` (ne pas modifier manuellement)
- Auto code-splitting activé

### Styling

- **Tailwind CSS v4** avec plugin Vite
- Classes utilitaires Tailwind uniquement
- Éviter le CSS custom sauf nécessité

### Backend Convex

- **Queries** : Lecture de données (cache automatique)
- **Mutations** : Modification de données
- **Actions** : Opérations side-effect (API externes, etc.)
- **Schéma** : Définir dans `convex/schema.ts`
- **Auth** : Utiliser `requireAuth` helper pour les endpoints protégés
- **Nommage des IDs** : Toujours utiliser `_id` (et non `id`) pour manipuler les identifiants Convex. Les arguments de queries/mutations doivent utiliser `_id`, et les appels frontend doivent passer `{ _id: ... }`

## Fichiers Importants

| Fichier                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `package.json`          | Dépendances et scripts npm                   |
| `vite.config.ts`        | Configuration Vite, plugins, port dev server |
| `tsconfig.json`         | Configuration TypeScript racine              |
| `convex/schema.ts`      | Schéma de base de données Convex             |
| `convex/auth.config.ts` | Configuration authentification               |
| `src/routeTree.gen.ts`  | Arbre de routes auto-généré (ne pas éditer)  |
| `src/main.tsx`          | Point d'entrée React avec providers          |

## Patterns et Best Practices

### Gestion d'État

- **Server State** : Convex queries/mutations (pas besoin de Redux/Zustand)
- **Local State** : React hooks (`useState`, `useReducer`)
- **Auth State** : `ConvexAuthProvider` wrapping l'app

### Authentification

```tsx
// Utiliser ConvexAuthProvider dans main.tsx
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Backend : protéger les endpoints
import { requireAuth } from "./utils/requireAuth";
```

### Fetching de Données

```tsx
// Custom hook pour queries avec status
import { useQueryWithStatus } from "./hooks/useQueryWithStatus";
```

### Structure des Routes

```
src/routes/
├── __root.tsx           # Layout principal avec Outlet
├── index.tsx            # Route racine "/"
└── signin.tsx           # Route "/signin"
```

## Dépendances Principales

| Package                | Version | Usage          |
| ---------------------- | ------- | -------------- |
| react                  | 19.2.0  | Framework UI   |
| convex                 | 1.31.2  | Backend client |
| @tanstack/react-router | 1.144.0 | Routing        |
| tailwindcss            | 4.1.18  | Styling        |
| vite                   | 7.2.4   | Build tool     |
| typescript             | 5.9.3   | Langage        |

## Ressources

- [Convex Docs](https://docs.convex.dev/)
- [TanStack Router Docs](https://tanstack.com/router)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

## Notes Spécifiques au Projet

- Le dev server tourne sur le port **3000** (configuré dans `vite.config.ts`)
- Auto code-splitting activé pour les routes TanStack
- Authentification via Convex Auth (pas de Firebase/Auth0)
- Ne pas commiter `.env.local` (déjà dans .gitignore)
