#!/usr/bin/env node

/*
 * needs to install aws-cli in your mac first! 
 * you should configure aws-cli IAM
 */

import {exec} from 'child_process';
import readline from 'readline';
import SecurityGroups from '../core/securityGroups.js';
import write from '../core/write.js';
import { getCurrentIp } from '../core/ip.js';

async function init() {

  showGroupInformation();
  selectSecurityGroup();

}


function showGroupInformation() {
  write('Your securityGroup lists\n\n');
  SecurityGroups.forEach((securityGroup, index) => {
    write('[' + index + '] ' + securityGroup['name'] + '(' + securityGroup['groupName'] + ')\n');
  });
}


async function selectSecurityGroup() {

  write('\nchoose to command >> ');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', async (line) => {

    if(line && line >= 0 && line < SecurityGroups.length) {
      rl.close();
      await processIngressCommand(line);
      return;
    }

    write('choose to command >> ');

  });

}


async function processIngressCommand(commandIndex) {

  const securityConfig = await checkCurrentIngressIpList(SecurityGroups[commandIndex]['groupName']);
  const securityGroup = parseSecurityConfig(securityConfig);
  
  console.log('GroupName : ', securityGroup['GroupName']);
  console.log('Ip Permissions');
  console.log(await formatIpIngress(securityGroup['IpPermissions']));
  // console.log(JSON.stringify(securityGroup['IpPermissions'], null, 4));

}


async function formatIpIngress(ipPermissions) {

  const currentIp = await getCurrentIp(true);
  
  const formattedIpPermissions = [];
  ipPermissions.forEach(ipPermission => {
    const port = ipPermission['FromPort'];
    const protocol = ipPermission['IpProtocol'];
    const cidrIps = ipPermission['IpRanges'].map(ipRange => {
      const cidrIp = ipRange['CidrIp'].split('/');
      const ip = cidrIp[0];
      const cidr = cidrIp[1];
      const coloredIp = getColoredIp(ip, currentIp);
      formattedIpPermissions.push('[' + coloredIp + ']' + getSpace(ip, 20) + '[' + cidr + ']' + getSpace(cidr, 5) + '[' + port + ']' + getSpace(String(port), 10) + '[' + protocol + ']');
    });
  });

  return formattedIpPermissions.join('\n');
}

function getColoredIp(ip, currentIp) {

  if(ip === currentIp) {
    return '\x1b[32m' + ip + '\x1b[0m';
  }

  if(ip === '0.0.0.0') {
    return '\x1b[34m' + ip + '\x1b[0m';
  }

  return ip;
}


function getSpace(word, maxLength) {

  const space = [];
  const size = maxLength - word.length;
  for(let i = 0; i < size; i++) {
    space.push(' ');
  }

  return space.join('');
}


async function checkCurrentIngressIpList(groupId) {
  return new Promise((resolve, reject) => {
    const command = 'aws ec2 describe-security-groups --group-ids ' + groupId;

    exec(command, (error, stdout, stderr) => {

      if(error) {
        console.log('error : ', error.message);
        reject();
      }

      if(stderr) {
        console.log('stderr : ', stderr);
      }

      if(stdout) {
        resolve(JSON.parse(stdout));
      }

    });

  });

}


function parseSecurityConfig(config) {
  return config['SecurityGroups'][0];
}


init();

