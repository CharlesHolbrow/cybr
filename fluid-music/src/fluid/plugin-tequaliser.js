const plugin = require('./plugin');
const fluid = { plugin };

const db2Level = v => Math.exp(v/8.6864); // For "Wet" and "Dry" params
const QConv = v => Math.pow((v-0.025)/39.975, 1/5); 
const freq2V = v => Math.pow((v-10)/29990, 1/5); 

const pluginTEqualiser = {
  /**
   * Select a `#TEqualiser` vst plugin on the selected track, creating a new
   * plugin instance if needed
   * @param {number} [pluginId] - optional index of the plugin to select
   */
  select(pluginId) {
    return fluid.plugin.select('#TEqualiser', 'vst', pluginId);
  },

  /**
   * Zero the selected `#TStereo Delay` plugin, resetting to sensible defaults.
   */
  zero() {
    return [
      pluginTEqualiser.setBand1State(0),
      pluginTEqualiser.setBand2State(0),
      pluginTEqualiser.setBand3State(0),
      pluginTEqualiser.setBand4State(0),
      pluginTEqualiser.setBand5State(0),
      pluginTEqualiser.setBand6State(0),
      pluginTEqualiser.setBand7State(0),
      pluginTEqualiser.setBand8State(0),
      pluginTEqualiser.setOutputGainDbfs(0),
      pluginTEqualiser.setSoloGainDbfs(0),
      pluginTEqualiser.setSoloBand(-1),
    ]
  },

  /**
   * @param {number} db Wet signal level in DBFS (0 = unity gain)
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setDryLevelDbfs(db, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Dry Level', db2Level(db), timeInWholeNotes, curve);
  },

  /**
   * @param {number} db Wet signal level in DBFS (0 = unity gain)
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setWetLevelDbfs(db, timeInWholeNotes, curve) {
      return fluid.plugin.setExternalParamHelper('Wet Level', db2Level(db), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand1State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 1 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand1FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 1 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand1GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 1 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand1Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 1 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand1Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 1 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand2State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 2 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand2FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 2 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand2GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 2 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand2Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 2 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand2Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 2 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand3State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 3 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand3FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 3 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand3GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 3 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand3Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 3 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand3Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 3 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand4State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 4 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand4FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 4 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand4GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 4 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand4Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 4 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand4Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 4 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand5State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 5 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand5FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 5 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand5GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 5 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand5Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 5 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand5Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 5 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand6State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 6 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand6FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 6 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand6GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 6 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand6Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 6 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand6Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 6 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand7State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 7 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand7FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 7 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand7GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 7 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand7Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 7 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand7Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 7 Shape', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-2 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand8State(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 8 State', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 10-30000 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand8FrequencyHz(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 8 Frequency', freq2V(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -30 and 30 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand8GainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 8 Gain', (value+30)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between 0.025-40 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand8Q(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 8 Q', QConv(value), timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setBand8Shape(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Band 8 Shape', value, timeInWholeNotes, curve);
  },


  /**
   * @param {number} value a boolean to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setEnable(value, timeInWholeNotes, curve) {
    if (typeof(value) !== "boolean"){throw new Error("value required to be of type Boolean")}
    return fluid.plugin.setExternalParamHelper('Enable', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -48 to 6 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setOutputGainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Output Gain', (value+48)/54, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between -1 to 8 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setSoloBand(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Solo Band', value, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value a number between -48 to 12 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setSoloGainDbfs(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Solo Gain', (value+48)/60, timeInWholeNotes, curve);
  },

  /**
   * @param {number} value an integer between 0-3 to set the parameter to
   * @param {number} [timeInWholeNotes] time to insert automation point in
   *    quarter notes. If no time is supplied, set the initial value
   * @param {number} [curve=0] A number from [-1, 1] (inclusive), which
   *    represents the curvature of the line formed by this point and the next
   *    point. Zero implies a linear change. Higher values create a curve that
   *    begins slowly and accelerates. Lower values create a curve that begins
   *    quickly, and decelerates.
   */
  setAnalyserMode(value, timeInWholeNotes, curve) {
    return fluid.plugin.setExternalParamHelper('Analyser Mode', value, timeInWholeNotes, curve);
  },

  params: {
  "band1State": "Band 1 State",
  "band1Frequency": "Band 1 Frequency",
  "band1Gain": "Band 1 Gain",
  "band1Q": "Band 1 Q",
  "band1Shape": "Band 1 Shape",
  "band2State": "Band 2 State",
  "band2Frequency": "Band 2 Frequency",
  "band2Gain": "Band 2 Gain",
  "band2Q": "Band 2 Q",
  "band2Shape": "Band 2 Shape",
  "band3State": "Band 3 State",
  "band3Frequency": "Band 3 Frequency",
  "band3Gain": "Band 3 Gain",
  "band3Q": "Band 3 Q",
  "band3Shape": "Band 3 Shape",
  "band4State": "Band 4 State",
  "band4Frequency": "Band 4 Frequency",
  "band4Gain": "Band 4 Gain",
  "band4Q": "Band 4 Q",
  "band4Shape": "Band 4 Shape",
  "band5State": "Band 5 State",
  "band5Frequency": "Band 5 Frequency",
  "band5Gain": "Band 5 Gain",
  "band5Q": "Band 5 Q",
  "band5Shape": "Band 5 Shape",
  "band6State": "Band 6 State",
  "band6Frequency": "Band 6 Frequency",
  "band6Gain": "Band 6 Gain",
  "band6Q": "Band 6 Q",
  "band6Shape": "Band 6 Shape",
  "band7State": "Band 7 State",
  "band7Frequency": "Band 7 Frequency",
  "band7Gain": "Band 7 Gain",
  "band7Q": "Band 7 Q",
  "band7Shape": "Band 7 Shape",
  "band8State": "Band 8 State",
  "band8Frequency": "Band 8 Frequency",
  "band8Gain": "Band 8 Gain",
  "band8Q": "Band 8 Q",
  "band8Shape": "Band 8 Shape",
  "enable": "Enable",
  "outputGain": "Output Gain",
  "soloBand": "Solo Band",
  "soloGain": "Solo Gain",
  "analyserMode": "Analyser Mode"
},

};

module.exports = pluginTEqualiser;