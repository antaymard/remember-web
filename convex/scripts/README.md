# Scripts Convex

Ce dossier contient des scripts de maintenance et de migration pour la base de données.

## Scripts disponibles

### `compressAllImages.ts`

Compresse toutes les images existantes dans la base de données (moments, persons, places, things, users).

**Utilisation :**

```bash
npx convex run scripts/compressAllImages:compressAllExistingImages
```

### `addStatusCompleted.ts`

Ajoute le statut "completed" à tous les éléments qui n'ont pas de statut.

**Utilisation :**

```bash
npx convex run scripts/addStatusCompleted:addStatusToAll
```

## Notes

- Les scripts utilisent `internalMutation` pour éviter les appels non autorisés
- Les compressions d'images sont lancées de manière asynchrone via le scheduler
- Surveillez les logs de Convex pour suivre la progression
