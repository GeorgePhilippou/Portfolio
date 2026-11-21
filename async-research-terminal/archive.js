const catalogSource = 'https://en.wikipedia.org/wiki/Backrooms_(web_series)#Episodes';
const officialPlaylist = 'https://www.youtube.com/playlist?list=PLVAh-MgDVqvDUEq6qDXqORBioE4Yhol_z';
const footageSource = 'https://en.wikipedia.org/wiki/The_Backrooms_(Found_Footage)';
const earlyAnalysis = 'https://www.reddit.com/r/backrooms/comments/sslyoq/the_backrooms_found_footage_series_by_kane_pixels/';
const chronologySource = 'https://kane-pixels-backrooms.fandom.com/wiki/Timeline';

// Release dates follow the episode catalogue. Story dates have their own evidence records below.
const videos = [
  ['ff1','The Backrooms (Found Footage)','2022-01-07','9:14','H4dGpz6cnHo','Found footage','An amateur film shoot ends when the camera operator falls through the ground. Inside the Complex, arrows, abrupt changes in elevation and a pursuing figure shape the route. The closing shot returns to the outside world.'],
  ['archive','Mar11_90_ARCHIVE.tar','2022-01-08','2:49','k0L8SM32ENI','Linked file','A digital archive opens to stills of the Complex and obscured personnel imagery. Its filename and assembly date can refer to different events.'],
  ['third','The Third Test','2022-01-13','1:46','tvmEc7JhR0E','Experiment','Narration introduces the Low-Proximity Magnetic Distortion System and attributes a housing and storage rationale to A-Sync vice-director Ivan Beck.'],
  ['first','First Contact','2022-01-17','1:58','eXdIDjzy6KY','Experiment','A-Sync activates its sixth test. The fixed camera records the apparatus illuminating and an opening forming at the test site.'],
  ['fault','faultline.mov','2022-01-17','2:59','mWFMDnMDI2o','Linked file','Archival television news covers the Loma Prieta earthquake. Placing it beside First Contact invites a causal reading. The dated overlap supports the juxtaposition.'],
  ['missing','Missing Persons','2022-01-28','2:37','py6c5NaHeB8','Field report','Missing-person notices precede a survey team’s discovery of a body near dark growth. Autopsy Report follows up on the discovery.'],
  ['info','Informational Video','2022-02-12','8:01','ZIFhglHn3W0','Training tape','Safety instructions establish the Threshold and a designated route. A surveyor becomes separated and returns to a substantially changed observation area.'],
  ['autopsy','Autopsy Report','2022-02-23','2:37','2AN6j7JYc1g', 'Medical report','The examiner describes abnormal decomposition and asks Beck about the body’s origin. These are statements from the in-story examination.'],
  ['motion','Motion Detected','2022-03-11','4:07','4FDotUHfpWk', 'Surveillance','A-Sync compiles motion-camera recordings. A dark shape at the edge of the final camera view is a candidate sighting.'],
  ['proto','Prototype','2022-03-28','1:33','9_UN1dsZ9Vg', 'Experiment','A prototype test predates the Threshold opening. Its recording supplies an early milestone for the programme.'],
  ['pit','Pitfalls','2022-05-01','14:04','0XwlWXtpaCM','Field tape','An A-Sync survey reaches a chamber of pits. Marvin falls and follows cries toward a red-lit street and house, where a figure pursues him.'],
  ['report','Report','2022-05-20','6:21','ywVxpZ4XUBM','Incident report','A-Sync reviews Marvin’s footage. The response restricts access to Division 14.'],
  ['car','9780415263573','2022-05-20','0:34','a7ckzgIgx_o','Linked file','A road camera shows a car disappearing through the roadway. Comparing it with Found Footage #2 raises a possible vehicle match.'],
  ['present','Presentation','2022-06-25','8:26','ITuGdHxHi0A','Briefing','A-Sync pitches potential uses for the Complex. The interrupted visit supplies an outside perspective on the return at the end of Informational Video.'],
  ['simpsons','Simpsons','2022-06-25','1:08','5akGUmdjxv4','Linked file','A television recording juxtaposes a Simpsons broadcast and a seemingly later advertisement, raising a question about when its signals originated.'],
  ['ff2','Backrooms - Found Footage #2','2022-08-21','13:23','sA5PxGHqpTo','Found footage','A garage anomaly leads to irregular rooms, a crashed car and a dark growth-filled space. A figure emerges near the growth, followed by a chase and green light.'],
  ['home','home_27647.mov','2022-08-22','3:26','Kq6l9yCO9rI','Linked file','Home video and family photographs supply domestic imagery for comparison with Found Footage #2, including a painting.'],
  ['remember','I Remember','2022-08-30','1:29','c-H59GkA-I4','Supplemental','A Kane Pixels upload using liminal interior imagery and music. Its status in the web-series narrative is uncertain.'],
  ['reunion','Reunion','2022-12-08','13:12','ye6YpxFE9jk','Field tape','A crew returns to Division 14. An encounter with Peter Tench connects the closed survey area with the story of the missing researcher.'],
  ['recording','_recording014','2022-12-08','2:32','cjUqCsDmx-I','Linked file','A phone conversation involving Ivan Beck discusses Tench after his return. The call provides an A-Sync account of the situation.'],
  ['overflow','Overflow','2022-12-24','1:39','8TYopkSmKyA', 'Experiment','An overload and green light interrupt an earlier experiment. A signed document brings Ivan Beck into a much earlier part of the chronology.'],
  ['damage','Damage Control','2023-01-30','14:03','j6klSI8GlXI', 'Incident report','A-Sync accounts for Tench’s disappearance and the confrontation in Reunion. The institution’s report gives one version of his fate.'],
  ['ff3','Backrooms - Found Footage #3','2024-09-13','45:01','acdYs9tPLko', 'Found footage','Ravi enters through his basement and traverses varied spaces, including a skywalk and domestic interiors. Voices, radio signals and brief silhouettes are separate pieces of evidence.'],
  ['lighting','Lighting and Tile Survey','2024-10-02','8:43','WbmkjR3gIgE', 'Survey','Researchers remove lighting hardware and ceiling tiles. Their report describes unusual dimensions and records manufacturing details.'],
  ['static','Static Dead End','2025-02-12','4:02','ZbPaWvqAEq4', 'Field tape','Marvin and George discuss Tench. A follow-up survey beyond Room 14D records distorted surfaces and furniture intersecting floors and walls.'],
  ['everything','Everything Must Go','2026-08-18','16:04','ewZx0bnBb30','Field tape','A-Sync explores the Kelowna Branch, where store signs recur across surfaces. Opening a wall leads to a retail interior and a pursuit.']
].map(([id,title,release,duration,yt,type,summary]) => ({id,title,release,duration,yt,type,summary, group:'videos'}));

