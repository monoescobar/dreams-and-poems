/**
 * Dreams and Poems - Video Manager
 * Advanced video management with preloading, error handling, and performance optimization
 * 
 * @author Carlos Escobar
 */

import { ArrayUtils, DeviceUtils, PerformanceUtils, ErrorUtils, A11yUtils } from './utils.js';

export class VideoManager {
  constructor(config = {}) {
    this.config = {
      preloadBufferSize: DeviceUtils.isMobile() ? 1 : 3,
      maxRetries: 3,
      retryDelay: 1000,
      loadTimeout: 30000,
      crossfadeDuration: 1500,
      ...config
    };

    this.videoUrls = [];
    this.currentIndex = -1;
    this.activeVideoElement = null;
    this.inactiveVideoElement = null;
    this.isTransitioning = false;
    this.preloadedVideos = new Map();
    this.loadingPromises = new Map();
    this.errorCount = 0;
    this.maxErrors = 10;
    
    // Performance monitoring
    this.performanceMetrics = {
      loadTimes: [],
      errorRate: 0,
      bufferHealth: 0
    };

    this.eventListeners = new Map();
    this.setupEventHandlers();
  }

  /**
   * Initialize video manager with video elements and URLs
   * @param {HTMLVideoElement} videoA - First video element
   * @param {HTMLVideoElement} videoB - Second video element
   * @param {Array} videoUrls - Array of video URLs
   */
  initialize(videoA, videoB, videoUrls) {
    this.videoA = videoA;
    this.videoB = videoB;
    this.activeVideoElement = videoA;
    this.inactiveVideoElement = videoB;
    
    this.setVideoUrls(videoUrls);
    this.setupVideoElements();
    
    A11yUtils.announce('Video player initialized');
  }

  /**
   * Set video URLs with validation
   * @param {Array} urls - Array of video URLs
   */
  setVideoUrls(urls) {
    if (!Array.isArray(urls) || urls.length === 0) {
      throw ErrorUtils.createError('Invalid video URLs provided', { urls });
    }

    // Validate URLs
    const validUrls = urls.filter(url => {
      if (typeof url !== 'string' || !url.trim()) return false;
      try {
        new URL(url);
        return true;
      } catch {
        console.warn('Invalid URL detected:', url);
        return false;
      }
    });

    if (validUrls.length === 0) {
      throw ErrorUtils.createError('No valid video URLs found');
    }

    this.videoUrls = ArrayUtils.shuffle(validUrls);
    console.log(`Loaded ${this.videoUrls.length} video URLs`);
  }

