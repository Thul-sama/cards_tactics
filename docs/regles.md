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
- Des **intérêts** sont versés sur l'or épargné : 1 or par tranche de 5, plafonné à 1 par tour.
- La **relance** de la boutique est payante.
- Le **prix** des cartes dépend de leur rareté.
- La **vente** rapporte de l'or. Sa valeur est **[à valider]**.

## 10. Valeurs de départ du prototype

| Paramètre | Valeur |
|---|---|
| Or par tour | 3 |
| Intérêts | 1 or par tranche de 5 épargnés, plafonné à **1** (3 avant les réglages n°1) |
| Prix d'une relance | 1 |
| Taille de la boutique | 3 cartes |
| Main maximale | 7 |
| Pioche de début de combat | 3 cartes, plus 1 mulligan |
| Pioche par tour | 1, optionnelle (**à équilibrer**) |
| Prix : commune / rare / épique | 1 / 2 / 3 |
| Prix de vente | 1 pour une commune, 2 pour une rare, 3 pour une épique |
| PV du héros du joueur | 20 |
| Chrono boutique / jeu | 30 s / 15 s |
| Bande de pillards | 20 PV, 4 emplacements de monstres, 2 monstres posés par tour |
| Attaque directe du héros ennemi | 2 dégâts par tour ennemi, ignore la Provocation |

## 11. Pool de départ proposé pour le prototype

**Monstres**

| Carte | Rareté | ATQ / PV | Effet |
|---|---|---|---|
| Gobelin éclaireur | Commune | 2 / 1 | — |
| Squelette | Commune | 1 / 3 | — |
| Loup des bois | Commune | 3 / 2 | — |
| Garde nain | Rare | 2 / 5 | Provocation : doit être attaqué en premier |
| Archer elfe | Rare | 2 / 2 | Charge : peut attaquer le tour où il est posé |
| Chef pillard | Rare | 4 / 4 | — **[à valider]** : carte de l'ennemi ajoutée au pool |
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

L'ennemi a un **deck prédéfini** et **annonce son intention** au tour précédent. Ses cartes viennent du **même pool que le joueur** (section 11).

Exemple, « Bande de pillards » (héros à 20 PV, 4 emplacements de monstres, 2 exemplaires par pose de monstre avec le levier 2.1) :

| Tour | Action |
|---|---|
| 1 | Pose 2 Gobelins (2/1) |
| 2 | Pose 2 Gobelins et attaque |
| 3 | Pose une Fosse à pieux (face cachée), pose 2 Gobelins et attaque |
| 4 | Pose un Chef pillard (4/4, Charge avec le levier 2.5) et un Gobelin, puis attaque |
| 5 et suivants | Attaque, puis pose 2 Gobelins dans les emplacements libres |

**Les scripts bouclent** : une fois les tours scriptés joués, la séquence `ensuite` se répète à chaque tour jusqu'à la fin du combat, pour que l'ennemi continue à agir. Une pose sans emplacement libre est annulée, et le journal l'indique.

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

## 14. Choix provisoires du prototype **[à valider]**

Ces choix comblent les trous des sections précédentes pour que le prototype soit jouable. Ce sont les options les plus simples. Ils sont paramétrables dans `data/config.js` ou `data/enemies.js` quand c'est possible.

