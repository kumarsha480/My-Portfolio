const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Step 1: Rename the main folder
const oldFolder = path.join(assetsDir, 'Sahil Kumar (Portfolio)');
const newFolder = path.join(assetsDir, 'portfolio');

if (fs.existsSync(oldFolder)) {
    fs.renameSync(oldFolder, newFolder);
    console.log('✅ Renamed folder: "Sahil Kumar (Portfolio)" → "portfolio"');
} else if (fs.existsSync(newFolder)) {
    console.log('⏭️  Folder "portfolio" already exists, skipping folder rename');
} else {
    console.log('❌ Folder "Sahil Kumar (Portfolio)" not found!');
}

// Step 2: Rename files inside portfolio folder
const fileRenames = [
    ['Project 1.png', 'project-1.png'],
    ['Project 2.png', 'project-2.png'],
    ['Project 3.png', 'project-3.png'],
    ['Project 4.png', 'project-4.png'],
    ['Project 5.png', 'project-5.png'],
    ['Project 6.png', 'project-6.png'],
    ['Intro video.mp4', 'intro-video.mp4'],
    ['Sample 1 \u2014 Portfolio variation.png', 'sample-1-portfolio-variation.png'],
];

const portfolioDir = newFolder;
if (fs.existsSync(portfolioDir)) {
    fileRenames.forEach(([oldName, newName]) => {
        const oldPath = path.join(portfolioDir, oldName);
        const newPath = path.join(portfolioDir, newName);
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: "${oldName}" → "${newName}"`);
        } else if (fs.existsSync(newPath)) {
            console.log(`⏭️  "${newName}" already exists, skipping`);
        } else {
            console.log(`⚠️  "${oldName}" not found, skipping`);
        }
    });
}

// Step 3: Rename files in assets root
const rootRenames = [
    ['My Photo.png', 'my-photo.png'],
    ['Sahil Kumar - New Updated Resume.pdf', 'sahil-kumar-resume.pdf'],
];

rootRenames.forEach(([oldName, newName]) => {
    const oldPath = path.join(assetsDir, oldName);
    const newPath = path.join(assetsDir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renamed: "${oldName}" → "${newName}"`);
    } else if (fs.existsSync(newPath)) {
        console.log(`⏭️  "${newName}" already exists, skipping`);
    } else {
        console.log(`⚠️  "${oldName}" not found, skipping`);
    }
});

console.log('\n🎉 All renames complete! You can now deploy your site.');
console.log('Delete this script after: del rename-assets.js');
