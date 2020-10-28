import { FluidPlugin, PluginType } from './plugin';
import { sessionToContentFluidMessage, sessionToTemplateFluidMessage, saveSessionAsTracktionFile } from './sessionToFluidMessage';
import { sessionToReaperProject } from './sessionToReaperProject'
import { FluidSession } from './FluidSession';
import * as gen from './plugin-generator';
import * as converters from './converters';
import m from './m'
import * as random from './random';
import * as techniques from './fluid-techniques';
import * as tLibrary from './t-library';
import * as tab from './tab';

// New Style Plugins
import { DragonflyRoom } from './plugin-dragonfly-room';
import { TCompressorVst2 } from './plugin-adapters/t-compressor-vst2'
import { TEqualizerVst2 } from './plugin-adapters/t-equalizer-vst2'
import { TStereoDelayVst2 } from './plugin-adapters/t-stereo-delay-vst2'
import { PodolskiVst2 } from './plugin-adapters/podolski-vst2'
import { TyrellN6Vst2 } from './plugin-adapters/tyrell-n6-vst2'

// OSC Message Helpers
import * as cybr from './cybr/index';
import * as audioclip from './cybr/audioclip';
import * as audiofile from './cybr/audiofile';
import * as audiotrack from './cybr/audiotrack';
import * as clip from './cybr/clip';
import * as content  from './cybr/content';
import * as global from './cybr/global';
import * as midiclip from './cybr/midiclip';
import * as plugin from './cybr/plugin';
import * as sampler from './cybr/sampler';
import * as tempo from './cybr/tempo';
import * as transport from './cybr/transport';

const UdpClient = require('./cybr/UdpClient');
import { IpcClient } from './cybr/IpcClient';

export = {
  cybr,
  audioclip,
  audiofile,
  audiotrack,
  Client: IpcClient,
  IpcClient,
  UdpClient,
  clip,
  content,
  converters,
  tLibrary,
  techniques,
  gen,
  global,
  m,
  midiclip,
  plugin,
  random,
  sampler,
  tab,
  tempo,
  sessionToTemplateFluidMessage,
  sessionToContentFluidMessage,
  saveSessionAsTracktionFile,
  sessionToReaperProject,
  transport,
  FluidSession,
  FluidPlugin,
  PluginType,
  DragonflyRoom,
  PodolskiVst2,
  TCompressorVst2,
  TEqualizerVst2,
  TStereoDelayVst2,
  TyrellN6Vst2,
};
