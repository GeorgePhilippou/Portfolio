const records = [...videos, ...dossiers];
const byId = Object.fromEntries(records.map(record => [record.id,record]));
const videoCategory = record => ({'Linked file':'linked',Supplemental:'supplemental'})[record.type] ?? 'public';
const mainTapes = videos.filter(record => videoCategory(record) === 'public');
const companionEdges = edges.filter(edge =>
  ['Description link','Companion recording'].includes(edge.kind) && videoCategory(byId[edge.to]) === 'linked'
);
const tabs = [
  ['overview','▣','Overview'],['videos','▤','Video archive'],['timeline','◷','Timeline'],
  ['map','▦','Complex map'],['locations','⌗','Complex survey'],['people','◇','Personnel'],['entities','◉','Sightings'],
  ['links','⋈','Connections'],['board','▧','Case board']
];
const labels = {videos:'Video',people:'Personnel',locations:'Location',entities:'Sighting'};
const symbols = {videos:'▤',people:'◇',locations:'⌗',entities:'◉'};
const main = document.querySelector('#main');
const inspector = document.querySelector('#inspector');
const nav = document.querySelector('#nav');
const search = document.querySelector('#search');
const lightbox = document.querySelector('#lightbox');
const tapePlayer = document.querySelector('#tape-player');
const playbackMode = document.querySelector('#playback-mode');
const playbackKey = 'async-terminal-playback-v1';
const recentKey = 'async-terminal-recent-record-v1';
let recentRecord;
try {
  if (localStorage.getItem(playbackKey) === 'youtube') playbackMode.value = 'youtube';
  const id = localStorage.getItem(recentKey);
  if (Object.hasOwn(byId,id)) recentRecord = byId[id];
} catch {}
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
let videoFilter = 'all';
let edgeFilter = 'all';
let mapRecord = 'ff1';
let resultsMessage = '';
let filmScroll = 0;

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
  closeTape();
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
function playButton(record,text='Play video',seconds=0) {
  if (!record.yt) return '';
  if (playbackMode.value === 'youtube') {
    return `<a class="button" href="${e(videoURL(record,seconds))}" target="_blank" rel="noopener">${e(text)} on YouTube</a>`;
  }
  return `<button class="button" type="button" data-play="${record.id}" data-start="${seconds}">${e(text)}</button>`;
}

playbackMode.addEventListener('change',() => {
  try { localStorage.setItem(playbackKey,playbackMode.value); } catch {}
  render();
});

function closeTape() {
  // Remove the player synchronously so its audio stops on every exit path.
  tapePlayer.replaceChildren();
  if (tapePlayer.open) tapePlayer.close();
}

function cueStamp(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`;
}

function openTape(record,seconds) {
  const start = Number.isSafeInteger(seconds) && seconds > 0 ? seconds : 0;
  const stamp = cueStamp(start);
  const header = `<div class="panel-bar"><span id="tape-title">${e(record.title)}</span><button class="button" type="button" data-close-tape autofocus>Close</button></div>`;
  const footer = `<div class="monitor-caption"><span>YouTube playback${start ? ` · Cue ${stamp}` : ''}</span>${watch(record,'Watch on YouTube',start)}</div>`;
  if (location.protocol === 'file:') {
    tapePlayer.innerHTML = header + `<div class="panel-body"><p>For in-app playback, open the <a href="https://georgephilippou.github.io/Portfolio/async-research-terminal/#record/${record.id}">hosted tape record</a>.</p></div>` + footer;
  } else {
    const params = new URLSearchParams({autoplay:'1',playsinline:'1',rel:'0'});
    if (start) params.set('start',String(start));
    const src = `https://www.youtube-nocookie.com/embed/${record.yt}?${params}`;
    tapePlayer.innerHTML = header + `<iframe class="tape-iframe" title="${e(record.title)} — YouTube player" src="${e(src)}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>` + footer;
  }
  tapePlayer.showModal();
}
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
  return `<span class="meta">${e(item.kind)} · ${e(item.credit ?? 'Kane Parsons')}</span><p>${e(item.note)}</p><div class="exhibit-links">
    ${playButton(video,item.seconds == null ? 'Play source video' : 'Play from this frame',item.seconds)}
    ${watch(video, `Source tape · ${video.title}`, item.seconds)}
    ${item.reference ? sourceLink(item.reference, 'Image reference') : ''}
  </div>`;
}

