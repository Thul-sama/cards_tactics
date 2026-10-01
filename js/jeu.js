// Logique du jeu, sans affichage.
// Aucune valeur d'équilibrage ici : tout vient de CONFIG, CARTES et ENNEMIS (dossier data/).

const CARTE = {};
CARTES.forEach(d => { CARTE[d.id] = d; });

let J = null;   // état de la run
const HISTORIQUE = []; // résumés des combats de la session (non sauvegardés)
let uidSuivant = 1;

// ---------- Outils ----------

function niveauCfg() { return CONFIG.niveaux[J.niveau - 1]; }
function mult(niveau) { return Math.pow(CONFIG.fusion.multiplicateur, niveau - 1); }
function melanger(t) {
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}
function log(txt) { J.log.push(txt); if (J.log.length > 60) J.log.shift(); }

function instance(id, niveau) {
  if (!CARTE[id]) throw new Error('Carte inconnue : ' + id);
  return { uid: uidSuivant++, id: id, niveau: niveau || 1 };
}

// Un monstre posé sur le plateau.
function unite(k) {
  const d = CARTE[k.id], m = mult(k.niveau), caps = d.capacites || [];
  return {
    uid: k.uid, carte: k, id: k.id, niveau: k.niveau,
    atq: d.atq * m, pv: d.pv * m, pvMax: d.pv * m,
    provocation: caps.includes('provocation'),
    charge: caps.includes('charge'),
    peutAttaquer: caps.includes('charge')
  };
}

// ---------- Textes ----------

function nomCarte(k) { return CARTE[k.id].nom + (k.niveau > 1 ? ' ★' + k.niveau : ''); }

function texteCarte(id, niveau) {
  const d = CARTE[id], m = mult(niveau || 1);
  if (d.type === 'monstre') {
    const caps = (d.capacites || []).map(c => c === 'provocation' ? 'Provocation' : 'Charge');
    return (d.atq * m) + ' / ' + (d.pv * m) + (caps.length ? ' · ' + caps.join(', ') : '');
  }
  const e = d.effet;
  if (d.type === 'piege') {
    if (d.declencheur === 'attaque') return 'Piège : quand un monstre ennemi attaque, lui inflige ' + e.valeur * m + ' dégâts';
    if (d.declencheur === 'sort') return 'Piège : annule le prochain sort ennemi';
  }
  if (e.type === 'degats') return 'Inflige ' + e.valeur * m + ' dégâts à une cible';
  if (e.type === 'soin') return 'Rend ' + e.valeur * m + ' PV à une cible';
  if (e.type === 'buff') return '+' + e.atq * m + ' ATQ et +' + e.pv * m + ' PV à un monstre';
  return '';
}

function actionsEnnemi(tour) {
  const d = J.combat.ennemi.def;
  return tour <= d.script.length ? d.script[tour - 1] : d.ensuite;
}

// Niveau d'une carte posée ou lancée par l'ennemi (levier 2.2).
function niveauEnnemi(act) {
  return CONFIG.leviers.niveauxEnnemis.enabled ? (act.niveau || 1) : 1;
}

// Nombre d'exemplaires posés par une action 'pose' (levier 2.1).
function nbPoses(act) {
  if (CARTE[act.carte].type !== 'monstre' || !CONFIG.leviers.posesMultiples.enabled) return 1;
  return J.combat.ennemi.def.posesParTour || 1;
}

function texteIntention(tour) {
  return actionsEnnemi(tour).map(a => {
    if (a.action === 'attaque') return 'Attaque';
    const d = CARTE[a.carte];
    const k = { id: a.carte, niveau: niveauEnnemi(a) };
    if (a.action === 'sort') return 'Lance ' + nomCarte(k);
    const n = nbPoses(a);
    if (d.type === 'monstre') return 'Pose ' + (n > 1 ? n + '× ' : '') + nomCarte(k) + ' (' + texteCarte(k.id, k.niveau) + ')';
    return 'Pose un piège face cachée';
  }).join(', puis ');
}

// ---------- Run et combats ----------

function nouvelleRun() {
  J = {
    or: CONFIG.orDepart, niveau: 1,
    collection: CONFIG.deckDepart.map(id => instance(id)), // toutes les cartes possédées
    combatIndex: 0, combat: null, ecran: 'combat',
    log: [], pause: false, selection: null
  };
  demarrerCombat();
}

