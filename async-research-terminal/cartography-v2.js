const sheetWidth = 880;
const sheetHeight = 500;

const surveyLandmarks = {
  gate: ['Threshold', 315, 408, 'threshold', 'The engineered doorway joins the facility side to the yellow corridor. Its placement along the edge of the chamber comes from the labelled camera plan.'],
  c1: ['Camera 1', 329, 320, 'motion', 'The plan shows Camera 1 next to the Threshold, aimed along the highlighted lane.'],
  c2: ['Camera 2', 507, 330, 'motion', 'Camera 2 appears to the right of the Threshold in the close diagram. This marker indicates its side of the survey, with schematic spacing.'],
  chamber: ['Main Chamber', 610, 150, 'yellow', 'The wide diagram shows a repeating grid of cross-shaped pillars. This trace covers the visible chamber edge and the marked lane.'],
  barrier: ['Approach', 161, 250, 'division', 'A-Sync can control access at the partition. Report shows the barrier being fitted and Reunion shows an opening made for the rover.'],
  pits: ['Room 14D', 425, 250, 'division', 'A bank of rectangular pits separates the approach from the far door. The route changes when the crew lays a walkway over the openings.'],
  far: ['Far door', 715, 150, 'division', 'A doorway at the far side of the pit room appears in Pitfalls. Static Dead End follows the survey beyond it.'],
  roomc: ['Room 14C', 690, 305, 'reunion', 'A separate team surveys Room 14C while the walkway is assembled. A flashlight reveals map-like wall markings. The route and distance from the pit room are uncertain.'],
  street: ['Red-lit street', 677, 385, 'street', 'Marvin reaches the street after falling through a pit. The descent establishes a sequence with unknown depth and bearings.'],
  interior: ['Beyond the door', 718, 327, 'static', 'The follow-up tape passes the far door into irregular spaces with recesses and objects intersecting the floor and walls.']
};

function surveyMarkers(area,stage) {
  if (area === 'threshold') {
    return (stage.id === 'motion' ? ['gate','c1','c2','chamber'] : ['gate','chamber'])
      .map(key => [key,...surveyLandmarks[key]]);
  }
  if (area === 'division') {
    const extra = {pit:['street'],report:[],reunion:['roomc'],static:['interior']}[stage.id];
    return ['barrier','pits','far',...extra].map(key => [key,...surveyLandmarks[key]]);
  }
  return stage.stops.map(([label,id],index) =>
    [String(index),label,125 + index * 630 / (stage.stops.length - 1),250,id,byId[id].summary]
  );
}

function selectSurvey(areaId,stageId) {
  const area = surveyAreas.find(item => item.id === areaId) ?? surveyAreas[0];
  const stage = area.stages.find(item => item.id === stageId) ?? area.stages.find(item => item.id === area.start);
  return {area,stage,markers:surveyMarkers(area.id,stage)};
}

function surveyMap(areaId,stageId) {
  const {area,stage,markers} = selectSurvey(areaId,stageId);
  const tape = byId[stage.video];
  const mode = area.id === 'threshold' && stage.id === 'motion' ? 'Redrawn from the camera plan' :
    area.id === 'threshold' ? 'March plan shown for orientation' : 'Recorded route schematic';
  return title('PROJECT KV31 / FIELD CARTOGRAPHY','Complex map','Select a survey tape, inspect a landmark, and compare the drawing with the original recording.') +
    `<div class="survey-console">
      <nav aria-label="Map area" class="survey-tabs">${surveyAreas.map(item => `<a class="button" href="#map/${item.id}/${item.start}" ${item.id === area.id ? 'aria-current="true"' : ''}>${e(item.title)}</a>`).join('')}</nav>
      <nav aria-label="Map recordings" class="survey-timeline">${area.stages.map(item => `<a href="#map/${area.id}/${item.id}" ${item.id === stage.id ? 'aria-current="true"' : ''}><span class="meta">${e(item.when)}</span><strong>${e(item.label)}</strong><span>${e(byId[item.video].title)}</span></a>`).join('')}</nav>
      <div class="survey-console-grid">
        <section class="panel survey-sheet" aria-label="Survey drawing">
          <div class="panel-bar"><span>${e(area.title)}</span><span>${e(mode)}</span></div>
          <div class="survey-tools" aria-label="Map zoom">
            <button class="button" type="button" data-survey-zoom="out" aria-label="Zoom out">−</button>
            <button class="button" type="button" data-survey-zoom="in" aria-label="Zoom in">+</button>
            <button class="button" type="button" data-survey-zoom="fit">Fit</button>
            <output id="survey-scale" aria-live="polite">100%</output>
          </div>
          <div class="survey-scroll" tabindex="0" aria-label="Survey drawing. Scroll or drag when zoomed.">
            <div class="survey-world"><canvas id="survey-canvas" width="${sheetWidth * 2}" height="${sheetHeight * 2}" aria-hidden="true"></canvas>
              ${markers.map(([key,label,x,y]) => `<button type="button" class="survey-pin" data-survey-pin="${key}" style="--x:${x / sheetWidth * 100}%;--y:${y / sheetHeight * 100}%" aria-pressed="false"><span></span>${e(label)}</button>`).join('')}
            </div>
          </div>
          <div class="survey-key"><span><i class="survey-key-line"></i>Visible trace / landmark</span><span><i class="survey-key-line approx"></i>Approximate route / later reference</span><span>Scale &amp; bearings unknown</span></div>
        </section>
        <aside class="survey-context" aria-label="Survey evidence">
          ${panel('Landmark', '<div id="survey-landmark" aria-live="polite"></div>')}
          ${panel('Source monitor', `<div id="survey-source"></div><div class="survey-source-strip" aria-label="Source frames">${stage.frames.map(key => `<button type="button" class="survey-source-pick" data-survey-source="${key}" aria-label="${e(evidence[key].title)}" aria-pressed="false">${evidenceImage(evidence[key])}</button>`).join('')}</div>`)}
        </aside>
      </div>
      ${panel('Survey changes',`<h2>${e(tape.title)}</h2><p>${e(stage.change)}</p><p class="muted">${e(stage.limit)}</p><div class="toolbar survey-actions">${recordLink(tape.id,'Open tape briefing')}${sourceLink('https://imgur.com/a/maps-of-kane-pixels-backrooms-KLYW2Xk','Community reconstruction')}</div>`,'doc survey-changes')}
    </div>`;
}

