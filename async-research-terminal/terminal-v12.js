const allDossiers = [...dossiers, ...additionalPeople, ...featureDossiers];
const allEvents = [...events, ...featureEvents];
const allEdges = [...edges, ...featureEdges];
const allBriefings = {...briefings, ...featureBriefings, ...Object.fromEntries(additionalPeople.map(record => [record.id,record]))};
const briefingFor = record => ({...allBriefings[record.id],...personnelFileNotes[record.id]});
const records = [...videos, featureFilm, ...allDossiers];
const byId = Object.fromEntries(records.map(record => [record.id,record]));
const videoCategory = record => ({'Linked file':'linked',Supplemental:'supplemental'})[record.type] ?? 'public';
const mainTapes = videos.filter(record => videoCategory(record) === 'public');
const companionEdges = edges.filter(edge =>
  ['Description link','Companion recording'].includes(edge.kind) && videoCategory(byId[edge.to]) === 'linked'
);
const navigation = [
  ['Workstation',[['overview','▣','Operator desk'],['questions','?','Open questions']]],
  ['Records',[['evidence','▧','Evidence register'],['videos','▤','Video archive'],['feature','▣','Feature film'],['timeline','◷','Timeline'],['people','◇','Personnel'],['entities','◉','Sightings']]],
  ['Analysis',[['map','▦','Complex map'],['locations','⌗','Locations'],['compare','◫','Compare evidence'],['links','⋈','Connections'],['board','▧','Case board']]]
];
const tabs = navigation.flatMap(([,entries])=>entries);
const labels = {videos:'Video',feature:'Feature film',people:'Personnel',locations:'Location',entities:'Sighting'};
const symbols = {videos:'▤',feature:'▣',people:'◇',locations:'⌗',entities:'◉'};
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
const filmScroll = new Map();
let compareFocus = '';

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
    loginFeedback.textContent = missing === operatorId ? 'Operator ID required.' : 'Access code required.';
    missing.focus();
    return;
  }
  try { sessionStorage.setItem(sessionKey,'open'); } catch {}
  setLoginState(true);
  render();
  if (!/^#timeline\/[^/]+\/[^/]+$/.test(location.hash)) window.scrollTo(0,0);
  main.focus({preventScroll:true});
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
    tapePlayer.innerHTML = header + `<div class="panel-body"><p>For in-app playback, open the <a href="https://georgephilippou.github.io/Portfolio/async-research-terminal/#record/${record === featureTrailer ? featureFilm.id : record.id}">hosted archive record</a>.</p></div>` + footer;
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

const sourceForEvidence = item => item.video === featureTrailer.id ? featureTrailer : byId[item.video];
const evidenceRecordId = item => item.video === featureTrailer.id ? featureFilm.id : item.video;

function evidenceCaption(item,key) {
  const video = sourceForEvidence(item);
  return `<span class="meta">${e(item.kind)} · ${e(item.credit ?? 'Kane Parsons')}</span><p>${e(item.note)}</p><div class="exhibit-links">
    ${playButton(video,item.seconds == null ? 'Play source video' : 'Play from this frame',item.seconds)}
    ${watch(video, `Source tape · ${video.title}`, item.seconds)}
    ${key ? `<a href="${comparisonURL(key)}">Compare frame</a>` : ''}
    ${item.reference ? sourceLink(item.reference, 'Image reference') : ''}
  </div>`;
}

function exhibitGallery(items,heading='Visual evidence') {
  if (!items.length) return '';
  return panel(heading, `<div class="evidence-grid">${items.map(key => {
    const item = evidence[key];
    return `<figure class="exhibit">
      <button class="exhibit-action" data-exhibit="${key}" aria-label="Enlarge ${e(item.title)}">${evidenceImage(item)}</button>
      <figcaption><h3>${e(item.title)}</h3>${evidenceCaption(item,key)}</figcaption>
    </figure>`;
  }).join('')}</div>`, 'doc');
}

function row(record,caption=record.summary,tag=record.release ? dateLabel(record.release) : labels[record.group]) {
  const preview = record === featureFilm ? featureImage : evidence[evidenceFor[record.id]?.[0]];
  return `<a class="record ${preview ? 'has-thumb' : ''}" href="#record/${record.id}">
    ${preview ? evidenceImage(preview,'entry-thumb') : `<span class="record-icon" aria-hidden="true">${symbols[record.group]}</span>`}
    <span class="record-main"><strong>${e(record.title)}</strong><small>${e(caption)}</small>${preview ? `<small class="preview-type">${e(preview.kind)}</small>` : ''}</span><span class="tag">${e(tag)}</span>
  </a>`;
}

function listing(items,empty='No matching records.') {
  return items.length ? `<div class="record-list">${items.map(record => row(record)).join('')}</div>` : `<p class="empty">${e(empty)}</p>`;
}

function overview() {
  const monitor = evidence.model;
  const desk = `<div class="operator-desk">
    <a href="${recentRecord ? '#record/'+recentRecord.id : '#timeline'}"><span class="eyebrow">${recentRecord ? 'Last opened' : 'Release order'}</span><strong>${e(recentRecord?.title ?? 'Browse the tapes')}</strong></a>
    <a href="#questions"><span class="eyebrow">Investigations</span><strong>${investigations.length} open questions</strong></a>
    <a href="#evidence"><span class="eyebrow">Evidence register</span><strong>${Object.keys(evidence).length} source exhibits</strong></a>
    <a href="#map"><span class="eyebrow">Field cartography</span><strong>Inspect the Complex map</strong></a>
    <a href="#compare"><span class="eyebrow">Two source monitors</span><strong>Compare evidence</strong></a>
    <a href="#board"><span class="eyebrow">Case board</span><strong>${memory.pins.length} pinned · ${memory.notes.length} notes</strong></a>
  </div>`;
  return title('KV31 / OPERATIONS','Operator desk','Open a record, trace a survey route, or review two source frames side by side.') +
    `<div class="workstation-desk">
      ${panel('Operations',desk,'desk-panel')}
      <section class="panel monitor briefing-monitor"><div class="panel-bar"><span>DOE Tape Archive</span><span>3283</span></div>
        <div class="screen">${evidenceImage(monitor,'monitor-img',true)}${playButton(byId.present,'Play briefing',monitor.seconds)}</div>
        <div class="monitor-caption"><span>Presentation · ${cueStamp(monitor.seconds)}</span>${recordLink('present','Open tape file')}</div>
      </section>
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
    listing(chosen) + (videoFilter === 'all' ? '<div class="section-line"><h2>Feature film</h2></div>' + listing([featureFilm]) : '');
}

function companionCard(record,label) {
  return `<a href="#record/${record.id}" class="film-companion" data-film="${record.id}">
    ${evidenceImage(evidence['upload-'+record.id])}
    <span><strong>${e(record.title)}</strong><small>${e(label)} · <time datetime="${record.release}">${e(dateLabel(record.release))}</time></small></span>
  </a>`;
}

function filmstrip({id,title,count,columns,options,jumpLabel,caption='',story=false}) {
  return `<section class="panel film-panel${story ? ' story-film-panel' : ''}" aria-label="${e(title)}">
    <div class="panel-bar"><span>${e(title)}</span><span>${e(count)}</span></div>
    <div class="film-tools">
      <button class="button" type="button" data-film-scroll="-1">Scroll left</button>
      <button class="button" type="button" data-film-scroll="1">Scroll right</button>
      <label for="film-jump-${id}">${e(jumpLabel)}</label>
      <select id="film-jump-${id}" data-film-jump><option value="">Choose a record</option>${options.map(([value,label]) =>
        `<option value="${e(value)}">${e(label)}</option>`).join('')}</select>
    </div>
    <div class="film-viewport" data-film-track="${id}" tabindex="0" aria-label="${e(title)} · horizontal track">
      <ol class="film-track">${columns}</ol>
    </div>
    ${caption ? `<div class="monitor-caption film-key">${caption}</div>` : ''}
  </section>`;
}

function releaseFilmstrip() {
  const attached = new Set(companionEdges.map(edge => edge.to));
  const releases = [...videos.filter(record => !attached.has(record.id)), featureFilm].sort((a,b) => a.release.localeCompare(b.release));
  const columns = releases.map(record => {
    if (record === featureFilm) {
      return `<li class="film-column film-feature">
        <div class="film-upper"></div><div class="film-axis"></div>
        <article class="film-card" data-film="${record.id}">
          <a class="film-record" href="#record/feature">${evidenceImage(featureImage)}
            <time datetime="${record.release}">${e(dateLabel(record.release))}</time><strong>${e(record.title)}</strong>
          </a>
          <div class="film-actions">${playButton(featureTrailer,'Trailer')}${recordLink(record.id,'Film file')}</div>
        </article>
      </li>`;
    }
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
  return filmstrip({
    id:'releases', title:'Release filmstrip', count:`${mainTapes.length} main episodes`, columns,
    options:releases.filter(record => mainTapes.includes(record) || record === featureFilm).map(record => [record.id,record.title]),
    jumpLabel:'Jump to release',
    caption:'<span><b>Above</b> · Companion files and supplemental material</span><span><b>Below</b> · Main episodes and the feature film</span>'
  });
}

function storyCard(event) {
  const record = byId[event.video];
  const frame = event.frame ? evidence[event.frame] : featureImage;
  const context = evidence[event.context];
  const when = event.date ? dateLabel(event.date) : 'Date unknown';
  const imageLabel = event.frame ? frame.kind : 'Official trailer image · A24';
  const date = event.date ? `<time datetime="${e(event.date)}">${e(when)}</time>` : `<span class="story-date">${e(when)}</span>`;
  const playback = playButton(record === featureFilm ? featureTrailer : record,
    record === featureFilm ? 'Trailer' : frame.seconds == null ? 'Play source' : 'Play from frame',frame.seconds);
  const related = event.refs.map(id => recordLink(id)).join('');
  return `<li class="film-column story-column">
    <div class="film-upper">${context ? `<button type="button" data-exhibit="${e(event.context)}" aria-label="Enlarge ${e(context.title)}" class="film-companion story-context">
      ${evidenceImage(context)}<span><strong>${e(context.title)}</strong><small>${e(context.kind)}</small></span>
    </button>` : ''}</div>
    <div class="film-axis"></div>
    <article class="film-card" data-film="${event.id}">
      <a class="film-record" href="#record/${record.id}">
        ${evidenceImage(frame)}<span class="story-image-label">${e(imageLabel)}</span>
        ${date}<strong>${e(event.title)}</strong>
      </a>
      <div class="story-incident"><span class="tag">${e(event.basis)}</span><p>${e(event.note)}</p>
        <div class="story-related">${related}${event.source ? sourceLink(event.source[1],event.source[0]) : ''}</div>
      </div>
      <div class="film-actions">${playback}${recordLink(record.id,record === featureFilm ? 'Film file' : 'Tape briefing')}${event.frame && frame.seconds != null ? `<button class="button" type="button" data-exhibit="${event.frame}">Enlarge frame</button>` : ''}</div>
    </article>
  </li>`;
}

function storyChronology() {
  const dated = [];
  const relative = [];
  const undated = [];
  for (const event of allEvents) {
    if (!event.date) undated.push(event);
    else if (event.group === 'relative' || event.basis.startsWith('Relative date')) relative.push(event);
    else dated.push(event);
  }
  const sortDate = event => event.id === 'clyde-calls-beck' ? '1990-05-08' : event.date;
  dated.sort((a,b) => sortDate(a).localeCompare(sortDate(b)));
  const groups = [
    {id:'dated',title:'Dated incidents and records',events:dated,
      caption:'<span><b>Above</b> · Context and comparison frames</span><span><b>Below</b> · Incidents ordered by the best available date</span>'},
    {id:'relative',title:'Approximate dates and sequences',events:relative,
      caption:'The film has an approximate year. Its position relative to the dated A-Sync tapes is open.'},
    {id:'undated',title:'Unplaced incidents and files',events:undated,
      caption:'Some incidents have a known local sequence. Their position in the wider chronology is open.'}
  ];
  return groups.map(group => filmstrip({
    id:group.id, title:group.title, count:`${group.events.length} records`, story:true,
    columns:group.events.map(storyCard).join(''),
    options:group.events.map(event => [event.id,`${event.date ? dateLabel(event.date) + ' · ' : ''}${event.title}`]),
    jumpLabel:'Jump to incident', caption:group.caption
  })).join('');
}

function timeline(mode) {
  const isStory = mode === 'story';
  return title('ARCHIVE / CHRONOLOGY','Timeline',isStory ? 'Trace civilian entries, A-Sync’s experiments and surveys, and sightings across the tapes and the feature film.' : 'Follow the main series and feature film in release order. Linked files sit above their related episodes, while standalone supplements sit between releases.') +
    `<nav class="toolbar timeline-switch" aria-label="Timeline order"><a class="button" href="#timeline/release" ${isStory ? '' : 'aria-current="page"'}>YouTube release order</a><a class="button" href="#timeline/story" ${isStory ? 'aria-current="page"' : ''}>In-story chronology</a></nav>` +
    (isStory ? storyChronology() : releaseFilmstrip());
}

function jumpToFilm(panel,id) {
  const item = [...panel.querySelectorAll('[data-film]')].find(card => card.dataset.film === id);
  if (!item) return null;
  const viewport = panel.querySelector('.film-viewport');
  viewport.scrollLeft += item.getBoundingClientRect().left - viewport.getBoundingClientRect().left - 14;
  const select = panel.querySelector('[data-film-jump]');
  if ([...select.options].some(option => option.value === id)) select.value = id;
  return item;
}

function showTimelineTarget(id) {
  for (const panel of main.querySelectorAll('.film-panel')) {
    const item = jumpToFilm(panel,id);
    if (item) {
      panel.scrollIntoView({block:'nearest'});
      return;
    }
  }
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

function routePanel(route) {
  return `<section class="panel doc">
    <div class="panel-bar">${e(route.title)}</div><div class="route route-bg">${route.nodes.map(([id,label,type],index) => `<a href="#record/${id}"><span class="tag">STOP ${index+1}</span><strong>${e(label)}</strong><small>${e(type)}</small></a>`).join('')}</div>
    <div class="monitor-caption">${e(route.description)}</div></section>`;
}

function dossierIndex(group) {
  const header = {
    people:['FILES / PERSONNEL','Personnel dossiers','Trace people and organisations across field tapes, narration, and internal records.'],
    locations:['SURVEY / ROUTE FRAGMENTS','Complex survey','Explore the order of spaces shown in each tape. The diagrams represent routes with unknown scale and orientation.'],
    entities:['FIELD RECORDS / LIFEFORM ACTIVITY','Sighting register','Review encounters one by one and follow the original recordings. Possible matches are marked as hypotheses.']
  }[group];
  const diagrams = group === 'locations' ? [...routes,featureRoute].map(routePanel).join('') : '';
  return title(...header) + (diagrams ? `<div class="toolbar">${button('Open Complex map','#map')}</div>` : '') +
    (group === 'people' ? personnelDirectory() : listing(allDossiers.filter(record => record.group === group))) +
    (diagrams ? '<div class="section-line"><h2>Survey routes</h2></div>' + diagrams : '');
}

function questionList(items) {
  return `<div class="question-grid">${items.map(question => `<a class="question-card" href="#questions/${question.id}">
    <small class="eyebrow">${e(question.topic)} · ${e(question.status)}</small>
    <strong>${e(question.title)}</strong><p>${e(question.known)}</p>
  </a>`).join('')}</div>`;
}

function questionsPage(id) {
  const question = investigations.find(item => item.id === id);
  if (!question) {
    const topics = [...new Set(investigations.map(item => item.topic))];
    return title('KV31 / UNRESOLVED CASES','Open questions','Review the evidence for each lead, the gaps in the record, and what to check next.') +
      topics.map(topic => `<section class="question-group"><h2>${e(topic)}</h2>${questionList(investigations.filter(item => item.topic === topic))}</section>`).join('');
  }
  return `<p class="file-path"><a href="#questions">Open questions</a><span aria-hidden="true">/</span>${e(question.topic)}</p>` +
    title('KV31 / RESTRICTED CASE REVIEW',question.title) +
    `<div class="file-meta"><span class="file-status">${e(question.status)}</span><a href="#timeline/story/${question.event}">View on chronology</a></div>` +
    `<div class="question-file">${panel('Evidence on file',`<p>${e(question.known)}</p>`,'doc')}
      ${panel('What remains open',`<p>${e(question.unknown)}</p>`,'doc unresolved')}
      ${panel('Review next',`<p>${e(question.next)}</p>`,'doc')}</div>` +
    exhibitGallery([question.frame],'Source exhibit') +
    '<div class="section-line"><h2>Connected records</h2></div>' + listing(question.refs.map(id => byId[id]));
}

function evidenceRegister(id) {
  const sources = [...videos,featureFilm];
  const active = sources.find(record => record.id === id);
  const allFrames = Object.keys(evidence).sort((a,b) => Number(evidence[b].seconds != null) - Number(evidence[a].seconds != null));
  const files = active ? (evidenceFor[active.id] ?? []) : allFrames;
  const linked = ['fault','simpsons','remember'].map(id => recordLink(id)).join(' · ');
  return title('KV31 / EVIDENCE REGISTER','Evidence register','Browse source frames, diagrams, upload thumbnails, and creator artwork by their originating file.') +
    `<details class="panel doc archive-coverage"><summary class="panel-bar">Catalogue coverage · 22 Nov 2026</summary>
      <div class="panel-body"><p>All 23 entries visible in the public playlist were matched to records. The register also holds three web files outside that playlist’s public listing and the 2026 feature film.</p>
      <p>${linked}</p><p>Upload descriptions and links are recorded where identified. Comments and incidental frame details have partial coverage.</p>
      <p>${sourceLink(officialPlaylist,'Official playlist')} · ${recordLink('feature','Feature film file')}</p></div></details>` +
    `<div class="toolbar"><label for="evidence-source">Source file</label>
      <select id="evidence-source"><option value="">All source files</option>${sources.map(record => `<option value="${record.id}" ${record === active ? 'selected' : ''}>${e(record.title)}</option>`).join('')}</select>
      <span class="meta muted">${files.length} exhibits</span>${active ? recordLink(active.id,'Open source file') : ''}</div>` +
    exhibitGallery(files,active ? active.title : 'Indexed exhibits');
}

function fileFrame(record) {
  const key = personnelFileNotes[record.id]?.frame ?? record.frame ?? evidenceFor[record.id]?.[0];
  return evidence[key] ? key : null;
}

function personnelDirectory() {
  const groups = ['A-Sync personnel','Civilian recordings','Missing and recovered','Feature film','Organisation'];
  return groups.map(section => {
    const people = allDossiers.filter(record => record.group === 'people' &&
      (record.section ?? personnelFileNotes[record.id]?.section ?? (record.filmSources ? 'Feature film' : 'A-Sync personnel')) === section);
    return `<section class="personnel-group"><h2>${e(section)}</h2><div class="personnel-grid">${people.map(record => {
      const frame = evidence[fileFrame(record)];
      const status = personnelFileNotes[record.id]?.status ?? record.status;
      return `<a class="person-card" href="#record/${record.id}">
        ${frame ? evidenceImage(frame) : '<span class="person-placeholder" aria-hidden="true">◇</span>'}
        <span><strong>${e(record.title)}</strong><small>${e(record.type)}</small><small>${e(status)}</small></span>
      </a>`;
    }).join('')}</div></section>`;
  }).join('');
}

function connectionCard(edge, showSource=true) {
  return `<article class="connection"><span class="tag ${edge.status === 'Hypothesis' ? 'warning' : ''}">${e(edge.status)}</span><h3>${e(edge.kind)}</h3><p>${recordLink(edge.from)} <span aria-hidden="true">↔</span> ${recordLink(edge.to)}</p><p class="muted">${e(edge.note)}</p>
    ${showSource && edge.kind === 'Description link' ? `<small>${edge.status === 'Documented' ? watch(byId[edge.from],'Source video description') : sourceLink('https://kanepixelsbackrooms.fandom.com/wiki/Backrooms_-_Presentation','Episode reference')}</small>` : ''}</article>`;
}

function connections() {
  const center = byId[mapRecord];
  const mapEdges = allEdges.filter(edge => edge.from === mapRecord || edge.to === mapRecord);
  const links = mapEdges.map(edge => {
    const other = byId[edge.from === mapRecord ? edge.to : edge.from];
    return `<div class="map-branch"><span class="tag">${e(edge.kind)}</span><a href="#record/${other.id}">${e(other.title)}</a><small class="muted">${e(edge.status)}</small></div>`;
  });
  const mapIds = [...new Set(allEdges.flatMap(edge => [edge.from, edge.to]))];
  const map = panel('Relationship map', `<div class="toolbar"><label for="map-record">Inspect neighbours</label><select id="map-record">${mapIds.map(id => `<option value="${id}" ${id === mapRecord ? 'selected' : ''}>${e(byId[id].title)}</option>`).join('')}</select></div><div class="relationship-map route-bg"><div class="map-anchor">${recordLink(center.id)}</div><div class="map-branches">${links.join('')}</div></div>`,'doc');
  const statuses = ['all',...new Set(allEdges.map(edge => edge.status))];
  const matches = allEdges.filter(edge => edgeFilter === 'all' || edge.status === edgeFilter);
  return title('ANALYSIS / CROSS-REFERENCES','Connections','Follow a documented link, compare two views of an incident, or inspect an open hypothesis.') + map + '<div class="section-line"><h2>Evidence register</h2></div>' +
    `<div class="toolbar"><label for="edge-type">Evidence status</label><select id="edge-type">${statuses.map(status => `<option value="${e(status)}" ${status === edgeFilter ? 'selected' : ''}>${e(status === 'all' ? 'All connections' : status)}</option>`).join('')}</select><span class="meta muted">${matches.length} connections</span></div><div class="guide">${matches.map(edge => connectionCard(edge)).join('')}</div>`;
}

function briefingPanel(record) {
  const briefing = briefingFor(record);
  const points = briefing.points.map(([heading,description,...sources]) => {
    const links = sources.map(([id,seconds]) => {
      const source = byId[id];
      if (seconds != null) return playButton(source,`${source.title} · ${cueStamp(seconds)}`,seconds);
      if (id === record.id) return watch(source,'Original video');
      return recordLink(id);
    });
    return `<li><h4>${e(heading)}</h4><p>${e(description)}</p><div class="briefing-sources">${links.join('')}</div></li>`;
  }).join('');
  return panel('Entry briefing',`
    <div class="briefing-why"><h3>Why it matters</h3><p>${e(briefing.why)}</p></div>
    <div class="briefing-findings"><h3>Key information</h3><ul class="briefing-points">${points}</ul></div>
    ${briefing.open ? `<div class="briefing-open"><h3>What remains open</h3><p>${e(briefing.open)}</p></div>` : ''}
  `,'doc briefing');
}

function recordPage(record,requestedSection) {
  const isVideo = record.group === 'videos';
  const isFeature = record === featureFilm;
  const profile = personnelFileNotes[record.id];
  const frameKey = fileFrame(record);
  const frame = evidence[frameKey];
  const frames = [...new Set([frameKey,...(evidenceFor[record.id] ?? [])].filter(Boolean))];
  const related = allEdges.filter(edge => edge.from === record.id || edge.to === record.id);
  const references = isVideo ? allDossiers.filter(entry => entry.refs.includes(record.id)) : record.refs.map(id => byId[id]);
  const sceneList = moments[record.id] ?? [];
  const recordEvents = allEvents.filter(event => event.video === record.id || event.refs.includes(record.id));
  const leads = investigations.filter(question => question.refs.includes(record.id));
  const review = fileReviewNotes[record.id];
  const pin = memory.pins.includes(record.id);
  const mapArea = surveyAreas.find(area => area.id === record.id || area.stages.some(stage=>stage.video === record.id));
  const mapStage = mapArea?.stages.find(stage=>stage.video === record.id)?.id ?? mapArea?.start;
  const fileURL = `#record/${record.id}`;
  const sections = [['','Briefing'],['evidence','Evidence'],['chronology','Chronology'],['connections','Connections']];
  const section = sections.some(([id]) => id === requestedSection) ? requestedSection : '';
  const groupURL = `#${record.group}`;
  const groupName = tabs.find(([key]) => key === record.group)?.[2] ?? labels[record.group];
  const counterparts = profile?.counterparts?.map(id => recordLink(id)).join('');
  const toolbar = `<div class="toolbar file-actions">
    ${isVideo ? playButton(record) : ''}${isVideo ? watch(record) : ''}
    ${mapArea ? button('Locate in Complex map',`#map/${mapArea.id}/${mapStage}`) : ''}
    <button class="button" data-pin="${record.id}" aria-pressed="${pin}">${pin ? 'Pinned to case board' : 'Pin to case board'}</button>
  </div>`;
  const header = `<header class="file-header">
    <p class="file-path"><a href="#overview">Operator desk</a><span aria-hidden="true">/</span><a href="${groupURL}">${e(groupName)}</a></p>
    <div class="file-classification"><span>KV31 · ${e(labels[record.group].toUpperCase())} / ${e(record.id.toUpperCase())}</span><span>RESTRICTED · A-SYNC PERSONNEL</span></div>
    <h1>${e(record.title)}</h1>
    <div class="file-meta"><span>${e(record.type)}</span>
      ${record.release ? `<span>${isFeature ? 'Theatrical release' : 'Uploaded'} · ${e(dateLabel(record.release))}</span><span>${e(record.duration)}</span>` : ''}
      ${profile?.status || record.status ? `<span class="file-status">${e(profile?.status ?? record.status)}</span>` : ''}
    </div>
  </header>`;
  const nav = `<nav class="file-tabs" aria-label="File sections">${sections.map(([id,label]) =>
    `<a href="${fileURL}${id ? '/' + id : ''}" ${section === id ? 'aria-current="page"' : ''}>${e(label)}</a>`).join('')}</nav>`;
  const content = {
    '': () => `<section class="panel file-summary${frame && !isFeature ? ' has-file-frame' : ''}" aria-label="File summary">
      <div class="panel-body"><h2>${record.group === 'people' && record.id !== 'async' ? 'Profile' : 'Summary'}</h2><p>${e(record.summary)}</p>
      ${counterparts ? `<div class="file-associates"><strong>Associated personnel</strong><div class="briefing-sources">${counterparts}</div></div>` : ''}
      </div>${frame && !isFeature ? `<figure class="file-frame"><button class="exhibit-action" type="button" data-exhibit="${frameKey}" aria-label="Enlarge ${e(frame.title)}">${evidenceImage(frame,'',true)}</button>
      <figcaption>${e(frame.title)} · ${e(frame.kind)}</figcaption></figure>` : ''}
    </section>` + (isFeature ? featureMedia() : '') + briefingPanel(record) + (isFeature ? featureEvidence() : '') +
      (leads.length ? '<div class="section-line"><h2>Open questions tied to this file</h2></div>' + questionList(leads) : ''),
    evidence: () => (review ? panel('Source assessment',`<span class="tag">${e(review[0])}</span><p>${e(review[1])}</p>
      <div class="briefing-sources">${review[2].map(id => recordLink(id)).join('')}</div>`,'doc') : '') +
      exhibitGallery(frames) +
      (sceneList.length ? panel('Scene notes',sceneList.map(scene => `<article class="scene"><span class="tag">${e(scene.label)}</span><h3>${e(scene.title)}</h3><p>${e(scene.note)}</p>
        ${scene.seconds == null ? '' : playButton(record,'Play from this cue',scene.seconds)}${scene.reference ? `<small> · ${sourceLink(scene.reference,'Cue reference')}</small>` : ''}</article>`).join(''),'doc') : '') +
      (!frames.length && !sceneList.length ? '<p class="empty">The available sources for this file are listed in the source register.</p>' : '') +
      (isVideo || isFeature ? `<p>${button('Browse in evidence register',`#evidence/${record.id}`)}</p>` : ''),
    chronology: () => recordEvents.length ? panel('Incident trail', recordEvents.map(event => `<article class="file-event">
      <div><span class="tag">${e(dateLabel(event.date))} · ${e(event.basis)}</span><h3>${e(event.title)}</h3><p>${e(event.note)}</p>
      <a href="#timeline/story/${event.id}">View on chronology</a></div>
      ${event.frame ? evidenceImage(evidence[event.frame]) : ''}</article>`).join(''),'doc') :
      '<p class="empty">The available evidence gives this file no position on the incident timeline.</p>',
    connections: () => (related.length ? panel('Connections',related.map(edge => connectionCard(edge)).join(''),'doc') : '') +
      (references.length ? `<div class="section-line"><h2>${isVideo ? 'Referenced dossiers' : 'Referenced records'}</h2></div>${listing(references)}` : '') +
      (leads.length ? '<div class="section-line"><h2>Open questions</h2></div>' + questionList(leads) : '') +
      (!related.length && !references.length && !leads.length ? '<p class="empty">Cross-references are awaiting review.</p>' : '')
  };
  return header + toolbar + nav + (isVideo && !section ? tapeNavigation(record) : '') + content[section]();
}

function featureMedia() {
  return panel('A24 · theatrical release', `<div class="feature-media">
    ${evidenceImage(featureImage,'feature-image',true)}
    <div><p>Kane Parsons · Director<br>Will Soodik · Screenwriter</p>
    <div class="toolbar">${playButton(featureTrailer,'Play official trailer')}${sourceLink(featureSources.release[1],'Official viewing options')}</div>
    <small>Trailer image · A24</small></div>
  </div>`,'doc');
}

function featureEvidence() {
  const people = featureDossiers.filter(record => record.group === 'people');
  const sightings = featureDossiers.filter(record => record.group === 'entities');
  const spoilers = featureSpoilers.map(([heading,note,refs]) => `<article class="scene"><h3>${e(heading)}</h3><p>${e(note)}</p>
    <div class="briefing-sources">${refs.map(id => recordLink(id)).join('')}</div></article>`).join('');
  return '<div class="section-line"><h2>Feature personnel</h2></div>' + listing(people) + routePanel(featureRoute) +
    `<details class="panel doc feature-spoilers"><summary class="panel-bar">Feature spoilers · sightings and ending</summary>
    <div class="panel-body">${listing(sightings)}${spoilers}<p>${sourceLink(featureSources.ending[1],featureSources.ending[0])}</p></div></details>`;
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
  const words = query.split(/\s+/);
  const results = query ? records.filter(record => {
    const briefing = briefingFor(record);
    const context = [
      record.title, record.id, record.type, record.summary, record.release, dateLabel(record.release),
      briefing.why, briefing.open, briefing.status ?? record.status, ...briefing.points.flatMap(([heading,description]) => [heading,description]),
      ...allEvents.filter(event => event.video === record.id).flatMap(event => [event.date,event.title]),
      ...(record.refs ?? []).map(id => byId[id].title)
    ].join(' ').toLowerCase();
    return words.every(word => context.includes(word));
  }) : [];
  const leads = query ? investigations.filter(question => {
    const context = [question.title,question.topic,question.known,...question.refs.map(id => byId[id].title)].join(' ').toLowerCase();
    return words.every(word => context.includes(word));
  }) : [];
  return title('ARCHIVE / QUERY','Search archive',query ? `${results.length + leads.length} results for “${search.value.trim()}”` : 'Enter a name, video, location, or date.') +
    (results.length ? '<div class="section-line"><h2>Records</h2></div>' + listing(results) : '') +
    (leads.length ? '<div class="section-line"><h2>Open questions</h2></div>' + questionList(leads) : '') +
    (query && !results.length && !leads.length ? '<p class="empty">No matching records or questions.</p>' : '');
}

function recordInspector(record) {
  const isVideo = record.group === 'videos';
  if (record.filmSources) {
    const sources = record.filmSources.map(key => {
      const [label,url] = featureSources[key];
      return sourceLink(url,label);
    }).join('');
    return panel('Film sources',`<div class="source-list">${sources}</div>`);
  }
  const source = isVideo ? watch(record) : '';
  const refs = isVideo ? '' : record.refs.map(id => `<span>${watch(byId[id],byId[id].title)}</span>`).join('');
  const reference = briefingFor(record).reference;
  const descriptive = allEdges.filter(edge => edge.from === record.id && edge.kind === 'Description link');
  return panel('Source register',`<div class="source-list">${source}${refs}${reference ? sourceLink(reference,'Record reference notes') : ''}${sourceLink(catalogSource,'Episode catalogue')}${sourceLink(chronologySource,'Secondary chronology')}${record.id === 'ff1' ? sourceLink(footageSource,'Found Footage scene reference') : ''}</div>`) +
    (isVideo ? panel('YouTube metadata',descriptive.length ? descriptive.map(edge => `<p><span class="tag">${e(edge.status)}</span> · ${recordLink(edge.to)}</p>`).join('') + '<p class="muted">Pinned and viewer comments are awaiting review.</p>' : '<p class="muted">Description and comment coverage varies by file. Open the upload to inspect the current page.</p>') : '');
}

function dashboardInspector() {
  const sampleEvents = ['1972-08-02','1989-10-17','1990-05-08','1996-09-23'].map(date => allEvents.find(event => event.date === date));
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
  const isFilmstrip = page === 'timeline';
  const isSurvey = page === 'map';
  const isCompare = page === 'compare';
  const fullWidth = isFilmstrip || isSurvey || isCompare || page === 'evidence' || page === 'questions';
  for (const track of main.querySelectorAll('[data-film-track]')) filmScroll.set(track.dataset.filmTrack,track.scrollLeft);
  const entry = page === 'feature' ? featureFilm : (page === 'record' ? byId[id] : null);
  const active = entry?.group ?? page;
  const views = {overview, videos:videoArchive, timeline:()=>timeline(id), map:()=>surveyMap(id,stage) + routePanel(featureRoute), compare:()=>comparisonView(id,stage), people:()=>dossierIndex('people'),
    locations:()=>dossierIndex('locations'), entities:()=>dossierIndex('entities'),
    links:connections, board, search:searchResults, questions:()=>questionsPage(id), evidence:()=>evidenceRegister(id)};
  nav.innerHTML = navigation.map(([group,entries])=>`<div class="nav-section"><span class="nav-heading">${group}</span>${entries.map(([key,symbol,label]) =>
    `<a class="nav" href="#${key}" ${key === active ? 'aria-current="page"' : ''}><i aria-hidden="true">${symbol}</i>${label}</a>`
  ).join('')}</div>`).join('');
  main.innerHTML = entry ? recordPage(entry,stage) : (Object.hasOwn(views,page) ? views[page]() : title('ARCHIVE','Record unavailable') + button('Return to overview','#overview'));
  document.querySelector('#workspace-context').textContent = entry ? `${labels[entry.group]} / ${entry.title}` :
    tabs.find(([key])=>key===page)?.[2] ?? (page === 'search' ? 'Search archive' : 'Records');
  main.parentElement.classList.toggle('film-workspace', fullWidth);
  inspector.hidden = fullWidth;
  if (isSurvey) initSurvey(id,stage);
  if (isFilmstrip) {
    for (const track of main.querySelectorAll('[data-film-track]')) track.scrollLeft = filmScroll.get(track.dataset.filmTrack) ?? 0;
    if (stage) showTimelineTarget(stage);
  } else if (!fullWidth) {
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
  if (lightbox.open) lightbox.close();
  resultsMessage = '';
  render();
  const [page,,stage] = location.hash.slice(1).split('/');
  if (!(page === 'timeline' && stage)) window.scrollTo(0,0);
  if (compareFocus && location.hash.startsWith('#compare/')) {
    main.querySelector('#compare-'+compareFocus)?.focus({preventScroll:true});
  } else if (location.hash !== '#search') main.focus({preventScroll:true});
  compareFocus = '';
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
  const record = play.dataset.play === featureTrailer.id ? featureTrailer : byId[play.dataset.play];
  if (!record?.yt) return;
  if (lightbox.open) lightbox.close();
  openTape(record,Number(play.dataset.start));
});
main.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  const {filmScroll:scrollDirection,videoFilter:filter,pin,deleteNote,exhibit,comparePin} = control.dataset;
  if (comparePin) {
    memory.pins = [...new Set([...memory.pins,...comparePin.split('/').filter(id=>Object.hasOwn(byId,id))])];
    save();
    main.querySelector('#compare-state').textContent = storageAvailable ? 'Source records pinned.' : 'Pinned for this session.';
    return;
  }
  if (scrollDirection) {
    const viewport = control.closest('.film-panel').querySelector('.film-viewport');
    viewport.scrollBy({left:Number(scrollDirection)*viewport.clientWidth*.8});
    return;
  }
  if (exhibit) {
    event.preventDefault();
    const item = evidence[exhibit];
    lightbox.innerHTML = `<div class="panel-bar"><span id="exhibit-title">${e(item.title)}</span><button class="button" data-close-exhibit autofocus>Close</button></div>
      ${evidenceImage(item,'',true)}<div class="panel-body">${evidenceCaption(item,exhibit)}</div>`;
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
  const {compareSide,peer} = event.target.dataset;
  if (compareSide) {
    compareFocus = compareSide;
    location.hash = compareSide === 'A' ? comparisonURL(value,peer) : comparisonURL(peer,value);
    return;
  }
  if (event.target.hasAttribute('data-film-jump')) {
    jumpToFilm(event.target.closest('.film-panel'),value);
    return;
  }
  if (id === 'evidence-source') {
    location.hash = value ? `evidence/${value}` : 'evidence';
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
