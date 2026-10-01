// Pool de cartes (docs/regles.md, section 11).
// type : 'monstre' | 'sort' (sort direct) | 'piege'
// effet.type : 'degats' | 'soin' | 'buff' | 'annuler'
// declencheur (pièges) : 'attaque' (un monstre adverse attaque) | 'sort' (l'adversaire lance un sort)
// horsPool : carte réservée aux ennemis, jamais proposée en boutique.
var CARTES = [
  // Monstres
  { id: 'gobelin',     nom: 'Gobelin éclaireur', type: 'monstre', rarete: 'commune', atq: 2, pv: 1 },
  { id: 'squelette',   nom: 'Squelette',         type: 'monstre', rarete: 'commune', atq: 1, pv: 3 },
  { id: 'loup',        nom: 'Loup des bois',     type: 'monstre', rarete: 'commune', atq: 3, pv: 2 },
  { id: 'garde_nain',  nom: 'Garde nain',        type: 'monstre', rarete: 'rare',    atq: 2, pv: 5, capacites: ['provocation'] },
  { id: 'archer_elfe', nom: 'Archer elfe',       type: 'monstre', rarete: 'rare',    atq: 2, pv: 2, capacites: ['charge'] },
  { id: 'ogre',        nom: 'Ogre',              type: 'monstre', rarete: 'epique',  atq: 6, pv: 6 },

  // Sorts directs
  { id: 'projectile',  nom: 'Projectile magique', type: 'sort', rarete: 'commune', effet: { type: 'degats', valeur: 2 } },
  { id: 'soin',        nom: 'Soin',               type: 'sort', rarete: 'commune', effet: { type: 'soin', valeur: 4 } },
  { id: 'boule_feu',   nom: 'Boule de feu',       type: 'sort', rarete: 'rare',    effet: { type: 'degats', valeur: 4 } },
  { id: 'benediction', nom: 'Bénédiction',        type: 'sort', rarete: 'rare',    effet: { type: 'buff', atq: 2, pv: 2 } },

  // Pièges
  { id: 'fosse',       nom: 'Fosse à pieux', type: 'piege', rarete: 'commune', declencheur: 'attaque', effet: { type: 'degats', valeur: 3 } },
  { id: 'contre_sort', nom: 'Contre-sort',   type: 'piege', rarete: 'rare',    declencheur: 'sort',    effet: { type: 'annuler' } },

  // Cartes des ennemis
  { id: 'chef_pillard', nom: 'Chef pillard', type: 'monstre', rarete: 'rare', atq: 4, pv: 4, horsPool: true }
];