  /**
   * Setup video element properties and event listeners
   */
  setupVideoElements() {
    [this.videoA, this.videoB].forEach(video => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('playsinline', '');
      video.style.willChange = 'opacity';
      
      // Add accessibility attributes
      video.setAttribute('aria-label', 'Dreams and Poems video content');
      video.setAttribute('role', 'img');
    });
  }

  /**
   * Setup event handlers for video events
   */
  setupEventHandlers() {
    // Video event handlers
    this.videoEventHandler = this.createVideoEventHandler();
    
    // Performance monitoring
    this.performanceMonitor = PerformanceUtils.throttle(() => {
      this.updatePerformanceMetrics();
    }, 5000);
  }

  /**
   * Create comprehensive video event handler
   * @returns {Object} Event handler functions
   */
  createVideoEventHandler() {
    return {
      loadstart: (event) => {
        const startTime = performance.now();
        this.loadingPromises.set(event.target.src, startTime);
      },

      canplay: (event) => {
        const startTime = this.loadingPromises.get(event.target.src);
        if (startTime) {
          const loadTime = performance.now() - startTime;
          this.performanceMetrics.loadTimes.push(loadTime);
          this.loadingPromises.delete(event.target.src);
        }
      },

      error: (event) => {
        const video = event.target;
        this.handleVideoError(video, event.error);
      },

      ended: (event) => {
        this.emit('videoEnded', { video: event.target });
      },

      timeupdate: (event) => {
        this.emit('timeUpdate', { 
          video: event.target,
          currentTime: event.target.currentTime,
          duration: event.target.duration 
        });
      },

      waiting: (event) => {
        console.log('Video buffering:', event.target.src);
        this.emit('buffering', { video: event.target });
      },

      playing: (event) => {
        this.emit('playing', { video: event.target });
      },

      pause: (event) => {
        this.emit('paused', { video: event.target });
      }
    };
  }

  /**
   * Add event listeners to video element
   * @param {HTMLVideoElement} video - Video element
   */
  addVideoEventListeners(video) {
    Object.entries(this.videoEventHandler).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });
  }

  /**
   * Remove event listeners from video element
   * @param {HTMLVideoElement} video - Video element
   */
  removeVideoEventListeners(video) {
    Object.entries(this.videoEventHandler).forEach(([event, handler]) => {
      video.removeEventListener(event, handler);
    });
  }

  /**
   * Load and play video at specific index
   * @param {number} index - Video index
   * @returns {Promise} Playback promise
   */
  async playVideo(index) {
    if (this.isTransitioning || this.videoUrls.length === 0) {
      return Promise.reject(new Error('Cannot play video: transitioning or no URLs'));
    }

    try {
      this.isTransitioning = true;
      this.currentIndex = index % this.videoUrls.length;
      const videoUrl = this.videoUrls[this.currentIndex];

      // Check if video is preloaded
      const preloadedVideo = this.preloadedVideos.get(videoUrl);
      if (preloadedVideo && preloadedVideo.readyState >= 2) {
        await this.usePreloadedVideo(preloadedVideo);
      } else {
        await this.loadNewVideo(videoUrl);
      }

      await this.crossfade();
      this.updatePreloadQueue();
      
      A11yUtils.announce(`Playing video ${this.currentIndex + 1} of ${this.videoUrls.length}`);
      
    } catch (error) {
      console.error('Error playing video:', error);
      this.handleVideoError(this.inactiveVideoElement, error);
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Use preloaded video for playback
   * @param {HTMLVideoElement} preloadedVideo - Preloaded video element
   */
  async usePreloadedVideo(preloadedVideo) {
    this.inactiveVideoElement.src = preloadedVideo.src;
    this.inactiveVideoElement.currentTime = 0;
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Preloaded video setup timeout'));
      }, 5000);

      const onCanPlay = () => {
        clearTimeout(timeout);
        this.inactiveVideoElement.removeEventListener('canplay', onCanPlay);
        resolve();
      };

      this.inactiveVideoElement.addEventListener('canplay', onCanPlay);
      this.inactiveVideoElement.load();
    });
  }

  /**
   * Load new video into inactive element
   * @param {string} videoUrl - Video URL to load
   */
  async loadNewVideo(videoUrl) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Video load timeout: ${videoUrl}`));
      }, this.config.loadTimeout);

      const onCanPlay = () => {
        clearTimeout(timeout);
        this.inactiveVideoElement.removeEventListener('canplay', onCanPlay);
        this.inactiveVideoElement.removeEventListener('error', onError);
        resolve();
      };

      const onError = (event) => {
        clearTimeout(timeout);
        this.inactiveVideoElement.removeEventListener('canplay', onCanPlay);
        this.inactiveVideoElement.removeEventListener('error', onError);
        reject(new Error(`Video load error: ${event.error?.message || 'Unknown error'}`));
      };

      this.inactiveVideoElement.addEventListener('canplay', onCanPlay);
      this.inactiveVideoElement.addEventListener('error', onError);
      this.inactiveVideoElement.src = videoUrl;
      this.inactiveVideoElement.load();
    });
  }

  /**
   * Perform crossfade transition between videos
   */
  async crossfade() {
    return new Promise((resolve) => {
      // Start playback
      const playPromise = this.inactiveVideoElement.play();
      
      if (playPromise) {
        playPromise.catch(error => {
          console.error('Playback failed:', error);
          this.emit('playbackError', { error });
        });
      }

      // Perform crossfade
      this.inactiveVideoElement.style.opacity = '1';
      this.activeVideoElement.style.opacity = '0';

      setTimeout(() => {
        // Swap video elements
        [this.activeVideoElement, this.inactiveVideoElement] = 
        [this.inactiveVideoElement, this.activeVideoElement];
        
        // Pause inactive video
        this.inactiveVideoElement.pause();
        
        // Setup event listeners for new active video
        this.setupActiveVideoListeners();
        
        resolve();
      }, this.config.crossfadeDuration);
    });
  }

  /**
   * Setup event listeners for the active video
   */
  setupActiveVideoListeners() {
    this.removeVideoEventListeners(this.inactiveVideoElement);
    this.addVideoEventListeners(this.activeVideoElement);
  }

  /**
   * Update preload queue with intelligent buffering
   */
  updatePreloadQueue() {
    // Clean up old preloaded videos
    this.cleanupPreloadQueue();
    
    // Preload upcoming videos
    for (let i = 1; i <= this.config.preloadBufferSize; i++) {
      const nextIndex = (this.currentIndex + i) % this.videoUrls.length;
      const nextUrl = this.videoUrls[nextIndex];
      
      if (!this.preloadedVideos.has(nextUrl) && !this.loadingPromises.has(nextUrl)) {
        this.preloadVideo(nextUrl);
      }
    }
    
    this.updateBufferHealth();
  }

  /**
   * Preload video with performance monitoring
   * @param {string} url - Video URL to preload
   */
  async preloadVideo(url) {
    try {
      const video = document.createElement('video');
      video.style.display = 'none';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = url;

      const loadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Preload timeout: ${url}`));
        }, this.config.loadTimeout);

        video.addEventListener('canplaythrough', () => {
          clearTimeout(timeout);
          resolve(video);
        }, { once: true });

        video.addEventListener('error', (event) => {
          clearTimeout(timeout);
          reject(new Error(`Preload error: ${event.error?.message || 'Unknown error'}`));
        }, { once: true });
      });

      this.loadingPromises.set(url, loadPromise);
      document.body.appendChild(video);
      video.load();

      const loadedVideo = await loadPromise;
      this.preloadedVideos.set(url, loadedVideo);
      this.loadingPromises.delete(url);
      
    } catch (error) {
      console.warn('Preload failed:', url, error);
      this.loadingPromises.delete(url);
    }
  }

  /**
   * Clean up old preloaded videos
   */
  cleanupPreloadQueue() {
    const currentUrl = this.videoUrls[this.currentIndex];
    
    for (const [url, video] of this.preloadedVideos.entries()) {
      const videoIndex = this.videoUrls.indexOf(url);
      const distance = (videoIndex - this.currentIndex + this.videoUrls.length) % this.videoUrls.length;
      
      if (distance > this.config.preloadBufferSize && url !== currentUrl) {
        this.preloadedVideos.delete(url);
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      }
    }
  }

  /**
   * Update buffer health metrics
   */
  updateBufferHealth() {
    const targetBufferSize = Math.min(this.config.preloadBufferSize, this.videoUrls.length - 1);
    const currentBufferSize = this.preloadedVideos.size;
    this.performanceMetrics.bufferHealth = (currentBufferSize / targetBufferSize) * 100;
  }

  /**
   * Handle video errors with retry logic
   * @param {HTMLVideoElement} video - Video element with error
   * @param {Error} error - Error object
   */
  async handleVideoError(video, error) {
    this.errorCount++;
    this.performanceMetrics.errorRate = this.errorCount / (this.currentIndex + 1);

    console.error('Video error:', {
      src: video.src,
      error: error,
      currentTime: video.currentTime,
      readyState: video.readyState
    });

    this.emit('videoError', { video, error });

    // Skip to next video if too many errors
    if (this.errorCount > this.maxErrors) {
      A11yUtils.announce('Multiple video errors detected. Skipping to next content.');
      await this.playNext();
    } else {
      // Retry current video
      setTimeout(() => {
        if (!this.isTransitioning) {
          this.retryCurrentVideo();
        }
      }, this.config.retryDelay);
    }
  }

  /**
   * Retry loading current video
   */
  async retryCurrentVideo() {
    try {
      await this.playVideo(this.currentIndex);
    } catch (error) {
      console.error('Retry failed:', error);
      await this.playNext();
    }
  }

  /**
   * Play next video in sequence
   */
  async playNext() {
    const nextIndex = (this.currentIndex + 1) % this.videoUrls.length;
    await this.playVideo(nextIndex);
  }

  /**
   * Play previous video in sequence
   */
  async playPrevious() {
    const prevIndex = (this.currentIndex - 1 + this.videoUrls.length) % this.videoUrls.length;
    await this.playVideo(prevIndex);
  }

  /**
   * Play random video
   */
  async playRandom() {
    const randomIndex = Math.floor(Math.random() * this.videoUrls.length);
    await this.playVideo(randomIndex);
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    // Calculate average load time
    if (this.performanceMetrics.loadTimes.length > 0) {
      const avgLoadTime = this.performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / 
                         this.performanceMetrics.loadTimes.length;
      
      // Keep only recent load times
      if (this.performanceMetrics.loadTimes.length > 10) {
        this.performanceMetrics.loadTimes = this.performanceMetrics.loadTimes.slice(-10);
      }

      console.log('Performance metrics:', {
        avgLoadTime: `${avgLoadTime.toFixed(2)}ms`,
        errorRate: `${(this.performanceMetrics.errorRate * 100).toFixed(2)}%`,
        bufferHealth: `${this.performanceMetrics.bufferHealth.toFixed(2)}%`,
        preloadedCount: this.preloadedVideos.size
      });
    }
  }

  /**
   * Get current video information
   * @returns {Object} Current video info
   */
  getCurrentVideoInfo() {
    return {
      index: this.currentIndex,
      total: this.videoUrls.length,
      url: this.videoUrls[this.currentIndex],
      currentTime: this.activeVideoElement?.currentTime || 0,
      duration: this.activeVideoElement?.duration || 0,
      buffered: this.getBufferedRanges(),
      isPlaying: !this.activeVideoElement?.paused
    };
  }

  /**
   * Get buffered time ranges
   * @returns {Array} Buffered ranges
   */
  getBufferedRanges() {
    const ranges = [];
    const buffered = this.activeVideoElement?.buffered;
    
    if (buffered) {
      for (let i = 0; i < buffered.length; i++) {
        ranges.push({
          start: buffered.start(i),
          end: buffered.end(i)
        });
      }
    }
    
    return ranges;
  }

  /**
   * Event emitter functionality
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    // Clear all preloaded videos
    for (const [url, video] of this.preloadedVideos.entries()) {
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
    }
    
    this.preloadedVideos.clear();
    this.loadingPromises.clear();
    this.eventListeners.clear();
    
    // Remove event listeners
    if (this.activeVideoElement) {
      this.removeVideoEventListeners(this.activeVideoElement);
    }
    if (this.inactiveVideoElement) {
      this.removeVideoEventListeners(this.inactiveVideoElement);
    }
  }
}