function demarrerCombat() {
  const id = CONFIG.donjon[J.combatIndex];
  const def = ENNEMIS[id];
  if (!def) throw new Error('Ennemi inconnu : ' + id);
  J.ecran = 'combat';
  J.selection = null;
  J.combat = {
    tour: 0, phase: 'mulligan', fini: false, chrono: 0,
    deck: melanger(J.collection.slice()), main: [], defausse: [],
    joueur: { estJoueur: true, nom: 'Toi', pv: CONFIG.pvHeros, pvMax: CONFIG.pvHeros, monstres: [], pieges: [] },
    ennemi: { estJoueur: false, nom: def.nom, def: def, pv: def.pv, pvMax: def.pv, monstres: [], pieges: [] },
    boutique: [], pioches: 0, sorts: 0, mulligans: CONFIG.mulligan,
    monstresEnnemisDebutJeu: 0,
    stats: {
      orGagne: 0, orDepense: 0, interets: 0, ventes: 0,
      unitesEnnemies: [], toursNettoyes: 0,
      degats: { monstres: 0, sorts: 0, direct: 0, enrage: 0 },
      achetees: {}, jouees: {}
    }
  };
  log('— Combat ' + (J.combatIndex + 1) + '/' + CONFIG.donjon.length + ' : ' + def.nom + ' —');
  for (let i = 0; i < CONFIG.piocheDebutCombat; i++) piocherCarte();
  verifierFusions();
  if (!peutMulligan()) debutTour();
}

function piocherCarte() {
  const c = J.combat;
  if (!c.deck.length || c.main.length >= CONFIG.mainMax) return false;
  c.main.push(c.deck.shift());
  return true;
}

function peutMulligan() {
  const c = J.combat;
  return c.phase === 'mulligan' && c.mulligans > 0 && c.deck.length > 0 && c.main.length > 0;
}

// On pioche d'abord la remplaçante pour ne pas reprendre la même carte.
function mulligan(uid) {
  const c = J.combat;
  if (!peutMulligan()) return;
  const i = c.main.findIndex(k => k.uid === uid);
  if (i < 0) return;
  const [k] = c.main.splice(i, 1);
  c.main.push(c.deck.shift());
  c.deck.push(k);
  melanger(c.deck);
  c.mulligans--;
  log('Mulligan : ' + nomCarte(k) + ' remplacée.');
  verifierFusions();
}

function commencerCombat() {
  if (J.combat.phase === 'mulligan') debutTour();
}

function changerPhase(p) {
  const c = J.combat;
  c.phase = p;
  c.chrono = CONFIG.chrono[p] || 0;
  J.selection = null;
}

// Appelé régulièrement par l'interface. Renvoie true si l'affichage doit être reconstruit.
function tick(dt) {
  if (!J || J.pause || J.ecran !== 'combat') return false;
  const c = J.combat;
  if ((c.phase !== 'boutique' && c.phase !== 'jeu') || !CONFIG.chrono[c.phase]) return false;
  c.chrono -= dt;
  if (c.chrono > 0) return false;
  log('Temps écoulé.');
  if (c.phase === 'boutique') finBoutique(); else finTour();
  return true;
}

function compter(table, nom) { table[nom] = (table[nom] || 0) + 1; }

function enregistrerResume(victoire) {
  const c = J.combat, s = c.stats;
  HISTORIQUE.push({
    numero: HISTORIQUE.length + 1,
    ennemi: c.ennemi.nom, victoire: victoire, tours: c.tour,
    orGagne: s.orGagne, orDepense: s.orDepense, orEpargne: J.or, interets: s.interets, ventes: s.ventes,
    pv: Math.max(0, c.joueur.pv), pvPct: Math.round(100 * Math.max(0, c.joueur.pv) / c.joueur.pvMax),
    ennemisPoses: s.unitesEnnemies.length,
    ennemisAyantAttaque: s.unitesEnnemies.filter(u => u.aAttaque).length,
    toursNettoyes: s.toursNettoyes,
    degats: Object.assign({}, s.degats),
    achetees: s.achetees, jouees: s.jouees
  });
}

function verifierFin() {
  const c = J.combat;
  if (c.fini) return true;
  if (c.ennemi.pv <= 0) {
    c.fini = true;
    enregistrerResume(true);
    J.combatIndex++;
    J.ecran = J.combatIndex >= CONFIG.donjon.length ? 'runGagnee' : 'entreCombats';
    log('Victoire contre ' + c.ennemi.nom + ' !');
  } else if (c.joueur.pv <= 0) {
    c.fini = true;
    enregistrerResume(false);
    J.ecran = 'runPerdue';
    log('Défaite.');
  }
  return c.fini;
}