function evidenceGallery(record) {
  return exhibitGallery(evidenceFor[record.id] ?? []);
}

function exhibitGallery(items,heading='Visual evidence') {
  if (!items.length) return '';
  return panel(heading, `<div class="evidence-grid">${items.map(key => {
    const item = evidence[key];
    return `<figure class="exhibit">
      <button class="exhibit-action" data-exhibit="${key}" aria-label="Enlarge ${e(item.title)}">${evidenceImage(item)}</button>
      <figcaption><h3>${e(item.title)}</h3>${evidenceCaption(item)}</figcaption>
    </figure>`;
  }).join('')}</div>`, 'doc');
}

function row(record,caption=record.summary,tag=record.release ? dateLabel(record.release) : labels[record.group]) {
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
      <div class="screen">${evidenceImage(monitor,'monitor-img',true)}${playButton(byId.ff1,'Play tape')}</div>
      <div class="monitor-caption"><span>${e(monitor.kind)} · Kane Parsons</span>${recordLink('ff1','Open tape file')}</div>
    </section>
    <div class="archive-desk">
      <a href="${recentRecord ? '#record/'+recentRecord.id : '#timeline'}"><span class="eyebrow">${recentRecord ? 'Last opened' : 'Release order'}</span><strong>${e(recentRecord?.title ?? 'Browse the tapes')}</strong></a>
      <a href="#map"><span class="eyebrow">Survey</span><strong>Inspect the Complex map</strong></a>
      <a href="#board"><span class="eyebrow">Case board</span><strong>${memory.pins.length} pinned · ${memory.notes.length} notes</strong></a>
    </div>
    <div class="section-line"><h2>Visual files</h2></div>
    <div class="evidence-strip">${['division','beck','growth-figure'].map(id => {
      const item = evidence[evidenceFor[id]?.[0]];
      return `<a href="#record/${id}">${item ? evidenceImage(item) : ''}<strong>${e(byId[id].title)}</strong>${item ? `<span class="meta">${e(item.kind)}</span>` : ''}</a>`;
    }).join('')}</div>
    <div class="section-line"><h2>Investigation files</h2><a href="#videos">All ${videos.length} videos</a></div>
    <div class="record-list">${row(byId.ff1,'Recovered footage · description leads to a second file','CIVILIAN')}${row(byId.first,'Threshold experiment · compare with faultline.mov','A-SYNC')}${row(byId.pit,'Field expedition · Room 14D and the house encounter','A-SYNC')}${row(byId.beck,'Personnel dossier · experiment records and internal calls','DOSSIER')}</div>`;
}

function videoArchive() {
  const filters = [['all','All videos'],['public','Main uploads'],['linked','Linked files'],['supplemental','Supplemental']];
  const chosen = videos.filter(record => videoFilter === 'all' || videoFilter === videoCategory(record));
  return title('ARCHIVE / MEDIA','Video archive','Open a tape to inspect its story dates, scene notes, references and connections.') +
    `<div class="toolbar" aria-label="Filter videos">${filters.map(([id,name]) => `<button class="button" data-video-filter="${id}" aria-pressed="${id === videoFilter}">${name}</button>`).join('')}<span class="meta muted">${chosen.length} records</span></div>` +
    listing(chosen);
}

function companionCard(record,label) {
  return `<a href="#record/${record.id}" class="film-companion" data-film="${record.id}">
    ${evidenceImage(evidence['upload-'+record.id])}
    <span><strong>${e(record.title)}</strong><small>${e(label)} · <time datetime="${record.release}">${e(dateLabel(record.release))}</time></small></span>
  </a>`;
}

function releaseFilmstrip() {
  const attached = new Set(companionEdges.map(edge => edge.to));
  const columns = videos.filter(record => !attached.has(record.id)).map(record => {
    if (videoCategory(record) !== 'public') {
      return `<li class="film-column film-gap"><div class="film-upper">${companionCard(record,record.type)}</div><div class="film-axis"></div></li>`;
    }
    const companions = companionEdges.filter(edge => edge.from === record.id).map(edge =>
      companionCard(byId[edge.to],edge.kind === 'Description link' ? 'Description link' : 'Companion recording')
    ).join('');
    return `<li class="film-column">
      <div class="film-upper">${companions}</div><div class="film-axis"></div>
      <article class="film-card" data-film="${record.id}">
        <a href="#record/${record.id}" class="film-record">${evidenceImage(evidence['upload-'+record.id])}
          <time datetime="${record.release}">${e(dateLabel(record.release))}</time><strong>${e(record.title)}</strong>
        </a>
        <div class="film-actions">${playButton(record,'Play')}${recordLink(record.id,'Briefing')}</div>
      </article>
    </li>`;
  }).join('');
  return `<section class="panel film-panel" aria-label="Release filmstrip">
    <div class="panel-bar"><span>Release filmstrip</span><span>${mainTapes.length} main episodes</span></div>
    <div class="film-tools">
      <button class="button" type="button" data-film-scroll="-1">Scroll left</button>
      <button class="button" type="button" data-film-scroll="1">Scroll right</button>
      <label for="film-jump">Jump to episode</label>
      <select id="film-jump"><option value="">Choose an episode</option>${mainTapes.map(record =>
        `<option value="${record.id}">${e(record.title)}</option>`).join('')}</select>
    </div>
    <div class="film-viewport" tabindex="0" aria-label="Scrollable release filmstrip">
      <ol class="film-track">${columns}</ol>
    </div>
    <div class="monitor-caption film-key"><span><b>Above</b> · Companion files and supplemental material</span><span><b>Below</b> · Main episodes, in upload order</span></div>
  </section>`;
}

function storyChronology() {
  const eventRow = event => `<a class="record timeline-row" href="#record/${event.video}"><time>${e(dateLabel(event.date))}</time><span class="record-main"><strong>${e(event.title)}</strong><small>${e(byId[event.video].title)} · ${e(event.note)}</small></span><span class="tag">${e(event.basis)}</span></a>`;
  const orderDate = event => event.video === 'recording' ? '1990-05-08' : event.date;
  const dated = events.filter(event => event.date && event.basis !== 'Relative date').sort((a,b) => orderDate(a).localeCompare(orderDate(b)));
  const relative = events.filter(event => event.basis === 'Relative date');
  const undated = events.filter(event => !event.date);
  return `<div class="record-list">${dated.map(eventRow).join('')}</div>
    <div class="section-line"><h2>Known sequence, uncertain date</h2></div><div class="record-list">${relative.map(eventRow).join('')}</div>
    <div class="section-line"><h2>Unplaced events</h2></div><div class="record-list">${undated.map(eventRow).join('')}</div>`;
}

function timeline(mode) {
  const isStory = mode === 'story';
  return title('ARCHIVE / CHRONOLOGY','Timeline',isStory ? 'Reconstruct the order of events from dates in the footage, upload descriptions, and secondary references.' : 'Follow the main series in upload order. Linked files sit above their related episode, while standalone supplements sit between releases.') +
    `<nav class="toolbar timeline-switch" aria-label="Timeline order"><a class="button" href="#timeline/release" ${isStory ? '' : 'aria-current="page"'}>YouTube release order</a><a class="button" href="#timeline/story" ${isStory ? 'aria-current="page"' : ''}>In-story chronology</a></nav>` +
    (isStory ? storyChronology() : releaseFilmstrip());
}

function jumpToFilm(id) {
  if (!videos.some(record => record.id === id)) return;
  const viewport = main.querySelector('.film-viewport');
  const item = viewport?.querySelector(`[data-film="${id}"]`);
  if (!item) return;
  const bounds = viewport.getBoundingClientRect();
  viewport.scrollLeft += item.getBoundingClientRect().left - bounds.left - 14;
  main.querySelector('#film-jump').value = mainTapes.some(record => record.id === id) ? id : '';
}

function tapeNavigation(record) {
  const index = mainTapes.indexOf(record);
  const previous = index > 0 ? mainTapes[index - 1] : null;
  const next = index >= 0 ? mainTapes[index + 1] : null;
  return `<nav class="tape-navigation" aria-label="Release navigation">
    ${previous ? recordLink(previous.id,`Previous · ${previous.title}`) : ''}
    <a href="#timeline/release/${record.id}">View in release filmstrip</a>
    ${next ? recordLink(next.id,`Next · ${next.title}`) : ''}
  </nav>`;
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
  return title(...header) + (diagrams ? `<div class="toolbar">${button('Open Complex map','#map')}</div>` : '') +
    listing(dossiers.filter(record => record.group === group)) +
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

function briefingPanel(record) {
  const briefing = briefings[record.id];
  const facts = `<div class="facts">${record.release ? `<span>Upload · ${e(dateLabel(record.release))}</span><span>Runtime · ${e(record.duration)}</span>` : ''}<span>${e(record.type)}</span></div>`;
  const points = briefing.points.map(([heading,description,...sources]) => {
    const links = sources.map(([id,seconds]) => {
      const source = byId[id];
      if (seconds != null) return playButton(source,`${source.title} · ${cueStamp(seconds)}`,seconds);
      if (id === record.id) return watch(source,'Original video');
      return recordLink(id);
    });
    return `<li><h4>${e(heading)}</h4><p>${e(description)}</p><div class="briefing-sources">${links.join('')}</div></li>`;
  }).join('');
  const reference = briefing.reference ? `<div class="briefing-sources">${sourceLink(briefing.reference,'Additional source notes')}</div>` : '';
  return panel('Entry briefing',`
    <div class="briefing-intro">
      <h2>${record.group === 'people' ? (record.id === 'async' ? 'What is A-Sync?' : 'Who is this?') : 'Overview'}</h2>
      <p>${e(record.summary)}</p>${facts}
    </div>
    <div class="briefing-why"><h3>Why it matters</h3><p>${e(briefing.why)}</p></div>
    <div class="briefing-findings"><h3>Key information</h3><ul class="briefing-points">${points}</ul></div>
    <div class="briefing-open"><h3>What remains open</h3><p>${e(briefing.open)}</p>${reference}</div>
  `,'doc briefing');
}

function recordPage(record) {
  const isVideo = record.group === 'videos';
  const related = edges.filter(edge => edge.from === record.id || edge.to === record.id);
  const sightings = dossiers.filter(entry => entry.refs.includes(record.id));
  const sceneList = moments[record.id] ?? [];
  const recordEvents = events.filter(event => event.video === record.id);
  const pin = memory.pins.includes(record.id);
  const mapArea = surveyAreas.find(area => area.id === record.id || area.stages.some(stage=>stage.video === record.id));
  const mapStage = mapArea?.stages.find(stage=>stage.video === record.id)?.id ?? mapArea?.start;
  const actions = `<div class="toolbar">${isVideo ? playButton(record) : ''}${mapArea ? button('Locate in Complex map',`#map/${mapArea.id}/${mapStage}`) : ''}<button class="button" data-pin="${record.id}" aria-pressed="${pin}">${pin ? 'Pinned to case board' : 'Pin to case board'}</button>${isVideo ? watch(record) : ''}</div>`;
  const datePanel = recordEvents.length ? panel('In-story events',recordEvents.map(event => `<article class="scene"><span class="tag">${e(dateLabel(event.date))} · ${e(event.basis)}</span><h3>${e(event.title)}</h3><p>${e(event.note)}</p></article>`).join(''),'doc') : '';
  const scenePanel = sceneList.length ? panel('Scene notes',sceneList.map(scene => `<article class="scene"><span class="tag">${e(scene.label)}</span><h3>${e(scene.title)}</h3><p>${e(scene.note)}</p>${scene.seconds == null ? '' : playButton(record,'Play from this cue',scene.seconds)}${scene.reference ? `<small> · ${sourceLink(scene.reference,'Cue reference')}</small>` : ''}</article>`).join(''),'doc') : '';
  const associations = isVideo ? sightings : record.refs.map(id => byId[id]);
  return title(`${labels[record.group]} / ${record.id.toUpperCase()}`,record.title) + actions + (isVideo ? tapeNavigation(record) : '') + briefingPanel(record) + evidenceGallery(record) + datePanel + scenePanel +
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
    const briefing = briefings[record.id];
    const context = [
      record.title, record.id, record.type, record.summary, record.release, dateLabel(record.release),
      briefing.why, ...briefing.points.flatMap(([heading,description]) => [heading,description]),
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
  return panel('Incident log',sampleEvents.map(event => `<div class="incident"><time>${e(dateLabel(event.date))}</time>${recordLink(event.video,event.title)}</div>`).join('') + button('Open chronology','#timeline/story')) +
    panel('Active lead',`<p class="mini-title">The Ivan Beck file</p><p class="muted">Follow Beck from the project’s public rationale through the recovered-body examination and the Tench incident.</p>${button('Inspect dossier','#record/beck')}`) +
    panel('Evidence key','<p><span class="tag">DOCUMENTED</span><br>Directly attested in the cited source.</p><p><span class="tag warning">HYPOTHESIS</span><br>A possible relationship to investigate.</p>');
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(memory));
  } catch { storageAvailable = false; }
}

function render() {
  const [page,id,stage] = (location.hash.slice(1) || 'overview').split('/');
  const isFilmstrip = page === 'timeline' && id !== 'story';
  const isSurvey = page === 'map';
  filmScroll = main.querySelector('.film-viewport')?.scrollLeft ?? filmScroll;
  const entry = page === 'record' ? byId[id] : null;
  const active = entry?.group ?? page;
  const views = {overview, videos:videoArchive, timeline:()=>timeline(id), map:()=>surveyMap(id,stage), people:()=>dossierIndex('people'),
    locations:()=>dossierIndex('locations'), entities:()=>dossierIndex('entities'),
    links:connections, board, search:searchResults};
  nav.innerHTML = tabs.map(([key,symbol,label]) => `<a class="nav" href="#${key}" ${key === active ? 'aria-current="page"' : ''}><i aria-hidden="true">${symbol}</i>${label}</a>`).join('');
  main.innerHTML = entry ? recordPage(entry) : (Object.hasOwn(views,page) ? views[page]() : title('ARCHIVE','Record unavailable') + button('Return to overview','#overview'));
  main.parentElement.classList.toggle('film-workspace', isFilmstrip || isSurvey);
  inspector.hidden = isFilmstrip || isSurvey;
  if (isSurvey) initSurvey(id,stage);
  if (isFilmstrip) {
    main.querySelector('.film-viewport').scrollLeft = filmScroll;
    if (stage) jumpToFilm(stage);
  } else if (!isSurvey) {
    inspector.innerHTML = entry ? recordInspector(entry) : dashboardInspector();
  }
  if (!document.body.classList.contains('login-pending')) {
    if (entry) {
      recentRecord = entry;
      try { localStorage.setItem(recentKey,entry.id); } catch {}
    }
    document.title = `${main.querySelector('h1').textContent} | A-Sync Research Terminal`;
  }
}

window.addEventListener('hashchange', () => {
  closeTape();
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
tapePlayer.addEventListener('click', event => {
  if (event.target === tapePlayer || event.target.closest('[data-close-tape]')) closeTape();
});
tapePlayer.addEventListener('cancel', event => {
  event.preventDefault();
  closeTape();
});
document.addEventListener('click', event => {
  const play = event.target.closest('[data-play]');
  if (!play || document.body.classList.contains('login-pending')) return;
  const record = byId[play.dataset.play];
  if (!record?.yt) return;
  if (lightbox.open) lightbox.close();
  openTape(record,Number(play.dataset.start));
});
main.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  const {filmScroll:scrollDirection,videoFilter:filter,pin,deleteNote,exhibit} = control.dataset;
  if (scrollDirection) {
    const viewport = main.querySelector('.film-viewport');
    viewport.scrollBy({left:Number(scrollDirection)*viewport.clientWidth*.8});
    return;
  }
  if (exhibit) {
    const item = evidence[exhibit];
    lightbox.innerHTML = `<div class="panel-bar"><span id="exhibit-title">${e(item.title)}</span><button class="button" data-close-exhibit autofocus>Close</button></div>
      ${evidenceImage(item,'',true)}<div class="panel-body">${evidenceCaption(item)}</div>`;
    lightbox.showModal();
    return;
  }
  let restore;
  if (filter) {
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
  if (id === 'film-jump') {
    jumpToFilm(value);
    return;
  }
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
