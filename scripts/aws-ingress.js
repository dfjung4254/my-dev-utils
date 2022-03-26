#!/usr/bin/env node

/*
 *  needs to install aws-cli in your mac first!
 *  you should configure aws-cli IAM
 */

import {exec} from "child_process";
import SecurityGroups from "../core/securityGroups.js";
import PortInfos from "../core/portInfo.js";
import readline from "readline";
import write from '../core/write.js';

const AWS_IPCHECK_HOST = 'https://checkip.amazonaws.com';
const CIDR_PREFIX = '/32';
const MAX_PORT_NUMBER = 65535;


async function init() {

  const currentIp = await getCurrentExternalIp();
  console.log('current ip is : ', currentIp);

  const groupId = await getGroupId();
  const port = await getPort();  

  await permitIngress(groupId, currentIp, port);

}


function getGroupId() {
  return new Promise((resolve, reject) => {
    showGroupInformation();

    write('\nchoose to command >> ');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', line => {

      if(line && line >= 0 && line < SecurityGroups.length) {
        rl.close();
        return resolve(SecurityGroups[line]['groupName']); // group id 
      }

      write('choose to command >> ');

    });
  });

}


function showGroupInformation() {
  write('Your securityGroup lists\n\n');
  SecurityGroups.forEach((securityGroup, index) => {
    write('[' + index + '] ' + securityGroup['name'] + '(' + securityGroup['groupName'] + ')\n');
  });
}


async function getPort() {
  return new Promise((resolve, reject) => {
    showPortInformation();

    write('\nInsert port number >> ');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', line => {
     
      if(line && line >= 0 && line < MAX_PORT_NUMBER) {
        rl.close();
        return resolve(line);  // port number
      }

      write('Insert port number >> ');

    });

  });
  
}


function showPortInformation() {
  write('Select Port List\n\n');
  PortInfos.forEach((port, index) => {
    write(' - ' + port['port'] + getSpace(String(port), 10) + '[' + port['name'] + ']\n');
  });
}


function getSpace(word, maxLength) {

  const space = [];
  const spaceLength = maxLength - word.length;
  for(let i = 0; i < spaceLength; i++) {
    space.push(' ');
  }

  return space.join('');
}


async function permitIngress(targetGroupId, targetIp, targetPort) {

  console.log(`permitIngress : [${targetGroupId}] / [${targetIp}] / [${targetPort}]`);

  await setIngressWithAwsCli(targetGroupId, targetIp, targetPort);

}


async function getCurrentExternalIp() {
  return new Promise((resolve, reject) => {
    const command = 'curl ' + AWS_IPCHECK_HOST;

    exec(command, (error, stdout, stderr) => {
      if(error) {
        console.log('error : ', error.message);
          reject();
       }

       if(stderr) {
         // console.log('stderr : ', stderr);
       }

       if(stdout) {
         // console.log(stdout);
         const ip = stdout.replace(/\n|\r|\s*/g, "");
         resolve(ip);
       }

     })
  });

}


async function setIngressWithAwsCli(groupId, permmitIp, permmitPort) {

  const cidr = permmitIp + CIDR_PREFIX;

  return new Promise((resolve, reject) => {
    const command = 'aws ec2 authorize-security-group-ingress --group-id ' + groupId + ' --protocol tcp --port ' + permmitPort + ' --cidr ' + cidr;

    exec(command, (error, stdout, stderr) => {
      if(error) {
        console.log('error : ', error);
        reject();
      }

      if(stderr) {
        console.log('stderr : ', stderr);
      }

      if(stdout) {
        console.log('stdout : ', stdout);
        resolve(stdout);
      }

    });

  });
}


init();
