// Storyboard times come from the original upload’s preview metadata.
const evidence = Object.fromEntries(videos.map(video => [`upload-${video.id}`, {
  file: video.id === 'lighting' ? 'lighting-survey-original' : `upload-${video.id}`,
  video: video.id,
  title: 'Upload thumbnail',
  kind: 'Official upload thumbnail',
  alt: `Thumbnail for ${video.title}`,
  ...(video.id === 'simpsons' ? {credit:'YouTube upload by Laura Harris'} : {}),
  note: 'The image supplied with the original YouTube upload. Its exact frame time is unassigned.'
}]));

const evidenceFor = Object.fromEntries(videos.map(video => [video.id, [`upload-${video.id}`]]));

const storyboardExhibits = [
  ['notice-bolton','missing',2,'Utility-pole notice','A missing-person notice is attached to a utility pole.',['missing-bolton']],
  ['notice-watson','missing',10,'Margaret Watson notice','The notice bearing Watson’s name lies outside.',['missing-watson']],
  ['notice-reward','missing',18,'Unidentified reward notice','A notice shows an unidentified person above a reward line.',['missing-unidentified-notice']],
  ['notice-scott','missing',34,'Janice Scott notice','A notice in a shop window is identified as Scott’s in the episode reference.',['missing-scott']],
  ['missing-notice-frame','missing',28,'Missing-person notice','A missing-person poster on glass in the opening montage.',['missing-white']],
  ['recovered-remains','missing',136,'Recovery sequence','The survey team’s view near the wall during the discovery sequence.'],
  ['loma-prieta-news','fault',20,'Loma Prieta news coverage','An aerial news shot from the linked archival broadcast.'],
  ['autopsy-frame','autopsy',30,'Autopsy recording','The examination tape shows the body on a table.'],
  ['test-apparatus','third',84,'Apparatus during the third test','Light fills the opening during the third test.'],
  ['test-setup','third',41,'Third Test equipment','Equipment footage accompanying the account of A-Sync’s magnetic distortion programme.'],
  ['tench-survey-frame','info',130,'Survey team inside the Complex','Suited staff seen on Tench’s camera during the survey.'],
  ['recording-news','recording',66,'Newspaper insert','The call tape includes a newspaper image associated with the Tench case.'],
  ['lighting-field','lighting',55,'Lighting field survey','Suited A-Sync researchers inside the Complex during the lighting survey.'],
  ['camera-outside','ff1',525,'Outside view from the falling camera','Trees enter the frame during the closing descent.'],
  ['film-clark-frame','feature-trailer',28,'Clark in the Complex','Clark inside the yellow rooms in the official A24 trailer.'],
  ['film-mary-frame','feature-trailer',116,'Mary in the Complex','Mary in a fluorescent-lit room in the official A24 trailer.'],
  ['film-async-frame','feature-trailer',70,'Suited personnel','Suited personnel shown in the official A24 trailer.'],
  ['office','ff1',55,'Yellow office rooms','Square pillars and fluorescent fixtures across a yellow office interior.',['yellow']],
  ['wall','ff1',210,'Wall markings','The wall at the end of a passage bears several drawn symbols.',['yellow']],
  ['figure-gap','ff1',490,'Figure through a narrow opening','A dark form is partly visible through the slit during the pursuit. Use the upload thumbnail for a wider view of the figure.',['figure1']],
  ['logo-card','first',6,'A-Sync title card','The black triangular A-Sync logo appears on a saturated blue field.',['async']],
  ['opening','first',103,'Threshold opening','The test apparatus frames a lit corridor. The date and clock in the corner are part of the recording.',['threshold']],
  ['outpost','present',420,'Observation area','The outpost interior during the visit shown in Presentation.',['threshold']],
  ['model','present',385,'A-Space model','A physical model under review during the visit. It illustrates the proposal for developing the Complex.',['async']],
  ['pit-grid','pit',265,'Room 14D pit grid','The survey team’s view over the rectangular openings toward the far wall.',['division']],
  ['pit-door','pit',310,'Door beyond the pits','The camera records the open door beyond the pit grid.',['division']],
  ['pit-shaft','pit',365,'View back towards a shaft','The camera looks up at an opening after the fall.',['division','leigh']],
  ['red-street','pit',555,'Red-lit street','The camera points down a road inside the Complex. This is a separate view from the house interior.',['street','leigh']],
  ['red-house','pit',595,'House exterior','The house appears at the end of the recorded approach.',['street']],
  ['house-interior','pit',650,'Interior of the red-lit house','The camera enters a blue-walled interior with corridor signs before the encounter.',['house-figure']],
  ['house-corridor','pit',735,'Corridor during the encounter','Marvin’s view down the corridor during the encounter. The distant end of the hall is difficult to make out in this preview.',['house-figure']],
  ['corkboard','overflow',77,'Signed document on the corkboard','The frame shows the paper identified in the episode notes as bearing Beck’s signature. The preview is low resolution.',['beck']],
  ['tench-confrontation','reunion',675,'Confrontation in Division 14','The flashlight obscures the figure during the confrontation with Tench. Identification comes from the scene.',['tench']],
  ['cam5','motion',220,'Camera 5 overview','Wide view of the area later enlarged in the same upload.',['motion-shape']],
  ['cam5-highlight','motion',230,'Region marked in the recording','A red circle in the source recording identifies the area under review.',['motion-shape']],
  ['cam5-enlargement','motion',240,'In-video enhancement','The upload labels this passage as upscaled and enhanced. The shape at the corner remains ambiguous.',['motion-shape']],
  ['garage-tape','ff2',40,'Garage markings','Tape outlines the spot under investigation on the garage floor.',['garage']],
  ['crashed-car','ff2',505,'Crashed vehicle','The damaged car where the camera encounters it in the Complex.',['garage']],
  ['growth-room','ff2',600,'Growth-filled room','The encounter sequence includes a dark room with dense growth. Parts of the frame are difficult to resolve.',['growth-figure']],
  ['growth-encounter','ff2',620,'Backlit movement','The frame falls within the encounter. The bright opening silhouettes part of the scene.',['growth-figure']],
  ['ravi-camera','ff3',70,'Ravi on the opening recording','The camera shows Ravi outdoors in the opening sequence.',['ravi']],
  ['ravi-interior','ff3',1060,'Interior from Ravi’s tape','The dark, cluttered passage gives context for the encounter sequence. This frame offers a partial view of the space.',['ravi-figures']],
  ['ravi-radio','ff3',1540,'Radio equipment','Ravi records the equipment he uses to try to make contact.',['ravi']],
  ['kelowna-sign','everything',760,'Sign beyond the wall','A light catches a suspended sale sign deeper inside the branch.',['kelowna']],
  ['kelowna-tv','everything',930,'Television in the retail interior','The set is visible shortly before the final pursuit sequence.',['kelowna']],
  ['retail-pursuit','everything',940,'Retail pursuit sequence','A suited researcher is visible in the foreground. Use the source tape to inspect the brief encounter around this moment.',['retail-figure']]
];

