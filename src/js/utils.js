/**
 * Dreams and Poems - Utility Functions
 * Core utility functions for the video player application
 * 
 * @author Carlos Escobar
 */

// Array utilities
export const ArrayUtils = {
  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Get random item from array
   * @param {Array} array - Source array
   * @returns {*} Random item
   */
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} array - Source array
   * @param {number} size - Chunk size
   * @returns {Array} Array of chunks
   */
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// Device detection utilities
export const DeviceUtils = {
  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  },

  /**
   * Check if device is desktop
   * @returns {boolean} True if desktop device
   */
  isDesktop() {
    return window.matchMedia('(min-width: 769px)').matches;
  },

  /**
   * Check if device supports touch
   * @returns {boolean} True if touch supported
   */
  hasTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get device pixel ratio
   * @returns {number} Device pixel ratio
   */
  getPixelRatio() {
    return window.devicePixelRatio || 1;
  },

  /**
   * Check if device prefers reduced motion
   * @returns {boolean} True if reduced motion preferred
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Performance utilities
export const PerformanceUtils = {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Create requestAnimationFrame-based throttle
   * @param {Function} func - Function to throttle
   * @returns {Function} RAF-throttled function
   */
  rafThrottle(func) {
    let requestId = null;
    return function(...args) {
      if (requestId === null) {
        requestId = requestAnimationFrame(() => {
          func.apply(this, args);
          requestId = null;
        });
      }
    };
  },

  /**
   * Measure performance of a function
   * @param {Function} func - Function to measure
   * @param {string} label - Performance label
   * @returns {Promise} Function result with timing
   */
  async measure(func, label = 'operation') {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }
};

// Storage utilities
export const StorageUtils = {
  /**
   * Set item in localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to store item:', error);
      return false;
    }
  },

  /**
   * Get item from localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to retrieve item:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove item:', error);
      return false;
    }
  },

  /**
   * Clear all localStorage items
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear storage:', error);
      return false;
    }
  }
};

// URL utilities
export const UrlUtils = {
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isValid(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get file extension from URL
   * @param {string} url - URL to parse
   * @returns {string} File extension
   */
  getExtension(url) {
    try {
      const pathname = new URL(url).pathname;
      return pathname.split('.').pop().toLowerCase();
    } catch {
      return '';
    }
  },

  /**
   * Check if URL is video file
   * @param {string} url - URL to check
   * @returns {boolean} True if video URL
   */
  isVideo(url) {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    return videoExtensions.includes(this.getExtension(url));
  },

  /**
   * Add timestamp to URL to prevent caching
   * @param {string} url - Original URL
   * @returns {string} URL with timestamp
   */
  addTimestamp(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
};

// Animation utilities
export const AnimationUtils = {
  /**
   * Fade element in
   * @param {HTMLElement} element - Element to fade in
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} Animation completion promise
   */
  fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      let start = null;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = progress.toString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  },

  /**
   * Fade element out
   * @param {HTMLElement} element - Element to fade out
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} Animation completion promise
   */
  fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      const startOpacity = parseFloat(getComputedStyle(element).opacity);
      
      let start = null;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = (startOpacity * (1 - progress)).toString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  },

  /**
   * Slide element down
   * @param {HTMLElement} element - Element to slide
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} Animation completion promise
   */
  slideDown(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.overflow = 'hidden';
      element.style.height = '0px';
      element.style.display = 'block';
      
      const targetHeight = element.scrollHeight;
      
      let start = null;
      function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.height = (targetHeight * progress) + 'px';
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.height = '';
          element.style.overflow = '';
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  }
};

// Accessibility utilities
export const A11yUtils = {
  /**
   * Announce text to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Announcement priority ('polite' or 'assertive')
   */
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },

  /**
   * Set focus trap for modal dialogs
   * @param {HTMLElement} container - Container element
   * @returns {Function} Cleanup function
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  },

  /**
   * Generate unique ID for accessibility attributes
   * @param {string} prefix - ID prefix
   * @returns {string} Unique ID
   */
  generateId(prefix = 'element') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Error handling utilities
export const ErrorUtils = {
  /**
   * Safe function execution with error handling
   * @param {Function} func - Function to execute
   * @param {*} fallback - Fallback value on error
   * @returns {*} Function result or fallback
   */
  safely(func, fallback = null) {
    try {
      return func();
    } catch (error) {
      console.error('Safe execution failed:', error);
      return fallback;
    }
  },

  /**
   * Retry function execution with exponential backoff
   * @param {Function} func - Function to retry
   * @param {number} maxAttempts - Maximum retry attempts
   * @param {number} baseDelay - Base delay in ms
   * @returns {Promise} Function result
   */
  async retry(func, maxAttempts = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await func();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },

  /**
   * Create error with additional context
   * @param {string} message - Error message
   * @param {Object} context - Additional context
   * @returns {Error} Enhanced error
   */
  createError(message, context = {}) {
    const error = new Error(message);
    error.context = context;
    error.timestamp = new Date().toISOString();
    return error;
  }
};
