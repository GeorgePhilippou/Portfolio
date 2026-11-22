// Original recordings remain the controlling sources. Transcript-based identifications are labelled in the file.
const missingPosterSource = 'https://kane-pixels-backrooms.fandom.com/wiki/Missing_Persons';
const damageTranscript = 'https://kane-pixels-backrooms.fandom.com/wiki/Damage_Control/Transcript';
const reunionTranscript = 'https://kane-pixels-backrooms.fandom.com/wiki/Reunion/Transcript';

const personnelAdditions = [
  {id:'levy',title:'George Levy',type:'A-Sync field researcher',status:'Field team · interpretation disputed',refs:['info','pit','damage','static'],
    summary:'George is named in the account of the original survey team. He later discusses Peter Tench’s death with Marvin and records the survey beyond Room 14D.',
    why:'George connects the early expedition to later fieldwork and gives a more cautious reading of the Tench case than Marvin.',
    points:[
      ['Original survey team','Damage Control’s account names George alongside Marvin, Ronald and Peter.', ['damage'], ['info']],
      ['Room 14D follow-up','Listen to George and Marvin’s conversation before the survey footage. The two colleagues place different weight on A-Sync’s explanation.', ['static'], ['leigh'], ['tench']]
    ], open:'How much of the incident did George witness directly, and what did he learn from A-Sync’s briefing?', reference:damageTranscript, frame:'map-static-beyond'},
  {id:'blume',title:'Mark Blume',type:'A-Sync field researcher',status:'Wounded in the Division 14 confrontation',refs:['pit','reunion','damage'],
    summary:'Mark works with the Division 14 team. The A-Sync incident recording identifies him as the researcher who calls for help when Peter confronts the crew.',
    why:'His radio call gives an immediate account of the confrontation, which can be checked against the later institutional account.',
    points:[
      ['Field role','In Pitfalls, Mark is part of the team at the pit chamber when Marvin becomes separated.', ['pit'], ['leigh']],
      ['Request for support','Damage Control opens with the radio call for armed support. Compare it with the final minutes of the field recording in Reunion.', ['damage'], ['reunion',675]]
    ], open:'What care or debriefing followed Mark’s injury?', reference:damageTranscript, frame:'tench-confrontation'},
  {id:'mccarthy',title:'Ronald McCarthy',type:'A-Sync field researcher',status:'Named in the survey account',refs:['info','damage'],
    summary:'Ronald is named in the survey team that entered the Complex with Peter Tench, George Levy and Marvin Leigh.',
    why:'His name helps reconstruct the team’s membership even where the suited people are hard to distinguish in the handheld footage.',
    points:[
      ['Team roster','The Damage Control briefing identifies the participants in the earlier survey. Use the spoken roster when checking the unlabelled figures in Informational Video.', ['damage'], ['info']],
      ['Separation','Peter’s camera follows his own route after separation, leaving the rest of the group’s movements largely off camera.', ['tench'], ['info']]
    ], open:'The available footage gives little evidence of Ronald’s own movements or later work.', reference:damageTranscript, frame:'tench-survey-frame'},
  {id:'clyde',title:'Clyde',type:'A-Sync employee · telephone caller',status:'Identified by the call account',refs:['recording','present','damage'],
    summary:'Clyde reports Peter Tench’s reappearance to his supervisor, Ivan Beck, after the outpost alarm.',
    why:'The call follows the incident seen in Presentation and records what gets communicated up the chain of command.',
    points:[
      ['Discovery after the alarm','The caller describes a disoriented, fully suited employee who identifies himself as Peter Tench.', ['recording'], ['tench']],
      ['One side of the line','The tape preserves the caller’s report. Beck’s reply and exact instructions remain unheard.', ['recording'], ['beck']]
    ], open:'What did Beck instruct Clyde to do, and what happened to Peter immediately afterwards?', reference:'https://kane-pixels-backrooms.fandom.com/wiki/Recording014/Transcript', frame:'recording-news'},
  {id:'tachi',title:'Randall Tachi',type:'A-Sync field researcher',status:'Named in the Room 14C roster',refs:['reunion'],
    summary:'The expedition labels in Reunion place Randall Tachi with Mark Blume and Marvin Leigh on the team assigned to Room 14C.',
    why:'The roster distinguishes Room 14C’s exploration party from the workers constructing the crossing in Room 14D.',
    points:[
      ['Room assignment','Check the team identifier and room designations in Reunion alongside the separate fieldwork around the pits.', ['reunion'], ['division']],
      ['Shared incident','The later confrontation is documented from the expedition’s viewpoint.', ['reunion',675], ['blume'], ['leigh']]
    ], open:'Individual actions are difficult to assign in the low-light footage.', reference:reunionTranscript, frame:'map-reunion-wall'},
  {id:'ff1-operator',title:'Found Footage camera operator',type:'Civilian · unidentified in the tape',status:'Final status unknown',refs:['ff1','archive'],
    summary:'The camera operator falls through the ground during a film shoot. Their footage continues through the Complex and later returns to the outside.',
    why:'The recording documents a civilian entrance and two distinct date anchors, one at entry and one associated with the recording’s ending.',
    points:[
      ['Entry and pursuit','Follow the fall into offices, the wall marks and the pursuit from the operator’s point of view.', ['ff1',55], ['ff1',490], ['figure1']],
      ['Recovered image','The ending shows the outside from the falling camera. The image alone leaves the operator’s outcome unresolved.', ['ff1',525]]
    ], open:'Did the operator escape, and how much time elapsed for them inside?', frame:'office'},
  {id:'ff2-operator',title:'Garage camera operator',type:'Civilian · Found Footage #2',status:'Final status unknown',refs:['ff2','home','car'],
    summary:'A camera operator investigates a marked area in a garage and records a fall into the Complex, a crashed vehicle and a pursuit.',
    why:'The garage entry supplies an independent civilian route. The linked home material gives visual comparisons for the domestic imagery.',
    points:[
      ['Garage access','Tape on the garage floor marks the area the operator inspects.', ['ff2',40], ['garage']],
      ['Car, growth and pursuit','The vehicle and the later movement near growth provide separate comparisons. The road clip raises a possible vehicle match.', ['ff2',505], ['ff2',620], ['car'], ['growth-figure']]
    ], open:'The recording leaves the operator’s identity and final status unresolved.', frame:'garage-tape'},
  {id:'recovered-person',title:'Unidentified person recovered by A-Sync',type:'Unidentified remains',status:'Identity unverified',refs:['missing','autopsy'],
    summary:'A-Sync finds human remains in the Complex near dark growth. The examiner reports abnormal decomposition.',
    why:'The field tape and the autopsy describe the same investigation from different vantage points.',
    points:[
      ['Recovery','The survey recording follows the notice montage and shows the discovery.', ['missing',136]],
      ['Examination','The examiner describes the condition of the body and asks Beck about its origin.', ['autopsy',30], ['beck']]
    ], open:'Which person was recovered, and how did the remains reach the Complex?', frame:'recovered-remains'}
].map(record => ({...record,group:'people',section:record.id === 'recovered-person' ? 'Missing and recovered' : record.id.startsWith('ff') ? 'Civilian recordings' : 'A-Sync personnel'}));

