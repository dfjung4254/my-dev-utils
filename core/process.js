import {spawn, execFile} from 'child_process';

export default class ProcessUtils {

  constructor() {

  }

  exec = async (cmd, options) => {
    return new Promise((resolved, rejected) => {

      const child = spawn(cmd, options);

      child.stdout.on('data', data => {
        console.log(`${data}`);
      })

      child.stderr.on('data', data => {
        console.error(`${data}`);
      })
      
      child.on('close', code => {
        console.log(`cmd process exited with ${code}`);
        if(code !== 0) {
          rejected(code);
        }
        resolved(code);
      });

    });

  }

  execResult = async (cmd, options) => {
    return new Promise((resolved, rejected) => {

      const child = execFile(cmd, options, (error, stdout, stderr) => {
        if(error) {
          rejected(stderr);
        }
        resolved(stdout);
      });

    });

  }

}
