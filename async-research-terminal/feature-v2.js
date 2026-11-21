const featureSources = {
  release: ['A24 · film details and viewing options', 'https://a24films.com/films/backrooms'],
  notes: ['A24 · production notes', 'https://praesens.com/praesens-pro-presse/katalog/backrooms/regional/de/backrooms-press-kit-dch/'],
  scene: ['Kane Parsons · scene breakdown', 'https://www.youtube.com/watch?v=8DePR0N84iM'],
  ending: ['TheWrap · ending analysis (spoilers)', 'https://www.thewrap.com/creative-content/movies/backrooms-ending-lore-explained/'],
  bonus: ['SIFF · July 2026 theatrical bonus cut', 'https://www.siff.net/cinema/in-theaters/backrooms-everything-must-go-edition-w/-extra-footage']
};

const featureFilm = {
  id: 'feature', group: 'feature', title: 'Backrooms (2026)', type: 'A24 feature film',
  release: '2026-05-29', duration: '1 h 50 min',
  summary: 'A furniture showroom owner finds a passage into the Complex. When he goes missing, his therapist follows him inside. Directed by Kane Parsons and written by Will Soodik.',
  refs: ['first', 'info', 'ff1', 'ff2', 'everything'],
  filmSources: ['release', 'notes', 'scene', 'bonus', 'ending']
};

const featureTrailer = {id: 'feature-trailer', title: 'Backrooms (2026) · official A24 trailer', yt: '0HjdiohVOik'};
const featureImage = {file: 'feature-trailer', alt: 'A24 official Backrooms trailer thumbnail'};
const featureDossiers = [
  ['film-clark', 'people', 'Clark', 'Showroom owner · Chiwetel Ejiofor',
    'Clark discovers the passage beneath his furniture showroom and recruits Kat and Bobby to document it.',
    'His route gives the archive a sustained look at civilian exploration alongside A-Sync’s instrumented surveys.', 'notes'],
  ['film-mary', 'people', 'Dr. Mary Kline', 'Therapist · Renate Reinsve',
    'Mary is Clark’s therapist. When he disappears, she goes looking for him and encounters spaces that echo her childhood.',
    'Her route offers a second perspective on how the Complex repeats and distorts familiar spaces.', 'notes'],
  ['film-kat', 'people', 'Kat', 'Showroom employee · Lukita Maxwell',
    'Kat works for Clark. He recruits her and her boyfriend Bobby to chart the rooms beyond the basement.',
    'Kat gives the expedition a witness who approaches Clark’s discovery with skepticism.', 'notes'],
  ['film-bobby', 'people', 'Bobby', 'Civilian camera operator · Finn Bennett',
    'Bobby joins Kat and Clark on the showroom expedition and records the rooms on video.',
    'The handheld footage brings the web series’ recording format into the feature.', 'notes'],
  ['film-phil', 'people', 'Phil', 'A-Sync scientist · Mark Duplass',
    'Phil is an A-Sync scientist assigned to monitor the Complex.',
    'His role establishes A-Sync’s presence in the feature and gives the archive another institutional perspective on civilian witnesses.', 'notes'],
  ['film-showroom', 'locations', 'Furniture showroom basement', 'Civilian access point',
    'Clark discovers a doorway in the showroom basement that opens onto fluorescent-lit interiors.',
    'Compare this entry with the garage passage and A-Sync’s engineered Threshold. The routes establish different points of access to the Complex.', 'scene'],
  ['film-replicas', 'locations', 'Distorted copies of familiar rooms', 'Observed interiors · feature',
    'Spaces encountered by Clark and Mary echo familiar objects, the showroom and parts of Mary’s childhood environment.',
    'Recurring features can help identify a visual echo. A shared appearance gives limited evidence about where the spaces sit in relation to each other.', 'notes'],
  ['film-still-lifes', 'entities', 'Still Lifes', 'Humanlike replicas · feature spoilers',
    'The feature shows distorted replicas of people, including a version of Clark in his showroom mascot costume.',
    'The feature depicts several replicas with different behavior. The web-series pursuit figures remain separate observations with their own evidence.', 'ending'],
  ['film-captain', 'entities', 'Captain Clark', 'Active replica · feature spoilers',
    'A hostile replica resembles Clark’s pirate character from a showroom advertisement, down to the exaggerated crutch and peg leg.',
    'The costume provides a specific visual match between the creature and an image from Clark’s life. Its aggression remains unexplained.', 'ending']
].map(([id,group,title,type,summary,why,source]) => ({
  id, group, title, type, summary, why, refs: ['feature'], filmSources: [source]
}));