const missingPersons = [
  ['bolton','Nicolas Bolton',2,'notice-bolton','A notice attached to a utility pole appears early in the montage. The displayed name is transcribed in reference material.'],
  ['watson','Margaret Watson',10,'notice-watson','Her notice is shown lying outside. The reported last-seen date belongs to the notice and leaves the circumstances of her disappearance open.'],
  ['unidentified-notice','Unidentified man on reward notice',18,'notice-reward','A notice with a portrait and a reward line appears indoors. The indexed material leaves the person’s name unverified.'],
  ['white','Ellis White',28,'missing-notice-frame','A notice with White’s name is shown on glass. The surrounding montage links it to the subject of reported disappearances.'],
  ['scott','Janice Scott',34,'notice-scott','Her notice appears in the montage before the graph of missing-person reports. The name is transcribed in reference material.'],
  ['esmail','James Esmail',null,null,'A secondary episode reference identifies Esmail in a brief insert during the transition to the graph.']
].map(([id,title,seconds,frame,summary]) => ({
  id:'missing-'+id, title, group:'people', type:'Missing Persons montage', section:'Missing and recovered',
  status:frame ? 'Notice shown · fate unverified' : 'Brief notice · secondary identification', refs:['missing'], frame,
  summary, why:'The notice records a reported disappearance. The montage and subsequent recovery are separate strands of evidence.',
  points:[['Notice and montage','Check the notice in context with the other missing-person reports and the graph that follows.', ['missing',seconds ?? 0]]],
  open:'The available material leaves the circumstances and this person’s fate unresolved.', reference:missingPosterSource
}));

