import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configuration
cloudinary.config({ 
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, 
    api_key:  import.meta.env.VITE_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET
});

// List of all images to upload
const imagesToUpload = [
    "public/bg2.jpg",
    "public/bg1.jpg", 
    "public/bg-login.jpg",
    "public/signin.jpg",
    "public/call.jpg",
    "public/support.jpg",
    "public/whytawfir.jpg",
    "public/t1.jpg",
    "public/team.jpg",
    "public/teamour.jpg",
    "public/logo.png",
    "public/logo.svg",
    "public/assets/marketstock.png",
    "public/assets/stock.png",
    "public/assets/managed.jpg",
    "public/assets/OPCVM.jpg",
    "public/assets/deposite.jpg",
    "public/assets/savingaccount.jpg",
    "public/assets/hero.gif",
    "public/assets/herovodeo.gif",
    "public/assets/avatars/1.jpg",
    "public/assets/avatars/2.jpg",
    "public/assets/avatars/3.jpg",
    "public/assets/avatars/mediumavatar.jpg",
    "public/investor-profile.svg",
    "public/finance-profile.svg",
    "public/esg.svg",
    "public/epagne-profile.svg",
    "public/connaisance-personal.svg",
    "public/contactus.svg",
    "public/msg.svg",
    "public/dashb.svg",
    "public/perf.svg",
    "public/1form.svg",
    "public/step1.svg",
    "public/free.svg",
    "public/tawfir.svg",
    "public/saving.svg",
    "public/svg_team.svg",
    "public/Pourquoi.svg",
    "public/Pourquoiépargner.svg",
    "public/vite.svg",
    "public/assets/service.svg",
    "public/assets/OPCVM.svg",
    "public/assets/deposit.svg",
    "public/assets/saving.svg",
    "public/assets/products.svg",
    "public/assets/react.svg"
];

// Upload function
async function uploadImage(filePath) {
    try {
        const publicId = path.basename(filePath, path.extname(filePath));
        const folder = "tawfir-ai";
        
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            public_id: `${folder}/${publicId}`,
            resource_type: "auto",
            overwrite: true
        });
        
        console.log(`✅ Uploaded: ${filePath} -> ${uploadResult.secure_url}`);
        return {
            originalPath: filePath,
            cloudinaryUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        };
    } catch (error) {
        console.error(`❌ Failed to upload ${filePath}:`, error.message);
        return null;
    }
}

// Main upload function
async function uploadAllImages() {
    console.log("🚀 Starting Cloudinary upload process...\n");
    
    const results = [];
    
    for (const imagePath of imagesToUpload) {
        if (fs.existsSync(imagePath)) {
            const result = await uploadImage(imagePath);
            if (result) {
                results.push(result);
            }
        } else {
            console.log(`⚠️  File not found: ${imagePath}`);
        }
    }
    
    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successfully uploaded: ${results.length} images`);
    console.log(`❌ Failed uploads: ${imagesToUpload.length - results.length} images`);
    
    // Save mapping to JSON file
    const mapping = {};
    results.forEach(result => {
        mapping[result.originalPath] = result.cloudinaryUrl;
    });
    
    fs.writeFileSync("cloudinary-mapping.json", JSON.stringify(mapping, null, 2));
    console.log("\n💾 Saved mapping to cloudinary-mapping.json");
    
    return results;
}

// Run the upload
uploadAllImages()
    .then(() => {
        console.log("\n🎉 Upload process completed!");
        process.exit(0);
    })
    .catch(error => {
        console.error("💥 Upload process failed:", error);
        process.exit(1);
    });
