// Toutes les valeurs d'équilibrage du prototype.
// Les lignes marquées [à valider] sont des choix provisoires : voir docs/regles.md, section 14.
var CONFIG = {
  // --- Économie ---
  orDepart: 0,                                   // [à valider] non précisé par les règles
  orParTour: 3,
  interets: { tranche: 5, plafond: 3 },          // 1 or par tranche de 5 épargnés, plafonné à 3
  prixRelance: 1,
  prixAchat: { commune: 1, rare: 2, epique: 3, legendaire: 4 }, // légendaire [à valider], aucune carte
  prixVente: { commune: 1, rare: 2, epique: 3, legendaire: 4 },
  venteSelonNiveau: true,                        // [à valider] une carte niv. 2 vaut le prix de ses 3 exemplaires

  // --- Boutique ---
  tailleBoutique: 3,
  chancesRarete: { commune: 60, rare: 30, epique: 10, legendaire: 0 }, // [à valider] poids relatifs

  // --- Main et pioche ---
  mainMax: 7,
  piocheDebutCombat: 3,
  mulligan: 1,
  piocheParTour: 1,
  deckDepart: ['gobelin', 'squelette', 'loup', 'projectile'], // [à valider] non précisé par les règles

  // --- Héros ---
  pvHeros: 20,                                   // remis au maximum à chaque combat [à valider]

  // --- Chrono, en secondes (0 = désactivé) ---
  chrono: { boutique: 30, jeu: 15 },

  // --- Fusion ---
  fusion: {
    exemplaires: 3,
    niveauMax: 2,       // [à valider] mettre 3 pour autoriser la fusion niv. 2 -> niv. 3
    multiplicateur: 2   // [à valider] stats et effets multipliés par niveau
  },

  // --- Niveaux du joueur (index 0 = niveau 1) ---
  // prix : or à payer pour atteindre ce niveau depuis le précédent.
  niveaux: [
    { monstres: 1, sortsParTour: 1, pieges: 1, prix: 0 },
    { monstres: 2, sortsParTour: 1, pieges: 1, prix: 4 }, // [à valider]
    { monstres: 3, sortsParTour: 2, pieges: 2, prix: 6 }  // [à valider]
  ],

  // --- Leviers de pression ennemie et outils de diagnostic ---
  // Chaque levier a un interrupteur `enabled`. Voir docs/regles.md, section 16.
  leviers: {
    // Résumé de fin de combat et historique de la session
    statistiques: { enabled: true }
  },

  // --- Donjon : suite des ennemis (clés de data/enemies.js) ---
  donjon: ['pillards', 'pillards']               // [à valider]
};
