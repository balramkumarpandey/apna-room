export const getOptimizedUrl = (url, width = 800) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  // Split the URL at '/upload/'
  const parts = url.split('/upload/');
  
  // Return optimized URL
  return `${parts[0]}/upload/f_auto,q_auto,w_${width}/${parts[1]}`;
};