function combatSuivant() {
  if (J.ecran === 'entreCombats') demarrerCombat();
}

// ---------- Phase de boutique ----------

function debutTour() {
  const c = J.combat;
  c.tour++;
  const interets = Math.min(Math.floor(J.or / CONFIG.interets.tranche), CONFIG.interets.plafond);
  J.or += CONFIG.orParTour + interets;
  c.stats.orGagne += CONFIG.orParTour + interets;
  c.stats.interets += interets;
  log('Tour ' + c.tour + ' : +' + CONFIG.orParTour + ' or, +' + interets + ' d\'intérêts.');
  c.boutique = tirerBoutique();
  c.pioches = 0;
  changerPhase('boutique');
}

function tirerBoutique() {
  const res = [];
  for (let i = 0; i < CONFIG.tailleBoutique; i++) res.push(tirerCarte(CARTES).id);
  return res;
}

function tirerCarte(pool) {
  const ch = CONFIG.chancesRarete;
  const rars = Object.keys(ch).filter(r => ch[r] > 0 && pool.some(d => d.rarete === r));
  let x = Math.random() * rars.reduce((s, r) => s + ch[r], 0);
  let rar = rars[rars.length - 1];
  for (const r of rars) { x -= ch[r]; if (x < 0) { rar = r; break; } }
  const cands = pool.filter(d => d.rarete === rar);
  return cands[Math.floor(Math.random() * cands.length)];
}

function prixAchat(id) { return CONFIG.prixAchat[CARTE[id].rarete]; }

function prixVente(k) {
  const base = CONFIG.prixVente[CARTE[k.id].rarete];
  return CONFIG.venteSelonNiveau ? base * Math.pow(CONFIG.fusion.exemplaires, k.niveau - 1) : base;
}

function prixNiveauSuivant() {
  const n = CONFIG.niveaux[J.niveau];
  return n ? n.prix : null;
}

function peutAcheter(i) {
  const c = J.combat, id = c.boutique[i];
  return c.phase === 'boutique' && !!id && J.or >= prixAchat(id) && c.main.length < CONFIG.mainMax;
}

function acheter(i) {
  const c = J.combat;
  if (!peutAcheter(i)) return;
  const id = c.boutique[i];
  J.or -= prixAchat(id);
  c.stats.orDepense += prixAchat(id);
  compter(c.stats.achetees, CARTE[id].nom);
  const k = instance(id);
  J.collection.push(k);
  c.main.push(k);
  c.boutique[i] = null;
  log('Achat : ' + CARTE[id].nom + ' (-' + prixAchat(id) + ' or).');
  verifierFusions();
}

function peutRelancer() { return J.combat.phase === 'boutique' && J.or >= CONFIG.prixRelance; }

function relancer() {
  if (!peutRelancer()) return;
  J.or -= CONFIG.prixRelance;
  J.combat.stats.orDepense += CONFIG.prixRelance;
  J.combat.boutique = tirerBoutique();
  log('Relance de la boutique (-' + CONFIG.prixRelance + ' or).');
}

function peutPiocher() {
  const c = J.combat;
  return c.phase === 'boutique' && c.pioches < CONFIG.piocheParTour && c.deck.length > 0 && c.main.length < CONFIG.mainMax;
}

function piocherTour() {
  if (!peutPiocher()) return;
  piocherCarte();
  J.combat.pioches++;
  log('Tu pioches : ' + nomCarte(J.combat.main[J.combat.main.length - 1]) + '.');
  verifierFusions();
}

function peutMonterNiveau() {
  const p = prixNiveauSuivant();
  return J.combat.phase === 'boutique' && p !== null && J.or >= p;
}

function monterNiveau() {
  if (!peutMonterNiveau()) return;
  J.or -= prixNiveauSuivant();
  J.combat.stats.orDepense += prixNiveauSuivant();
  J.niveau++;
  log('Niveau ' + J.niveau + ' atteint.');
}

