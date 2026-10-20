const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Locate Git executable
const gitPaths = [
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
    'git'
];

let gitExe = 'git';
for (const p of gitPaths) {
    if (p === 'git' || fs.existsSync(p)) {
        gitExe = p;
        break;
    }
}

console.log(`Using Git at: "${gitExe}"\n`);

function runGit(args, ignoreError = false) {
    console.log(`> git ${args.join(' ')}`);
    const res = spawnSync(gitExe, args, {
        cwd: __dirname,
        stdio: 'inherit',
        shell: false
    });
    if (res.error && !ignoreError) {
        console.error('Execution error:', res.error);
        process.exit(1);
    }
    if (res.status !== 0 && !ignoreError) {
        console.log(`Command exited with code ${res.status}`);
    }
    return res;
}

const REPO_URL = 'https://github.com/kumarsha480/My-Portfolio.git';

console.log('--- Step 1: Initializing Git ---');
runGit(['init']);

console.log('\n--- Step 2: Configuring user info ---');
runGit(['config', 'user.name', 'Sahil Kumar']);
runGit(['config', 'user.email', 'Kumarsha480@gmail.com']);

console.log('\n--- Step 3: Setting remote origin ---');
// Check remote
const remotes = spawnSync(gitExe, ['remote'], { cwd: __dirname }).stdout?.toString() || '';
if (remotes.includes('origin')) {
    runGit(['remote', 'set-url', 'origin', REPO_URL]);
} else {
    runGit(['remote', 'add', 'origin', REPO_URL]);
}

console.log('\n--- Step 4: Setting branch to main ---');
runGit(['branch', '-M', 'main']);

console.log('\n--- Step 5: Staging all files ---');
runGit(['add', '.']);

console.log('\n--- Step 6: Committing changes ---');
runGit(['commit', '-m', 'Fix asset paths and folder names for Netlify deployment'], true);

console.log('\n--- Step 7: Pushing to GitHub (main & kumarsha480) ---');
console.log('If a browser window pops up asking you to sign in to GitHub, please click Sign in/Authorize!\n');
runGit(['push', '-u', 'origin', 'main', '--force']);
runGit(['push', 'origin', 'main:kumarsha480', '--force']);

console.log('\n🎉 Finished! Check your portfolio at https://sahilkumar.work/');
