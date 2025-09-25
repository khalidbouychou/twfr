// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dkfrrfxa1",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "575644558498264",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "tIbvrejZjv7e2M6WVMTRcL0ZDYw"
};

// Image URL builder
export const buildCloudinaryUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    ...otherOptions
  } = options;

  let url = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
  // Add transformations
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  // Add other options
  Object.entries(otherOptions).forEach(([key, value]) => {
    transformations.push(`${key}_${value}`);
  });
  
  if (transformations.length > 0) {
    url += `/${transformations.join(",")}`;
  }
  
  return `${url}/${publicId}`;
};
// Actual image mappings from Cloudinary upload
export const imageMappings = {
  "public/bg2.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706702/tawfir-ai/bg2.jpg",
  "public/bg1.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706703/tawfir-ai/bg1.jpg",
  "public/bg-login.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706704/tawfir-ai/bg-login.jpg",
  "public/signin.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706705/tawfir-ai/signin.jpg",
  "public/call.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706706/tawfir-ai/call.jpg",
  "public/support.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706707/tawfir-ai/support.jpg",
  "public/whytawfir.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706707/tawfir-ai/whytawfir.jpg",
  "public/t1.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706708/tawfir-ai/t1.jpg",
  "public/team.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706709/tawfir-ai/team.jpg",
  "public/teamour.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706710/tawfir-ai/teamour.jpg",
  "public/logo.png": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.png",
  "public/logo.svg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg",
  "public/assets/marketstock.png": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706713/tawfir-ai/marketstock.png",
  "public/assets/stock.png": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706714/tawfir-ai/stock.png",
  "public/assets/managed.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706715/tawfir-ai/managed.webp",
  "public/assets/OPCVM.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706715/tawfir-ai/OPCVM.webp",
  "public/assets/deposite.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706716/tawfir-ai/deposite.webp",
  "public/assets/savingaccount.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706717/tawfir-ai/savingaccount.jpg",
  "public/assets/hero.gif": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706718/tawfir-ai/hero.gif",
  "public/assets/herovodeo.gif": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706720/tawfir-ai/herovodeo.gif",
  "public/assets/avatars/1.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706721/tawfir-ai/1.jpg",
  "public/assets/avatars/2.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/2.jpg",
  "public/assets/avatars/3.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/3.jpg",
  "public/assets/avatars/mediumavatar.jpg": "https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706723/tawfir-ai/mediumavatar.jpg"
};
// Helper function to get image URL
export const getImageUrl = (localPath, options = {}) => {
  // If we have a mapping for this local path, use it
  if (imageMappings[localPath]) {
    return imageMappings[localPath];
  }
  
  // Otherwise, try to construct from local path
  const publicId = localPath.replace(/^\/?public\//, "").replace(/\.[^/.]+$/, "");
  return buildCloudinaryUrl(`tawfir-ai/${publicId}`, options);
};

// React component for Cloudinary images
export const CloudinaryImage = ({ src, alt, className, options = {}, ...props }) => {
  const imageUrl = getImageUrl(src, options);
  return <img src={imageUrl} alt={alt} className={className} {...props} />;
};
// Helper function to get image URL
export const getImageUrl = (localPath, options = {}) => {
  if (imageMappings[localPath]) {
    return imageMappings[localPath];
  }
  const publicId = localPath.replace(/^\/?public\//, "").replace(/\.[^/.]+$/, "");
  return buildCloudinaryUrl(`tawfir-ai/${publicId}`, options);
};

// React component for Cloudinary images
export const CloudinaryImage = ({ src, alt, className, options = {}, ...props }) => {
  const imageUrl = getImageUrl(src, options);
  return <img src={imageUrl} alt={alt} className={className} {...props} />;
};
