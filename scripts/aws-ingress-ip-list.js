#!/usr/bin/env node

/*
 * needs to install aws-cli in your mac first! 
 * you should configure aws-cli IAM
 */

import {exec} from 'child_process';

// tldj-rdb security group 
const RED_SECURITY_GROUP_ID = 'sg-0de0015ddb203348c';

async function checkCurrentIngressIpList() {
  return new Promise((resolve, reject) => {
    const command = 'aws ec2 describe-security-groups --group-ids ' + RED_SECURITY_GROUP_ID;

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


const securityConfig = await checkCurrentIngressIpList();
const securityGroup = parseSecurityConfig(securityConfig);

console.log('GroupName : ', securityGroup['GroupName']);
console.log('Ip Permissions');
console.log(JSON.stringify(securityGroup['IpPermissions'], null, 4));