const additionalPeople = [...personnelAdditions,...missingPersons];
const personnelFileNotes = {
  beck:{status:'Vice-director · decision trail incomplete',frame:'corkboard',counterparts:['clyde','tench','async']},
  tench:{status:'Deceased in A-Sync’s account · circumstances disputed',frame:'tench-confrontation',counterparts:['beck','clyde','blume','levy','leigh']},
  leigh:{status:'Field witness · Division 14',frame:'pit-shaft',counterparts:['levy','blume','tench']},
  ravi:{section:'Civilian recordings',status:'Final status unknown',frame:'ravi-camera'},
  async:{section:'Organisation',status:'KV31 research and operations',frame:'model',counterparts:['beck','film-phil']},
  'film-clark':{status:'Showroom access · feature',frame:'film-clark-frame',counterparts:['film-mary','film-kat','film-bobby'],
    points:[['Mapping the entry','Clark recruits Kat and Bobby after discovering the basement doorway. Compare this planned exploration with the sudden entry in Found Footage #2.', ['film-showroom'], ['ff2']],['Replica evidence','The Captain Clark file links the hostile figure to the costume used in Clark’s advertisement.', ['film-captain']]],open:'How much of what Clark encounters can be traced to his memories or to objects the Complex encounters?'},
  'film-mary':{status:'Recovered by A-Sync · release unresolved',frame:'film-mary-frame',counterparts:['film-clark','film-phil'],
    points:[['Reason for entry','Mary searches for her missing patient and encounters spaces reminiscent of her own childhood.', ['film-clark'], ['film-replicas']],['Interview and duplication','Phil interviews Mary after the recovery. The feature’s closing image adds a second observation involving her likeness.', ['film-phil'], ['film-still-lifes']]],open:'What does A-Sync do with Mary after the interview?'},
  'film-kat':{status:'Civilian expedition · feature',counterparts:['film-clark','film-bobby'],
    points:[['Expedition team','Clark brings Kat and her boyfriend Bobby on his exploratory trip. Their participation establishes a civilian group at the entrance.', ['film-clark'], ['film-bobby'], ['film-showroom']]],open:'The film gives limited evidence about the expedition from Kat’s individual viewpoint.'},
  'film-bobby':{status:'Camera operator · feature',counterparts:['film-clark','film-kat'],
    points:[['Handheld record','Bobby carries the camera during the showroom expedition. Compare how the recording limits what can be seen during the encounter.', ['film-showroom'], ['ff1']],['Expedition encounter','The archived film spoiler notes follow the incident and the figure that appears.', ['film-captain'], ['feature']]],open:'Which details in the encounter can be established from Bobby’s camera?'},
  'film-phil':{status:'A-Sync observer · feature',counterparts:['film-mary','async'],
    points:[['Monitoring the Complex','Production notes identify Phil as the scientist assigned to oversee observations of the Complex.', ['async'], ['feature']],['Recovering a witness','In the ending, Phil questions Mary. His authority over what happens next remains unclear.', ['film-mary']]],open:'How much discretion does Phil have in handling civilians, and who makes the final decision?'}
};

