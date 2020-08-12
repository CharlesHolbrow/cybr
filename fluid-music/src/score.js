const R       = require('ramda');
const tab     = require('./tab');
const fluid   = require('./fluid/index');
const mappers = require('./event-mappers');

const reservedKeys = tab.reservedKeys;

/**
 * score.parse is somewhat similar to tab.parse, except that it expects a
 * different input format, and outputs a `Session` instead of an array of notes.
 *
 * Typically called with two arguments (other args are for internal use only)
 * - A ScoreObject array
 * - A config object with (at minimum) a `.nLibrary` and `.r`hythm
 *
 * @param {ScoreObject|String} scoreObject The Score Object to parse
 * @param {Object} [config]
 * @param {number} [config.startTime=0]
 * @param {string} [config.r] default rhythm string, which may be
 *    overridden by values in `scoreObject`. If not specified, `scoreObject` must have a
 *   `.r` property.
 * @param {string} [config.trackKey] name of the track being parsed
 * @param {string} [config.d] optional dynamicLibrary
 * @param {NoteLibrary} [config.dLibrary]
 * @param {NoteLibrary} [config.nLibrary] (see tab.parseTab for details about
 *   `NoteLibrary`). If not specified, `scoreObject` must have a `.nLibrary` property.
 * @param {Session} [session] Only used in recursion. Consuming code should not
 *    supply this argument.
 * @returns {Session} representation of the score.
 */
function parse(scoreObject, config, session, tracks={}) {
  const isOutermost = (session === undefined);
  if (isOutermost) session = {};

  if (!config) config = {};
  else config = Object.assign({}, config); // Shallow copy should be ok
  //                                                                               ensure that we do note modify the n/dLibrary, as it may be reused later
  if (scoreObject.hasOwnProperty('nLibrary'))     config.nLibrary = Object.assign((config.nLibrary && Object.assign({}, config.nLibrary))|| {}, scoreObject.nLibrary);
  if (scoreObject.hasOwnProperty('dLibrary'))     config.dLibrary = Object.assign((config.dLibrary && Object.assign({}, config.dLibrary))|| {}, scoreObject.dLibrary);
  if (scoreObject.hasOwnProperty('r'))            config.r = scoreObject.r;
  if (scoreObject.hasOwnProperty('d'))            config.d = scoreObject.d;
  if (scoreObject.hasOwnProperty('eventMappers')) config.eventMappers = scoreObject.eventMappers
  // Note that we cannot specify a .startTime in a score like we can for rhythms
  if (typeof config.startTime !== 'number') config.startTime = 0;

  // Internally, there are three handlers for (1)arrays (2)strings (3)objects
  //
  // All three handlers must:
  // - return an object that has a .duration property. Duration are interpreted
  //   differently for Arrays, Objects, and Strings found in the input object.
  //   - Array:  sum of the duration of the array's elements
  //   - Object: duration of the longest child
  //   - string: duration of the associated rhythm string
  //
  // The array and object handlers must:
  // - create an appropriate `config` object for each child
  // - call score.parse on each child
  //
  // The string handler must:
  // - create clips with a .startTime and .duration
  // - add those clips to the sessions[trackKey].clips array
  //
  // The object handler must:
  // - return a TracksObject representation of the ScoreObject input

  let returnValue = {
    startTime: config.startTime,
    duration: 0,
  };
  if (isOutermost) {
    returnValue.tracks = tracks;
    if (!tracks.plugins) tracks.plugins = [];
  }

  // create the track if it does not exist
  if (config.trackKey) {
    if (!tracks.hasOwnProperty(config.trackKey)) tracks[config.trackKey] = {}; // Create Track instance
    const track = tracks[config.trackKey];
    if (track.name && track.name !== config.trackKey)
      throw new Error(`score.parse was passed a track with a .name string (${track.name}), but that string's name did not match the TrackObject key (${config.trackKey})`);
    track.name = config.trackKey; // Is this a good idea?
    if (!track.clips) track.clips = [];
    if (!track.plugins) track.plugins = [];
    if (!track.automation) track.automation = {}; // Create Automation instance
  }

  if (Array.isArray(scoreObject)) {
    let arrayStartTime = config.startTime;
    returnValue.regions = [];
    for (let o of scoreObject) {
      config.startTime = arrayStartTime + returnValue.duration;
      let result = parse(o, config, session, tracks);
      returnValue.regions.push(result);
      returnValue.duration += result.duration;
    }
  } else if (typeof scoreObject === 'string') {
    // We have a string that can be parsed with parseTab
    if (typeof config.trackKey !== 'string')
      throw new Error(`score.parse encountered a pattern (${scoreObject}), but could not find a track name`);
    const track = tracks[config.trackKey];

    // Get the dynamic and rhythm strings
    const d = config.d || track.d || tracks.d; // may be undefined
    const r = config.r || track.r || tracks.r; // must be defined
    if (r === undefined)
      throw new Error(`score.parse encountered a pattern (${scoreObject}), but could not find a rhythm`);

    // Make the nLibrary and dLibrary
    const nLibrary = {};
    if (tracks.nLibrary) Object.assign(nLibrary, tracks.nLibrary);
    if (track.nLibrary) Object.assign(nLibrary, track.nLibrary);
    if (config.nLibrary) Object.assign(nLibrary, config.nLibrary);
    const dLibrary = {};
    if (tracks.dLibrary) Object.assign(dLibrary, tracks.dLibrary);
    if (track.dLibrary) Object.assign(dLibrary, track.dLibrary);
    if (config.dLibrary) Object.assign(dLibrary, config.dLibrary);

    // create the clip
    const rhythmObject = tab.parseRhythm(r);
    const resultClip = tab.parseTab(rhythmObject, scoreObject, nLibrary, d, dLibrary);
    resultClip.startTime = config.startTime;
    if (config.eventMappers) resultClip.eventMappers = config.eventMappers;
    // add dynamics
    if (d) {
      const getDynamic = tab.createDynamicGetter(rhythmObject, d, dLibrary);
      for (const event of resultClip.events) event.d = getDynamic(event.startTime);
    }

    tracks[config.trackKey].clips.push(resultClip);
    returnValue = resultClip;
  } else {
    // Assume we have a JavaScript Object
    for (let [key, val] of Object.entries(scoreObject)) {
      if (reservedKeys.hasOwnProperty(key) && key !== 'clips') continue;
      if (key !== 'clips') config.trackKey = key; // if key='clips' use parent key
      let result = parse(val, config, session, tracks);
      if (result.duration > returnValue.duration) returnValue.duration = result.duration;
      returnValue[config.trackKey] = result;
    }
  }

  if (isOutermost) applyEventMappers(returnValue)
  return returnValue;
};