function vendre(uid) {
  const c = J.combat;
  if (c.phase !== 'boutique') return;
  const k = c.main.find(x => x.uid === uid);
  if (!k) return;
  c.main = c.main.filter(x => x !== k);
  J.collection = J.collection.filter(x => x !== k);
  J.or += prixVente(k);
  c.stats.orGagne += prixVente(k);
  c.stats.ventes += prixVente(k);
  J.selection = null;
  log('Vente : ' + nomCarte(k) + ' (+' + prixVente(k) + ' or).');
}

// Fusion automatique : seules les cartes en main comptent. [à valider]
function verifierFusions() {
  const c = J.combat, n = CONFIG.fusion.exemplaires;
  let encore = true;
  while (encore) {
    encore = false;
    for (const k of c.main) {
      if (k.niveau >= CONFIG.fusion.niveauMax) continue;
      const memes = c.main.filter(x => x.id === k.id && x.niveau === k.niveau).slice(0, n);
      if (memes.length < n) continue;
      c.main = c.main.filter(x => !memes.includes(x));
      J.collection = J.collection.filter(x => !memes.includes(x));
      const nouv = instance(k.id, k.niveau + 1);
      c.main.push(nouv);
      J.collection.push(nouv);
      log('Fusion : ' + nomCarte(nouv) + ' !');
      encore = true;
      break;
    }
  }
}

function finBoutique() {
  const c = J.combat;
  if (c.phase !== 'boutique') return;
  changerPhase('jeu');
  c.sorts = 0;
  c.monstresEnnemisDebutJeu = c.ennemi.monstres.length;
  c.joueur.monstres.forEach(m => { m.peutAttaquer = true; });
}

// ---------- Phase de jeu ----------

function retirerDeMain(k) { J.combat.main = J.combat.main.filter(x => x !== k); }

function peutPoser(k) {
  const c = J.combat, d = CARTE[k.id];
  if (c.phase !== 'jeu') return false;
  if (d.type === 'monstre') return c.joueur.monstres.length < niveauCfg().monstres;
  if (d.type === 'piege') return c.joueur.pieges.length < niveauCfg().pieges;
  return false;
}

function poser(uid) {
  const c = J.combat, k = c.main.find(x => x.uid === uid);
  if (!k || !peutPoser(k)) return;
  retirerDeMain(k);
  J.selection = null;
  compter(c.stats.jouees, CARTE[k.id].nom);
  if (CARTE[k.id].type === 'monstre') {
    c.joueur.monstres.push(unite(k));
    log('Tu poses ' + nomCarte(k) + '.');
  } else {
    c.joueur.pieges.push(k);
    log('Tu poses ' + nomCarte(k) + ' face cachée.');
  }
}

function peutLancerSort() {
  const c = J.combat;
  return c.phase === 'jeu' && c.sorts < niveauCfg().sortsParTour;
}

// Références de cible : 'hj' / 'he' pour les héros, 'm<uid>' pour un monstre.
function trouverCible(ref) {
  const c = J.combat;
  if (ref === 'hj') return { camp: c.joueur, unite: null };
  if (ref === 'he') return { camp: c.ennemi, unite: null };
  const uid = +ref.slice(1);
  for (const camp of [c.joueur, c.ennemi]) {
    const u = camp.monstres.find(m => m.uid === uid);
    if (u) return { camp: camp, unite: u };
  }
  return null;
}

function ciblesSort(k) {
  const c = J.combat;
  const monstres = c.joueur.monstres.concat(c.ennemi.monstres).map(m => 'm' + m.uid);
  return CARTE[k.id].effet.type === 'buff' ? monstres : ['hj', 'he'].concat(monstres);
}

function ciblesAttaque(defenseur) {
  const provoc = defenseur.monstres.filter(m => m.provocation);
  if (provoc.length) return provoc.map(m => 'm' + m.uid);
  return defenseur.monstres.map(m => 'm' + m.uid).concat(defenseur.estJoueur ? 'hj' : 'he');
}

function appliquerEffet(e, m, cible) {
  const u = cible.unite, camp = cible.camp;
  if (e.type === 'degats') {
    if (u) u.pv -= e.valeur * m; else camp.pv -= e.valeur * m;
  } else if (e.type === 'soin') {
    if (u) u.pv = Math.min(u.pvMax, u.pv + e.valeur * m);
    else camp.pv = Math.min(camp.pvMax, camp.pv + e.valeur * m);
  } else if (e.type === 'buff' && u) {
    u.atq += e.atq * m;
    u.pv += e.pv * m;
    u.pvMax += e.pv * m;
  }
}