| Point | Choix du prototype | Paramètre |
|---|---|---|
| Or de départ | 0 | `orDepart` |
| Deck de départ | Gobelin éclaireur, Squelette, Loup des bois, Projectile magique | `deckDepart` |
| Moment des intérêts | Calculés sur l'or possédé au début du tour, avant le revenu | — |
| Pool de la boutique | Infini, tirage pondéré par rareté (60 / 30 / 10 / 0) | `chancesRarete` |
| Cartes achetées | Elles vont directement en main | — |
| Fusion | Seules les cartes **en main** comptent. Pas de niveau 3. Le niveau 2 double les stats et les valeurs d'effet. | `fusion` |
| Vente d'une carte de niveau 2 | Prix de vente × 3, soit la valeur des 3 exemplaires | `venteSelonNiveau` |
| « 1 sort » au niveau 1 | 1 sort direct par tour | `niveaux[].sortsParTour` |
| Sorts et pièges | Les sorts directs se lancent. Seules les cartes Piège se posent face cachée. La règle « un sort peut être posé comme piège » n'est pas appliquée, faute de déclencheur défini pour les sorts directs. | — |
| Montée de niveau | Achat en boutique : niv. 2 pour 4 or (2 monstres), niv. 3 pour 6 or (3 monstres, 2 sorts, 2 pièges) | `niveaux` |
| Cibles des sorts | Dégâts et soin : n'importe quel monstre ou héros. Bénédiction : n'importe quel monstre. | — |
| Résolution d'une attaque | Échange simultané. La Fosse à pieux frappe l'attaquant avant l'échange ; s'il meurt, l'attaque est annulée. | — |
| Pièges | À usage unique, ils partent en défausse une fois déclenchés | — |
| Chrono écoulé | La phase se termine : la boutique passe au jeu, et le jeu passe la main à l'ennemi. Les actions non faites sont perdues. | `chrono` (0 = désactivé) |
| Pause | Un bouton de pause, plus une pause automatique quand l'application passe en arrière-plan | — |
| Emplacements de l'ennemi | 3 monstres, 1 piège | `emplacementsMonstres`, `emplacementsPieges` |
| Ciblage de l'ennemi | Voir section 15 | `ia` dans `enemies.js` |
| Pièges ennemis | Le nombre est visible, le contenu reste caché. L'intention annonce « un piège » sans le nommer. | — |
| PV du héros | Remis à 20 au début de chaque combat | `pvHeros` |
| Défaite | Fin de la run | — |
| Donjon | 2 combats contre la Bande de pillards | `donjon` |
| Sauvegarde | Non incluse dans le prototype (hors périmètre) | — |
| Contre-sort | Implémenté, mais inutile pour l'instant : l'ennemi scripté ne lance aucun sort (l'action `sort` existe dans les scripts mais n'est pas utilisée) | — |

## 15. IA de ciblage de l'ennemi

L'IA choisit seulement les **cibles**. Ce que l'ennemi pose ou lance reste défini par son script.

**Attaques.** Chaque monstre prêt attaque à son tour, en testant ces priorités dans l'ordre :

1. **Létal** : il attaque le héros si les dégâts cumulés des monstres qui n'ont pas encore attaqué ce tour suffisent à le tuer.
2. **Tuer sans perte** : il tue un monstre du joueur sans perdre l'attaquant, c'est-à-dire si l'ATQ de la cible est inférieure à ses propres PV. S'il a le choix, il vise le plus dangereux.
3. **Héros** : sinon, il attaque le héros.

