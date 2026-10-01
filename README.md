# cards_tactics — prototype

Prototype jetable pour tester la boucle d'un jeu de cartes tactique solo (boutique façon TFT, combat façon Hearthstone). Les règles sont dans [`docs/regles.md`](docs/regles.md).

## Jouer

- **En local** : ouvrir `index.html` d'un double-clic. Aucun serveur ni installation n'est nécessaire.
- **Sur téléphone** : activer GitHub Pages (Settings → Pages → *Deploy from a branch*, branche `main`, dossier `/`), puis ouvrir l'URL fournie.

## Comment jouer

0. **Choix de l'ennemi** (outil de test, `choixEnnemi`) : l'ennemi prévu par le donjon est mis en évidence.
1. **Mulligan** : on peut remplacer 1 carte de la main de départ.
2. **Boutique** (chrono) : acheter, relancer, piocher 1 carte, vendre une carte de la main (la sélectionner, puis « Vendre ») ou monter de niveau.
3. **Jeu** (chrono) : sélectionner une carte de la main pour la poser ou la lancer, puis toucher la cible encadrée en pointillés. Pour attaquer, toucher un monstre prêt (bordure verte), puis sa cible.
4. **Tour ennemi** : il est résolu automatiquement. Son intention est affichée pendant ton tour.

## Équilibrer

Toutes les valeurs se trouvent dans `data/` :

- `data/config.js` : or, intérêts, prix, chrono, tailles de main et de boutique, niveaux, fusion, donjon ;
- `data/cards.js` : le pool de cartes ;
- `data/enemies.js` : les ennemis scriptés.

Les choix provisoires faits pour combler les règles **[à valider]** sont listés dans la section 14 de `docs/regles.md`.

Pour tester sans éditer les fichiers :

- **Réglages** : active ou désactive les leviers de pression ennemie (enrage, attaque directe, poses multiples...), modifie leurs valeurs et celles des ennemis pour la session, puis **Copier la config** ou **Copier les ennemis** pour reporter les bons réglages dans `data/` ;
- **Historique** : le résumé de chaque combat de la session (tours, or, PV restants, tours de nettoyage, dégâts reçus par source...).

Les leviers sont décrits dans la section 16 de `docs/regles.md`.