const dossiers = [
  {id:'beck',group:'people',title:'Ivan Beck',type:'A-Sync vice-director',summary:'The Third Test attributes the public housing and storage rationale to Beck. Later records place him in discussions about a recovered body and Peter Tench. Overflow links his name to an earlier experiment through a signed document.',refs:['third','autopsy','recording','overflow']},
  {id:'tench',group:'people',title:'Peter Tench',type:'A-Sync researcher',summary:'A separated surveyor returns to the Threshold outpost. Presentation, Reunion and Damage Control reframe that event from different institutional and personal perspectives.',refs:['info','present','recording','reunion','damage','static']},
  {id:'leigh',group:'people',title:'Marvin E. Leigh',type:'A-Sync researcher',summary:'The camera operator in Pitfalls descends through a pit and documents a pursuit. Report reviews that recording. Later appearances connect the field surveys to the Tench incident.',refs:['pit','report','reunion','static']},
  {id:'ravi',group:'people',title:'Ravi',type:'Civilian camera operator',summary:'Ravi documents his passage from a basement into large interiors and makes repeated attempts to establish contact.',refs:['ff3']},
  {id:'async',group:'people',title:'A-Sync Research Institute',type:'Organisation',summary:'The fictional institute runs the Threshold experiments, surveys the Complex and proposes practical uses for the space. Its internal reports record a changing response to field incidents.',refs:['third','first','present','lighting','report','damage']},
  {id:'threshold',group:'locations',title:'Threshold & outpost',type:'Access point',summary:'The engineered entrance links the A-Sync facility to the Complex. The observation outpost appears along the approach in the 1990 records.',refs:['first','info','present','motion']},
  {id:'yellow',group:'locations',title:'Yellow office rooms',type:'Route fragment',summary:'Fluorescent panels, low ceilings and repeating wallpaper recur in many recordings. They offer visual comparison points across routes whose coordinates remain unknown.',refs:['ff1','archive','info','lighting']},
  {id:'division',group:'locations',title:'Division 14 / Room 14D',type:'Survey sector',summary:'The distinctive bank of pits anchors the route in Pitfalls. Report describes restricting access, Reunion records the return, and Static Dead End follows the opening beyond the chamber.',refs:['pit','report','reunion','static']},
  {id:'street',group:'locations',title:'Red-lit residential street',type:'Route fragment',summary:'Marvin reaches the street after falling through a pit. The descent is an observed passage. Its direction and scale are unknown.',refs:['pit']},
  {id:'garage',group:'locations',title:'Garage entry & interior route',type:'Civilian entry',summary:'Found Footage #2 begins at a garage anomaly and moves into a series of irregular interiors. Home footage gives comparison material for some domestic imagery.',refs:['ff2','home','car']},
  {id:'kelowna',group:'locations',title:'Kelowna Branch',type:'Survey sector',summary:'A field team documents repeating store signs and finds a retail interior through an opened wall.',refs:['everything']},
  {id:'figure1',group:'entities',title:'Tall figure near wall markings',type:'Observed pursuit',summary:'A dark figure appears near a marked wall and pursues the camera operator. The footage anchors the sighting; a biological classification is unknown.',refs:['ff1']},
  {id:'motion-shape',group:'entities',title:'Shape in motion-camera feed',type:'Ambiguous sighting',summary:'A dark shape is visible at the margin of the final feed. The distant, partial view limits identification and comparison.',refs:['motion']},
  {id:'house-figure',group:'entities',title:'House encounter',type:'Observed pursuit',summary:'Marvin hears cries before an encounter inside the house. Compare the ordering of the audio and the sighting before attributing the voice to the figure.',refs:['pit','report']},
  {id:'growth-figure',group:'entities',title:'Figure near dark growth',type:'Observed pursuit',summary:'Found Footage #2 shows movement near the growth before the chase. The imagery invites comparison with Missing Persons, where A-Sync finds a body beside growth.',refs:['ff2','missing','autopsy']},
  {id:'ravi-figures',group:'entities',title:'Figures on Ravi’s recording',type:'Multiple encounters',summary:'A pursuit and a later rush toward Ravi appear in distinct sequences. View each encounter before deciding whether they involve the same figure.',refs:['ff3']},
  {id:'retail-figure',group:'entities',title:'Costumed figure in retail interior',type:'Observed pursuit',summary:'A tall humanoid figure in a costume emerges during the Kelowna Branch exploration.',refs:['everything']}
];

