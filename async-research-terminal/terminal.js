const records = [...videos, ...dossiers];
const byId = Object.fromEntries(records.map(record => [record.id,record]));
const tabs = [
  ['overview','▣','Overview'],['videos','▤','Video archive'],['timeline','◷','Timeline'],
  ['locations','⌗','Complex survey'],['people','◇','Personnel'],['entities','◉','Sightings'],
  ['links','⋈','Connections'],['board','▧','Case board']
];
const labels = {videos:'Video',people:'Personnel',locations:'Location',entities:'Sighting'};
const symbols = {videos:'▤',people:'◇',locations:'⌗',entities:'◉'};
const main = document.querySelector('#main');
const inspector = document.querySelector('#inspector');
const nav = document.querySelector('#nav');
const search = document.querySelector('#search');
const lightbox = document.querySelector('#lightbox');
const operatorForm = document.querySelector('#operator-form');
const operatorId = document.querySelector('#operator-id');
const operatorCode = document.querySelector('#operator-code');
const loginFeedback = document.querySelector('#login-feedback');
const sessionKey = 'async-terminal-operator-v1';
const operatorFields = new Map([[operatorId,'KV31-OPS'],[operatorCode,'••••••••']]);
const progress = new Map([[operatorId,0],[operatorCode,0]]);
const storageKey = 'async-terminal-case-board-v1';
let memory = {pins:[],notes:[]};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved?.pins) && Array.isArray(saved?.notes)) memory = saved;
} catch {}
let storageAvailable = true;
let timelineMode = 'story';
let videoFilter = 'all';
let edgeFilter = 'all';
let mapRecord = 'ff1';
let resultsMessage = '';

function setLoginState(isSignedIn) {
  document.body.classList.toggle('login-pending',!isSignedIn);
  if (!isSignedIn) document.title = 'Operator sign-in | A-Sync Research Terminal';
}

function updateField(field, change) {
  const preset = operatorFields.get(field);
  const count = Math.max(0,Math.min(preset.length,progress.get(field)+change));
  progress.set(field,count);
  field.value = preset.slice(0,count);
  loginFeedback.textContent = '';
}

for (const field of operatorFields.keys()) {
  field.addEventListener('keydown',event => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
    if (event.key.length === 1 || ['Backspace','Delete'].includes(event.key)) {
      event.preventDefault();
      updateField(field,event.key.length === 1 ? 1 : -1);
    } else if (event.key === 'Enter' && field === operatorId) {
      event.preventDefault();
      operatorCode.focus();
    }
  });
  field.addEventListener('beforeinput',event => {
    if (!event.cancelable) return;
    event.preventDefault();
    updateField(field,event.inputType.startsWith('delete') ? -1 : 1);
  });
  // Some mobile input methods cannot cancel beforeinput. Replace their DOM value without reading it.
  field.addEventListener('input',event => updateField(field,event.inputType?.startsWith('delete') ? -1 : 1));
  for (const type of ['paste','drop']) {
    field.addEventListener(type,event => {
      event.preventDefault();
      updateField(field,1);
    });
  }
}

operatorForm.addEventListener('submit',event => {
  event.preventDefault();
  const missing = [...operatorFields.keys()].find(field => !progress.get(field));
  if (missing) {
    loginFeedback.textContent = 'Type a key in both fields to continue.';
    missing.focus();
    return;
  }
  try { sessionStorage.setItem(sessionKey,'open'); } catch {}
  setLoginState(true);
  render();
  main.focus();
});

document.querySelector('#sign-out').addEventListener('click',() => {
  try { sessionStorage.removeItem(sessionKey); } catch {}
  for (const [field,preset] of operatorFields) updateField(field,-preset.length);
  setLoginState(false);
  operatorId.focus();
});

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
})[char]);
const e = escapeHTML;
const recordLink = (id,text) => `<a href="#record/${id}">${e(text ?? byId[id].title)}</a>`;
const sourceLink = (url,text) => `<a href="${e(url)}" target="_blank" rel="noopener">${e(text)}</a>`;
const button = (text,href) => `<a class="button" href="${href}">${e(text)}</a>`;
const videoURL = (record,seconds) => record.yt
  ? `https://www.youtube.com/watch?v=${record.yt}${seconds == null ? '' : `&t=${seconds}s`}`
  : officialPlaylist;
