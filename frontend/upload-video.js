import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dkfrrfxa1',
  api_key: '575644558498264',
  api_secret: 'tIbvrejZjv7e2M6WVMTRcL0ZDYw'
});

async function uploadVideo() {
  try {
    console.log('🎬 Starting video upload to Cloudinary...');
    
    const videoPath = path.join(__dirname, './public/assets/00.mp4');
    
    // Check if video exists
    if (!fs.existsSync(videoPath)) {
      console.error('❌ Video file not found:', videoPath);
      return;
    }
    
    console.log('📁 Video file found, uploading...');
    
    const result = await cloudinary.uploader.upload(videoPath, {
      resource_type: 'video',
      public_id: 'tawfir-ai/hero-video',
      folder: 'tawfir-ai',
      overwrite: true,
      transformation: [
        {
          quality: 'auto',
          format: 'mp4',
          width: 800,
          crop: 'scale'
        }
      ]
    });
    
    console.log('✅ Video uploaded successfully!');
    console.log('🔗 Cloudinary URL:', result.secure_url);
    console.log('📊 File size:', Math.round(result.bytes / 1024 / 1024 * 100) / 100, 'MB');
    console.log('⏱️  Duration:', result.duration, 'seconds');
    console.log('📏 Dimensions:', `${result.width}x${result.height}`);
    
    // Update the video mapping in cloudinary.js
    const mappingEntry = `"public/assets/00.mp4": "${result.secure_url}"`;
    console.log('\n📝 Add this to videoMappings in cloudinary.js:');
    console.log(mappingEntry);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Run the upload
uploadVideo();