const events = [
  ['overflow','1972-08-02','Power overload','Reported recording date','An early equipment event precedes the Threshold project shown in First Contact.'],
  ['proto','1982','Prototype trial','Reported year','An early test of the magnetic distortion system.'],
  ['third','1988-04','Beck’s public rationale','Narration · month','The narrator attributes the housing and storage objective to Beck at an April conference.'],
  ['third','1988-07-02','Third test','Narration · day','The tape places the third test on this date.'],
  ['first','1989-10-17','Sixth test opens the Threshold','In-story event','The opening provides a point of reference for later A-Sync entries.'],
  ['fault','1989-10-17','Loma Prieta news footage','Historical event date','Shared date with the sixth test. The juxtaposition leaves the causal question open.'],
  ['lighting','1989-11-14','Light and tile removal','Reported recording date','The field crew extracts samples from the Complex.'],
  ['lighting','1989-11-15','Preliminary analysis','Reported report date','The laboratory reports unusual dimensions.'],
  ['missing','1990-02-03','Survey team finds a body','Secondary chronology','The field team’s discovery leads into the autopsy record.'],
  ['autopsy','1990-02-05','Medical examination','Secondary chronology','The examiner describes the body and addresses Beck.'],
  ['info','1990-02-29','Surveyor is separated','Anomalous date label','The date often attributed to this tape is February 29, 1990. That date is invalid on a Gregorian calendar. Its placement here is approximate.'],
  ['motion','1990-03','Surveillance recordings','Approximate month','Recording contains multiple motion-camera clips.'],
  ['archive','1990-03-11','Date encoded in archive filename','Filename · interpretation','The filename suggests March 11, 1990. It may designate source material. The compilation date is a separate question.'],
  ['pit','1990-05-06','Division 14 expedition','Placed with Report','The chronology places the expedition near the review, whose description supplies May 6.'],
  ['report','1990-05-06','Division 14 footage reviewed','YouTube description','The episode description gives May 6, 1990.'],
  ['present','1990-05-08','Briefing interrupted at the outpost','Reported story date','Presentation gives another perspective on the end of Informational Video.'],
  ['recording','1990-05','Beck discusses Tench','Approximate month','Placed after the return based on the subject of the call.'],
  ['reunion','1990-05-25','Return to Division 14','YouTube description','The episode description gives May 25, 1990.'],
  ['damage','1990-05-26','A-Sync briefs staff','Sequence-based date','A briefing the day after the events in Reunion places it around May 26.'],
  ['everything','1990-06-18','Kelowna Branch survey begins','Reported recording date','A-Sync examines repeated sale signs.'],
  ['everything','1990-06-19','Investigation beyond the wall','Reported recording date','Further examination follows the initial survey.'],
  ['static','1990','Follow-up after the Tench incident','Relative date','The discussion places it after the incident. The day is unassigned in this archive.'],
  ['ff1','1991-07-04','Cameraman enters the Complex','Reported opening date','The film shoot gives a starting date distinct from the closing sequence.'],
  ['ff2','1995-08-19','Garage recording','Secondary chronology','Treat as a working date for the recording.'],
  ['ff1','1996-09-23','Camera returns to the outside','YouTube description and ending','The description supplies this date. The closing sequence is distinct from the 1991 opening.'],
  ['car','','Vehicle disappears','Unknown date','The road recording has a possible link to the garage tape.'],
  ['ff3','','Ravi’s recording','Unplaced','The current archive leaves the date open.'],
  ['home','','Home video montage','Multiple or unknown dates','The file contains clips and stills whose dates need individual review.'],
  ['remember','','Supplemental montage','Narrative placement unknown','The archive does not assign the montage an in-story date.'],
  ['simpsons','','Television signal mismatch','Conflicting media dates','Broadcast material gives comparison points. The date of the recording remains open.']
].map(([video,date,title,basis,note]) => ({video,date,title,basis,note}));

