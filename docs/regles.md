# Jeu de cartes tactique — Règles du prototype v0.1

> Document de travail. Les valeurs chiffrées sont des points de départ à ajuster en jouant. Les éléments marqués **[à valider]** sont des propositions qui ne sont pas encore décidées.

## 1. Concept

Jeu de cartes tactique solo, hors ligne, en PvE, avec une structure de roguelike.

- La **boutique** façon TFT revient à chaque tour.
- Le **combat** se joue façon Hearthstone : des monstres, des sorts et des pièges.
- Une **économie globale** s'étend sur tout le donjon.
- Le jeu fonctionne en **phases courtes sous chrono**, pour décider vite et bien.

## 2. Structure d'une run

- Un donjon est une suite de combats.
- La partie est **sauvegardée après chaque combat**.
- L'**or** et les **cartes possédées** sont conservés d'un combat à l'autre.
- Entre les runs, des cartes débloquées rejoignent le pool. C'est la collection, qui n'est pas incluse dans le prototype.

## 3. Les cartes

| Type | Fonctionnement |
|---|---|
| **Monstre** | Possède des points d'attaque et de vie. Il est posé sur le plateau. |
| **Sort direct** | A un effet immédiat, puis va en défausse. |
| **Piège** | Sort posé face cachée dans un emplacement de piège. Il se déclenche sur une condition. |

- **Pas de coût de pose** : le coût est payé à l'achat.
- **Rareté** : commune, rare, épique, légendaire. Plus une carte est rare, plus elle est chère.
- **Fusion** : 3 exemplaires identiques fusionnent automatiquement en 1 carte de niveau 2. Les 3 cartes sont retirées et remplacées par la nouvelle.
  - Fusion de niveau 2 vers niveau 3 : **[à valider]**.
  - Effet du niveau 2 : **[à valider]**. Proposition : statistiques doublées.

## 4. Zones de jeu

| Zone | Rôle |
|---|---|
| **Pool** | Ensemble prédéfini où la boutique pioche ses cartes. Pas de personnalisation par le joueur. |
| **Deck** | Toutes les cartes possédées, mélangées en début de combat. |
| **Main** | **7 cartes maximum.** |
| **Plateau** | Emplacements de monstres et de pièges, selon le niveau du joueur. |
| **Défausse** | Cartes jouées, ou monstres morts. Elles sont hors jeu jusqu'à la fin du combat et reviennent dans le deck au combat suivant (sauf mécanique particulière). |

## 5. Niveau du joueur

- Le niveau 1 donne : 1 emplacement de monstre, 1 sort et 1 emplacement de piège.
- Un sort peut être joué comme sort direct ou posé comme piège.
- La progression aux niveaux supérieurs est **[à valider]**.
- La façon de gagner un niveau est **[à valider]**. Proposition : un achat avec de l'or, façon TFT.

## 6. Début de combat

1. Toutes les cartes possédées vont dans le deck, qui est mélangé.
2. On pioche **3 cartes**.
3. Un **mulligan d'1 carte** est possible.

## 7. Déroulement d'un tour

