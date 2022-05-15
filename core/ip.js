import ProcessUtils from '../core/process.js';

async function getCurrentIp(nostdout) {

  const processUtils = new ProcessUtils();
  const result = await processUtils.execResult('curl', ['http://ip-api.com/json']);
  const ipInfo = JSON.parse(result);

  if(!nostdout) {
    console.log(`current ip : \x1b[32m [${ipInfo['query']}] \x1b[0m`);
    console.log(`current ip details : `, ipInfo);
  }
  
  return ipInfo['query'];
}

export { getCurrentIp };