// Edges identify the evidence for the relationship. Direction is kept for description links.
const edges = [
  ['ff1','archive','Description link','The official Found Footage description links to the archive.','Documented'],
  ['ff2','home','Description link','The official Found Footage #2 description links to the home video.','Documented'],
  ['report','car','Description link','The official Report description links to the road recording.','Documented'],
  ['reunion','recording','Description link','The official Reunion description links to the call.','Documented'],
  ['present','simpsons','Description link','The upload is attributed to a link from Presentation in episode references.','Reported'],
  ['first','fault','Companion recording','The dated test and news footage share October 17, 1989. The causal link is an open question.','Comparison'],
  ['third','first','Experiment sequence','Both tapes concern the magnetic distortion tests, leading from the third test to the sixth.','Narrative link'],
  ['missing','autopsy','Follow-up report','The examination follows the discovery of a body inside the Complex.','Narrative link'],
  ['pit','report','Footage replayed','Leadership reviews footage from the earlier expedition.','Narrative link'],
  ['info','present','Overlapping event','The ending of the training tape and interrupted briefing depict the return to the outpost from different perspectives.','Narrative link'],
  ['present','recording','Incident aftermath','The call refers to the recovery following the outpost incident.','Narrative link'],
  ['reunion','damage','Incident aftermath','Damage Control addresses the confrontation recorded by the field crew.','Narrative link'],
  ['pit','static','Return to surveyed area','Both tapes use the pits as a landmark. Static Dead End follows the room beyond them.','Narrative link'],
  ['car','ff2','Possible vehicle match','Compare the car that vanishes with the crashed car in the garage recording. Shared identity remains open.','Hypothesis'],
  ['home','ff2','Repeated domestic imagery','Compare the painting and interior imagery across the two uploads. A matching feature leaves the spatial relationship open.','Comparison'],
  ['figure1','house-figure','Possible related sightings','Both recordings show pursuit by a dark, tall figure. The relationship between the sightings remains open.','Hypothesis'],
  ['growth-figure','house-figure','Possible related sightings','Compare figure visibility, surroundings and audio before proposing an identity.','Hypothesis'],
  ['remember','yellow','Visual motif','The montage offers another view of liminal interiors. The archive treats this as a visual comparison.','Comparison'],
  ['yellow','lighting','Material comparison','The survey supplies measurements and manufacturing clues for hall fittings. Other rooms may contain similar-looking fixtures.','Comparison']
].map(([from,to,kind,note,status]) => ({from,to,kind,note,status}));

