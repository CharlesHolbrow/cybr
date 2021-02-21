/**
 * Begin playback
 */
export function play() { return { address: '/transport/play' }; }

 /**
 * Stop playback
 */
export function stop() { return { address: '/transport/stop' }; }

/**
 * Set loop points, and enable looping.
 * @param startTimeSeconds The time in seconds at which the loop should begin.
 *    Or `false`, which disables looping.
 * @param durationSeconds The length of the loop, measured seconds.
 */
export function loop(startTimeSeconds : number|boolean, durationSeconds? : number) {
  if (startTimeSeconds === false) {
    // disable looping
    startTimeSeconds = 0;
    durationSeconds = 0;
  } else if (startTimeSeconds === true) {
    throw new Error('to enable looping, the first argument to transport.loop must be a startTime number (not `true`)')
  }

  if (typeof startTimeSeconds !== 'number' || typeof durationSeconds !== 'number')
    throw new Error('transport.loop requires start and length times (in whole notes)');

  return {
    address: '/transport/loop',
    args: [
      { type: 'double', value: startTimeSeconds },
      { type: 'double', value: durationSeconds },
    ],
  };
}

/**
 * Move the playback transport
 */
export function to(timeInWholeNotes) {
  if (typeof timeInWholeNotes !== 'number')
    throw new Error('transport.to requires a time (number of whole notes) to go to');

  return {
    address: '/transport/to',
    args: [
      { type: 'float', value: timeInWholeNotes },
    ]
  };
}
