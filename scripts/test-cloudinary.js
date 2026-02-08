require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const path = require('path');

// Configure Cloudinary - remove quotes if present
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test upload
async function testUpload() {
    console.log('🧪 Testing Cloudinary Upload\n');

    // Test with a sample image
    const testImagePath = path.join(__dirname, '..', 'public', 'images', 'products', 'lips', 'lipstick', 'matte-liquid-lipstick.jpg');

    console.log('Config:');
    console.log('  Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.replace(/"/g, ''));
    console.log('  API Key:', process.env.CLOUDINARY_API_KEY?.replace(/"/g, '').substring(0, 8) + '...');
    console.log('\n📁 Test image:', testImagePath);

    try {
        const result = await cloudinary.uploader.upload(testImagePath, {
            public_id: 'florelle/test/sample-lipstick',
            folder: 'florelle/test',
            resource_type: 'image',
        });

        console.log('\n✅ Upload successful!');
        console.log('   URL:', result.secure_url);
        console.log('   Width:', result.width);
        console.log('   Height:', result.height);
        console.log('   Format:', result.format);
        console.log('\n🎉 Cloudinary is working correctly!');

    } catch (error) {
        console.error('\n❌ Upload failed:', error.message);
        if (error.http_code === 401) {
            console.error('   → Check your API credentials in .env');
        }
    }
}

testUpload();
