// ========================================
// AUTO UPDATE JSON SCRIPT
// ========================================
// 
// HOW TO RUN:
// 1. Open Terminal in VS Code (Ctrl + ~)
// 2. Make sure you're in the root folder:
//    cd c:\Users\mhard\Documents\GitHub\HardikMehta
// 3. Run the script:
//    node auto-update-json.js
//
// WHAT IT DOES:
// - Scans Projects/ folder and detects all project folders
// - Detects all images in each project's Images/ folder
// - Scans certificates/ folder and detects all certificate folders
// - Auto-generates/updates projects.json and certificates.json
//
// WHEN TO RUN:
// - After adding a new project folder
// - After adding new images to a project
// - After adding a new certificate folder
//
// ========================================

const fs = require('fs');
const path = require('path');

// Function to scan Projects folder and create projects.json
function generateProjectsJson() {
    const projectsDir = path.join(__dirname, 'Projects');
    const projects = [];

    if (!fs.existsSync(projectsDir)) {
        console.log('❌ Projects folder not found');
        return;
    }

    const projectFolders = fs.readdirSync(projectsDir).filter(file => {
        return fs.statSync(path.join(projectsDir, file)).isDirectory();
    });

    projectFolders.forEach(projectFolder => {
        const projectPath = path.join(projectsDir, projectFolder);
        const imagesDir = path.join(projectPath, 'Images');
        const images = [];

        // Get all images from the Images folder
        if (fs.existsSync(imagesDir)) {
            const imageFiles = fs.readdirSync(imagesDir)
                .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
                .sort();

            imageFiles.forEach(image => {
                images.push(`Projects/${projectFolder}/Images/${image}`);
            });
        }

        projects.push({
            id: projectFolder,
            thumbnail: `images/thumbs/${projectFolder.replace('project', '')}.png`,
            images: images
        });
    });

    // Write to projects.json
    fs.writeFileSync(
        path.join(__dirname, 'projects.json'),
        JSON.stringify(projects, null, 4)
    );

    console.log(`✅ projects.json updated with ${projects.length} projects`);
}

// Function to scan certificates folder and create certificates.json
function generateCertificatesJson() {
    const certificatesDir = path.join(__dirname, 'certificates');
    const certificates = [];

    if (!fs.existsSync(certificatesDir)) {
        console.log('❌ certificates folder not found');
        return;
    }

    const certificateFolders = fs.readdirSync(certificatesDir).filter(file => {
        return fs.statSync(path.join(certificatesDir, file)).isDirectory();
    });

    certificateFolders.forEach(certFolder => {
        certificates.push({
            id: certFolder
        });
    });

    // Write to certificates.json
    fs.writeFileSync(
        path.join(__dirname, 'certificates.json'),
        JSON.stringify(certificates, null, 4)
    );

    console.log(`✅ certificates.json updated with ${certificates.length} certificates`);
}

// Run both functions
console.log('🔄 Scanning folders and updating JSON files...\n');
generateProjectsJson();
generateCertificatesJson();
console.log('\n✨ Done! JSON files have been updated.');
