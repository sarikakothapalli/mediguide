import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const children = ['server', 'client'].map((name) => {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: new URL(`../${name}/`, import.meta.url),
    stdio: 'inherit',
    env: process.env,
    // Windows cannot spawn .cmd files directly unless they are run through cmd.exe.
    shell: isWindows,
  });
  child.on('error', (error) => {
    console.error(`Unable to start ${name}:`, error);
    shutdown(1);
  });
  child.on('exit', (code, signal) => {
    if (code && code !== 0) {
      console.error(`${name} process exited with code ${code}${signal ? ` (${signal})` : ''}`);
      shutdown(code);
    }
  });
  return child;
});

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill('SIGTERM');
  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
