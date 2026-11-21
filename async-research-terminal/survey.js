// Cues refer to the running time of Kane Parsons’ original uploads.
const surveyFrames = [
  ['map-motion-close','motion',54,'Threshold and Camera 1','The camera diagram labels the Threshold in green. The highlighted corridor and camera positions give the entrance a relative position.'],
  ['map-motion-wide','motion',64,'Lateral Division A overview','The pullback reveals repeated cross-shaped pillars and the highlighted lane extending from the Threshold.'],
  ['map-info-door','info',410,'Door and viewing window','Peter approaches the door and window along his return route.'],
  ['map-info-drawing','info',470,'Outpost drawing','A drawing with an overhead view appears during the closing montage. The small preview preserves the visible outline and interior columns.'],
  ['map-report-partition','report',330,'Partition at the approach','The construction sequence shows A-Sync installing a timber barrier across the approach.'],
  ['map-report-drawing','report',340,'Technical drawing in Report','A dense plan-like graphic follows the partition sequence. Labels are hard to read in the preview, so its relationship to the surveyed corridor is left open.'],
  ['map-reunion-opening','reunion',145,'Rover at the reopened partition','A rover is visible through the opened section of the timber barrier.'],
  ['map-reunion-walkway','reunion',425,'Walkway assembled over Room 14D','Wooden decking and rails begin to define a crossing over the pits.'],
  ['map-reunion-wall','reunion',640,'Hand-drawn markings in Room 14C','The flashlight catches a map-like wall drawing during the survey. It helps document the discovery of a local plan, with authorship and orientation unresolved.'],
  ['map-static-crossing','static',100,'Decked route across Room 14D','The follow-up visit shows the constructed walkway and access beyond the pit chamber.'],
  ['map-static-beyond','static',212,'Interior beyond the far door','The follow-up footage reaches a room with irregular floor recesses and objects intersecting surfaces.'],
  ['map-ff3-skywalk','ff3',1150,'Red-lit city view','Ravi’s footage shows a city-like interior from an enclosed passage. Its position relative to the Threshold remains unknown.']
];

for (const [key,video,seconds,title,note] of surveyFrames) {
  const timestamp = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  evidence[key] = {file:`${video}-frame-${seconds}`,video,seconds,title,alt:note,note,kind:`Source frame · ${timestamp}`};
}

