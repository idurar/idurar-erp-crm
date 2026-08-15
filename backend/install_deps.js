const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log('Starting install...');
    const output = execSync('npm install axios google-auth-library --no-audit --no-fund', { encoding: 'utf8' });
    fs.writeFileSync('install_log.txt', output);
    console.log('Install finished.');
} catch (error) {
    fs.writeFileSync('install_error.txt', error.stdout + '\n' + error.stderr);
    console.log('Install failed.');
}
