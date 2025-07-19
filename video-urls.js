/**
 * Dreams and Poems - Video URLs Configuration
 * Enhanced with metadata, categorization, and error handling
 * 
 * @author Carlos Escobar
 * @description Video URL configuration with enhanced features
 */

// Video metadata for enhanced features
const VIDEO_METADATA = {
  quality: {
    desktop: 'high',
    mobile: 'medium'
  },
  formats: ['mp4'],
  cdn: {
    primary: 'filedn.com',
    fallback: null
  },
  categories: {
    dreams: 'Abstract and surreal content',
    poems: 'Text-based poetic content',
    mixed: 'Combined audio-visual poetry'
  }
};

// Configuration for video loading and playback
const VIDEO_CONFIG = {
  preload: {
    desktop: 3,
    mobile: 2  // Increased from 1 to 2 for smoother mobile experience
  },
  retry: {
    maxAttempts: 3,
    delay: 1000
  },
  timeout: {
    loading: 30000,
    buffer: 5000
  },
  mobile: {
    crossfadeDuration: 800,  // Faster transitions on mobile
    touchTimeout: 150,       // Reduced touch detection timeout
    enableHoldToPause: false // Disable problematic hold-to-pause
  }
};

// Video URLs configuration for Dreams and Poems
window.VIDEO_URLS = {
    desktop: [
      "https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0001.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0002.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0003.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0004.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0005.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0006.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0007.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0008.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0009.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0010.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0011.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0012.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0013.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0014.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0015.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0016.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0017.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0018.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0019.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0020.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0021.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0022.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0023.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0024.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0025.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0026.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0027.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0028.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0029.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0030.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0031.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0032.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0033.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0034.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0035.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0036.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0037.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0038.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0039.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0040.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0041.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0042.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0043.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0044.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0045.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0046.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0047.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0048.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0049.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0050.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0051.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0052.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0053.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0054.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0055.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0056.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Desktop/escob.art_hor_0057.mp4" 
      ],
    mobile: [
      "https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0001.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0002.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0003.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0004.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0005.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0006.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0007.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0008.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0009.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0010.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0011.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0012.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0013.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0014.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0015.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0016.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0017.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0018.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0019.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0020.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0021.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0022.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0023.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0024.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0025.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0026.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0027.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0028.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0029.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0030.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0031.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0032.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0033.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0034.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0035.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0036.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0037.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0038.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0039.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0040.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0041.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0042.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0043.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0044.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0045.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0046.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0047.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0048.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0049.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0050.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0051.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0052.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0053.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0054.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0055.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0056.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0057.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0058.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0059.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0060.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0061.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0062.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0063.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0064.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0065.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0066.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0067.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0068.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0069.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0070.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0071.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0072.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0073.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0074.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0075.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0076.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0077.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0078.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0079.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0080.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0081.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0082.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0083.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0084.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0085.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0086.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0087.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0088.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0089.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0090.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0091.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0092.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0093.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0094.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0095.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0096.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0097.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0098.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0099.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0100.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0101.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0102.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0103.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0104.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0105.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0106.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0107.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0108.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0109.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0110.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0111.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0112.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0113.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0114.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0115.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0116.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0117.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0118.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0119.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0120.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0121.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0122.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0123.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0124.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0125.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0126.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0127.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0128.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0129.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0130.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0131.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0132.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0133.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0134.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0135.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0136.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0137.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0138.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0139.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0140.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0141.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0142.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0143.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0144.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0145.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0146.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0147.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0148.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0149.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0150.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0151.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0152.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0153.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0154.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0155.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0156.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0157.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0158.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0159.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0160.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0161.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0162.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0163.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0164.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0165.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0166.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0167.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0168.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0169.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0170.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0171.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0172.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0173.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0174.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0175.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0176.mp4","https://filedn.com/lHC6pEBkEzyQnHC8rtghiku/Dreams%20and%20Poems/Mobile/escob.art_ver_0177.mp4"
         ]
};

