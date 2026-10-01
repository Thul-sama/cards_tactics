// Ennemis scriptés (docs/regles.md, section 12).
// script : liste des actions pour chaque tour (tour 1, tour 2...).
// ensuite : actions répétées une fois le script terminé.
// Actions : { action: 'pose', carte: '<id>' }  — ignorée s'il n'y a plus d'emplacement libre
//           { action: 'attaque' }              — tous les monstres prêts attaquent
// Ciblage : un monstre avec Provocation s'il y en a un, sinon le héros du joueur. [à valider]
var ENNEMIS = {
  pillards: {
    nom: 'Bande de pillards',
    pv: 12,
    emplacementsMonstres: 3, // [à valider] non précisé par les règles
    emplacementsPieges: 1,
    script: [
      [{ action: 'pose', carte: 'gobelin' }],
      [{ action: 'pose', carte: 'gobelin' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'fosse' }, { action: 'attaque' }],
      [{ action: 'pose', carte: 'chef_pillard' }, { action: 'attaque' }]
    ],
    ensuite: [{ action: 'attaque' }, { action: 'pose', carte: 'gobelin' }]
  }
};