function drawSurvey(area,stage,markers,selected) {
  const ctx = document.querySelector('#survey-canvas').getContext('2d');
  ctx.setTransform(2,0,0,2,0,0);
  ctx.fillStyle = '#111d39';
  ctx.fillRect(0,0,sheetWidth,sheetHeight);
  ctx.lineWidth = 1;
  for (let x = 0; x <= sheetWidth; x += 20) {
    ctx.strokeStyle = x % 100 ? '#223050' : '#334264';
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,sheetHeight); ctx.stroke();
  }
  for (let y = 0; y <= sheetHeight; y += 20) {
    ctx.strokeStyle = y % 100 ? '#223050' : '#334264';
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(sheetWidth,y); ctx.stroke();
  }
  ctx.strokeStyle = '#4c6084';
  ctx.strokeRect(24,28,832,432);
  ctx.font = '700 15px Courier New';
  ctx.fillStyle = '#b8c8e5';
  ctx.fillText(area === 'unplaced' ? 'Route order only' : area === 'division' ? 'Division 14 / local survey' : 'Lateral Division A / Threshold approach',42,54);

  function line(points,color,dashed=false,width=2) {
    ctx.strokeStyle=color; ctx.lineWidth=width;
    ctx.setLineDash(dashed ? [7,6] : []);
    ctx.beginPath();
    points.forEach(([x,y],index)=>index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.stroke(); ctx.setLineDash([]);
  }

  if (area === 'threshold') {
    const live = stage.id === 'motion';
    const outline = live ? '#7da9cf' : '#506089';
    const laneTop = stage.id === 'first' ? 348 : 77;
    ctx.fillStyle = live ? '#c39c342d' : '#b49a3d19';
    ctx.fillRect(268,laneTop,96,332-(laneTop-77));
    line([[268,laneTop],[268,409]],'#e4bc65',!live);
    line([[364,laneTop],[364,409]],'#e4bc65',!live);
    const columns = [110,249,391,533,676,817];
    for (const y of [107,204,301]) {
      for (const x of columns) {
        const short=8, long=22;
        const points=[[x-short,y-long],[x+short,y-long],[x+short,y-short],[x+long,y-short],
          [x+long,y+short],[x+short,y+short],[x+short,y+long],[x-short,y+long],
          [x-short,y+short],[x-long,y+short],[x-long,y-short],[x-short,y-short],[x-short,y-long]];
        line(points,outline,!live,1.5);
      }
    }
    let boundary = [[45,410]];
    for (const x of columns) {
      boundary.push([x-19,410],[x-19,401],[x-9,401],[x-9,388],[x+9,388],[x+9,401],[x+19,401],[x+19,410]);
    }
    boundary.push([836,410]);
    line(boundary,outline,false,2);
    line([[283,412],[345,412]],'#a3dba5',false,5);
    ctx.fillStyle='#b8c8e5'; ctx.fillText('A-SYNC FACILITY SIDE',42,443);
    if (live) {
      line([[329,320],[329,112]],'#d9ad60',true,1.6);
      line([[507,330],[413,205]],'#d9ad60',true,1.6);
    }
  } else if (area === 'division') {
    ctx.strokeStyle='#86a9cd'; ctx.lineWidth=3;
    ctx.strokeRect(289,108,264,278);
    for (let row=0;row<7;row++) {
      for (let col=0;col<5;col++) {
        const x=310+44*col, y=130+33*row;
        ctx.fillStyle='#0a1328'; ctx.fillRect(x,y,34,25);
        ctx.strokeStyle='#58779e'; ctx.lineWidth=1; ctx.strokeRect(x,y,34,25);
      }
    }
    line([[66,250],[288,250]],'#8fa3c4',true);
    line([[554,150],[716,150]],'#8fa3c4',true);
    if (stage.id === 'report') {
      line([[197,207],[197,293]],'#fab17f',false,6);
      line([[181,236],[213,265]],'#fab17f');
    }
    if (stage.id === 'reunion' || stage.id === 'static') {
      line([[289,250],[552,250]],'#e4bc65',false,9);
      line([[295,240],[546,240]],'#e4bc6570',false,2);
      line([[295,260],[546,260]],'#e4bc6570',false,2);
    }
    if (stage.id === 'reunion') line([[215,250],[215,426],[690,426],[690,305]],'#8fa3c4',true);
    if (stage.id === 'pit') line([[440,310],[440,411],[678,411],[678,385]],'#d9ad60',true);
    if (stage.id === 'static') line([[715,150],[715,327]],'#8fa3c4',true);
  } else {
    line(markers.map(([, ,x,y])=>[x,y]),'#a2c8e8',true,3);
  }
  const [, ,x,y] = selected;
  ctx.strokeStyle='#f2c76a';
  ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(x,y,13,0,Math.PI*2); ctx.stroke();
}