const investigations = [
  ['threshold-quake','Experiments','Causation unproven','Did the sixth test cause the Loma Prieta earthquake?',
    'The test and the real earthquake share 17 October 1989. The linked news footage makes the parallel deliberate.',
    'The dated overlap establishes a connection in the presentation of the story. There is no independent measurement in either tape establishing a physical cause.',
    'Compare the on-screen test clock with the independently recorded quake time. Look for a second pair of records linking a test and a tremor.',
    ['first','fault','threshold'],'opening','loma-prieta'],
  ['ivan-orders','A-Sync','Missing account','What did Ivan Beck know and authorize?',
    'Beck’s public housing and storage pitch, the signed 1972 document, the autopsy address and Clyde’s call give four different traces of his involvement.',
    'The document dates the paperwork. The call records Clyde’s report and leaves Beck’s response unheard.',
    'Read the pitch and the call side by side. Separate what Beck is explicitly attributed from what viewers infer about his decisions.',
    ['beck','overflow','third','autopsy','clyde','recording'],'corkboard','clyde-calls-beck'],
  ['tench-time','Chronology','Conflicting date','How much time passed for Peter Tench?',
    'Informational Video labels the survey with an impossible calendar date. The return overlaps with the Department of Energy visit in Presentation.',
    'The two tapes give separate viewpoints, and the exact survey day and Tench’s subjective elapsed time remain unresolved.',
    'Review the return sequence in both recordings and track the outpost layout and the alarm separately from the title-card date.',
    ['tench','info','present','recording'],'outpost','tench-returns'],
  ['tench-fate','A-Sync','Conflicting accounts','What happened to Tench after the confrontation?',
    'Reunion records the confrontation. Damage Control acknowledges the staged crash story and gives a later account of his death. Marvin and George discuss it in Static Dead End.',
    'The briefing and witness accounts have different limits. Marvin’s suspicions establish that he doubts the official version.',
    'Make a sequence of footage, the staff briefing and the later discussion. Identify the gap each source leaves.',
    ['tench','reunion','damage','static','blume','levy'],'tench-confrontation','damage-control'],
  ['civilian-fates','Civilian cases','Identity unverified','Which civilian disappearances can be linked to the Complex?',
    'Missing Persons juxtaposes notices and a recovery. Other tapes document individual civilian entry routes.',
    'The remains have no confirmed identity in the archive. The recovered footage and notice montage leave individual fates open.',
    'Trace each person with a distinct source. Compare last-seen evidence and recorded entries before proposing a match.',
    ['missing','recovered-person','autopsy','ff1-operator','ff2-operator','ravi'],'missing-notice-frame','missing-notices'],
  ['road-car','Civilian cases','Possible match','Is the vanishing road car the one found in the Complex?',
    'The road clip shows a car disappear. Found Footage #2 shows a crashed vehicle inside the garage route.',
    'The project has no verified match for the vehicle, driver or incident dates.',
    'Compare model, body details and any readable markings. Treat the linked upload and the case for identity as separate evidence.',
    ['car','ff2','garage','ff2-operator'],'crashed-car','road-vehicle'],
  ['entity-identity','Sightings','Identity unverified','Which encounters involve the same kind of figure?',
    'The first found footage, the house in Pitfalls, the growth room and Kelowna all record encounters. Camera 5 shows an ambiguous shape.',
    'Similar movement and silhouettes can arise under different lighting, occlusion and camera angles. The feature also shows humanlike replicas.',
    'Compare each sighting by visible shape, movement, sound and setting before grouping them.',
    ['figure1','house-figure','growth-figure','motion-shape','retail-figure','film-still-lifes'],'figure-gap','room-14d'],
  ['growth','Sightings','Mechanism unknown','What links the recovered body, the growth and later encounters?',
    'The examination reports abnormal decomposition. Found Footage #2 later records growth and movement in the same sequence.',
    'The growth’s role and the relationship between the two recordings remain unsettled.',
    'Separate the spoken examination findings from what can be seen near the body and in the civilian footage.',
    ['autopsy','missing','ff2','growth-figure'],'growth-room','autopsy'],
  ['space','Cartography','Route incomplete','Which parts of the Complex can be connected on a map?',
    'The Threshold, outpost and Room 14D recur across specific surveys. Civilian routes and the feature establish additional entries.',
    'The drawings and footage preserve local routes. A continuous route from the Threshold to the garage or showroom remains undocumented.',
    'Match stable landmarks across visits and distinguish local orientation from an inferred connection between areas.',
    ['threshold','division','yellow','garage','film-showroom','kelowna'],'pit-grid','room-14d'],
  ['replication','Cartography','Mechanism unknown','Why do familiar objects and rooms recur?',
    'The linked home tape, the Kelowna Branch and the feature show echoes of domestic and retail imagery. The lighting survey records physical samples.',
    'Some resemblances are specific enough to compare. Distance, shared origin and the process behind the similarities remain open.',
    'Compare materials, layout and object details across the tapes before treating two similar views as one location.',
    ['home','ff2','lighting','everything','film-replicas'],'kelowna-tv','kelowna-pursuit'],
  ['signals','Chronology','Timing unverified','Where do the voices and broadcasts come from?',
    'Ravi attempts contact by radio and through a wall. The linked TV tape juxtaposes media with different dates.',
    'The signal dates and their route into the Complex remain uncertain. A recognizable broadcast is evidence about its content.',
    'Keep speech, radio signals and recorded television on separate evidence lines. Compare their apparent time anchors.',
    ['ravi','ff3','simpsons','present'],'ravi-radio','ravi-contact'],
  ['feature-date','Chronology','Approximate year','Where does the film sit among A-Sync’s 1990 tapes?',
    'Production notes place the film around 1990. Everything Must Go connects its theatrical bonus edition to the Kelowna recording.',
    'The order of the feature events relative to individual dated field tapes remains open.',
    'Compare dated records and shared institutional details before trying to place the showroom and Mary’s recovery on specific days.',
    ['feature','film-mary','film-phil','everything','kelowna'],'film-mary-frame','showroom-entry']
].map(([id,topic,status,title,known,unknown,next,refs,frame,event]) => ({id,topic,status,title,known,unknown,next,refs,frame,event}));