/**
 * @param {Session} session
 * @param {eventMapper[]} [ubiquitousMappers] fluid supplies a default
 *    collection of mappers that are needed for proper parsing. To override
 *    the default mappers, specify null or an empty array.
 */
function applyEventMappers(session, ubiquitousMappers=mappers.default) {

  for (const [trackName, track] of Object.entries(session.tracks)) {
    if (tab.reservedKeys.hasOwnProperty(trackName)) {
      continue;
    }

    if (!track.clips || !track.clips.length) {
      console.log(`applyEventMappers: skipping ${trackName}, because it has no .clips`);
      continue;
    }

    track.clips.forEach((clip, clipIndex) => {
      const context = {
        track,
        tracks: session.tracks,
        clip,
        clipIndex,
        data: {},
      };

      ubiquitousMappers = ubiquitousMappers || []; // null overrides default
      let customMappers = [];
      if (clip.hasOwnProperty('eventMappers')) {
        customMappers = clip.eventMappers;
        delete clip.eventMappers;
      }
      const eventMappers = customMappers.concat(ubiquitousMappers);
      // The code below shows what data are available inside eventMapper
      // callbacks. The contents of context.clip.events can look different to
      // each round of callbacks. Note the order of the loops: In the first
      // round, the first callback will be called on each event, potentially
      // removing that event from clip.events. Then, the second callback in the
      // eventMappers array will be called on each event. During the second
      // round of callbacks, clip.events may have a different length than during
      // the first round. This will happen if, for example, the callbacks in the
      // first round returned falsy values (removing events from clip.events in
      // subsequent rounds) or arrays (adding events to clip.events). Note that
      // changes to the contents of context.clip.events only take effect between
      // rounds. The exception would be if a callback explicitly modifies
      // context.clip.events -- however this would be a very poor design choice.
      // Callbacks should never need to do this and it could cause subtle bugs.
      //
      // A callback that needs access to the original list of events can access
      // it via the clip.unmappedEvents array. Note that even though events in
      // the unmappedEvents array will not be added or removed by eventMappers,
      // they will still be mutated by event mappers, so the event.n members
      // will likely not look the same as the objects in the .nLibrary objects.
      clip.unmappedEvents = clip.events;
      clip.events = clip.events.flat();
      for (const eventMapper of eventMappers) {
        clip.events = clip.events.flatMap((event, i) => {
          context.eventIndex = i;
          return eventMapper(event, context);
        }).filter(event => !!event);
      }; // iterate over eventMappers
    });  // iterate over clips
  }      // iterate over tracks
}

