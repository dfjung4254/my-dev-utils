#!/usr/bin/env node

import {exec, execFile, spawn} from 'child_process';
import ScriptInfo from './core/scriptInfo.js';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import write from './core/write.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptList = [
  new ScriptInfo('AWS 현재 IP Ingress 허용', 'scripts/aws-ingress.js'),
  new ScriptInfo('AWS 현재 허용중인 Ip 목록', 'scripts/aws-ingress-ip-list.js')
];


function init() {

  write('Aws script handler!\n\n');
  printScriptList();
  processCommand();  

}


function printScriptList() {
  scriptList.forEach((script, index) => {
    write('[' + index + '] ' + script['name'] + '\n');
  });
}


function processCommand() {

  write('\nchoose to command >> ');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', line => {

    if(line && line >= 0 && line < scriptList.length) {
      rl.close();
      execScript(scriptList[line]);
      return;
    }

    write('choose to command >> ');
    
  });

}


function execScript(script) {

  console.log('\r');

  const command = path.join(__dirname, script['path']);
  const child = spawn(command, [], {stdio: 'inherit'});

  child.on('exit', code => {
    console.log(`${script.name} exited with code ;  ${code}`);
  });

}


init();


