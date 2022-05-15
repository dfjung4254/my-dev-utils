#!/usr/bin/env node

import { getCurrentIp } from '../core/ip.js';

function init() {

  getCurrentIp(noStdout());

}

function noStdout() {
  return process.argv.some(arg => arg === '-no-stdout');
}

init();