const surveyAreas = [
  {id:'threshold', title:'Threshold & outpost', start:'motion', stages:[
    {id:'first', video:'first', when:'17 Oct 1989', label:'Threshold opens',
      change:'First Contact establishes the link between the test chamber and a lit corridor. Beyond the doorway, the clip gives a view into the Complex with little information about the wider floor plan.',
      limit:'The corridor footprint in the later camera plan is a reference for comparison.',
      frames:['opening']},
    {id:'info', video:'info', when:'Feb 1990 / later return', label:'Two field views',
      change:'Peter’s recording opens with a survey through the Threshold. On his return he finds a door and viewing window. The closing drawings and the alarm give additional views of the outpost.',
      limit:'The video carries an anomalous 29 February 1990 label. Presentation provides an independent view of the later return.',
      frames:['map-info-door','map-info-drawing']},
    {id:'motion', video:'motion', when:'5 Mar 1990', label:'Camera plan',
      change:'This is the clearest local floor plan. The doorway is marked in green, Camera 1 faces the highlighted lane, and the wider view shows the grid of cross-shaped columns.',
      limit:'The diagram covers the surveyed entrance area. The routes to Division 14 and the civilian recordings have no fixed position on it.',
      frames:['map-motion-close','map-motion-wide','cam5']},
    {id:'present', video:'present', when:'8 May 1990', label:'Outpost & model',
      change:'The Department of Energy visit shows the developed observation area. A physical model gives a second look at the pillar layout and A-Space’s planned use.',
      limit:'The model is shown during a development proposal. Use it to compare visible features with the camera plan and keep proposed construction distinct from surveyed routes.',
      frames:['model','outpost']}
  ]},
  {id:'division', title:'Division 14', start:'pit', stages:[
    {id:'pit', video:'pit', when:'6 May 1990', label:'Pits and far door',
      change:'The field crew finds a pit grid with a door across it. Marvin falls through one opening and later records a red-lit street and house.',
      limit:'The route from the Threshold to this sector and the vertical distance to the street are unresolved.',
      frames:['pit-grid','pit-door','red-street']},
    {id:'report', video:'report', when:'6 May 1990 report', label:'Approach closed',
      change:'A-Sync reviews Marvin’s footage, then a construction montage shows the approach being partitioned. This is a documented change to access.',
      limit:'The technical drawing is shown as evidence alongside the footage. Its scale and exact correspondence to the approach are unclear.',
      frames:['map-report-partition','map-report-drawing']},
    {id:'reunion', video:'reunion', when:'25 May 1990', label:'Reopened & bridged',
      change:'The team opens the partition and sends a rover inside. One group assembles a walkway across Room 14D while another surveys Room 14C, where the wall markings are filmed.',
      limit:'Room 14C is a separate survey branch. Its wall sketch has an unresolved orientation and authorship.',
      frames:['map-reunion-opening','map-reunion-walkway','map-reunion-wall']},
    {id:'static', video:'static', when:'After Reunion', label:'Beyond the far door',
      change:'The walkway is visible on the return visit. The team passes through the far door and records altered-looking surfaces, floor recesses and partly embedded objects.',
      limit:'This extends the recorded route beyond the door. The tape offers no measured plan for the interior beyond it.',
      frames:['map-static-crossing','map-static-beyond']}
  ]},
  {id:'unplaced', title:'Unplaced routes', start:'ff1', stages:[
    {id:'ff1',video:'ff1',when:'1991 opening',label:'Civilian tape 1',
      change:'The camera operator falls from a film set into yellow offices. Markings, drops and changes of level document parts of his route.',
      limit:'Yellow wallpaper and pillar shapes recur. The tape leaves the relation between this entry and the mapped Threshold open.',
      stops:[['Film set','ff1'],['Fall through floor','ff1'],['Yellow offices','yellow'],['Marked wall','figure1']],
      frames:['office','wall']},
    {id:'ff2',video:'ff2',when:'1995 working date',label:'Civilian tape 2',
      change:'The recording follows a garage entry into irregular rooms, a crashed car and the growth-filled area.',
      limit:'The car and domestic imagery give comparison points. The route’s bearings and its relation to the Threshold remain unknown.',
      stops:[['Garage','garage'],['Irregular rooms','ff2'],['Crashed car','ff2'],['Growth-filled room','growth-figure']],
      frames:['garage-tape','crashed-car','growth-room']},
    {id:'ff3',video:'ff3',when:'Date unplaced',label:'Ravi’s route',
      change:'Ravi’s tape travels from a basement through a long succession of domestic, commercial and industrial-looking interiors. The skywalk gives a view across a large city-like space.',
      limit:'These stops are selected views in playback order. The complete route and its tie to the A-Sync survey are unresolved.',
      stops:[['Basement','ff3'],['City view','ff3'],['Radio equipment','ravi']],
      frames:['map-ff3-skywalk','ravi-radio']},
    {id:'everything',video:'everything',when:'18–19 Jun 1990',label:'Kelowna Branch',
      change:'A-Sync follows repeated sale signs and opens a wall to find a retail interior. The tape gives a named branch and an observed passage.',
      limit:'The position of the Kelowna Branch relative to the Threshold and Division 14 is unknown.',
      stops:[['Kelowna survey','kelowna'],['Repeating signs','everything'],['Opened wall','everything'],['Retail interior','retail-figure']],
      frames:['kelowna-sign','kelowna-tv']}
  ]}
];