// Enhanced error handling and URL validation for Dreams and Poems v024
window.VIDEO_ERROR_HANDLER = {
    failedUrls: new Set(),
    retryCount: new Map(),
    maxRetries: 3,
    
    // HTTP status code explanations
    statusCodes: {
        304: 'Not Modified - Browser cache is up to date',
        404: 'Video file not found on server',
        403: 'Access forbidden - permission denied',
        500: 'Server error',
        503: 'Service unavailable'
    },
    
    // Log and handle video errors with detailed information
    logError(url, error, statusCode = null) {
        const videoName = url.split('/').pop();
        const errorType = statusCode || (error.name || 'Unknown Error');
        
        console.group(`🚨 Video Error: ${videoName}`);
        console.log(`URL: ${url}`);
        console.log(`Error Type: ${errorType}`);
        
        if (statusCode) {
            console.log(`HTTP Status: ${statusCode} - ${this.statusCodes[statusCode] || 'Unknown status'}`);
            
            // 304 is actually not an error - it means cached version is current
            if (statusCode === 304) {
                console.log(`✅ This is actually good - video is cached!`);
                console.groupEnd();
                return false; // Not a real error
            }
            
            // 404 means the video file doesn't exist
            if (statusCode === 404) {
                console.error(`❌ Video file missing: ${videoName}`);
                this.failedUrls.add(url);
            }
        }
        
        if (error.message) {
            console.log(`Error Message: ${error.message}`);
        }
        
        const retries = this.retryCount.get(url) || 0;
        console.log(`Retry Count: ${retries}/${this.maxRetries}`);
        console.groupEnd();
        
        // Track failed URLs to avoid repeated attempts
        if (retries >= this.maxRetries) {
            this.failedUrls.add(url);
            console.warn(`🚫 Marking ${videoName} as permanently failed`);
        } else {
            this.retryCount.set(url, retries + 1);
        }
        
        return true; // Real error occurred
    },
    
    // Check if URL should be skipped due to previous failures
    shouldSkipUrl(url) {
        return this.failedUrls.has(url);
    },
    
    // Get a filtered list of working video URLs
    getWorkingUrls(urlArray) {
        return urlArray.filter(url => !this.shouldSkipUrl(url));
    },
    
    // Reset error tracking (useful for testing)
    reset() {
        this.failedUrls.clear();
        this.retryCount.clear();
        console.log('🔄 Video error tracking reset');
    },
    
    // Get summary of video loading issues
    getSummary() {
        return {
            totalFailed: this.failedUrls.size,
            failedUrls: Array.from(this.failedUrls),
            totalRetries: this.retryCount.size
        };
    }
};

// URL validation utility
window.VIDEO_URL_VALIDATOR = {
    // Test if a video URL is accessible
    async testUrl(url) {
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                cache: 'no-cache' // Avoid cached responses for testing
            });
            
            if (response.ok || response.status === 304) {
                return { valid: true, status: response.status };
            } else {
                return { 
                    valid: false, 
                    status: response.status,
                    message: `HTTP ${response.status}: ${response.statusText}`
                };
            }
        } catch (error) {
            return { 
                valid: false, 
                status: null,
                message: error.message 
            };
        }
    },
    
    // Test a batch of URLs with rate limiting
    async testBatch(urls, batchSize = 5, delay = 1000) {
        const results = [];
        
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            const batchPromises = batch.map(url => this.testUrl(url));
            
            try {
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults.map((result, index) => ({
                    url: batch[index],
                    ...result
                })));
                
                // Add delay between batches to avoid overwhelming the server
                if (i + batchSize < urls.length) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                console.error(`Batch testing failed:`, error);
            }
        }
        
        return results;
    },
    
    // Quick validation of URL format
    isValidUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'https:' && url.endsWith('.mp4');
        } catch {
            return false;
        }
    }
};

// Enhanced video loading with error handling
window.ENHANCED_VIDEO_LOADER = {
    // Load video with comprehensive error handling
    async loadVideo(videoElement, url) {
        return new Promise((resolve, reject) => {
            if (VIDEO_ERROR_HANDLER.shouldSkipUrl(url)) {
                reject(new Error(`URL marked as failed: ${url}`));
                return;
            }
            
            const timeout = setTimeout(() => {
                reject(new Error(`Video load timeout: ${url}`));
            }, 30000);
            
            const onLoad = () => {
                clearTimeout(timeout);
                videoElement.removeEventListener('loadeddata', onLoad);
                videoElement.removeEventListener('error', onError);
                resolve(videoElement);
            };
            
            const onError = (event) => {
                clearTimeout(timeout);
                videoElement.removeEventListener('loadeddata', onLoad);
                videoElement.removeEventListener('error', onError);
                
                const error = event.target.error || new Error('Video load failed');
                VIDEO_ERROR_HANDLER.logError(url, error);
                reject(error);
            };
            
            videoElement.addEventListener('loadeddata', onLoad, { once: true });
            videoElement.addEventListener('error', onError, { once: true });
            
            videoElement.src = url;
            videoElement.load();
        });
    }
};

console.log('📹 Enhanced video error handling and validation loaded');
console.log(`📊 Total videos configured: Desktop ${VIDEO_URLS.desktop.length}, Mobile ${VIDEO_URLS.mobile.length}`);
