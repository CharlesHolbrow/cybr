#!/usr/bin/env node

const fluid = require('../src/index');
const FluidClient = require('../src/FluidClient');

const client = new FluidClient(9999);
client.send(fluid.transport.stop());