function lancerSort(uid, ref) {
  const c = J.combat, k = c.main.find(x => x.uid === uid);
  if (!k || CARTE[k.id].type !== 'sort' || !peutLancerSort() || !ciblesSort(k).includes(ref)) return;
  const cible = trouverCible(ref);
  retirerDeMain(k);
  c.defausse.push(k);
  c.sorts++;
  J.selection = null;
  compter(c.stats.jouees, CARTE[k.id].nom);
  if (declencherPiege(c.ennemi, 'sort', null)) {
    log(nomCarte(k) + ' est annulé.');
    return;
  }
  appliquerEffet(CARTE[k.id].effet, mult(k.niveau), cible);
  log('Tu lances ' + nomCarte(k) + ' sur ' + nomCible(cible) + '.');
  nettoyerMorts();
  verifierFin();
}

function nomCible(cible) {
  if (!cible.unite) return cible.camp.estJoueur ? 'ton héros' : cible.camp.nom;
  return nomCarte(cible.unite) + (cible.camp.estJoueur ? '' : ' (ennemi)');
}

// Déclenche le premier piège du camp défenseur correspondant au déclencheur.
function declencherPiege(defenseur, declencheur, attaquant) {
  const p = defenseur.pieges.find(k => CARTE[k.id].declencheur === declencheur);
  if (!p) return null;
  defenseur.pieges = defenseur.pieges.filter(k => k !== p);
  if (defenseur.estJoueur) J.combat.defausse.push(p);
  const e = CARTE[p.id].effet;
  log('Piège ' + (defenseur.estJoueur ? '' : 'ennemi ') + 'révélé : ' + nomCarte(p) + ' !');
  if (e.type === 'degats' && attaquant) attaquant.pv -= e.valeur * mult(p.niveau);
  return p;
}

function nettoyerMorts() {
  const c = J.combat;
  for (const camp of [c.joueur, c.ennemi]) {
    for (const m of camp.monstres.filter(u => u.pv <= 0)) {
      log(nomCarte(m) + (camp.estJoueur ? '' : ' (ennemi)') + ' meurt.');
      if (camp.estJoueur) c.defausse.push(m.carte);
    }
    camp.monstres = camp.monstres.filter(u => u.pv > 0);
  }
}

// Résolution : échange simultané façon Hearthstone. [à valider]
function resoudreAttaque(attaquantCamp, a, defenseur, ref) {
  a.peutAttaquer = false;
  const cible = trouverCible(ref);
  const qui = nomCarte(a) + (attaquantCamp.estJoueur ? '' : ' (ennemi)');
  declencherPiege(defenseur, 'attaque', a);
  if (a.pv <= 0) {
    nettoyerMorts();
    verifierFin();
    return;
  }
  a.aAttaque = true;
  if (!cible.unite) {
    defenseur.pv -= a.atq;
    if (defenseur.estJoueur) J.combat.stats.degats.monstres += a.atq;
    log(qui + ' attaque ' + nomCible(cible) + ' : ' + a.atq + ' dégâts.');
  } else {
    cible.unite.pv -= a.atq;
    a.pv -= cible.unite.atq;
    log(qui + ' attaque ' + nomCible(cible) + '.');
  }
  nettoyerMorts();
  verifierFin();
}

function attaquer(uid, ref) {
  const c = J.combat, a = c.joueur.monstres.find(m => m.uid === uid);
  if (c.phase !== 'jeu' || !a || !a.peutAttaquer || !ciblesAttaque(c.ennemi).includes(ref)) return;
  J.selection = null;
  resoudreAttaque(c.joueur, a, c.ennemi, ref);
}

function finTour() {
  const c = J.combat;
  if (c.phase !== 'jeu') return;
  // Plateau ennemi entièrement nettoyé pendant ce tour (il avait au moins un monstre au début).
  if (c.monstresEnnemisDebutJeu > 0 && c.ennemi.monstres.length === 0) c.stats.toursNettoyes++;
  tourEnnemi();
  if (!c.fini) debutTour();
}

// ---------- Tour ennemi ----------

function tourEnnemi() {
  const c = J.combat, e = c.ennemi;
  changerPhase('ennemi');
  e.monstres.forEach(m => { m.peutAttaquer = true; });
  for (const act of actionsEnnemi(c.tour)) {
    if (c.fini) return;
    if (act.action === 'pose') for (let i = nbPoses(act); i > 0; i--) poseEnnemi(act);
    if (act.action === 'sort') sortEnnemi(act);
    if (act.action === 'attaque') attaquesEnnemi();
  }
}

