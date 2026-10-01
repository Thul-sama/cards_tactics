// Ennemis scriptés (docs/regles.md, section 12). Leurs cartes viennent du même pool que le joueur (cards.js).
// script : liste des actions pour chaque tour (tour 1, tour 2...).
// ensuite : actions répétées une fois le script terminé.
// Actions : { action: 'pose', carte: '<id>' }  — ignorée s'il n'y a plus d'emplacement libre
//           option niveau: 2 ou 3 (levier 2.2) sur une pose ou un sort
//           option charge: true (levier 2.5) sur une pose de monstre
//           option exemplaires: N (levier 2.1) remplace posesParTour pour cette pose
//           { action: 'sort', carte: '<id>' }  — lance un sort direct, cible choisie par l'IA
//           { action: 'attaque' }              — tous les monstres prêts attaquent

// IA de ciblage : priorités testées dans l'ordre, la première qui trouve une cible l'emporte.
//   'letal'         : attaque le héros si les dégâts restants du tour suffisent à le tuer
//   'tuerSansPerte' : tue un monstre du joueur sans perdre l'attaquant (le plus dangereux d'abord)
//   'plusDangereux' : vise le monstre du joueur qui a l'ATQ la plus haute
//   'heros'         : vise le héros du joueur
// La Provocation est toujours respectée pour les attaques. Si rien ne correspond : le héros.
// attaques : ciblage des monstres. sorts : ciblage des sorts de dégâts.
// Chaque ennemi a aussi un `archetype` (texte affiché) et ses propres valeurs.
// L'IA de chaque archétype : les deux commencent par 'letal' et 'tuerSansPerte', puis
// l'aggro vise le héros et le contrôle attaque le monstre le plus dangereux.
var IA_AGGRO = {
  attaques: ['letal', 'tuerSansPerte', 'heros'],
  sorts: ['letal', 'plusDangereux']
};
var IA_CONTROLE = {
  attaques: ['letal', 'tuerSansPerte', 'plusDangereux'],
  sorts: ['letal', 'plusDangereux']
};

var ENNEMIS = {
  // Aggro : beaucoup de petits monstres posés vite (2 par pose avec le levier 2.1), qui visent le héros, et peu de PV.
  pillards: {
    nom: 'Bande de pillards',
    archetype: 'Aggro',
    pv: 20,
    emplacementsMonstres: 4, // indépendant du niveau du joueur ; 4 pour que 2 poses par tour restent possibles
    emplacementsPieges: 1,
    posesParTour: 2,         // levier 2.1 : exemplaires posés à chaque pose de monstre
    firstPlayer: 'enemy',    // levier 3 : 'player', 'enemy' ou 'random'
    ia: IA_AGGRO,
    script: [
      [{ action: 'pose', carte: 'gobelin' }],
      [{ action: 'pose', carte: 'gobelin' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'fosse' }, { action: 'pose', carte: 'gobelin' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'chef_pillard', charge: true, exemplaires: 1 }, { action: 'pose', carte: 'gobelin', exemplaires: 1 }, { action: 'attaque' }]
    ],
    ensuite: [{ action: 'attaque' }, { action: 'pose', carte: 'gobelin' }]
  },

  // Contrôle : peu de monstres mais résistants (niveau 2 avec le levier 2.2, Provocation),
  // des sorts qui visent les monstres du joueur, et beaucoup de PV. [à valider]
  crypte: {
    nom: 'Gardien de la crypte',
    archetype: 'Contrôle',
    pv: 30,
    emplacementsMonstres: 2,
    emplacementsPieges: 1,
    posesParTour: 1,
    firstPlayer: 'player',
    ia: IA_CONTROLE,
    script: [
      [{ action: 'pose', carte: 'squelette', niveau: 2 }],
      [{ action: 'sort', carte: 'projectile' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'garde_nain', niveau: 2 }, { action: 'attaque' }],
      [{ action: 'sort', carte: 'boule_feu' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'contre_sort' }, { action: 'attaque' }]
    ],
    ensuite: [{ action: 'sort', carte: 'projectile' }, { action: 'attaque' }, { action: 'pose', carte: 'squelette', niveau: 2 }]
  }
};
