export { FluidPlugin, PluginType } from './FluidPlugin'
export { sessionToContentFluidMessage, sessionToTemplateFluidMessage } from './sessionToFluidMessage'
export { sessionToReaperProject } from './sessionToReaperProject'
export { FluidSession } from './FluidSession'
export { FluidAudioFile, AudioFileOptions } from './FluidAudioFile'
export { FluidTrack } from './FluidTrack'
export * as gen from './plugin-generator'
export * as converters from './converters'
export * as m from './m'
export * as random from './random'
export * as tLibrary from './t-library'
export * as tab from './tab'

// Unfortunately, JSDoc imports cannot currently access properties of namespaces
// that were exported via the `export * as namespace from './somewhere'` format.
// In order to access techniques, JSDoc imports have to import from the build
// directory, which is likely to change in the future.
//
// While while the example below is unstable, it is also (currently) the only
// option for non-typescript users:
// /** @typedef {import('fluid-music/built/techniques').AudioFile} AudioFile */
export * as techniques from './techniques'

// New Style Plugins
export * as plugins from './plugin-adapters/index'

// OSC Message Helpers
export * as cybr from './cybr/index';

export const UdpClient = require('./cybr/UdpClient');
export { IpcClient } from './cybr/IpcClient';
export { IpcClient as Client } from './cybr/IpcClient'

// Technique authors can use JSDoc imports to enable syntax completion
// /** @typedef {import('fluid-music').UseContext} UseContext */
// This allows /** @param {UseContext} */ in a technique's documentation
//
// Imports may also be written inline in JSDoc @param types
// /** @param {import('fluid-music').UseContext} context */
export { UseContext } from './fluid-interfaces'
