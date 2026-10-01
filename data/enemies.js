// Ennemis scriptés (docs/regles.md, section 12). Leurs cartes viennent du même pool que le joueur (cards.js).
// script : liste des actions pour chaque tour (tour 1, tour 2...).
// ensuite : actions répétées une fois le script terminé.
// Actions : { action: 'pose', carte: '<id>' }  — ignorée s'il n'y a plus d'emplacement libre
//           { action: 'sort', carte: '<id>' }  — lance un sort direct (aucun script ne l'utilise encore)
//           { action: 'attaque' }              — tous les monstres prêts attaquent

// IA de ciblage : priorités testées dans l'ordre, la première qui trouve une cible l'emporte.
//   'letal'         : attaque le héros si les dégâts restants du tour suffisent à le tuer
//   'tuerSansPerte' : tue un monstre du joueur sans perdre l'attaquant (le plus dangereux d'abord)
//   'plusDangereux' : vise le monstre du joueur qui a l'ATQ la plus haute
//   'heros'         : vise le héros du joueur
// La Provocation est toujours respectée pour les attaques. Si rien ne correspond : le héros.
// attaques : ciblage des monstres. sorts : ciblage des sorts de dégâts.
var IA_STANDARD = {
  attaques: ['letal', 'tuerSansPerte', 'heros'],
  sorts: ['letal', 'plusDangereux']
};

var ENNEMIS = {
  pillards: {
    nom: 'Bande de pillards',
    pv: 20,
    emplacementsMonstres: 3, // indépendant du niveau du joueur [à valider]
    emplacementsPieges: 1,
    posesParTour: 1,         // levier 2.1 : exemplaires posés à chaque pose de monstre
    ia: IA_STANDARD,
    script: [
      [{ action: 'pose', carte: 'gobelin' }],
      [{ action: 'pose', carte: 'gobelin' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'fosse' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'chef_pillard' }, { action: 'attaque' }]
    ],
    ensuite: [{ action: 'attaque' }, { action: 'pose', carte: 'gobelin' }]
  }
};
