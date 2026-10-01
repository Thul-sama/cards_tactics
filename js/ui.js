// Affichage et interactions. Interface volontairement minimale : des rectangles et du texte.

const RARETE = { commune: 'Commune', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire' };
const TYPE = { monstre: 'monstre', sort: 'sort', piege: 'piège' };
const PHASE = { mulligan: 'Mulligan', boutique: 'Boutique', jeu: 'Jeu', ennemi: 'Tour ennemi' };

const el = id => document.getElementById(id);
let modal = null; // fenêtre ouverte : null, 'historique' ou 'reglages'. Le chrono est arrêté tant qu'elle est ouverte.

// Un bloc cliquable si une action est fournie, sinon un simple rectangle.
function bloc(classes, action, contenu, desactive) {
  if (!action) return '<div class="' + classes + '">' + contenu + '</div>';
  return '<button class="' + classes + '" ' + action + (desactive ? ' disabled' : '') + '>' + contenu + '</button>';
}
function bouton(txt, action, desactive, classe) {
  return '<button class="btn ' + (classe || '') + '" ' + action + (desactive ? ' disabled' : '') + '>' + txt + '</button>';
}

// ---------- Sélection et cibles ----------

function selection() {
  const s = J.selection, c = J.combat;
  if (!s || !c) return null;
  if (s.type === 'main') return { type: 'main', k: c.main.find(x => x.uid === s.uid) };
  if (s.type === 'unite') return { type: 'unite', u: c.joueur.monstres.find(m => m.uid === s.uid) };
  return null;
}

function estCible(ref) {
  const s = selection();
  if (!s) return false;
  if (s.type === 'main' && s.k && CARTE[s.k.id].type === 'sort' && peutLancerSort()) return ciblesSort(s.k).includes(ref);
  if (s.type === 'unite' && s.u && s.u.peutAttaquer) return ciblesAttaque(J.combat.ennemi).includes(ref);
  return false;
}

// ---------- Rendu ----------

function rendre() {
  rendreBarre();
  el('pause').hidden = !J.pause;
  el('btn-historique').hidden = !CONFIG.leviers.statistiques.enabled;
  const z = el('jeu');
  if (J.ecran !== 'combat') { z.innerHTML = ecranFin(); return; }
  z.innerHTML = zoneEnnemi() + zoneJoueur() + panneau() + zoneMain() + zoneLog();
}

function rendreBarre() {
  const c = J.combat;
  const chrono = c && (c.phase === 'boutique' || c.phase === 'jeu') && CONFIG.chrono[c.phase]
    ? ' · <b id="chrono">' + Math.ceil(c.chrono) + '</b> s' : '';
  el('infos').innerHTML =
    '<span>Combat ' + Math.min(J.combatIndex + 1, CONFIG.donjon.length) + '/' + CONFIG.donjon.length + '</span>' +
    (c ? '<span>Tour ' + c.tour + '</span><span>' + (PHASE[c.phase] || '') + chrono + '</span>' : '') +
    '<span>Or <b>' + J.or + '</b></span><span>Niv. ' + J.niveau + '</span>' +
    (c ? '<span>Deck ' + c.deck.length + ' · Défausse ' + c.defausse.length + '</span>' : '');
}

function majChrono() {
  const span = el('chrono');
  if (span) span.textContent = Math.ceil(J.combat.chrono);
}

function htmlHeros(camp, ref) {
  const cible = estCible(ref);
  const txt = '<b>' + camp.nom + '</b> — PV ' + Math.max(0, camp.pv) + ' / ' + camp.pvMax;
  return bloc('heros' + (cible ? ' cible' : ''), cible ? 'data-action="cible" data-ref="' + ref + '"' : '', txt);
}

function htmlUnite(m, camp) {
  const c = J.combat, ref = 'm' + m.uid, cible = estCible(ref);
  const sel = J.selection && J.selection.type === 'unite' && J.selection.uid === m.uid;
  let action = '';
  if (cible) action = 'data-action="cible" data-ref="' + ref + '"';
  else if (camp.estJoueur && c.phase === 'jeu' && m.peutAttaquer) action = 'data-action="sel-unite" data-uid="' + m.uid + '"';
  const etats = [];
  if (m.provocation) etats.push('Provocation');
  if (m.charge) etats.push('Charge');
  if (camp.estJoueur && c.phase === 'jeu') etats.push(m.peutAttaquer ? 'Prêt' : 'Ne peut pas attaquer');
  const enrage = atqEff(m) - m.atq;
  if (enrage) etats.push('enrage +' + enrage);
  const contenu = '<b>' + nomCarte(m) + '</b><span class="stats">' + atqEff(m) + ' / ' + m.pv + '</span>' +
    '<small>' + etats.join(' · ') + '</small>';
  return bloc('carte monstre' + (sel ? ' sel' : '') + (cible ? ' cible' : '') + (m.peutAttaquer && camp.estJoueur ? ' pret' : ''), action, contenu);
}

function emplacementsVides(n, piege) {
  let h = '';
  for (let i = 0; i < n; i++) h += piege ? '<div class="carte vide piege">piège (vide)</div>' : '<div class="carte vide">monstre (vide)</div>';
  return h;
}

function texteEnrage() {
  const L = CONFIG.leviers.enrage;
  if (!L.enabled) return '';
  const prochain = bonusEnrage(J.combat.ennemi.tours + 1);
  return '<p class="intention enrage">Enrage : <b>+' + bonusEnrage() + ' ATQ</b> pour les monstres ennemis' +
    ' (+' + prochain + ' au prochain tour ennemi' + (prochain ? '' : ', commence au tour ennemi ' + L.startTurn) + ')</p>';
}

function zoneEnnemi() {
  const c = J.combat, e = c.ennemi;
  let pieges = '';
  for (let i = 0; i < e.def.emplacementsPieges; i++) {
    pieges += i < e.pieges.length ? '<div class="carte piege cache">Piège<br>face cachée</div>' : emplacementsVides(1, true);
  }
  return '<section class="zone ennemi">' +
    htmlHeros(e, 'he') +
    '<p class="intention">Intention ce tour : <b>' + texteIntention(e.tours + 1) + '</b></p>' +
    texteEnrage() +
    '<div class="rang">' + pieges + '</div>' +
    '<div class="rang">' + e.monstres.map(m => htmlUnite(m, e)).join('') +
    emplacementsVides(e.def.emplacementsMonstres - e.monstres.length) + '</div>' +
    '</section>';
}

function zoneJoueur() {
  const c = J.combat, j = c.joueur, n = niveauCfg();
  const pieges = j.pieges.map(k => '<div class="carte piege"><b>' + nomCarte(k) + '</b><small>face cachée</small></div>').join('') +
    emplacementsVides(Math.max(0, n.pieges - j.pieges.length), true);
  return '<section class="zone joueur">' +
    '<div class="rang">' + j.monstres.map(m => htmlUnite(m, j)).join('') +
    emplacementsVides(Math.max(0, n.monstres - j.monstres.length)) + '</div>' +
    '<div class="rang">' + pieges + '</div>' +
    htmlHeros(j, 'hj') +
    '</section>';
}

function panneau() {
  const c = J.combat;
  if (c.phase === 'mulligan') {
    return '<section class="zone panneau"><p>' +
      (peutMulligan() ? 'Mulligan : sélectionne une carte de ta main pour la remplacer (' + c.mulligans + ' restant).' : 'Mulligan terminé.') +
      '</p><div class="actions">' + bouton('Commencer le combat', 'data-action="commencer"', false, 'principal') + '</div></section>';
  }
  if (c.phase === 'boutique') {
    const cartes = c.boutique.map((id, i) => {
      if (!id) return '<div class="carte vide">acheté</div>';
      const d = CARTE[id];
      return bloc('carte ' + d.type + ' r-' + d.rarete, 'data-action="acheter" data-i="' + i + '"',
        '<b>' + d.nom + '</b><small>' + RARETE[d.rarete] + ' · ' + TYPE[d.type] + '</small><span>' + texteCarte(id) + '</span>' +
        '<span class="prix">' + prixAchat(id) + ' or</span>', !peutAcheter(i));
    }).join('');
    const pn = prixNiveauSuivant();
    return '<section class="zone panneau"><h2>Boutique</h2><div class="rang">' + cartes + '</div><div class="actions">' +
      bouton('Piocher (deck : ' + c.deck.length + ')', 'data-action="piocher"', !peutPiocher()) +
      bouton('Relancer (' + CONFIG.prixRelance + ' or)', 'data-action="relancer"', !peutRelancer()) +
      (pn !== null ? bouton('Niveau ' + (J.niveau + 1) + ' (' + pn + ' or)', 'data-action="niveau"', !peutMonterNiveau()) : '') +
      bouton('Passer au jeu →', 'data-action="fin-boutique"', false, 'principal') +
      '</div></section>';
  }
  if (c.phase === 'jeu') {
    const n = niveauCfg();
    return '<section class="zone panneau"><p>Sorts ' + c.sorts + '/' + n.sortsParTour +
      ' · Monstres ' + c.joueur.monstres.length + '/' + n.monstres +
      ' · Pièges ' + c.joueur.pieges.length + '/' + n.pieges + '</p>' +
      '<p class="aide">Touche un monstre prêt puis sa cible pour attaquer. Touche une carte de ta main pour la jouer.</p>' +
      '<div class="actions">' + bouton('Fin du tour', 'data-action="fin-tour"', false, 'principal') + '</div></section>';
  }
  return '';
}

function actionsSelection(k) {
  const c = J.combat, d = CARTE[k.id];
  let h = '';
  if (c.phase === 'mulligan') h += bouton('Remplacer cette carte', 'data-action="mulligan"', !peutMulligan());
  if (c.phase === 'boutique') h += bouton('Vendre (+' + prixVente(k) + ' or)', 'data-action="vendre"');
  if (c.phase === 'jeu') {
    if (d.type === 'monstre') h += bouton('Poser', 'data-action="poser"', !peutPoser(k));
    if (d.type === 'piege') h += bouton('Poser face cachée', 'data-action="poser"', !peutPoser(k));
    if (d.type === 'sort') h += '<span class="aide">' + (peutLancerSort() ? 'Choisis une cible (cadre pointillé).' : 'Limite de sorts atteinte ce tour.') + '</span>';
  }
  return h + bouton('Annuler', 'data-action="deselect"');
}

function zoneMain() {
  const c = J.combat, s = selection();
  const cartes = c.main.map(k => {
    const d = CARTE[k.id], sel = s && s.type === 'main' && s.k === k;
    return bloc('carte ' + d.type + ' r-' + d.rarete + (sel ? ' sel' : ''), 'data-action="sel-main" data-uid="' + k.uid + '"',
      '<b>' + nomCarte(k) + '</b><small>' + RARETE[d.rarete] + ' · ' + TYPE[d.type] + '</small><span>' + texteCarte(k.id, k.niveau) + '</span>');
  }).join('');
  const barre = s && s.type === 'main' && s.k ? '<div class="actions">' + actionsSelection(s.k) + '</div>' : '';
  return '<section class="zone main"><h2>Main ' + c.main.length + '/' + CONFIG.mainMax + '</h2>' +
    '<div class="rang">' + (cartes || '<p class="aide">Main vide.</p>') + '</div>' + barre + '</section>';
}

function zoneLog() {
  return '<section class="zone log"><ol>' + J.log.slice(-8).reverse().map(l => '<li>' + l + '</li>').join('') + '</ol></section>';
}

function ecranFin() {
  let titre, btn;
  if (J.ecran === 'entreCombats') {
    titre = 'Victoire !';
    btn = bouton('Combat suivant (' + (J.combatIndex + 1) + '/' + CONFIG.donjon.length + ')', 'data-action="suivant"', false, 'principal');
  } else {
    titre = J.ecran === 'runGagnee' ? 'Donjon terminé : run gagnée !' : 'Défaite : fin de la run.';
    btn = bouton('Nouvelle run', 'data-action="nouvelle-run"', false, 'principal');
  }
  return '<section class="zone panneau"><h2>' + titre + '</h2>' +
    '<p>Or : ' + J.or + ' · Niveau ' + J.niveau + ' · Cartes possédées : ' + J.collection.length + '</p>' +
    '<p>' + J.collection.map(nomCarte).join(', ') + '</p>' +
    '<div class="actions">' + btn + '</div></section>' +
    (CONFIG.leviers.statistiques.enabled && HISTORIQUE.length ? '<section class="zone">' + htmlResume(HISTORIQUE[HISTORIQUE.length - 1]) + '</section>' : '') +
    zoneLog();
}

// ---------- Statistiques ----------

function listeCartes(t) {
  const noms = Object.keys(t);
  return noms.length ? noms.map(n => n + (t[n] > 1 ? ' ×' + t[n] : '')).join(', ') : '—';
}

function htmlResume(r) {
  const d = r.degats, total = d.monstres + d.sorts + d.direct + d.enrage;
  const ligne = (k, v) => '<tr><th>' + k + '</th><td>' + v + '</td></tr>';
  return '<h2>Combat ' + r.numero + ' : ' + (r.victoire ? 'victoire' : 'défaite') + ' contre ' + r.ennemi + '</h2>' +
    '<table class="resume">' +
    ligne('Tours', r.tours) +
    ligne('Or', 'gagné ' + r.orGagne + ' (dont intérêts ' + r.interets + ', ventes ' + r.ventes + ') · dépensé ' + r.orDepense + ' · épargné ' + r.orEpargne) +
    ligne('PV restants', r.pv + ' (' + r.pvPct + ' %)') +
    ligne('Monstres ennemis', r.ennemisPoses + ' posés, ' + r.ennemisAyantAttaque + ' ont attaqué au moins une fois') +
    ligne('Plateau ennemi nettoyé', r.toursNettoyes + ' tour(s) sur ' + r.tours) +
    ligne('Dégâts reçus', total + ' (monstres ' + d.monstres + ', sorts ' + d.sorts + ', attaque directe ' + d.direct + ', enrage ' + d.enrage + ')') +
    ligne('Cartes achetées', listeCartes(r.achetees)) +
    ligne('Cartes jouées', listeCartes(r.jouees)) +
    '</table>';
}

function htmlHistorique() {
  if (!HISTORIQUE.length) return '<p>Aucun combat terminé pendant cette session.</p>';
  return '<table class="resume"><tr><th>#</th><th>Ennemi</th><th>Issue</th><th>Tours</th><th>PV</th><th>Nettoyé</th><th>Dégâts</th></tr>' +
    HISTORIQUE.map(r => {
      const d = r.degats;
      return '<tr><td>' + r.numero + '</td><td>' + r.ennemi + '</td><td>' + (r.victoire ? 'V' : 'D') + '</td><td>' + r.tours +
        '</td><td>' + r.pvPct + ' %</td><td>' + r.toursNettoyes + '/' + r.tours + '</td><td>' + (d.monstres + d.sorts + d.direct + d.enrage) + '</td></tr>';
    }).join('') + '</table>' +
    HISTORIQUE.slice().reverse().map(r => '<details><summary>Détail du combat ' + r.numero + '</summary>' + htmlResume(r) + '</details>').join('');
}

// Contenu de la fenêtre. Reconstruit seulement à l'ouverture, pour ne pas perdre la saisie en cours.
function rendreModal() {
  el('modal').hidden = !modal;
  if (!modal) return;
  let titre = '', contenu = '';
  if (modal === 'historique') { titre = 'Historique de la session'; contenu = htmlHistorique(); }
  el('modal-contenu').innerHTML = '<h2>' + titre + '</h2>' + contenu +
    '<div class="actions">' + bouton('Fermer', 'data-action="fermer-modal"', false, 'principal') + '</div>';
}

// ---------- Interactions ----------

const ACTIONS = {
  'sel-main': d => {
    const uid = +d.uid;
    J.selection = J.selection && J.selection.type === 'main' && J.selection.uid === uid ? null : { type: 'main', uid: uid };
  },
  'sel-unite': d => {
    const uid = +d.uid;
    J.selection = J.selection && J.selection.type === 'unite' && J.selection.uid === uid ? null : { type: 'unite', uid: uid };
  },
  'cible': d => {
    const s = J.selection;
    if (s.type === 'main') lancerSort(s.uid, d.ref);
    else attaquer(s.uid, d.ref);
  },
  'deselect': () => { J.selection = null; },
  'mulligan': () => { mulligan(J.selection.uid); J.selection = null; },
  'commencer': commencerCombat,
  'acheter': d => acheter(+d.i),
  'relancer': relancer,
  'piocher': piocherTour,
  'niveau': monterNiveau,
  'vendre': () => vendre(J.selection.uid),
  'fin-boutique': finBoutique,
  'poser': () => poser(J.selection.uid),
  'fin-tour': finTour,
  'suivant': combatSuivant,
  'nouvelle-run': nouvelleRun,
  'pause': () => { J.pause = !J.pause; },
  'historique': () => { modal = 'historique'; rendreModal(); },
  'fermer-modal': () => { modal = null; rendreModal(); }
};

document.addEventListener('click', ev => {
  const cible = ev.target.closest('[data-action]');
  if (!cible || cible.disabled) return;
  const a = cible.dataset.action;
  if (J.pause && a !== 'pause') return;
  if (modal && !cible.closest('#modal')) return;
  ACTIONS[a](cible.dataset);
  rendre();
});

// Pause automatique quand l'application passe en arrière-plan (appel, notification...).
document.addEventListener('visibilitychange', () => {
  if (document.hidden && J && J.ecran === 'combat') { J.pause = true; rendre(); }
});

let dernierTick = Date.now();
setInterval(() => {
  const maintenant = Date.now();
  const dt = (maintenant - dernierTick) / 1000;
  dernierTick = maintenant;
  if (modal) return;
  if (tick(dt)) rendre(); else if (J && J.combat) majChrono();
}, 200);

nouvelleRun();
rendre();
