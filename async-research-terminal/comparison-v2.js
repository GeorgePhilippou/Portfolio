// Pairs link specific archived frames. They are prompts for comparison that keep their source context visible.
const comparisonPairs = [
  ['Threshold plan and outpost drawing','map-motion-close','map-info-drawing','Compare the camera positions with the later drawing. Look for repeated pillars and the entrance edge before aligning the spaces.'],
  ['Room 14D before and after','pit-grid','map-reunion-walkway','The pit grid and far wall give two reference points. The deck and rails in Reunion document A-Sync’s intervention.'],
  ['Threshold and A-Space model','map-motion-wide','model','The camera plan records a surveyed area. The model is shown during a development proposal. Compare the pillar arrangement with that distinction in mind.'],
  ['Surveillance frame and enhancement','cam5','cam5-enlargement','These images come from the same tape. Compare details visible in the wide shot with the in-video crop and enhancement.']
];

function comparisonURL(left,right='') {
  return `#compare/${left}${right ? '/' + right : ''}`;
}

function comparisonView(leftKey,rightKey) {
  const keys = Object.keys(evidence);
  const left = keys.includes(leftKey) ? leftKey : comparisonPairs[0][1];
  const paired = comparisonPairs.find(([,a,b])=>a===left||b===left);
  const right = keys.includes(rightKey) ? rightKey :
    paired ? (paired[1]===left ? paired[2] : paired[1]) : comparisonPairs[0][1];
  const activePair = comparisonPairs.find(([,a,b])=>(a===left&&b===right)||(a===right&&b===left));
  function monitor(key,side) {
    const item = evidence[key];
    const options = [...videos,featureTrailer].map(video => {
      const frames = keys.filter(id=>evidence[id].video===video.id);
      return `<optgroup label="${e(video.title)}">${frames.map(id=>`<option value="${id}" ${id===key?'selected':''}>${e(evidence[id].title)} · ${e(evidence[id].kind)}</option>`).join('')}</optgroup>`;
    }).join('');
    return `<section class="panel comparison-monitor" aria-label="Frame ${side}">
      <div class="panel-bar"><span>Monitor ${side}</span><span>${e(sourceForEvidence(item).title)}</span></div>
      <div class="compare-picker"><label for="compare-${side}">Frame ${side}</label><select id="compare-${side}" data-compare-side="${side}" data-peer="${side==='A'?right:left}">${options}</select></div>
      <button type="button" class="exhibit-action" data-exhibit="${key}" aria-label="Enlarge monitor ${side} frame">${evidenceImage(item,'',true)}</button>
      <div class="panel-body"><h2>${e(item.title)}</h2>${evidenceCaption(item)}</div>
    </section>`;
  }
  return title('ANALYSIS / TAPE COMPARISON','Compare evidence','Load two frames and compare what each source actually shows.') +
    `<div class="compare-pairs" aria-label="Suggested comparisons">${comparisonPairs.map(([name,a,b])=>
      `<a class="button" href="${comparisonURL(a,b)}" ${a===left&&b===right?'aria-current="true"':''}>${e(name)}</a>`
    ).join('')}</div>
    <div class="compare-controls">
      <a class="button" href="${comparisonURL(right,left)}">Swap monitors</a>
      <button class="button" type="button" data-compare-pin="${evidenceRecordId(evidence[left])}/${evidenceRecordId(evidence[right])}">Pin source records</button>
      <a href="#board">Open case board</a>
      <span class="meta muted" id="compare-state" role="status"></span>
    </div>
    <div class="comparison-grid">${monitor(left,'A')}${monitor(right,'B')}</div>
    ${activePair ? panel('Comparison notes',`<p>${e(activePair[3])}</p>`,'compare-notes') : ''}`;
}