const featureBriefings = {
  feature: {
    why: 'A24’s production notes describe the feature as part of the web series’ continuity. The feature follows civilians whose encounters overlap with A-Sync’s investigation of the Complex.',
    points: [
      ['Story setting', 'The production notes place the story in the Santa Clara Valley around 1990. That gives the archive a year for comparison with A-Sync’s dated tapes.', ['first'], ['info']],
      ['Two ways in', 'Clark discovers a passage in his showroom basement. Compare how he tests that opening with the civilian entry in Found Footage #2 and the engineered Threshold in First Contact.', ['film-showroom'], ['ff2'], ['threshold']],
      ['The bonus recording', 'The Everything Must Go theatrical edition screened bonus footage in July 2026. Parsons later uploaded that footage as Everything Must Go. The Kelowna survey has its own in-story dates.', ['everything'], ['kelowna']]
    ],
    open: 'The film’s exact placement among the dated 1990 field tapes is unresolved. The showroom doorway’s position relative to the Threshold is unknown.'
  },
  ...Object.fromEntries(featureDossiers.map(record => [record.id, {
    why: record.why,
    points: [['Primary film record', 'Open the film file for its release details and sources.', ['feature']]]
  }]))
};

const featureEvents = [
  ['showroom-entry','Clark discovers the showroom passage',
    'Clark finds a doorway beneath his furniture showroom and asks Kat and Bobby to help document what lies beyond it.',
    ['film-clark','film-showroom','film-kat','film-bobby'],'film-clark-frame'],
  ['clark-missing','Mary goes looking for Clark',
    'When Clark disappears, his therapist Dr. Mary Kline follows him into the Complex. Her route includes distorted echoes of familiar places.',
    ['film-mary','film-replicas'],'film-mary-frame'],
  ['film-async','A-Sync encounters Mary',
    'A-Sync personnel recover Mary, and Phil questions her about what she saw. The feature file preserves the ending and sightings in its spoiler section.',
    ['film-phil','async','film-still-lifes'],'film-async-frame']
].map(([id,title,note,refs,frame]) => ({
  id, video:'feature', date:'1990', title, note, refs, frame,
  basis:'Feature · approximate year',
  group:'relative'
}));

const featureEdges = [
  ['feature', 'first', 'Same continuity', 'A24’s production notes place A-Sync’s 1989 opening in the web series and the feature’s civilian discovery around 1990.', 'Documented'],
  ['feature', 'async', 'Organisation in both works', 'Phil monitors the Complex for A-Sync in the feature. The web archive follows the institute’s experiments, surveys and incident response.', 'Documented'],
  ['feature', 'everything', 'Theatrical bonus footage', 'The July 2026 theatrical edition screened the Kelowna Branch footage that Parsons later uploaded as Everything Must Go.', 'Documented'],
  ['film-showroom', 'threshold', 'Entry comparison', 'Both openings provide access to the Complex. Their relative position and any connecting route are unknown.', 'Comparison'],
  ['film-showroom', 'garage', 'Entry comparison', 'Compare the showroom doorway and the garage anomaly as civilian entry points.', 'Comparison'],
  ['film-replicas', 'kelowna', 'Retail imagery comparison', 'Retail interiors recur in both sources. Their visual similarities provide a comparison point and leave their geographic relationship open.', 'Comparison'],
  ['film-still-lifes', 'figure1', 'Sighting comparison', 'Compare observable appearance and behavior. The figure in Found Footage has no confirmed link to the replicas in the feature.', 'Comparison']
].map(([from,to,kind,note,status]) => ({from,to,kind,note,status}));

const featureRoute = {
  title: 'Feature route · showroom entry',
  description: 'Approximate order of the opening route. Distance, orientation, and connections to the A-Sync Threshold are unknown.',
  nodes: [
    ['film-showroom', 'Showroom basement', 'Civilian starting point'],
    ['film-showroom', 'Doorway', 'Discovered access point'],
    ['yellow', 'Fluorescent interiors', 'Visual comparison with the web archive'],
    ['film-replicas', 'Distorted rooms', 'Later interior observations']
  ]
};

const featureSpoilers = [
  ['Bobby’s recording and Captain Clark', 'The showroom expedition turns into a pursuit. The hostile copy of Clark reproduces the costume from his pirate-themed advertisement.', ['film-bobby', 'film-captain']],
  ['Mary’s interview', 'A-Sync personnel recover Mary. Phil questions her, and her release is left unresolved.', ['film-mary', 'film-phil', 'async']],
  ['The copied interview room', 'The closing image shows a replica of Mary in a distorted copy of the interview room. That image gives another example of the Complex reproducing people and spaces.', ['film-still-lifes', 'film-replicas']]
];
