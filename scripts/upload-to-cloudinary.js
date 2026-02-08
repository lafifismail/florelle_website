require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const MAPPING_FILE = path.join(__dirname, 'cloudinary-mapping.json');

// Mapping object: { "local_path": "cloudinary_url" }
const urlMapping = {};

// Function to get all image files recursively
function getAllImageFiles(dir, baseDir = dir) {
    let files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files = files.concat(getAllImageFiles(fullPath, baseDir));
        } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
            files.push(fullPath);
        }
    }

    return files;
}

// Function to upload a single image
async function uploadImage(localPath) {
    // Generate public_id from path: products/lips/lipstick/matte-liquid-lipstick.jpg
    const relativePath = path.relative(IMAGES_DIR, localPath);
    const publicId = 'florelle/products/' + relativePath.replace(/\\/g, '/').replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');

    try {
        console.log(`📤 Uploading: ${relativePath}`);

        const result = await cloudinary.uploader.upload(localPath, {
            public_id: publicId,
            folder: 'florelle/products',
            resource_type: 'image',
            overwrite: false, // Don't overwrite if already exists
        });

        // Store mapping: /images/products/... -> cloudinary URL
        const webPath = '/images/products/' + relativePath.replace(/\\/g, '/');
        urlMapping[webPath] = result.secure_url;

        console.log(`   ✅ Uploaded to: ${result.secure_url}`);
        return result;
    } catch (error) {
        console.error(`   ❌ Error uploading ${relativePath}:`, error.message);
        return null;
    }
}

// Main function
async function main() {
    console.log('🌩️  CLOUDINARY IMAGE UPLOAD SCRIPT\n');
    console.log(`📁 Images directory: ${IMAGES_DIR}\n`);

    // Get all image files
    const imageFiles = getAllImageFiles(IMAGES_DIR);
    console.log(`📊 Found ${imageFiles.length} images to upload\n`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    // Upload images with progress
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        console.log(`\n[${i + 1}/${imageFiles.length}]`);

        const result = await uploadImage(file);

        if (result) {
            uploaded++;
        } else {
            failed++;
        }

        // Progress indicator
        if ((i + 1) % 10 === 0) {
            console.log(`\n📈 Progress: ${i + 1}/${imageFiles.length} processed`);
        }
    }

    // Save mapping to file
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2));

    console.log('\n\n🎉 UPLOAD COMPLETE!\n');
    console.log(`✅ Uploaded: ${uploaded}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`\n💾 URL mapping saved to: ${MAPPING_FILE}`);
    console.log(`\nNext step: Run update-db-with-cloudinary.js to update database`);
}

// Run
main().catch(console.error);