const moments = {
  ff1:[
    {title:'Film shoot and fall',label:'Opening · 0:00',seconds:0,note:'The scene begins outside the Complex. The fall is a useful anchor when comparing other civilian entry footage.'},
    {title:'Marked wall and first pursuit',label:'Mid-tape sequence',note:'Arrows lead into a passage where the camera operator turns toward a noise. The markings and the sighting provide different clues.'},
    {title:'Returning camera',label:'Closing sequence',note:'The final outside shot and the date in the description anchor the end of the recording.'}
  ],
  third:[{title:'Test narration and Beck reference',label:'Opening · 0:00',seconds:0,note:'Listen for how the narrator describes the programme’s stated purpose and distinguishes the press conference from the test.'}],
  first:[{title:'Fixed camera at the test site',label:'Opening · 0:00',seconds:0,note:'The shot establishes the test rig. Track what changes during activation and where the opening appears.'}],
  ff2:[{title:'Garage anomaly',label:'Opening sequence',seconds:0,note:'The entry occurs through the domestic space, giving a comparison point with both other civilian tapes.'},{title:'Crashed car and growth',label:'Later sequence',note:'The car and blood trail precede the encounter. Their relationship to the road clip is a separate question.'}],
  home:[{title:'Home recordings and stills',label:'Opening · 0:00',seconds:0,note:'Compare the domestic setting and painting with the imagery in the linked tape.'}],
  archive:[{title:'Archive opened',label:'Opening · 0:00',seconds:0,note:'The archive framing gives a reason to distinguish the date of the material from the assembly date.'}],
  pit:[{title:'Survey route interrupted',label:'Pit chamber sequence',note:'Mark crosses the chamber. Marvin falls during the attempted crossing, interrupting the original survey route.'},{title:'Street, house and pursuit',label:'Later sequence',note:'The off-screen cries precede the visible encounter. This is a route fragment with gaps at its transitions.'}],
  present:[{title:'Proposal and inspection',label:'Opening · 0:00',seconds:0,note:'Compare the scale of the proposed use with the narrow field of view of the survey tapes.'},{title:'Alarm at the outpost',label:'Closing sequence',note:'Cross-reference the return near the end of Informational Video.'}],
  missing:[
    {title:'Missing-person notices',label:'0:39 · secondary cue',seconds:39,note:'Inspect the montage and the point where the tape shifts from missing-person material to the expedition.',reference:earlyAnalysis},
    {title:'Threshold approach',label:'0:56 · secondary cue',seconds:56,note:'Compare this view of the approach with the test rig in First Contact and the outpost in Presentation.',reference:earlyAnalysis},
    {title:'Closing insert',label:'2:31 · secondary cue',seconds:151,note:'A brief text insert invites a question about responsibility. The frame leaves the subject open.',reference:earlyAnalysis}
  ],
  overflow:[{title:'Signed document',label:'Closing imagery',note:'Beck’s name provides a character clue. The document by itself leaves his role in the overload open.'}],
  recording:[{title:'Recorded call about Tench',label:'Opening · 0:00',seconds:0,note:'The conversation gives an internal account to compare with the footage and later briefing.'}]
};

const routes = [
  {title:'Marvin’s route through Room 14D',description:'Observed sequence from Pitfalls. The fall breaks the survey team’s original route.',nodes:[['division','Room 14D','Pit chamber'],['pit','Descent','Fall through a pit'],['street','Residential street','Red-lit passage'],['house-figure','House interior','Encounter']]},
  {title:'Threshold and observation outpost',description:'Field activity around the Threshold and outpost. Compass bearings and scale are unknown.',nodes:[['first','Test facility','Engineered opening'],['threshold','Threshold','Entry from facility'],['info','Complex interior','Survey route'],['present','Observation outpost','Return recorded']]},
  {title:'Civilian entry from a garage',description:'Sequence abstracted from Found Footage #2. Distances between spaces remain unknown.',nodes:[['garage','Garage','Anomalous entry'],['ff2','Irregular interiors','Recorded traversal'],['ff2','Vehicle site','Crashed car'],['growth-figure','Growth-filled room','Sighting']]}
];