const watch = (record,text,seconds) => sourceLink(videoURL(record,seconds),text ?? (record.yt ? 'Open original upload' : 'Open official playlist'));
const title = (code,heading,description='') => `<header class="page-head"><span class="eyebrow">${e(code)}</span><h1>${e(heading)}</h1>${description ? `<p class="muted">${e(description)}</p>` : ''}</header>`;
const panel = (heading,body,extra='') => `<section class="panel ${extra}"><div class="panel-bar">${e(heading)}</div><div class="panel-body">${body}</div></section>`;

function dateLabel(date) {
  if (date === '1990-02-29') return '29 Feb 1990';
  if (!date) return 'Unplaced';
  if (date.length === 4) return date;
  return new Intl.DateTimeFormat('en-GB',{
    timeZone:'UTC', year:'numeric', month:'short', ...(date.length === 10 ? {day:'numeric'} : {})
  }).format(new Date(date.length === 7 ? date + '-01' : date));
}

function evidenceImage(item, className = '', eager = false) {
  const file = `evidence/${item.file}.webp`;
  const src = typeof embeddedEvidence === 'undefined' ? file : (embeddedEvidence[file] ?? file);
  return `<img src="${e(src)}" alt="${e(item.alt)}" class="${className}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
}

function evidenceCaption(item) {
  const video = byId[item.video];
  return `<span class="meta">${e(item.kind)} · Kane Parsons</span><p>${e(item.note)}</p><div class="exhibit-links">
    ${watch(video, `Source tape · ${video.title}`, item.seconds)}
    ${item.reference ? sourceLink(item.reference, 'Image reference') : ''}
  </div>`;
}

function evidenceGallery(record) {
  const items = evidenceFor[record.id] ?? [];
  if (!items.length) return '';
  return panel('Visual evidence', `<div class="evidence-grid">${items.map(key => {
    const item = evidence[key];
    return `<figure class="exhibit">
      <button class="exhibit-action" data-exhibit="${key}" aria-label="Enlarge ${e(item.title)}">${evidenceImage(item)}</button>
      <figcaption><h3>${e(item.title)}</h3>${evidenceCaption(item)}</figcaption>
    </figure>`;
  }).join('')}</div>`, 'doc');
}

function row(record,caption=record.type,tag=record.release ? dateLabel(record.release) : labels[record.group]) {
  const preview = evidence[evidenceFor[record.id]?.[0]];
  return `<a class="record ${preview ? 'has-thumb' : ''}" href="#record/${record.id}">
    ${preview ? evidenceImage(preview,'entry-thumb') : `<span class="record-icon" aria-hidden="true">${symbols[record.group]}</span>`}
    <span class="record-main"><strong>${e(record.title)}</strong><small>${e(caption)}</small>${preview ? `<small class="preview-type">${e(preview.kind)}</small>` : ''}</span><span class="tag">${e(tag)}</span>
  </a>`;
}

function listing(items,empty='No matching records.') {
  return items.length ? `<div class="record-list">${items.map(record => row(record)).join('')}</div>` : `<p class="empty">${e(empty)}</p>`;
}

function overview() {
  const monitor = evidence[evidenceFor.ff1[0]];
  return title('PROJECT KV31 / RESEARCH RECORDS','Complex Research Archive','Review recovered footage, survey locations, and compare incident records.') +
    `<section class="panel monitor"><div class="panel-bar"><span>Frame viewer</span><span>The Backrooms (Found Footage)</span></div>
      <div class="screen">${evidenceImage(monitor,'monitor-img',true)}${button('Open tape file','#record/ff1')}</div>
      <div class="monitor-caption"><span>${e(monitor.kind)} · Kane Parsons</span>${watch(byId.ff1,'Open source tape',monitor.seconds)}</div>
    </section>
    <div class="section-line"><h2>Visual files</h2></div>
    <div class="evidence-strip">${['division','beck','growth-figure'].map(id => {
      const item = evidence[evidenceFor[id]?.[0]];
      return `<a href="#record/${id}">${item ? evidenceImage(item) : ''}<strong>${e(byId[id].title)}</strong>${item ? `<span class="meta">${e(item.kind)}</span>` : ''}</a>`;
    }).join('')}</div>
    <div class="section-line"><h2>Investigation files</h2><a href="#videos">All ${videos.length} videos</a></div>
    <div class="record-list">${row(byId.ff1,'Recovered footage · description leads to a second file','CIVILIAN')}${row(byId.first,'Threshold experiment · compare with faultline.mov','A-SYNC')}${row(byId.pit,'Field expedition · Room 14D and the house encounter','A-SYNC')}${row(byId.beck,'Personnel dossier · experiment records and internal calls','DOSSIER')}</div>
    <div class="section-line"><h2>Open an investigation</h2></div><div class="overview-grid">
      <a href="#timeline"><strong>◷</strong>Reconstruct events</a><a href="#locations"><strong>⌗</strong>Follow field routes</a><a href="#board"><strong>▧</strong>Build a case</a>
    </div>`;
}

function videoArchive() {
  const filters = [['all','All videos'],['public','Main uploads'],['linked','Linked files'],['supplemental','Supplemental']];
  const filterTypes = {'Linked file':'linked',Supplemental:'supplemental'};
  const chosen = videos.filter(record => videoFilter === 'all' || videoFilter === (filterTypes[record.type] ?? 'public'));
  return title('ARCHIVE / MEDIA','Video archive','Open a tape to inspect its story dates, scene notes, references and connections.') +
    `<div class="toolbar" aria-label="Filter videos">${filters.map(([id,name]) => `<button class="button" data-video-filter="${id}" aria-pressed="${id === videoFilter}">${name}</button>`).join('')}<span class="meta muted">${chosen.length} records</span></div>` +
    listing(chosen);
}

function timeline() {
  const isStory = timelineMode === 'story';
  const eventRow = event => `<a class="record timeline-row" href="#record/${event.video}"><time>${e(dateLabel(event.date))}</time><span class="record-main"><strong>${e(event.title)}</strong><small>${e(byId[event.video].title)} · ${e(event.note)}</small></span><span class="tag">${e(event.basis)}</span></a>`;
  const dated = events.filter(event => event.date).sort((a,b) => a.date.localeCompare(b.date));
  const undated = events.filter(event => !event.date);
  return title('ARCHIVE / CHRONOLOGY','Timeline',isStory ? 'Reconstruct the order of events from dates in the footage, upload descriptions, and secondary references.' : 'Browse the archive by YouTube upload date.') +
    `<div class="toolbar" aria-label="Timeline order"><button class="button" data-timeline="story" aria-pressed="${isStory}">In-story chronology</button><button class="button" data-timeline="release" aria-pressed="${!isStory}">YouTube release order</button></div>` +
    (isStory ? `<div class="record-list">${dated.map(eventRow).join('')}</div><div class="section-line"><h2>Unplaced events</h2></div><div class="record-list">${undated.map(eventRow).join('')}</div>` : listing(videos));
}

function dossierIndex(group) {
  const header = {
    people:['FILES / PERSONNEL','Personnel dossiers','Trace people and organisations across field tapes, narration, and internal records.'],
    locations:['SURVEY / ROUTE FRAGMENTS','Complex survey','Explore the order of spaces shown in each tape. The diagrams represent routes with unknown scale and orientation.'],
    entities:['FIELD RECORDS / LIFEFORM ACTIVITY','Sighting register','Review encounters one by one and follow the original recordings. Possible matches are marked as hypotheses.']
  }[group];
  const diagrams = group === 'locations' ? routes.map(route => `<section class="panel doc">
    <div class="panel-bar">${e(route.title)}</div><div class="route route-bg">${route.nodes.map(([id,label,type],index) => `<a href="#record/${id}"><span class="tag">STOP ${index+1}</span><strong>${e(label)}</strong><small>${e(type)}</small></a>`).join('')}</div>
    <div class="monitor-caption">${e(route.description)}</div></section>`).join('') : '';
  return title(...header) + listing(dossiers.filter(record => record.group === group)) +
    (diagrams ? '<div class="section-line"><h2>Survey routes</h2></div>' + diagrams : '');
}

function connectionCard(edge, showSource=true) {
  return `<article class="connection"><span class="tag ${edge.status === 'Hypothesis' ? 'warning' : ''}">${e(edge.status)}</span><h3>${e(edge.kind)}</h3><p>${recordLink(edge.from)} <span aria-hidden="true">↔</span> ${recordLink(edge.to)}</p><p class="muted">${e(edge.note)}</p>
    ${showSource && edge.kind === 'Description link' ? `<small>${edge.status === 'Documented' ? watch(byId[edge.from],'Source video description') : sourceLink('https://kanepixelsbackrooms.fandom.com/wiki/Backrooms_-_Presentation','Episode reference')}</small>` : ''}</article>`;
}

function connections() {
  const center = byId[mapRecord];
  const mapEdges = edges.filter(edge => edge.from === mapRecord || edge.to === mapRecord);
  const links = mapEdges.map(edge => {
    const other = byId[edge.from === mapRecord ? edge.to : edge.from];
    return `<div class="map-branch"><span class="tag">${e(edge.kind)}</span><a href="#record/${other.id}">${e(other.title)}</a><small class="muted">${e(edge.status)}</small></div>`;
  });
  const mapIds = [...new Set(edges.flatMap(edge => [edge.from, edge.to]))];
  const map = panel('Relationship map', `<div class="toolbar"><label for="map-record">Inspect neighbours</label><select id="map-record">${mapIds.map(id => `<option value="${id}" ${id === mapRecord ? 'selected' : ''}>${e(byId[id].title)}</option>`).join('')}</select></div><div class="relationship-map route-bg"><div class="map-anchor">${recordLink(center.id)}</div><div class="map-branches">${links.join('')}</div></div>`,'doc');
  const statuses = ['all',...new Set(edges.map(edge => edge.status))];
  const matches = edges.filter(edge => edgeFilter === 'all' || edge.status === edgeFilter);
  return title('ANALYSIS / CROSS-REFERENCES','Connections','Follow a documented link, compare two views of an incident, or inspect an open hypothesis.') + map + '<div class="section-line"><h2>Evidence register</h2></div>' +
    `<div class="toolbar"><label for="edge-type">Evidence status</label><select id="edge-type">${statuses.map(status => `<option value="${e(status)}" ${status === edgeFilter ? 'selected' : ''}>${e(status === 'all' ? 'All connections' : status)}</option>`).join('')}</select><span class="meta muted">${matches.length} connections</span></div><div class="guide">${matches.map(edge => connectionCard(edge)).join('')}</div>`;
}

function recordPage(record) {
  const isVideo = record.group === 'videos';
  const related = edges.filter(edge => edge.from === record.id || edge.to === record.id);
  const sightings = dossiers.filter(entry => entry.refs.includes(record.id));
  const sceneList = moments[record.id] ?? [];
  const recordEvents = events.filter(event => event.video === record.id);
  const pin = memory.pins.includes(record.id);
  const actions = `<div class="toolbar"><button class="button" data-pin="${record.id}" aria-pressed="${pin}">${pin ? 'Pinned to case board' : 'Pin to case board'}</button>${isVideo ? watch(record) : ''}</div>`;
  const details = panel('Record summary', `<p>${e(record.summary)}</p><div class="facts">${isVideo ? `<span>Upload · ${e(dateLabel(record.release))}</span><span>Runtime · ${e(record.duration)}</span>` : ''}<span>${e(record.type)}</span></div>`,'doc');
  const datePanel = recordEvents.length ? panel('In-story events',recordEvents.map(event => `<article class="scene"><span class="tag">${e(dateLabel(event.date))} · ${e(event.basis)}</span><h3>${e(event.title)}</h3><p>${e(event.note)}</p></article>`).join(''),'doc') : '';
  const scenePanel = sceneList.length ? panel('Scene notes',sceneList.map(scene => `<article class="scene"><span class="tag">${e(scene.label)}</span><h3>${e(scene.title)}</h3><p>${e(scene.note)}</p>${scene.seconds == null ? '' : `<small>${watch(record,'Open this cue on YouTube',scene.seconds)}</small>`}${scene.reference ? `<small> · ${sourceLink(scene.reference,'Cue reference')}</small>` : ''}</article>`).join(''),'doc') : '';
  const associations = isVideo ? sightings : record.refs.map(id => byId[id]);
  return title(`${labels[record.group]} / ${record.id.toUpperCase()}`,record.title) + actions + details + evidenceGallery(record) + datePanel + scenePanel +
    (related.length ? panel('Connections',related.map(edge => connectionCard(edge)).join(''),'doc') : '') +
    (associations.length ? `<div class="section-line"><h2>${isVideo ? 'Referenced dossiers' : 'Referenced videos'}</h2></div>${listing(associations)}` : '');
}

function safeExternal(text) {
  if (!text) return null;
  try {
    const url = new URL(text);
    return ['http:','https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

function board() {
  const pinned = memory.pins.map(id => byId[id]).filter(Boolean);
  const notes = memory.notes.slice().reverse();
  return title('ANALYSIS / WORKING FILE','Case board','Pin records while browsing, then write down the connection you want to investigate. Pins and notes are saved in this browser.') +
    (!storageAvailable ? '<p class="empty">Browser storage is unavailable. Changes last for this session.</p>' : '') +
    `<div class="section-line"><h2>Pinned evidence</h2><span class="meta muted">${pinned.length} pins</span></div>` +
    listing(pinned,'Open a record and select “Pin to case board” to collect evidence here.') +
    '<div class="section-line"><h2>Investigation notes</h2></div>' +
    panel('New observation or hypothesis',`<form class="note-form" id="note-form"><label for="note-record">Related record</label><select id="note-record" name="record"><option value="">General note</option>${records.map(record => `<option value="${record.id}">${e(record.title)}</option>`).join('')}</select>
      <label for="note-text">Your note</label><textarea id="note-text" name="note" maxlength="2000" required></textarea>
      <label for="note-source">Source URL (optional)</label><input id="note-source" name="source" type="url" maxlength="1500" placeholder="Video, timestamp or comment permalink">
      <div><button class="button" type="submit">Save note</button></div></form><p id="board-status" role="status" class="meta muted">${e(resultsMessage)}</p>`,'doc') +
    notes.map(note => {
      const url = safeExternal(note.source);
      return panel('Analyst note',`<p class="preserve">${e(note.text)}</p>${byId[note.record] ? `<p>${recordLink(note.record)}</p>` : ''}${url ? `<p>${sourceLink(url,'Open note source')}</p>` : ''}<button class="button danger" data-delete-note="${e(note.id)}">Delete note</button>`,'doc');
    }).join('');
}

function searchResults() {
  const query = search.value.trim().toLowerCase();
  const results = query ? records.filter(record => {
    const context = [
      record.title, record.id, record.type, record.summary, record.release, dateLabel(record.release),
      ...events.filter(event => event.video === record.id).flatMap(event => [event.date,event.title]),
      ...(record.refs ?? []).map(id => byId[id].title)
    ].join(' ').toLowerCase();
    return query.split(/\s+/).every(word => context.includes(word));
  }) : [];
  return title('ARCHIVE / QUERY','Search archive',query ? `${results.length} results for “${search.value.trim()}”` : 'Enter a name, video, location, or date.') + (query ? listing(results) : '');
}

function recordInspector(record) {
  const isVideo = record.group === 'videos';
  const source = isVideo ? watch(record) : '';
  const refs = isVideo ? '' : record.refs.map(id => `<span>${watch(byId[id],byId[id].title)}</span>`).join('');
  const descriptive = edges.filter(edge => edge.from === record.id && edge.kind === 'Description link');
  return panel('Source register',`<div class="source-list">${source}${refs}${sourceLink(catalogSource,'Episode catalogue')}${sourceLink(chronologySource,'Secondary chronology')}${record.id === 'ff1' ? sourceLink(footageSource,'Found Footage scene reference') : ''}</div>`) +
    (isVideo ? panel('YouTube metadata',descriptive.length ? descriptive.map(edge => `<p><span class="tag">${e(edge.status)}</span> · ${recordLink(edge.to)}</p>`).join('') + '<p class="muted">Pinned and viewer comments are awaiting review.</p>' : '<p class="muted">Description and comment coverage varies by file. Open the upload to inspect the current page.</p>') : '');
}

function dashboardInspector() {
  const sampleEvents = ['1972-08-02','1989-10-17','1990-05-08','1996-09-23'].map(date => events.find(event => event.date === date));
  return panel('Incident log',sampleEvents.map(event => `<div class="incident"><time>${e(dateLabel(event.date))}</time>${recordLink(event.video,event.title)}</div>`).join('') + button('Open timeline','#timeline')) +
    panel('Active lead',`<p class="mini-title">The Ivan Beck file</p><p class="muted">Follow Beck from the project’s public rationale through the recovered-body examination and the Tench incident.</p>${button('Inspect dossier','#record/beck')}`) +
    panel('Evidence key','<p><span class="tag">DOCUMENTED</span><br>Directly attested in the cited source.</p><p><span class="tag warning">HYPOTHESIS</span><br>A possible relationship to investigate.</p>');
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(memory));
  } catch { storageAvailable = false; }
}

function render() {
  const [page,id] = (location.hash.slice(1) || 'overview').split('/');
  const entry = page === 'record' ? byId[id] : null;
  const active = entry?.group ?? page;
  const views = {overview, videos:videoArchive, timeline, people:()=>dossierIndex('people'),
    locations:()=>dossierIndex('locations'), entities:()=>dossierIndex('entities'),
    links:connections, board, search:searchResults};
  nav.innerHTML = tabs.map(([key,symbol,label]) => `<a class="nav" href="#${key}" ${key === active ? 'aria-current="page"' : ''}><i aria-hidden="true">${symbol}</i>${label}</a>`).join('');
  main.innerHTML = entry ? recordPage(entry) : (Object.hasOwn(views,page) ? views[page]() : title('ARCHIVE','Record unavailable') + button('Return to overview','#overview'));
  inspector.innerHTML = entry ? recordInspector(entry) : dashboardInspector();
  if (!document.body.classList.contains('login-pending')) {
    document.title = `${main.querySelector('h1').textContent} | A-Sync Research Terminal`;
  }
}

window.addEventListener('hashchange', () => {
  resultsMessage = '';
  render();
  window.scrollTo(0,0);
  if (location.hash !== '#search') main.focus({preventScroll:true});
});
search.addEventListener('input', () => {
  if (location.hash === '#search') render();
  else location.hash = 'search';
});
document.addEventListener('keydown',event => {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]')) {
    event.preventDefault();
    search.focus();
  }
});
lightbox.addEventListener('click', event => {
  if (event.target === lightbox || event.target.closest('[data-close-exhibit]')) lightbox.close();
});
main.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  const {timeline,videoFilter:filter,pin,deleteNote,exhibit} = control.dataset;
  if (exhibit) {
    const item = evidence[exhibit];
    lightbox.innerHTML = `<div class="panel-bar"><span id="exhibit-title">${e(item.title)}</span><button class="button" data-close-exhibit autofocus>Close</button></div>
      ${evidenceImage(item,'',true)}<div class="panel-body">${evidenceCaption(item)}</div>`;
    lightbox.showModal();
    return;
  }
  let restore;
  if (timeline) {
    timelineMode = timeline;
    restore = `[data-timeline="${timeline}"]`;
  } else if (filter) {
    videoFilter = filter;
    restore = `[data-video-filter="${filter}"]`;
  } else if (pin && byId[pin]) {
    memory.pins = memory.pins.includes(pin) ? memory.pins.filter(id => id !== pin) : [...memory.pins,pin];
    save();
    restore = `[data-pin="${pin}"]`;
  } else if (deleteNote) {
    memory.notes = memory.notes.filter(note => note.id !== deleteNote);
    save();
    resultsMessage = 'Note deleted.';
    restore = '#note-text';
  } else return;
  render();
  main.querySelector(restore)?.focus({preventScroll:true});
});
main.addEventListener('change', event => {
  const {id,value} = event.target;
  if (id === 'edge-type') edgeFilter = value;
  else if (id === 'map-record') mapRecord = value;
  else return;
  render();
  main.querySelector('#' + id).focus({preventScroll:true});
});
main.addEventListener('submit', event => {
  if (event.target.id !== 'note-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  const note = form.get('note').trim();
  const source = form.get('source').trim();
  if (!note || (source && !safeExternal(source))) {
    main.querySelector('#board-status').textContent = note ? 'Enter an http or https source URL.' : 'Enter a note first.';
    return;
  }
  memory.notes.push({
    id:globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text:note, source, record:form.get('record')
  });
  save();
  resultsMessage = 'Note saved.';
  render();
  main.querySelector('#note-text').focus({preventScroll:true});
});

let signedIn = false;
try { signedIn = sessionStorage.getItem(sessionKey) === 'open'; } catch {}
setLoginState(signedIn);
render();
