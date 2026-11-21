// Each finding points to the archive records the reader can inspect.
// A timestamp is included only when it identifies a specific published cue.
const briefings = {
  ff1: {
    why: 'The first released tape establishes the civilian side of the story. Someone can enter the Complex during an ordinary activity, far from the engineered Threshold used by A-Sync.',
    points: [
      ['Accidental entry','An amateur film shoot becomes a first-person record after the camera operator falls through the ground. The yellow office rooms are the first recognisable region he encounters.',['ff1',55]],
      ['A route with gaps','Arrows and graffiti precede the first pursuit. Drops, climbs and cuts make the order of some rooms traceable while leaving their positions relative to each other uncertain.',['ff1',210],['yellow']],
      ['Two different dates','The opening is generally placed in July 1991. The upload description gives September 23, 1996, associated with the camera’s return. The tape’s first and last scenes belong at different points on the timeline.',['ff1'],['archive']]
    ],
    open: 'Does the camera’s return tell us anything about the operator’s fate or how much time he experienced inside?'
  },
  archive: {
    reference: 'https://kane-pixels-backrooms.fandom.com/wiki/Mar11_90_ARCHIVE.tar',
    why: 'This description-linked file is an early example of the wider A-Sync story hiding underneath a civilian upload. It gives still images that can be compared with the later research tapes.',
    points: [
      ['Project material','The slideshow includes technical-looking diagrams, rooms and workspaces. Treat it as a collection of records with individual subjects.',['archive']],
      ['Null Zone 4','An annotated image labels an area as Null Zone 4 and refers to a discrepancy in elevation. It provides a named research clue and limited information about what a null zone does.',['archive']],
      ['Two possible archive dates','The filename points to March 11, 1990. The episode reference gives June 1991 as the compilation date. The same file can contain records created earlier than the compilation.',['archive'],['ff1']]
    ],
    open: 'Which stills show the Complex, and which show the facility or its equipment?'
  },
  third: {
    reference: 'https://kane-pixels-backrooms.fandom.com/wiki/The_Third_Test',
    why: 'This tape introduces the project’s institutional goal and the first evidence in release order for Ivan Beck’s position. It gives the Threshold a research history and an economic motive.',
    points: [
      ['Beck’s position and pitch','The narration identifies Ivan Beck as vice-director and attributes a public appeal for government backing to him. His proposed benefit was cheap capacity for housing and storage.',['third'],['beck']],
      ['An early test','The narration dates the third Low-Proximity Magnetic Distortion System test to July 2, 1988. The rig produces a disturbance that collapses again.',['third']],
      ['Compare the sixth test','First Contact shows a passage that remains visible and can be approached after the activation. This is the clearest contrast between the two recordings.',['first',103]]
    ],
    open: 'How much did A-Sync understand about the far side at the time of the third test?'
  },
  first: {
    why: 'The sixth test establishes the Threshold as a usable connection between A-Sync’s facility and the yellow office rooms. The research expeditions depend on that access.',
    points: [
      ['Date of the opening','The test recording places the event on October 17, 1989. Keep this in-story date separate from the upload date.',['first',103]],
      ['A way through','After a chaotic activation sequence, the apparatus frames a lit corridor. The closing views establish the physical threshold between the two spaces.',['first',103],['threshold']],
      ['Earthquake comparison','The companion news footage covers the Loma Prieta earthquake on the same date. Watch the pair to see the suggested link between the test and events outside.',['fault']]
    ],
    open: 'The matching date suggests a connection. What evidence would distinguish the test causing the earthquake from the two events simply coinciding in the story?'
  },
  fault: {
    why: 'The earthquake news clip anchors the fictional sixth test to a real event and expands the scope of the story to effects beyond the research facility.',
    points: [
      ['Archival news','The companion clip uses real coverage of the Loma Prieta earthquake. The event provides a date that can be compared with the timestamp in First Contact.',['fault'],['first',103]],
      ['An inference about cause','Neither the newscast nor the test footage explains the mechanism tying the two events together. The relationship comes from placing the recordings side by side.',['fault'],['first']]
    ],
    open: 'Is the earthquake a consequence of opening the Threshold, a contributing condition, or a narrative parallel?'
  },
  missing: {
    why: 'The episode puts missing civilians and A-Sync’s work in the same story. A body recovered inside the Complex gives the first concrete point of comparison with the missing-person material.',
    points: [
      ['Missing-person notices','The opening montage establishes the disappearances as a public problem before the footage moves underground.',['missing',39]],
      ['Discovery in the Complex','The expedition finds a body against a wall near dark growth. The later autopsy continues the case and addresses the condition of the remains.',['missing'],['autopsy']],
      ['A recurring visual clue','Compare the growth with the later recording in Found Footage #2. Similar appearance gives a line of inquiry about the environment and its effects.',['ff2',600],['growth-figure']]
    ],
    open: 'The tape leaves the recovered person’s identity open. It also leaves open how many of the disappearances share this cause.'
  },
  info: {
    why: 'This tape establishes A-Sync’s planned procedures, then shows how far a real survey can depart from them. The missing surveyor is Peter Tench, whose story continues across several later records.',
    points: [
      ['Training versus field conditions','The introductory instructions set expectations about the Threshold and how staff should move through the Complex. Peter’s separation shows the limits of those procedures.',['info'],['threshold']],
      ['An altered return','Peter comes back to an observation outpost that appears unfamiliar. Compare the alarm and return with the same incident from the briefing side in Presentation.',['info'],['present'],['tench']],
      ['An impossible date','The upload description gives February 29, 1990. Since 1990 was not a leap year, treat the printed date as part of the record and its calendar placement as uncertain.',['info']]
    ],
    open: 'Does the anomalous date indicate a deliberate clue, or is the time displacement better established by the later accounts of Peter’s return?'
  },
  autopsy: {
    why: 'The autopsy is the series’ clearest medical account of what happened to a recovered body. It also establishes Beck as a point of contact after a field discovery.',
    points: [
      ['Examiner’s observations','The examiner reports abnormal decomposition and associates the growth with an unusual form of hay bacillus. This is a finding reported by the examiner within the story.',['autopsy']],
      ['Beck is addressed','The examiner asks Beck about where the body came from. The exchange helps connect the medical material with A-Sync leadership.',['autopsy'],['beck']],
      ['Compare the later growth','Found Footage #2 shows growth around a sighting. The autopsy and later footage document different kinds of evidence and leave the biological relationship open.',['missing'],['ff2',600]]
    ],
    open: 'Does the growth affect the body after death, or could it also contribute to what happens to living people?'
  },
  motion: {
    why: 'The surveillance system captures an event without a researcher holding the camera. It supplies a different kind of entity evidence, with a fixed angle and an in-video enhancement.',
    points: [
      ['Baseline footage','The compilation shows staff and activity near the Threshold before the unusual detection. These ordinary clips help set the scale and explain how the cameras are used.',['motion']],
      ['Camera 5','The recording first presents the wide shot, then circles and enlarges a region near a distant wall. Review the views in order to see which details persist.',['motion',220],['motion',240]],
      ['Limits of the image','The preview is small and the source itself has been enhanced. The visible movement supports an ambiguous sighting.',['motion-shape']]
    ],
    open: 'Which details belong to a moving subject, and which could result from the distance, lighting or enhancement?'
  },
  proto: {
    why: 'The prototype places work on magnetic distortion years before the successful opening. The project develops over time and through multiple tests.',
    points: [
      ['An early trial','The tape is generally placed in 1982 and identifies a prototype associated with Oak Ridge National Laboratory.',['proto']],
      ['A comparison across tests','Watch it alongside the 1988 third test and the 1989 sixth test. Compare apparatus behaviour, what appears at the opening and what remains when the test ends.',['third'],['first']]
    ],
    open: 'How closely does the prototype relate to the earlier equipment in Overflow? The tapes leave several years of development undocumented.'
  },
  pit: {
    why: 'Marvin’s fall reveals that the Complex includes residential streets and interiors beyond the office rooms. His recording also prompts A-Sync’s response in Report.',
    points: [
      ['Room 14D','A grid of pits interrupts the survey route. Mark crosses towards a door. Marvin falls while attempting the crossing.',['pit',265],['division']],
      ['Street, house and cries','After the fall, Marvin reaches a red-lit street and follows cries towards a house. Listen to the timing of the cries relative to what the camera sees.',['pit',555],['pit',650]],
      ['Recorded pursuit','A figure pursues Marvin inside. The subsequent review treats the incident as serious enough to justify restricting Division 14.',['house-figure'],['report']]
    ],
    open: 'The tape gives one descent route. The destinations of the other pits and the origin of the cries remain open.'
  },
  report: {
    why: 'This is A-Sync’s response to the house encounter. It turns a field discovery into a decision about who can enter Division 14.',
    points: [
      ['The earlier recording is replayed','The briefing examines Marvin’s footage from Pitfalls. A repeated shot here is a record of the same encounter.',['report'],['pit']],
      ['Division 14 is restricted','Access to the surveyed area is closed after the review. Reunion later shows the team going back in.',['report'],['reunion']],
      ['An extra lead in the description','The upload links to 9780415263573, the short highway recording. Its placement invites comparison with civilian anomalies.',['car']]
    ],
    open: 'What procedure or evidence convinced A-Sync to reopen the route by Reunion?'
  },
  car: {
    reference: 'https://en.wikipedia.org/wiki/Backrooms_(web_series)#Episodes',
    why: 'This description-linked clip shows an apparent entry event from a stationary camera. A car-sized object can vanish from an ordinary road, extending the pattern seen in civilian recordings.',
    points: [
      ['A vehicle disappears','The short black-and-white road view records a car dropping out of sight into the roadway.',['car']],
      ['The comparison shot','Found Footage #2 later shows a crashed car in a large room. Compare exterior details before calling them the same vehicle.',['ff2',505]],
      ['The title is a clue','Episode references identify the number as an ISBN associated with The Yellow Wallpaper. Treat this as a literary reference alongside the events depicted.',['car']]
    ],
    open: 'Is the road clip the source of the vehicle in Found Footage #2, and what would confirm the match?'
  },
  present: {
    why: 'A-Sync presents A-Space as a development opportunity while field records are exposing the risks. It also gives an official-facing perspective on the alarm from Informational Video.',
    points: [
      ['The business case','The proposal and scale model show how A-Sync imagines using the Complex for storage and development. This elaborates the earlier rationale attributed to Beck.',['present',385],['third']],
      ['Two views of one interruption','The alarm during the visit coincides with Peter’s return. Compare the visitor side with the end of Peter’s field recording.',['present',420],['info']],
      ['What happens next','The linked call in _recording014 describes staff dealing with an unexpected person after the Department of Energy visit.',['recording']]
    ],
    open: 'How much of the field evidence did the visitors hear about before or during the contract review?'
  },
  simpsons: {
    why: 'The supplemental TV clip puts ordinary broadcast material with apparently different dates into a single recording. It is a small comparison case for the series’ larger timing anomalies.',
    points: [
      ['Two recognisable pieces of television','A Simpsons segment is interrupted by a Spanish-language advert. The dates attributed to the two pieces are clues to compare.',['simpsons']],
      ['Keep content date and recording date distinct','A programme’s first air date, the date of a later broadcast and the date someone records it can differ. The juxtaposition alone cannot date the tape.',['simpsons'],['present']]
    ],
    open: 'Does the edit represent a time anomaly in the story, a broadcast interruption, or an unexplained juxtaposition?'
  },
  ff2: {
    why: 'The second civilian tape opens several comparison routes at once. Its garage entry, crashed car, domestic imagery and growth echo clues from other records.',
    points: [
      ['The garage anomaly','Blue tape marks the area on the garage floor before the camera operator enters the Complex. It is a separate civilian point of entry from the first tape.',['ff2',40],['garage']],
      ['Compare the car and painting','The crashed vehicle can be checked against the highway clip. Look for the painting when comparing the Complex interior with the linked home recordings.',['ff2',505],['car'],['home']],
      ['The later encounter','Dark growth, a pursuit and green light occur in sequence. Keeping those observations separate helps when comparing this sighting with the autopsy and other chases.',['ff2',600],['growth-figure']]
    ],
    open: 'Which repeated objects imply a shared origin, and which simply show that the Complex can reproduce familiar imagery?'
  },
  home: {
    why: 'The description-linked home tape supplies a reference outside the main chase. A painting and domestic details can be checked against visually similar imagery in Found Footage #2.',
    points: [
      ['A montage of records','The file contains family imagery and stills. Their presence in one montage does not place every clip at the same time or address.',['home']],
      ['Compare the painting','Identify features such as subject, frame and placement, then compare the house imagery with the green-lit painting in the Complex recording.',['home'],['ff2']]
    ],
    open: 'Is the Complex showing the same physical place, a copy of something familiar, or a visual echo?'
  },
  remember: {
    why: 'This supplemental Kane Pixels upload adds a theme of memory and lost interiors. It provides parallels for interpretation while its narrative placement remains open.',
    points: [
      ['Voice and imagery','A distorted narration accompanies liminal interiors. Its tone and setting are useful for comparing motifs across the series.',['remember']],
      ['The Beck theory','Some viewers connect the narration or repeated sound cues with Beck. His documented role comes from the named references and signature in other tapes.',['remember'],['beck'],['overflow',77]]
    ],
    open: 'Who is speaking, and does the upload describe a specific in-story event?'
  },
  reunion: {
    why: 'Division 14 reopens and the missing-person strand collides with the expedition strand. Peter’s account challenges how his disappearance was handled by A-Sync.',
    points: [
      ['Return to the pits','The upload description gives May 25, 1990. Staff return to Division 14 and begin work around the pits.',['reunion'],['division']],
      ['Peter confronts the team','Peter appears, holds the group at gunpoint and tells them that A-Sync made his family believe he was dead. This leads to the confrontation covered in Damage Control.',['reunion',675],['tench'],['damage']],
      ['Description-linked call','Reunion links out to _recording014. The call concerns the earlier return during the Department of Energy visit, so the link connects two events released together.',['recording'],['present']]
    ],
    open: 'What did the field crew know about Peter’s earlier return before he confronted them?'
  },
  recording: {
    reference: 'https://kane-pixels-backrooms.fandom.com/wiki/Recording014/Transcript',
    why: 'The short call is one of the strongest sources on Ivan Beck’s role in the Tench incident. It connects the Department of Energy visit, the alarm and A-Sync’s hidden response.',
    points: [
      ['Who calls whom','Clyde asks for his supervisor, Ivan Beck. The recording follows Clyde’s side of the call, so Beck’s replies must be inferred from what Clyde says.',['recording'],['beck']],
      ['The name that changes the call','Clyde reports finding a disoriented, suited employee who says he is Peter Tench. His reaction changes as the significance of that name becomes clear.',['recording'],['tench']],
      ['The newspaper insert','The wreck headline can be compared with the later briefing about Peter’s staged death. It is a visual clue alongside the conversation.',['recording'],['damage']]
    ],
    open: 'The missing half of the call leaves Beck’s precise instructions and reasoning uncertain.'
  },
  overflow: {
    reference: 'https://kane-pixels-backrooms.fandom.com/wiki/Overflow/Transcript',
    why: 'The 1972 date on Beck’s document places his name much earlier than the 1988 public pitch in The Third Test. It gives the KV31 storyline deeper roots without providing a full account of the early research.',
    points: [
      ['Equipment event','A warning light and green illumination interrupt the recording. The tape gives little explanation of what the equipment was designed to do.',['overflow']],
      ['The document','The close-up links the name Ivan Beck to a document dated August 2, 1972. The date belongs to the document and is a clue for placing the scene.',['overflow',77],['beck']],
      ['Compare the later experiments','Prototype and The Third Test offer later milestones for magnetic-distortion work. Connections between all three recordings require inference.',['proto'],['third']]
    ],
    open: 'Does the signed document establish a connection to the equipment event, or only that Beck’s paperwork was present?'
  },
  damage: {
    why: 'A-Sync’s account of Peter Tench reframes the previous tapes. The institution acknowledges that the crash story was staged and offers its own explanation of what happened after the shooting.',
    points: [
      ['Confrontation aftermath','The tape follows the disturbance from Reunion and includes surveillance of Peter’s escape.',['damage'],['reunion']],
      ['A staged public account','The briefing says A-Sync arranged a cover story about Peter’s death after the disappearance. Compare the briefing with his anger about his family in Reunion.',['damage'],['recording']],
      ['Later doubt','The institution gives an account of his eventual death. Marvin and George discuss it in Static Dead End and voice different levels of trust in the explanation.',['damage'],['static']]
    ],
    open: 'Which parts of the final account have an independent recording, and which depend on A-Sync’s briefing?'
  },
  ff3: {
    why: 'Ravi’s tape expands the Complex beyond the familiar office loops. It also shows how sound, radio traffic, and another person’s voice can become clues across spaces.',
    points: [
      ['A named civilian viewpoint','Ravi is visible in the opening. His basement entry leads to domestic interiors, industrial-looking spaces, a skywalk and a city-like view.',['ff3',70]],
      ['Attempts at contact','Radio equipment and a conversation through a wall give Ravi two different ways to reach someone. Their origins and timing matter to the interpretation.',['ff3',1540]],
      ['Review sightings separately','A pursuit and a later rush occur in distinct sequences. Compare each shot and sound before grouping the figures as one entity.',['ravi-figures']]
    ],
    open: 'Where do the voices and transmissions originate, and do their apparent dates line up with Ravi’s recording?'
  },
  lighting: {
    why: 'The survey is one of the few tapes where A-Sync brings ordinary material out of the Complex and measures it. The results make the resemblance to office construction testable.',
    points: [
      ['Samples are taken','The field crew removes a ceiling tile and a fluorescent light fitting. The upload description dates the survey to November 14, 1989.',['lighting']],
      ['Familiar components, unusual dimensions','The lab reports odd proportions and records manufacturing details from some components. Recognisable markings give a lead about their origins.',['lighting']],
      ['Questions about power','The field discussion calls attention to how the fixture is able to work. Compare the extraction sequence with other tapes that show illuminated rooms.',['lighting'],['yellow']]
    ],
    open: 'Are the fixtures transported objects, copies of objects, or something that only approximates the originals?'
  },
  static: {
    why: 'This tape revisits two unresolved issues at once. Marvin questions the explanation for Peter’s death, and the survey returns to the space behind the door in Room 14D.',
    points: [
      ['Marvin and George disagree','Marvin suspects the official account leaves something out. George offers a more sceptical response. Their conversation documents competing in-story perspectives.',['static'],['damage']],
      ['Beyond the door','A follow-up route shows stretched or intersecting architectural features and furniture. Compare the approach with the door opened in Pitfalls.',['static'],['pit',310],['division']]
    ],
    open: 'The conversation raises a suspicion about Peter’s death. The later route evidence concerns the room, and the two clues carry different weight.'
  },
  everything: {
    why: 'The Kelowna survey shows A-Sync testing a prediction about duplicated signage, then finding a much larger interior. It is also a bridge between the web archive and the film’s imagery.',
    points: [
      ['Study of the repeated signs','The survey begins on June 18, 1990. Sale signs recur across the room, and the team examines where further copies might be.',['everything'],['kelowna']],
      ['Opening the wall','An intervention exposes a retail space beyond the apparent boundary. A television and later pursuit place the anomaly inside a recognisable kind of setting.',['everything',760],['everything',930]],
      ['A separate encounter','A costumed figure appears in the retail interior. The association with film imagery is useful context for the sighting.',['retail-figure']]
    ],
    open: 'Does the retail space preserve a particular original location, or reproduce parts of it in a different arrangement?'
  },
  beck: {
    reference: 'https://kane-pixels-backrooms.fandom.com/wiki/Ivan_Beck',
    why: 'Ivan Beck is A-Sync’s vice-director and a senior figure in the KV31 story. His public pitch explains why the institute wants to use the Complex. His name in the autopsy and Tench records connects that pitch to the private handling of incidents.',
    points: [
      ['What he wanted','The Third Test attributes an April 1988 press conference to Beck. He argues that government support could turn the research into a way to meet housing and storage needs while reducing costs.',['third']],
      ['How far back he appears','Overflow shows a document dated August 2, 1972 bearing his name. This is an earlier trace of Beck than the public KV31 pitch. His exact role in the equipment event is uncertain.',['overflow',77]],
      ['Why staff call him','The examiner addresses Beck about the recovered body. Later, Clyde names Beck as his supervisor and calls him after Peter Tench turns up during the Department of Energy visit.',['autopsy'],['recording'],['tench']],
      ['What counts as a likeness','The score cover is creator artwork associated with Beck by fans. The web-series case for his identity rests on named references, the call and the signed document.',['overflow'],['third']]
    ],
    open: 'The tapes establish Beck’s title and involvement. They leave his exact orders after Tench’s return and the nature of his earlier work uncertain.'
  },
  tench: {
    why: 'Peter Tench is the A-Sync researcher whose disappearance and return connect the strongest time-displacement evidence to the institute’s cover story.',
    points: [
      ['Separated on survey','Peter is cut off from his group while documenting the Complex. When he returns, the Threshold outpost appears different from the one he remembers.',['info'],['present']],
      ['Found again','Clyde reports finding Peter disoriented after the alarm during the Department of Energy visit. Compare the timing of the call with the briefing.',['recording']],
      ['Confrontation and aftermath','Peter tells the returning crew that his family believes he is dead. Damage Control acknowledges the staged crash story and gives A-Sync’s version of his later death.',['reunion',675],['damage'],['static']]
    ],
    open: 'What happened in the interval Peter experienced, and how reliable is A-Sync’s account of his final hours?'
  },
  leigh: {
    why: 'Marvin E. Leigh is an A-Sync researcher and field camera operator. His tapes provide the best through-line from exploration of Division 14 to staff questioning A-Sync’s handling of Peter.',
    points: [
      ['The camera behind Pitfalls','Marvin records the pit chamber, falls and documents the street and house. These scenes represent what he can see and record from his position.',['pit',365],['pit',555]],
      ['A witness at Division 14','His footage is reviewed in Report. He returns with the crew in Reunion and witnesses the confrontation with Peter.',['report'],['reunion']],
      ['Questioning the briefing','In Static Dead End, Marvin voices doubts about Peter’s death. His viewpoint is a source for that suspicion.',['static'],['damage']]
    ],
    open: 'How much can Marvin know from his own footage and conversations, and which parts of the incident was he absent for?'
  },
  ravi: {
    why: 'Ravi is a civilian whose own recording shows how someone navigates the Complex without an A-Sync map or a planned route back.',
    points: [
      ['The person behind the tape','He appears in the opening material and later investigates a disturbance at home. The camera becomes his record of the spaces he moves through.',['ff3',70]],
      ['Trying to get help','Ravi experiments with radio equipment and exchanges words with a voice through a wall. These events give different kinds of possible contact with others.',['ff3',1540]],
      ['Distinct encounters','The tape documents multiple moments of danger, interspersed with ordinary-looking rooms and long stretches of wandering.',['ravi-figures'],['ff3']]
    ],
    open: 'The recording leaves his final status and the reliability of the apparent contact unresolved.'
  },
  async: {
    why: 'A-Sync is the fictional research institute behind Project KV31. Following it across the archive explains how a laboratory experiment becomes a development proposal and a series of internal incidents.',
    points: [
      ['Research programme','Magnetic-distortion tests culminate in the Threshold. The institute sets up procedures, camera coverage and material surveys inside the Complex.',['third'],['first'],['lighting']],
      ['Commercial ambition','A-Space is the prospective development pitched to visitors. Beck’s earlier comments supply the rationale for housing and storage.',['present',385],['beck']],
      ['Institutional response','The institute restricts a survey area after a sighting, later reopens it, and manages the accounts of Peter’s disappearance and death.',['report'],['reunion'],['damage']]
    ],
    open: 'A-Sync staff have different information and responsibilities. Which claims represent the individual observer and which represent the institution’s position?'
  },
  threshold: {
    why: 'The Threshold is A-Sync’s engineered entrance. The outpost is observation infrastructure on the Complex side. Together they anchor several routes, experiments and timeline events.',
    points: [
      ['The doorway','First Contact shows the apparatus framing an open passage after the sixth test. This is the deliberate entry route used by staff.',['first',103]],
      ['Observation infrastructure','The approach and outpost appear in survey, surveillance and briefing footage. Peter’s return changes how the two perspectives on the outpost line up.',['info'],['motion'],['present',420]],
      ['Compare another type of entry','Civilian cameras enter through surfaces or domestic spaces away from the institute. They reach similar interiors through different means.',['ff1',55],['ff2',40]]
    ],
    open: 'How far can recorded landmarks near the outpost reliably anchor routes deeper into the Complex?'
  },
  yellow: {
    why: 'The yellow office rooms are the recurring visual baseline. Comparing them across tapes helps distinguish genuine route landmarks from ordinary features that repeat everywhere.',
    points: [
      ['A familiar architectural palette','Repeated wallpaper, ceiling grids, pillars and fluorescent fixtures occur across civilian and A-Sync footage.',['ff1',55],['info']],
      ['Markings may distinguish a route','Arrows and graffiti can serve as more specific comparison points than yellow wallpaper by itself.',['ff1',210]],
      ['Physical survey','Lighting and Tile Survey supplies a basis for comparing fixtures and tiles beyond their appearance.',['lighting']]
    ],
    open: 'Which wall junctions, unusual fixtures or markings can establish a local match across separate camera trips?'
  },
  division: {
    why: 'Room 14D is one surveyed chamber in Division 14. Its grid of pits and far door make it a useful landmark across four tapes.',
    points: [
      ['Layout and fall','The camera records the grid, the route to the far door and the view back up after Marvin falls. These establish a sequence of places.',['pit',265],['pit',310],['pit',365]],
      ['Access history','Report covers the restriction. Reunion covers the reopening, and Static Dead End documents further survey work behind the door.',['report'],['reunion'],['static']]
    ],
    open: 'One pit is associated with Marvin’s route. The camera gives little basis for assigning routes to the other openings.'
  },
  street: {
    why: 'The red-lit street establishes that the Complex can contain an outdoor-looking neighbourhood and a house beneath the familiar office landscape.',
    points: [
      ['Approach','Marvin reaches a tunnel-like opening and then a road after falling from Room 14D. The tape gives observed order with uncertain distance.',['pit',555],['division']],
      ['House sequence','The recording carries from the road to the house exterior and blue-walled interior. The cries and pursuit make this route a sighting location.',['pit',595],['pit',650],['house-figure']]
    ],
    open: 'The street looks outdoors. The footage gives no clear way to determine whether the sky and horizon behave like an exterior.'
  },
  garage: {
    why: 'Found Footage #2 provides a distinct entry route through a domestic setting. The locations inside give several specific objects to compare with linked tapes.',
    points: [
      ['Marking the anomaly','Blue tape on the garage floor outlines the area the camera operator is investigating before entering.',['ff2',40]],
      ['Objects along the route','Inside, the camera finds a crashed vehicle and imagery that can be compared with the wall painting in the linked home archive.',['ff2',505],['car'],['home']],
      ['Growth area','The route leads into darker rooms around the sighting, followed by a pursuit through different interiors.',['ff2',600],['growth-figure']]
    ],
    open: 'How closely are the garage, the home video interiors and their counterparts in the Complex related?'
  },
  kelowna: {
    why: 'Kelowna Branch gives the archive a named field location where repeated objects and a hidden interior can be tracked across a documented survey.',
    points: [
      ['Signs as evidence','The recurring sale signs give the team an object to measure and trace across surfaces. The opening date card places the work in June 1990.',['everything',10]],
      ['Space beyond the wall','Opening a wall leads to a retail area. The suspended sign and television help connect the two stages of the survey.',['everything',760],['everything',930]],
      ['Encounter site','The retail pursuit makes this branch a sighting location as well as an architectural anomaly.',['retail-figure']]
    ],
    open: 'How much of the retail layout comes from one recognisable shop, and how much has been rearranged?'
  },
  figure1: {
    why: 'This is the first clear hostile pursuit introduced to viewers of the series. It establishes one observable subject to compare with later glimpses and encounters.',
    points: [
      ['Setting and sequence','The camera approaches wall markings before turning toward a sound. The pursuit moves through yellow rooms and narrow passages.',['ff1',210],['ff1',490]],
      ['Shape and movement','The figure reads as tall, dark and thin in the brief views. Compare what the camera captures before pursuing any proposed link to a later sighting.',['ff1'],['house-figure']]
    ],
    open: 'Is the figure the same kind of being seen in Pitfalls or Found Footage #2? Similar silhouettes are limited evidence.'
  },
  'motion-shape': {
    why: 'This record gives the archive its most useful fixed-camera comparison. It also shows how editing and enhancement change what an observer can identify.',
    points: [
      ['Original camera context','Camera 5 shows repeating columns and a distant corner. The unusual shape occupies a small portion of the frame.',['motion',220]],
      ['Editorial intervention','The tape adds a circle and then presents an enhanced crop. Compare all versions before interpreting the outline.',['motion',230],['motion',240]]
    ],
    open: 'Is the movement enough to identify a living subject, or only to flag the feed for review?'
  },
  'house-figure': {
    why: 'The house encounter gives A-Sync a field recording of threatening activity and changes access to Division 14. It links a sighting to a documented institutional decision.',
    points: [
      ['Sound before the encounter','Marvin follows cries towards the house. The audio provides a clue about how he chooses his route.',['pit',555],['pit',650]],
      ['Limited view during pursuit','The moving camera, corridor distance and lighting limit what can be resolved about the figure. Watch the original sequence and the report’s review.',['pit',735],['report']],
      ['One event across two tapes','The report reuses material from the field recording. It gives the response to the sighting as well as a second place to inspect the image.',['report'],['division']]
    ],
    open: 'Did the figure make the cries, and what evidence would distinguish that from an unrelated sound in the house?'
  },
  'growth-figure': {
    why: 'This sighting is the closest visual comparison between an encounter and the growth first seen around the recovered body. It raises a biological question while leaving causation open.',
    points: [
      ['Where it appears','The camera crosses a growth-filled space near the start of the pursuit. The preview frames help locate the passage for review.',['ff2',600],['ff2',620]],
      ['Compare the body case','Missing Persons documents dark growth near a body. Autopsy Report supplies the examiner’s interpretation of that earlier case.',['missing'],['autopsy']],
      ['Green light is a separate observation','The light later in the chase also invites comparison with Overflow. The shared colour alone carries little evidence about its origin.',['ff2'],['overflow',77]]
    ],
    open: 'Is the growth part of the figure, something it emerges from, or simply part of the environment around it?'
  },
  'ravi-figures': {
    why: 'Ravi’s tape may contain more than one kind of encounter. Keeping the sequences distinct avoids assigning every noise or moving shape to a single subject.',
    points: [
      ['Clues occur at different times','A pursuit and a later rush toward Ravi appear in separated parts of the recording. Use the preceding room and sound as context for each.',['ff3']],
      ['The interior still is context','The preview of the cluttered passage documents the setting. For motion and identification, use the surrounding footage.',['ff3',1060]],
      ['Other signals have their own evidence','Radio chatter and voices elsewhere in the tape raise separate questions about communication and origin.',['ff3',1540],['ravi']]
    ],
    open: 'Do the glimpses share distinctive behaviour or visual features that justify treating them as the same subject?'
  },
  'retail-figure': {
    why: 'The retail pursuit adds a distinctly costumed figure and connects the Kelowna survey to the series’ furniture-store imagery.',
    points: [
      ['Lead-in','The team passes deeper into a retail interior and finds a television. This sets the scene immediately before the pursuit.',['everything',930],['kelowna']],
      ['Use the moving footage','The nearby preview contains the fleeing crew and corridor context. The costume and movement are more informative in the surrounding sequence than that single frame.',['everything',940]]
    ],
    open: 'How closely should the costumed figure be identified with the film material, and what does the web episode establish on its own?'
  }
};