La priorité « le plus dangereux » (attaquer le monstre du joueur qui a l'ATQ la plus haute, même à perte) existe, mais elle n'est pas utilisée : en simulation, elle faisait sacrifier ses monstres à l'ennemi, qui ne gagnait aucun combat.

La Provocation est toujours respectée, même quand une attaque sur le héros serait létale. L'IA ignore les pièges cachés du joueur. **[à valider]**

**Sorts** (aucun script n'en lance pour l'instant) :

- Sort de dégâts : le héros si c'est létal, sinon le monstre du joueur à l'ATQ la plus haute, sinon le héros. Les sorts ignorent la Provocation.
- Soin : son propre héros. Bénédiction : son monstre à l'ATQ la plus haute. **[à valider]**

Les priorités sont paramétrables pour chaque ennemi dans `data/enemies.js` (`ia.attaques` et `ia.sorts`, valeurs possibles : `letal`, `tuerSansPerte`, `plusDangereux`, `heros`). Par exemple, `['letal', 'heros']` donne un profil agressif qui frappe toujours le héros.

## 16. Leviers de pression ennemie et diagnostic

Ces outils servent à équilibrer. Chaque levier se règle dans `data/config.js` (`leviers`) ou dans `data/enemies.js`, et possède un interrupteur `enabled`. Au départ, tous les leviers étaient désactivés sauf les statistiques. Les réglages n°1 activent les poses multiples (16.2) et l'attaque directe (16.5).

### 16.1 Statistiques de diagnostic (`leviers.statistiques`, activé)

À la fin de chaque combat, un résumé affiche :

- le nombre de tours ;
- l'or gagné (revenu, intérêts et ventes), dépensé (achats, relances, niveaux) et épargné (or restant), ainsi que les intérêts touchés ;
- la **part d'or dépensée**, en pourcentage de l'or gagné pendant le combat. Elle peut dépasser 100 % si le joueur dépense de l'or épargné lors des combats précédents ;
- les PV restants du joueur, en valeur et en pourcentage ;
- le nombre de monstres ennemis posés, et combien ont attaqué au moins une fois ;
- le nombre de tours où le plateau ennemi a été **entièrement nettoyé** à la fin du tour du joueur. Un tour ne compte que si l'ennemi avait au moins un monstre au début de la phase de jeu. **[à valider]**
- les dégâts reçus par le héros joueur, par source : monstres, sorts, attaque directe, enrage ;
- les cartes achetées et les cartes jouées.

Le bouton **Historique** liste les combats de la session, pour comparer plusieurs parties. Rien n'est sauvegardé : recharger la page efface l'historique.

### 16.2 Plusieurs poses par tour (`leviers.posesMultiples`, **activé** depuis les réglages n°1)

Quand le levier est actif, chaque action « pose un monstre » du script pose `posesParTour` exemplaires de ce monstre, dans la limite des emplacements libres. Une pose peut fixer son propre nombre avec `exemplaires` (par exemple pour ne poser qu'un seul Chef pillard). L'intention l'annonce, par exemple « Pose 2× Gobelin éclaireur ». **[à valider]** : les scripts ne posant qu'un monstre à la fois, « nombre de poses par tour » est interprété comme un nombre d'exemplaires.

Le nombre d'emplacements de monstres de l'ennemi (`emplacementsMonstres`) se règle par ennemi. Il ne dépend pas du niveau du joueur, et il est toujours actif (ce n'est pas un levier).

### 16.3 Monstres résistants (`leviers.niveauxEnnemis`, désactivé)

Dans un script ennemi, une pose ou un sort peut indiquer un `niveau` de 2 ou 3. Les statistiques et les effets sont alors multipliés comme pour une fusion (`fusion.multiplicateur`, ×2 par niveau). Quand le levier est désactivé, toutes les cartes ennemies sont de niveau 1. Le niveau 3 est permis pour l'ennemi, même si le joueur ne peut pas encore fusionner jusqu'au niveau 3.

La **Provocation** fonctionne dans les deux camps : tant qu'un monstre adverse a Provocation, les attaques de monstres doivent le viser, et le héros ne peut pas être attaqué. Les sorts l'ignorent, comme dans Hearthstone. **[à valider]**

### 16.4 Enrage (`leviers.enrage`, désactivé)

À partir du tour ennemi `startTurn`, l'ATQ de tous les monstres ennemis augmente de `perTurn` à chaque tour ennemi : +1 au tour `startTurn`, +2 au suivant, et ainsi de suite. Le bonus compte aussi pour la riposte quand le joueur attaque un monstre ennemi. Le bonus en cours et celui du prochain tour sont affichés dans la zone ennemie. Les tours sont comptés **côté ennemi** : c'est son propre compteur qui fait avancer son script et son enrage. **[à valider]**

Dans les statistiques, la part des dégâts au héros due au bonus est comptée en « enrage », le reste en « monstres ».

### 16.5 Attaque directe du héros ennemi (`leviers.attaqueDirecte`, **activé** depuis les réglages n°1)

**Règle** : à la fin de chaque tour ennemi, quel que soit l'état du plateau, le héros ennemi inflige au héros du joueur `damage` dégâts (**2** par défaut), plus `perTurn` par tour ennemi écoulé (soit `damage + perTurn × (tour ennemi − 1)`, `perTurn` valant 0 par défaut). Cette attaque **n'est pas bloquée par la Provocation** et ne déclenche pas les pièges. Elle s'applique à tous les ennemis.

Elle est annoncée dans l'intention (« Frappe directe : 2 dégâts »), affichée en rouge dans le récapitulatif « Dernier tour ennemi » au-dessus du plateau ennemi, et comptée en « attaque directe » dans les statistiques de fin de combat.

### 16.6 Charge sur certains monstres ennemis (`leviers.chargeEnnemie`, désactivé)

Une pose du script peut porter `charge: true`. Quand le levier est actif, le monstre gagne Charge : il peut attaquer dès le tour où il est posé, à condition que l'action « attaque » vienne après la pose dans le script. L'intention l'annonce. Exemple fourni : le Chef pillard des pillards, au tour 4.

### 16.7 Archétypes d'ennemis

Deux ennemis sont fournis, avec des cartes du pool commun. Leurs valeurs sont dans `data/enemies.js`.

| | Bande de pillards (Aggro) | Gardien de la crypte (Contrôle) |
|---|---|---|
| PV | 20 | 30 **[à valider]** |
| Emplacements de monstres | 4 | 2 |
| Poses | 2 exemplaires par pose (levier 2.1) | 1 |
| Cartes | Gobelins, Fosse à pieux, Chef pillard (Charge, levier 2.5) | Squelette et Garde nain de niveau 2 (levier 2.2, Provocation), Projectile magique, Boule de feu, Contre-sort |
| IA d'attaque | létal → tuer sans perte → héros | létal → tuer sans perte → plus dangereux |
| Sorts | — | létal → plus dangereux |

Avec tous les leviers désactivés, les deux ennemis ne posent qu'un exemplaire, de niveau 1, sans Charge. Les archétypes ne prennent tout leur sens qu'avec les leviers 2.1, 2.2 et 2.5 activés.

Le donjon enchaîne les pillards puis la crypte (`donjon`). Pour les tests, un écran permet de **choisir l'ennemi avant chaque combat** (`choixEnnemi: true`) ; l'ennemi prévu par le donjon y est mis en évidence.

Les PV du héros des pillards (20) remplacent les 12 de l'exemple de la section 12.

### 16.8 Intention avec cibles

L'IA de ciblage est décrite à la section 15 ; ses priorités se règlent par ennemi (`ia`), et chaque archétype a la sienne (section 16.7).

Pendant le tour du joueur, l'intention annonce l'action de l'ennemi **et ses cibles**, par exemple « Attaque : Gobelin éclaireur → ton héros ; Chef pillard → Loup des bois » ou « Lance Boule de feu → Ogre ». C'est une **prédiction** : elle est recalculée à chaque changement du plateau, donc le joueur voit comment ses actions modifient les choix de l'ennemi. Elle ne tient pas compte des monstres que l'ennemi posera ce tour-là ni des pièges du joueur. **[à valider]** : annoncer une cible fixe au tour précédent serait incohérent, puisque le joueur modifie le plateau entre-temps.

### 16.9 Ordre de départ (`leviers.ordreDepart`, désactivé)

Chaque ennemi a un paramètre `firstPlayer` : `"player"`, `"enemy"` ou `"random"`. Quand le levier est actif et que l'ennemi commence, il joue un tour complet (son tour 1) après le mulligan et avant la première boutique du joueur. Le joueur reçoit alors `secondPlayerGold` or (1 par défaut), une seule fois par combat, avant le calcul des intérêts du premier tour. **[à valider]**

Réglages fournis : les pillards (aggro) commencent, la crypte (contrôle) laisse commencer le joueur. Ce levier est surtout prévu pour un futur PvP ; en PvE, il sert de levier de difficulté par ennemi.

### 16.10 Panneau de réglage

Le bouton **Réglages** ouvre un panneau, caché par défaut, qui permet d'activer ou désactiver chaque levier, de modifier ses valeurs et de régler les paramètres de chaque ennemi (PV, emplacements, poses, ordre de départ, priorités d'IA). Les changements ne valent que pour la session. Le chrono est arrêté tant que le panneau est ouvert.

**Copier la config** exporte les valeurs actuelles au format de `data/config.js`, et **Copier les ennemis** fait de même pour `data/enemies.js`, pour reporter les bons réglages dans les fichiers. L'export est du JSON valide en JavaScript ; les commentaires des fichiers d'origine ne sont pas conservés.
