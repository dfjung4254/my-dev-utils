#!/usr/bin/env node

/*
 *  needs to install aws-cli in your mac first!
 *  you should configure aws-cli IAM
 */

import {exec} from "child_process";

const AWS_IPCHECK_HOST = 'https://checkip.amazonaws.com';

// tldj-rdb security group 
const RDB_SECURITY_GROUP_ID = 'sg-0de0015ddb203348c'; 
const RDB_INGRESS_PORT = '3306';

async function permitIngress() {
  const currentIp = await getCurrentExternalIp();
  console.log('current ip is : ', currentIp);

  const result = await setIngressWithAwsCli(currentIp);

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


async function setIngressWithAwsCli(permmitIp) {

  const cidr = permmitIp + '/32';

  return new Promise((resolve, reject) => {
    const command = 'aws ec2 authorize-security-group-ingress --group-id ' + RDB_SECURITY_GROUP_ID + ' --protocol tcp --port ' + RDB_INGRESS_PORT + ' --cidr ' + cidr;

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


permitIngress();