/**
 * Create a `FluidMessage` from a `TracksObject`
 *
 * ```javascript
 * const session = fluid.score.parse(myScore, myConfig);
 * const message = fluid.score.tracksToFluidMessage(session.tracks);
 * const client = new fluid.Client();
 * client.send(message);
 * ```
 *
 * @param {TracksObject} tracksObject A tracks object generated by score.parse
 * @returns {FluidMessage}
 */
function tracksToFluidMessage(tracksObject) {
  const sessionMessages = [];
  let i = 0;

  // // example tracks object
  // const tracks = {
  //   bass: { clips: [ clip1, clip2... ] },
  //   kick: { clips: [ clip1, clip2... ] },
  // };
  for (const [trackName, track] of Object.entries(tracksObject)) {
    if (tab.reservedKeys.hasOwnProperty(trackName)) {
      continue;
    }

    if (!track.clips || !track.clips.length) {
      if (!tracksObject.plugins.length) {
        console.log(`tracksToFluidMessage: skipping ${trackName}, because it has no .clips and no .plugins`);
        continue;
      }
    }

    // Create a sub-message for each track
    let trackMessages = [];
    trackMessages.push(fluid.audiotrack.select(trackName));
    sessionMessages.push(trackMessages);

    track.clips.forEach((clip, clipIndex) => {

      // Create a sub-message for each clip. Note that the naming convention
      // gets a little confusing, because we do not yet know if "clip" contains
      // a single "Midi Clip", a collection of audio file events, or both.
      const clipMessages = [];
      trackMessages.push(clipMessages);

      // Create one EventContext object for each clip.
      const context = {
        track,
        clip,
        clipIndex,
        messages: clipMessages,
        tracks: tracksObject,
        data: {},
      };

      if (clip.midiEvents && clip.midiEvents.length) {
        clipMessages.push(midiEventsToFluidMessage(clip.midiEvents, context));
      }

      if (clip.fileEvents && clip.fileEvents.length) {
        clipMessages.push(fileEventsToFluidMessage(clip.fileEvents, context));
      }

    }); // track.clips.forEach

    // Handle track specific automation.
    for (const [name, automation] of Object.entries(track.automation)) {
      let trackAutoMsg = [];
      trackMessages.push(trackAutoMsg);
      if (name === 'volume' || name === 'pan') {
        // fluid.audiotrack.gain should always adjust the last volume plugin on
        // the track. That means that we want to apply automation on an earlier
        // volume plugin. First, ensure that we have at least two volume plugins
        trackAutoMsg.push(fluid.plugin.select('volume', 'tracktion', 1));
        // ...then select the first volume plugin which will be automated
        trackAutoMsg.push(fluid.plugin.select('volume', 'tracktion', 0));

        // Iterate over the automation points. If we are just dealing with
        // volume and pan, then the autoPoint should usable unedited. When
        // dealing with sends, this might need to be more complicated.
        for (const autoPoint of automation.points) {
          trackAutoMsg.push(createFluidMessageForAutomationPoint(name, autoPoint));
        }

      } else {
        throw new Error(`Fluid Track Automation found unsupported parameter: "${name}"`);
      }
    } // for [name, automation] of track.automation

    // Handle plugins/plugin automation
    for (const plugin of track.plugins) {
      trackMessages.push(fluid.plugin.select(plugin.name, plugin.type, plugin.nth));
      for (const [paramName, automation] of Object.entries(plugin.automation)) {
        for (const autoPoint of automation.points) {
          trackMessages.push(createFluidMessageForAutomationPoint(paramName, autoPoint));
        } // for (autoPoint of automation.points)
      }   // for (paramName, automation of plugin.automation)
    }     // for (plugin of track.plugins)
  }       // for (track of tracks)

  return sessionMessages;
};