function initSurvey(areaId,stageId) {
  const {area,stage,markers} = selectSurvey(areaId,stageId);
  const view = document.querySelector('.survey-scroll');
  const world = view.querySelector('.survey-world');
  const output = document.querySelector('#survey-scale');
  let zoom = 1;
  let drag;

  function landmark(key) {
    const marker = markers.find(([id]) => id === key);
    if (!marker) return;
    const [,label,,,record,note] = marker;
    for (const control of world.querySelectorAll('[data-survey-pin]')) {
      control.setAttribute('aria-pressed',String(control.dataset.surveyPin === key));
    }
    const stageNote = key === 'barrier' ? (stage.id === 'report' ? 'Partition closed in this recording.' :
      stage.id === 'reunion' || stage.id === 'static' ? 'Approach reopened by this recording.' : 'Approach in use during the survey.') : '';
    document.querySelector('#survey-landmark').innerHTML = `<h2>${e(label)}</h2><p>${e(note)}</p>${stageNote ? `<p class="survey-condition">${e(stageNote)}</p>` : ''}<p>${recordLink(record,'Open linked record')}</p>`;
    drawSurvey(area.id,stage,markers,marker);
  }

  function setSource(key) {
    if (!stage.frames.includes(key)) return;
    const item=evidence[key];
    for (const control of document.querySelectorAll('[data-survey-source]')) {
      control.setAttribute('aria-pressed',String(control.dataset.surveySource === key));
    }
    document.querySelector('#survey-source').innerHTML = `<button class="exhibit-action survey-source-large" type="button" data-exhibit="${key}" aria-label="Enlarge ${e(item.title)}">${evidenceImage(item,'',true)}</button><h3>${e(item.title)}</h3>${evidenceCaption(item)}`;
  }

  function setZoom(next) {
    const x=(view.scrollLeft+view.clientWidth/2)/zoom;
    const y=(view.scrollTop+view.clientHeight/2)/zoom;
    zoom=next;
    world.style.width=`${zoom*100}%`;
    view.scrollTo(x*zoom-view.clientWidth/2,y*zoom-view.clientHeight/2);
    output.value=`${zoom*100}%`;
    view.classList.toggle('can-pan',zoom>1);
    document.querySelector('[data-survey-zoom="in"]').disabled=zoom===2;
    document.querySelector('[data-survey-zoom="out"]').disabled=zoom===1;
  }

  document.querySelector('.survey-console').addEventListener('click',event => {
    const control=event.target.closest('button');
    if (!control) return;
    const {surveyPin,surveySource,surveyZoom}=control.dataset;
    if (surveyPin) landmark(surveyPin);
    if (surveySource) setSource(surveySource);
    if (surveyZoom) setZoom(surveyZoom === 'fit' ? 1 : Math.max(1,Math.min(2,zoom+(surveyZoom === 'in' ? .25 : -.25))));
  });

  view.addEventListener('pointerdown',event => {
    if (zoom === 1 || event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button')) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:view.scrollLeft,top:view.scrollTop};
    view.setPointerCapture(event.pointerId);
    view.classList.add('panning');
  });
  view.addEventListener('pointermove',event => {
    if (drag?.id !== event.pointerId) return;
    view.scrollTo(drag.left+drag.x-event.clientX,drag.top+drag.y-event.clientY);
  });
  view.addEventListener('lostpointercapture',() => {
    drag=null;
    view.classList.remove('panning');
  });
  landmark(markers[0][0]);
  setSource(stage.frames[0]);
  setZoom(1);
}
