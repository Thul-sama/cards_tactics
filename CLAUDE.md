# CLAUDE.md — cards_tactics (prototype)

## Contexte

Ce dépôt est un **prototype jetable** qui sert à tester la boucle de jeu d'un jeu de cartes tactique solo (PvE, roguelike). Les règles se trouvent dans `docs/regles.md`. C'est la source de vérité : en cas de doute sur une règle, s'y référer, et ne jamais inventer de règle de jeu sans le signaler.

Le vrai jeu sera développé plus tard dans Godot. Rien ici n'a vocation à être réutilisé.

## Objectif du prototype

Vérifier que la boucle de jeu est amusante, et faciliter l'équilibrage :

- une boutique à chaque tour, avec or, intérêts, relance, rareté et vente ;
- une pioche optionnelle après avoir vu la boutique ;
- les fusions (3 exemplaires donnent 1 carte de niveau 2) ;
- le combat : monstres, sorts et pièges, avec des emplacements limités par le niveau ;
- un chrono sur la phase de boutique et sur la phase de jeu ;
- un ennemi scripté qui annonce ses intentions.

## Contraintes techniques (à respecter strictement)

- **Pas de framework, pas d'outil de build, pas de dépendance npm.** Du HTML, du CSS et du JavaScript natifs.
- `index.html` doit fonctionner **en l'ouvrant d'un double-clic** (`file://`), sans serveur.
- Les données sont dans des fichiers **`.js`** (pas en `.json`, qui est bloqué en `file://`), chargés par des balises `<script>` :
  - `data/config.js` : toutes les valeurs d'équilibrage (or, intérêts, prix, chrono, tailles de main et de boutique...) ;
  - `data/cards.js` : le pool de cartes ;
  - `data/enemies.js` : les ennemis scriptés.
- **Aucune valeur d'équilibrage codée en dur** dans la logique : tout passe par `data/`.
- Une **interface volontairement minimale** : des rectangles et du texte, sans graphisme ni animation superflue.
- **Utilisable sur mobile** : mise en page responsive et zones tactiles assez grandes. Le jeu est publié sur GitHub Pages pour être testé au téléphone.
- Un **bouton pause** est prévu pour les interruptions sur mobile.

## Structure

```
index.html        ← interface et logique du jeu
data/config.js
data/cards.js
data/enemies.js
docs/regles.md    ← règles du jeu (source de vérité)
README.md
```

Si `index.html` devient trop gros, la logique peut être découpée dans `js/*.js`, toujours chargés par `<script>`, sans modules ES pour rester compatible `file://`.

## Façon de travailler

- **Un commit par changement**, avec un message explicite en français. Pour un changement d'équilibrage, indiquer la raison (exemple : « relance à 2 or : trop facile de chercher les fusions »).
- Quand une règle est ajoutée ou modifiée, **mettre à jour `docs/regles.md`** dans le même commit.
- Quand une règle est ambiguë ou marquée **[à valider]**, choisir l'option la plus simple, la rendre paramétrable dans `config.js` si possible, et **le signaler** au lieu de trancher en silence.
- Garder le code simple et lisible plutôt qu'architecturé.

## Hors périmètre

Le PvP, la collection entre les runs, les sauvegardes persistantes, les graphismes, le son et l'IA avancée ne font pas partie de ce prototype.