/**
 * FluidMessage objects are guaranteed to have either a .normalizedValue or a
 * .explicitValue -- this just checks which one the AutomationPoint has, and
 * returns an appropriate FluidMessage.
 *
 * Throws if the AutomationPoint does not have either type of value.
 *
 * This function is only used inside of tracksToFluidMessage, and should not be
 * exported.
 *
 * @param {string} paramName
 * @param {AutomationPoint} autoPoint
 * @returns {FluidMessage}
 */
const createFluidMessageForAutomationPoint = (paramName, autoPoint) => {
  if (typeof autoPoint.explicitValue === 'number') {
    return fluid.plugin.setParamExplicitAt(
      paramName,
      autoPoint.explicitValue,
      autoPoint.startTime,
      autoPoint.curve);
  } else if (typeof autoPoint.normalizedValue === 'number') {
    return fluid.plugin.setParamNormalizedAt(
      paramName,
      autoPoint.normalizedValue,
      autoPoint.startTime,
      autoPoint.curve);
  } else {
    throw new Error(`AutomationPoint has neither of .explicitValue/.normalizedValue: ${JSON.stringify(autoPoint)}`);
  }
}


/**
 * @param {ClipEvent[]} midiEvents
 * @param {ClipEventContext} context This will not have a .eventIndex
 */
function midiEventsToFluidMessage(midiEvents, context) {
  if (typeof context.clip.startTime !== 'number')
    throw new Error('Clip is missing startTime');

  const msg = [];
  const clipName  = `${context.track.name} ${context.clipIndex}`
  const startTime = context.clip.startTime;
  const duration  = context.clip.duration;
  const clipMsg   = fluid.midiclip.select(clipName, startTime, duration)
  msg.push(clipMsg);

  for (const event of midiEvents) {
    if (event.type === 'midiNote') {
      let velocity = (event.d && typeof event.d.v === 'number')
        ? event.d.v
        : (typeof event.v === 'number')
          ? event.v
          : undefined;
      msg.push(fluid.midiclip.note(event.n, event.startTime, event.length, velocity));
    }
  }

  return msg;
};

/**
 * @param {ClipEvent[]} fileEvents
 * @param {ClipEventContext} context This will not have a .eventIndex
 */
function fileEventsToFluidMessage(fileEvents, context) {
  if (typeof context.clip.startTime !== 'number')
    throw new Error('Clip is missing startTime');

  // exampleClipEvent = {
  //   type: 'file',
  //   path: 'media/kick.wav',
  //   startTime: 0.50,
  //   length: 0.25,
  //   d: { v: 70, dbfs: -10 }, // If .v is present here...
  // };

  return fileEvents.map((event, eventIndex) => {
    const startTime = context.clip.startTime + event.startTime;

    if (typeof event.path !== 'string') {
      console.error(event);
      throw new Error('tracksToFluidMessage: A file event found in the note library does not have a .path string');
    };

    const clipName = `s${context.clipIndex}.${eventIndex}`;
    const msg = [fluid.audiotrack.insertWav(clipName, startTime, event.path)];

    if (event.startInSourceSeconds)
      msg.push(fluid.clip.setSourceOffsetSeconds(event.startInSourceSeconds));

    // adjust the clip length, unless the event is a .oneShot
    if (!event.oneShot)
      msg.push(fluid.clip.length(event.length));

    // apply fade in/out times (if specified)
    if (typeof event.fadeOutSeconds === 'number' || typeof event.fadeInSeconds === 'number')
      msg.push(fluid.audioclip.fadeInOutSeconds(event.fadeInSeconds, event.fadeOutSeconds));

    // If there is a dynamics object, look for a dbfs property and apply gain.
    if (event.d && typeof(event.d.dbfs) === 'number')
      msg.push(fluid.audioclip.gain(event.d.dbfs));

    return msg;
  });
}

module.exports = {
  tracksToFluidMessage,
  applyEventMappers,
  parse,
}
