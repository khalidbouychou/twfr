import React from 'react';
import { getImageUrl, getVideoUrl } from './cloudinary.js';

// React component for Cloudinary images
export const CloudinaryImage = ({ src, alt, className, options = {}, ...props }) => {
  const imageUrl = getImageUrl(src, options);
  return <img src={imageUrl} alt={alt} className={className} {...props} />;
};

// React component for Cloudinary videos
export const CloudinaryVideo = ({ src, className, options = {}, ...props }) => {
  const videoUrl = getVideoUrl(src, options);
  return (
    <video src={videoUrl} className={className} {...props}>
      Your browser does not support the video tag.
    </video>
  );
};