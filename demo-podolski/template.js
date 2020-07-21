const path    = require('path');
const fluid   = require('../fluid-music');
const recipes = require('../fluid-recipes');
const tr909   = require('@fluid-music/tr-909');
const drums   = require('./drums');
const file    = path.join(process.cwd(), 'session.tracktionedit');
const dragonflyRoom = fluid.pluginDragonflyRoomReverb;

// experimental automation point
const a = {
  type: fluid.noteTypes.auto,
  plugin: { name: 'Podolski.64' },
  param: fluid.pluginPodolski.params.vcf0Cutoff,
  value: 0.5,
};

const score = {
  r:     '1 + 2 + 3 + 4 + ',
  kick:  {
  kick:  '.   . dd dD .D  ',
  d:     '.   . mf        '},
  snare: '.   k-  .   k-  ',
  tamb:  'c c c c c c c c ',
  bass:{
    bass:'       b-   ab  ',
    nLibrary: {b: 40, c: 48, a },
  },
};

const dLibrary = {
  f: { dbfs: 0, intensity: 1.0 },
  m: { dbfs: -2.6, intensity: 3/4 },
};

const customEventMappers = [
  (note, context) => {
    if (!note.n || note.n.type !== 'random') return note;
    note.n = fluid.random.choice(note.n.choices);
    return note;
  }
].concat(fluid.eventMappers.default);

const session = fluid.score.parse(score, {nLibrary: drums.nLibrary, dLibrary});
fluid.score.applyEventMappers(session, customEventMappers);

const msg = [
  fluid.global.activate(file, true),
  fluid.tempo.set(96),
  fluid.transport.loop(0, session.duration),

  // reverb
  fluid.audiotrack.selectReturnTrack('verb room'),
  dragonflyRoom.select(),
  dragonflyRoom.presets.smallVocalRoom(),

  // bass
  fluid.audiotrack.select('bass'),
  recipes.presets.podolski.sineSlowDecay(),

  // kick
  fluid.audiotrack.select('kick'),
  fluid.pluginTCompressor.select(),
  fluid.pluginTCompressor.setThresholdDbfs(-13),
  fluid.pluginTCompressor.setRatio(2.23),
  fluid.pluginTCompressor.setAttackMs(42),
  fluid.pluginTCompressor.setReleaseMs(72.3),
  fluid.audiotrack.send('verb room', -35),

  // snare
  fluid.audiotrack.select('snare'),
  fluid.pluginTCompressor.select(),
  fluid.pluginTCompressor.setThresholdDbfs(-25.44),
  fluid.pluginTCompressor.setRatio(3.7),
  fluid.pluginTCompressor.setAttackMs(24.5),  // medium attack, lets the transient through
  fluid.pluginTCompressor.setReleaseMs(84.5), // mid-fast release exaggerates the body+decay
  fluid.pluginTCompressor.setMakeUpDbfs(10),  // yea
  fluid.audiotrack.send('verb room', -35),

  // hat/tambourine
  fluid.audiotrack.select('tamb'),
  fluid.audiotrack.send('verb room', -28),

  // content
  fluid.score.tracksToFluidMessage(session.tracks),
];

const client = new fluid.Client();
client.send(msg);