for (const [id,video,seconds,title,note,subjects=[]] of storyboardExhibits) {
  const timestamp = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`;
  const isTrailer = video === 'feature-trailer';
  const file = `${isTrailer ? 'trailer' : video}-frame-${seconds}`;
  evidence[id] = {file, video, seconds, title, alt:note, note, kind:`${isTrailer ? 'Official trailer frame' : 'Source frame'} · ${timestamp}`,
    ...(isTrailer ? {credit:'A24'} : {})};
  for (const subject of [isTrailer ? 'feature' : video,...subjects]) (evidenceFor[subject] ??= []).push(id);
}

evidence['upload-ff1'].note = 'The creator-selected thumbnail shows a tall figure between pillars. Its exact timestamp is unassigned.';
evidenceFor.figure1.unshift('upload-ff1');
evidenceFor.kelowna.unshift('upload-everything');

evidence.beckArtwork = {
  file:'beck-score',
  video:'overflow',
  title:'Backrooms score artwork',
  alt:'Cover of Backrooms Original Score Volume 3',
  kind:'Creator artwork · identification is interpretive',
  note:'Kane Parsons’ cover for Volume 3 is associated with Beck in the fan reference. The signed document is the on-screen evidence in Overflow.',
  reference:'https://kanepixels.bandcamp.com/album/backrooms-original-score-vol-3'
};
evidenceFor.beck.push('beckArtwork');

for (const [id,feature] of [
  ['house-figure','house-corridor'],
  ['growth-figure','growth-encounter'],
  ['motion-shape','cam5-highlight']
]) {
  evidenceFor[id] = [feature, ...evidenceFor[id].filter(key => key !== feature)];
}

for (const video of videos) {
  const items = evidenceFor[video.id];
  if (items.length > 1) items.push(items.shift());
}