**Phase de boutique (chrono d'environ 30 s)**

1. Le joueur reçoit son or du tour et ses intérêts.
2. La boutique s'affiche.
3. Si le deck n'est pas vide, le joueur peut **piocher 1 carte**. C'est optionnel, et la décision se prend après avoir vu la boutique.
4. Il peut **acheter** des cartes, dans la limite de son or et de sa place en main.
5. Il peut **relancer** la boutique, ce qui est payant.
6. Il peut **vendre** des cartes, uniquement depuis sa main.

**Phase de jeu (chrono d'environ 15 s)**

7. Le joueur pose des cartes dans la limite des emplacements de son niveau.
8. Ses monstres attaquent. Un monstre **ne peut pas attaquer le tour où il est posé**. Chaque monstre choisit sa cible : **un monstre adverse ou le héros adverse**.

**Tour ennemi**

9. L'ennemi joue selon son script.

## 8. Combat

- **Victoire** : les PV du héros adverse tombent à 0.
- **Résolution d'une attaque** : **[à valider]**. Proposition : un échange simultané façon Hearthstone, où les deux monstres s'infligent leurs dégâts.
- **Défaite** : sa conséquence en PvE est **[à valider]**. Elle peut entraîner la fin de la run, ou la perte de PV de run.

## 9. Économie

- De l'or est gagné à chaque tour.
- Des **intérêts** sont versés sur l'or épargné.
- La **relance** de la boutique est payante.
- Le **prix** des cartes dépend de leur rareté.
- La **vente** rapporte de l'or. Sa valeur est **[à valider]**.

## 10. Valeurs de départ du prototype

| Paramètre | Valeur |
|---|---|
| Or par tour | 3 |
| Intérêts | 1 or par tranche de 5 épargnés, plafonné à 3 |
| Prix d'une relance | 1 |
| Taille de la boutique | 3 cartes |
| Main maximale | 7 |
| Pioche de début de combat | 3 cartes, plus 1 mulligan |
| Pioche par tour | 1, optionnelle (**à équilibrer**) |
| Prix : commune / rare / épique | 1 / 2 / 3 |
| Prix de vente | 1 pour une commune, 2 pour une rare, 3 pour une épique |
| PV du héros du joueur | 20 |
| Chrono boutique / jeu | 30 s / 15 s |

## 11. Pool de départ proposé pour le prototype

**Monstres**

| Carte | Rareté | ATQ / PV | Effet |
|---|---|---|---|
| Gobelin éclaireur | Commune | 2 / 1 | — |
| Squelette | Commune | 1 / 3 | — |
| Loup des bois | Commune | 3 / 2 | — |
| Garde nain | Rare | 2 / 5 | Provocation : doit être attaqué en premier |
| Archer elfe | Rare | 2 / 2 | Charge : peut attaquer le tour où il est posé |
| Ogre | Épique | 6 / 6 | — |

**Sorts directs**

| Carte | Rareté | Effet |
|---|---|---|
| Projectile magique | Commune | Inflige 2 dégâts à une cible |
| Soin | Commune | Rend 4 PV à une cible |
| Boule de feu | Rare | Inflige 4 dégâts à une cible |
| Bénédiction | Rare | Donne +2 ATQ et +2 PV à un monstre |

**Pièges**

| Carte | Rareté | Déclencheur et effet |
|---|---|---|
| Fosse à pieux | Commune | Quand un monstre ennemi attaque, lui inflige 3 dégâts |
| Contre-sort | Rare | Annule le prochain sort ennemi |

## 12. Ennemi scripté du prototype **[à valider]**

L'ennemi a un **deck prédéfini** et **annonce son intention** au tour précédent.

Exemple, « Bande de pillards » (héros à 12 PV) :

| Tour | Action |
|---|---|
| 1 | Pose un Gobelin (2/1) |
| 2 | Pose un Gobelin (2/1) et attaque |
| 3 | Pose une Fosse à pieux (face cachée) et attaque |
| 4 | Pose un Chef pillard (4/4) et attaque |
| 5 et suivants | Attaque, et pose un Gobelin s'il a un emplacement libre |

## 13. Points ouverts

- Le nombre de cartes piochées par tour, à équilibrer.
- La progression des niveaux, leur coût et ce que chaque niveau débloque.
- La fusion vers le niveau 3, et l'effet concret d'une montée de niveau.
- La limite de sorts directs par tour.
- Ce qui se passe quand le chrono est écoulé : action par défaut ou tour passé.
- La pause sur mobile.
- Les pièges ennemis : indices visibles ou non.
- La conséquence d'une défaite en PvE, et l'existence de PV de run.
- Le nombre de combats par donjon.
- Le comportement de l'IA au-delà des scripts simples.
- Le PvP, prévu pour plus tard.