// Review notes identify what to look for before carrying a claim across records.
const fileReviewNotes = {
  ff1:['Recovered camcorder footage','Treat the film shoot, the pursuit and the outside view as separate segments. The ending shows the camera leaving the space, and the operator’s fate is a separate question.',['ff1-operator','figure1','archive']],
  archive:['Description-linked digital archive','Inspect the filename separately from any labels inside the montage. A file name, the date shown in an image, and the date the compilation was assembled can describe different things.',['ff1','yellow']],
  third:['Narrated experiment record','The explanation of Beck’s press conference is delivered by narration. The experiment footage supplies a separate first-hand record of the apparatus.',['beck','proto','first']],
  first:['Fixed camera · experiment log','Use the timestamp on the test footage and the visible change at the opening. Keep the clock on the tape separate from the independently recorded quake time.',['fault','threshold']],
  fault:['Description-linked archival news','The broadcast supplies a historical reference date. Use the geological record for the quake’s measured time and magnitude.',['first']],
  missing:['Montage and field recording','The notices and graph give the public context. The field camera supplies a separate evidence strand about the recovery. An established name needs a specific link between those strands.',['recovered-person','autopsy']],
  info:['Orientation and field recording','Compare the narrated safety instructions with the route the camera actually follows. Compare the return against the outpost view in Presentation.',['tench','present','threshold']],
  autopsy:['Examiner’s account','Transcribe what the examiner reports before comparing the visible growth. The examination is an in-story assessment with its own limits.',['recovered-person','missing','growth-figure']],
  motion:['Fixed cameras · original and enhanced views','Follow the order of the views. A feature inside the circled area carries more weight if it can be traced in the wide view as well as the enhancement.',['motion-shape','threshold']],
  proto:['Pre-Threshold experiment record','Compare the location and equipment labels with the Third Test narration. The first sustained passage is documented separately in First Contact.',['third','first']],
  pit:['Handheld field tape · Marvin’s viewpoint','Divide the footage into the crossing, fall, street approach and encounter. The apparent source of the voice in one section can remain unresolved even where movement is visible in another.',['leigh','division','house-figure']],
  report:['Internal review and intervention','Distinguish the footage replayed for staff from the subsequent barrier installation. The barrier is a physical change that can be checked in Reunion.',['pit','reunion','division']],
  car:['Description-linked road camera','Record the point in the frame where the car disappears. Use only visible vehicle details when comparing it with the garage footage.',['ff2','garage']],
  present:['Internal demonstration and incident footage','The model depicts A-Sync’s proposal. The camera at the outpost documents actual infrastructure and a separate intervention during the visit.',['async','tench','info']],
  simpsons:['Linked television recording · attribution reported','Date any identifiable segment independently. Different broadcast dates can coexist in the recorded signal, so note which component supports each inference.',['present','ff3']],
  ff2:['Recovered civilian footage','Trace the marked garage floor, the crashed car and the growth room as separate observations. Each has its own potential cross-reference.',['ff2-operator','garage','home','car']],
  home:['Description-linked home montage','Use the painting and other identifiable details to compare interiors. The montage combines different shots, so avoid assigning one date to all of them.',['ff2','garage']],
  remember:['Creator upload · narrative placement unresolved','Use repeated interiors and sound as comparison material. Identifying the speaker would require evidence beyond similarity of tone or motif.',['yellow','beck']],
  reunion:['Handheld survey and construction record','Follow the reopening and walkway construction before the confrontation. Match team designations and room numbers against the staff briefing where possible.',['division','tachi','blume','damage']],
  recording:['Description-linked call · one audible participant','The caller supplies the report of Peter’s return. Timing and identities can be cross-checked with Presentation and Damage Control.',['clyde','beck','present','damage']],
  overflow:['Equipment tape and dated document','Record the timestamp of the document shot separately from any date appearing on it. Its presence is one piece of evidence about Beck’s connection to the early equipment.',['beck','proto','third']],
  damage:['Staff briefing and incident material','Track which details come from the radio call, the field or surveillance material, and the institution’s spoken account.',['blume','reunion','static','tench']],
  ff3:['Recovered civilian tape · Ravi’s viewpoint','Separate the exchange at the wall, the radio experiment, and the visible encounters. They offer different evidence of who or what might be nearby.',['ravi','ravi-figures','simpsons']],
  lighting:['Field extraction and material report','Compare the objects shown during removal with the dimensions and markings reported afterwards. Those are useful evidence about the samples and their resemblance to familiar fittings.',['yellow','threshold']],
  static:['Conversation and later field survey','The early conversation is evidence about staff opinions. The later view behind Room 14D’s door is a separate observation about the site.',['levy','leigh','division','damage']],
  everything:['Field tape and theatrical bonus recording','Follow the repeated signs, the wall intervention and the retail encounter in that order. Use the feature’s retail imagery as a comparison while the route between them remains open.',['kelowna','retail-figure','feature']],
  feature:['Feature film · trailer and production material','The trailer frames identify visual subjects. The chronology comes from production notes and the feature’s events. Check the showroom route separately from A-Sync’s engineered entry.',['film-showroom','film-mary','threshold','everything']],
  threshold:['Engineered entrance and observation infrastructure','The Threshold is the opening. The outpost is the observation area on the Complex side. That distinction makes it easier to align the test footage, training tape and camera plan.',['first','info','motion','present']],
  yellow:['Recurring visual motif','Match pillar shape, wall markings and corridor arrangements before treating two yellow interiors as the same place.',['ff1','info','lighting']],
  division:['Repeat visits with documented changes','Use the timber partition and pit grid as anchors. The walkway in Reunion records a later change at the same survey area.',['pit','report','reunion','static']],
  street:['View from a civilian-looking setting inside the Complex','The red light, street and house are landmarks in Marvin’s route. The distance to the pit grid and the scale of the surrounding area are unknown.',['pit','leigh','house-figure']],
  garage:['Civilian entry and later interior route','The blue tape identifies the entry area. The damaged car appears deeper in the recording. Check the road clip independently for a potential match.',['ff2','car','ff2-operator']],
  kelowna:['Survey sector · local route','The June field tapes show repeated signs and a way through a wall. They give a local sequence without resolving the branch’s position relative to the feature showroom.',['everything','film-showroom']],
  figure1:['Observed pursuit','Check the source frame through the gap and the creator’s thumbnail separately. The thumbnail gives a wider view, with no assigned timestamp.',['ff1','house-figure']],
  'motion-shape':['Low-resolution surveillance observation','Compare the wide view, marked region and enhancement in order. Shape and movement are stronger claims than identification at this distance.',['motion']],
  'house-figure':['Sight and sound in one encounter','Record when the voice is heard and when a figure becomes visible. The timing helps assess whether both observations belong together.',['pit','report','street']],
  'growth-figure':['Backlit pursuit sequence','Use the room view to study the growth. Use the pursuit footage to study movement. These views have different visibility and support different claims.',['ff2','missing','autopsy']],
  'ravi-figures':['Multiple visible encounters','Keep distinct pursuit or rush sequences separate and compare lighting and camera movement before proposing a match.',['ff3','ravi']],
  'retail-figure':['Brief costumed figure sighting','The visible costume gives a useful comparison point. Similar retail imagery leaves the figure’s relationship to the feature unresolved.',['everything','kelowna','film-captain']]
};