// Les monstres prêts attaquent un par un ; chaque cible est choisie par l'IA (ia.attaques).
function attaquesEnnemi() {
  const c = J.combat, e = c.ennemi;
  for (const m of e.monstres.slice()) {
    if (c.fini) return;
    if (!e.monstres.includes(m) || !m.peutAttaquer) continue;
    // Dégâts que les attaquants restants (celui-ci compris) peuvent encore infliger ce tour.
    const restants = e.monstres.filter(u => u.peutAttaquer).reduce((s, u) => s + u.atq, 0);
    const ref = choisirCibleIA(e.def.ia.attaques, ciblesAttaque(c.joueur), m.atq, m.pv, restants);
    resoudreAttaque(e, m, c.joueur, ref);
  }
}

// Renvoie la première cible trouvée en testant les priorités dans l'ordre.
// options : cibles autorisées (Provocation déjà prise en compte pour les attaques).
// pvAttaquant : null pour un sort (il ne subit pas de riposte).
function choisirCibleIA(priorites, options, degats, pvAttaquant, degatsTotaux) {
  const j = J.combat.joueur;
  const monstres = j.monstres.filter(u => options.includes('m' + u.uid));
  const plusDangereux = liste => liste.reduce((best, u) => (!best || u.atq > best.atq ? u : best), null);
  for (const p of priorites) {
    if (p === 'letal' && options.includes('hj') && degatsTotaux >= j.pv) return 'hj';
    if (p === 'tuerSansPerte') {
      const u = plusDangereux(monstres.filter(u => u.pv <= degats && (pvAttaquant === null || u.atq < pvAttaquant)));
      if (u) return 'm' + u.uid;
    }
    if (p === 'plusDangereux' && monstres.length) return 'm' + plusDangereux(monstres).uid;
    if (p === 'heros' && options.includes('hj')) return 'hj';
  }
  return options.includes('hj') ? 'hj' : options[0];
}

// Sort ennemi. Dégâts : ciblés par l'IA (ia.sorts) parmi les cibles du joueur.
// Soin : son propre héros. Bénédiction : son monstre à l'ATQ la plus haute. [à valider]
function sortEnnemi(act) {
  const c = J.combat, e = c.ennemi, d = CARTE[act.carte], k = instance(act.carte, niveauEnnemi(act));
  let ref = null;
  if (d.effet.type === 'degats') {
    const options = ['hj'].concat(c.joueur.monstres.map(u => 'm' + u.uid));
    const degats = d.effet.valeur * mult(k.niveau);
    ref = choisirCibleIA(e.def.ia.sorts, options, degats, null, degats);
  } else if (d.effet.type === 'soin') {
    ref = 'he';
  } else if (d.effet.type === 'buff' && e.monstres.length) {
    ref = 'm' + e.monstres.reduce((best, u) => (u.atq > best.atq ? u : best)).uid;
  }
  if (!ref) return;
  if (declencherPiege(c.joueur, 'sort', null)) {
    log(e.nom + ' lance ' + nomCarte(k) + ', mais le sort est annulé.');
    return;
  }
  const cible = trouverCible(ref);
  const pvAvant = c.joueur.pv;
  appliquerEffet(d.effet, mult(k.niveau), cible);
  if (c.joueur.pv < pvAvant) c.stats.degats.sorts += pvAvant - c.joueur.pv;
  log(e.nom + ' lance ' + nomCarte(k) + ' sur ' + nomCible(cible) + '.');
  nettoyerMorts();
  verifierFin();
}

function poseEnnemi(act) {
  const id = act.carte, e = J.combat.ennemi, d = CARTE[id];
  if (d.type === 'monstre' && e.monstres.length < e.def.emplacementsMonstres) {
    const u = unite(instance(id, niveauEnnemi(act)));
    e.monstres.push(u);
    J.combat.stats.unitesEnnemies.push(u);
    log(e.nom + ' pose ' + nomCarte(u) + '.');
  } else if (d.type === 'piege' && e.pieges.length < e.def.emplacementsPieges) {
    e.pieges.push(instance(id, niveauEnnemi(act)));
    log(e.nom + ' pose un piège face cachée.');
  }
}
