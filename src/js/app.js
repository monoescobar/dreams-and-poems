/**
 * Dreams and Poems - Main Application
 * Enhanced video player application with modular architecture
 * 
 * @author Carlos Escobar
 */

import { DeviceUtils, ErrorUtils, A11yUtils, StorageUtils } from './utils.js';
import { VideoManager } from './videoManager.js';
import { UIController } from './uiController.js';

class DreamsAndPoemsApp {
  constructor() {
    this.isInitialized = false;
    this.config = this.loadConfiguration();
    
    // Core managers
    this.videoManager = null;
    this.uiController = null;
    
    // Application state
    this.state = {
      isPlaying: false,
      isPaused: false,
      currentVideoIndex: -1,
      autoplay: true,
      muted: true,
      volume: 0.5
    };
    
    // Performance monitoring
    this.performance = {
      startTime: performance.now(),
      initTime: null,
      errors: [],
      metrics: new Map()
    };
    
    // Error boundary
    this.setupErrorBoundary();
    
    console.log(`Dreams and Poems - Initializing...`);
  }

  /**
   * Load application configuration
   * @returns {Object} Configuration object
   */
  loadConfiguration() {
    const baseConfig = {
      PRELOAD_BUFFER_SIZE_DESKTOP: 3,
      PRELOAD_BUFFER_SIZE_MOBILE: 1,
      CROSSFADE_DURATION: 1500,
      UI_TIMEOUT: 3000,
      MAX_RETRIES: 3,
      RETRY_DELAY: 1000,
      LOAD_TIMEOUT: 30000
    };

    // Merge with VIDEO_CONFIG if available
    if (typeof VIDEO_CONFIG !== 'undefined') {
      return { ...baseConfig, ...VIDEO_CONFIG };
    }

    return baseConfig;
  }

  /**
   * Setup global error boundary
   */
  setupErrorBoundary() {
    window.addEventListener('error', (event) => {
      this.handleError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'promise_rejection'
      });
    });
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      console.log('🎬 Dreams and Poems - Starting initialization...');
      
      // Show loading state
      this.showLoadingState();
      
      // Validate environment
      this.validateEnvironment();
      
      // Initialize DOM elements
      const elements = this.initializeDOMElements();
      
      // Initialize video manager
      await this.initializeVideoManager(elements);
      
      // Initialize UI controller
      await this.initializeUIController(elements);
      
      // Initialize PWA functionality
      this.initializePWA();
      
      // Setup application event handlers
      this.setupApplicationEventHandlers();
      
      // Load initial video
      await this.loadInitialVideo();
      
      // Complete initialization
      this.completeInitialization();
      
      console.log('✅ Dreams and Poems - Initialization complete!');
      
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  /**
   * Validate environment and dependencies
   */
  validateEnvironment() {
    // Check for required APIs
    const requiredAPIs = [
      'requestAnimationFrame',
      'querySelector',
      'addEventListener',
      'localStorage'
    ];

    const missingAPIs = requiredAPIs.filter(api => !(api in window));
    if (missingAPIs.length > 0) {
      throw new Error(`Missing required APIs: ${missingAPIs.join(', ')}`);
    }

    // Check for video support
    const video = document.createElement('video');
    if (!video.canPlayType) {
      throw new Error('Video playback not supported');
    }

    // Check for required video URLs
    if (typeof VIDEO_URLS === 'undefined' || !VIDEO_URLS) {
      throw new Error('VIDEO_URLS not found');
    }

    console.log('✅ Environment validation passed');
  }

  /**
   * Initialize and validate DOM elements
   * @returns {Object} DOM elements object
   */
  initializeDOMElements() {
    const elements = {
      // Video elements
      videoContainer: document.getElementById('video-container'),
      videoA: document.getElementById('video-a'),
      videoB: document.getElementById('video-b'),
      
      // UI elements
      uiOverlay: document.getElementById('ui-overlay'),
      desktopControls: document.querySelector('.desktop-controls'),
      
      // Control elements
      toggleSoundBtn: document.getElementById('toggle-sound-btn'),
      fullscreenBtn: document.getElementById('fullscreen-btn'),
      autoPlayCheckbox: document.getElementById('auto-play-checkbox'),
      
      // Feedback
      gestureFeedback: document.getElementById('gesture-feedback'),
      statusIndicator: document.getElementById('status-indicator'),
      
      // Navigation
      aboutLink: document.getElementById('about-link'),
      portfolioLink: document.getElementById('portfolio-link'),
      versionNumber: document.getElementById('version-number')
    };

    // Validate required elements
    const required = ['videoContainer', 'videoA', 'videoB', 'uiOverlay'];
    const missing = required.filter(key => !elements[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required DOM elements: ${missing.join(', ')}`);
    }

    console.log('✅ DOM elements initialized');
    return elements;
  }

  /**
   * Initialize video manager
   * @param {Object} elements - DOM elements
   */
  async initializeVideoManager(elements) {
    const isMobile = DeviceUtils.isMobile();
    const preloadBufferSize = isMobile ? 
      this.config.PRELOAD_BUFFER_SIZE_MOBILE : 
      this.config.PRELOAD_BUFFER_SIZE_DESKTOP;

    this.videoManager = new VideoManager({
      preloadBufferSize,
      maxRetries: this.config.MAX_RETRIES,
      retryDelay: this.config.RETRY_DELAY,
      loadTimeout: this.config.LOAD_TIMEOUT,
      crossfadeDuration: this.config.CROSSFADE_DURATION
    });

    // Get appropriate video URLs for device
    const videoUrls = isMobile ? VIDEO_URLS.mobile : VIDEO_URLS.desktop;
    
    if (!videoUrls || videoUrls.length === 0) {
      throw new Error(`No video URLs available for ${isMobile ? 'mobile' : 'desktop'}`);
    }

    this.videoManager.initialize(elements.videoA, elements.videoB, videoUrls);
    
    // Setup video manager event listeners
    this.setupVideoManagerEvents();
    
    console.log(`✅ Video manager initialized with ${videoUrls.length} videos`);
  }

  /**
   * Initialize UI controller
   * @param {Object} elements - DOM elements
   */
  async initializeUIController(elements) {
    this.uiController = new UIController({
      uiTimeout: this.config.UI_TIMEOUT,
      gestureFeedbackDuration: 1000,
      keyboardEnabled: DeviceUtils.isDesktop(),
      touchEnabled: DeviceUtils.hasTouch()
    });

    this.uiController.initialize(elements);
    
    // Setup UI controller event listeners
    this.setupUIControllerEvents();
    
    console.log('✅ UI controller initialized');
  }

  /**
   * Initialize PWA functionality
   */
  initializePWA() {
    try {
      console.log('📱 Initializing PWA functionality...');
      
      // Check if running as PWA
      const isPWA = this.detectPWAMode();
      
      // Handle install prompt
      this.setupInstallPrompt();
      
      // Setup PWA event listeners
      this.setupPWAEventListeners();
      
      // Handle iOS Safari specifics
      this.handleIOSPWA();
      
      console.log(`✅ PWA initialized - Running as: ${isPWA ? 'PWA' : 'Browser'}`);
      
    } catch (error) {
      console.warn('PWA initialization failed:', error);
    }
  }

  /**
   * Detect if app is running as PWA
   */
  detectPWAMode() {
    // Check display mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check iOS standalone mode
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const iOSStandalone = iOS && window.navigator.standalone;
    
    // Check Android TWA (Trusted Web Activity)
    const androidTWA = document.referrer.includes('android-app://');
    
    const isPWA = standalone || iOSStandalone || androidTWA;
    
    // Add PWA class to body for CSS targeting
    if (isPWA) {
      document.body.classList.add('pwa-mode');
    }
    
    return isPWA;
  }

  /**
   * Setup install prompt handling
   */
  setupInstallPrompt() {
    let deferredPrompt = null;
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('💾 Install prompt available');
      e.preventDefault();
      deferredPrompt = e;
      
      // Could show custom install button here
      this.handleInstallPromptAvailable(deferredPrompt);
    });
    
    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('✅ App installed successfully');
      deferredPrompt = null;
      
      // Track installation
      this.trackPWAInstall();
    });
  }

  /**
   * Handle when install prompt becomes available
   */
  handleInstallPromptAvailable(deferredPrompt) {
    // For now, just log it. Could implement custom install UI later
    console.log('Install prompt ready - could show custom install button');
    
    // Example: Show install button after user interaction
    // This could be triggered by a gesture or after some time
    setTimeout(() => {
      if (deferredPrompt && !this.detectPWAMode()) {
        console.log('Auto-suggesting app installation');
        // deferredPrompt.prompt(); // Uncomment to auto-prompt
      }
    }, 30000); // After 30 seconds
  }

  /**
   * Setup PWA-specific event listeners
   */
  setupPWAEventListeners() {
    // Handle display mode changes
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    displayModeQuery.addEventListener('change', (e) => {
      console.log('Display mode changed:', e.matches ? 'standalone' : 'browser');
      
      if (e.matches) {
        document.body.classList.add('pwa-mode');
      } else {
        document.body.classList.remove('pwa-mode');
      }
    });
    
    // Handle service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'APP_INSTALLED') {
          console.log('Service Worker: App installation confirmed');
        }
      });
    }
  }

  /**
   * Handle iOS PWA specifics
   */
  handleIOSPWA() {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (iOS) {
      // Prevent iOS bounce scrolling in PWA mode
      if (window.navigator.standalone) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
      
      // Handle iOS safe areas
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport && window.navigator.standalone) {
        viewport.content = viewport.content + ', viewport-fit=cover';
      }
    }
  }

  /**
   * Track PWA installation for analytics
   */
  trackPWAInstall() {
    // Could send to analytics service
    const installData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: this.detectPlatform()
    };
    
    // Store locally for now
    try {
      localStorage.setItem('pwa_install_data', JSON.stringify(installData));
    } catch (e) {
      console.warn('Could not store PWA install data:', e);
    }
  }

  /**
   * Detect user platform
   */
  detectPlatform() {
    const ua = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'macOS';
    if (/Linux/.test(ua)) return 'Linux';
    
    return 'Unknown';
  }

  /**
   * Setup video manager event listeners
   */
  setupVideoManagerEvents() {
    this.videoManager.on('videoEnded', () => {
      if (this.state.autoplay) {
        this.playNext();
      }
    });

    this.videoManager.on('timeUpdate', (data) => {
      this.handleTimeUpdate(data);
    });

    this.videoManager.on('videoError', (data) => {
      this.handleVideoError(data);
    });

    this.videoManager.on('playing', () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
    });

    this.videoManager.on('paused', () => {
      this.state.isPlaying = false;
      this.state.isPaused = true;
    });

    this.videoManager.on('buffering', () => {
      this.showStatus('Buffering...', 2000);
    });
  }

  /**
   * Setup UI controller event listeners
   */
  setupUIControllerEvents() {
    this.uiController.on('soundToggle', (muted) => {
      this.toggleSound(muted);
    });

    this.uiController.on('autoplayToggle', (enabled) => {
      this.state.autoplay = enabled;
      this.updateVideoLooping();
    });

    this.uiController.on('fullscreenToggle', (enabled) => {
      console.log(`Fullscreen ${enabled ? 'enabled' : 'disabled'}`);
    });

    this.uiController.on('nextVideo', () => {
      this.playNext();
    });

    this.uiController.on('previousVideo', () => {
      this.playPrevious();
    });

    this.uiController.on('randomVideo', () => {
      this.playRandom();
    });

    this.uiController.on('playPause', () => {
      this.togglePlayPause();
    });

    this.uiController.on('mouseDown', () => {
      this.pauseVideo();
    });

    this.uiController.on('mouseUp', () => {
      this.resumeVideo();
    });

    this.uiController.on('holdStart', () => {
      this.pauseVideo();
    });

    this.uiController.on('holdEnd', () => {
      this.resumeVideo();
    });

    this.uiController.on('tap', () => {
      this.handleTap();
    });

    this.uiController.on('resize', (data) => {
      this.handleResize(data);
    });
  }

  /**
   * Setup additional application event handlers
   */
  setupApplicationEventHandlers() {
    // Page visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Load initial video
   */
  async loadInitialVideo() {
    try {
      const randomIndex = Math.floor(Math.random() * this.videoManager.videoUrls.length);
      await this.videoManager.playVideo(randomIndex);
      
      this.state.currentVideoIndex = randomIndex;
      this.updateVideoLooping();
      
      console.log(`✅ Initial video loaded (index: ${randomIndex})`);
      
    } catch (error) {
      console.error('Failed to load initial video:', error);
      this.showStatus('Failed to load video. Retrying...', 3000);
      
      // Retry with a different video
      setTimeout(() => {
        this.loadInitialVideo();
      }, 2000);
    }
  }

  /**
   * Complete initialization process
   */
  completeInitialization() {
    this.isInitialized = true;
    this.performance.initTime = performance.now() - this.performance.startTime;
    
    // Hide loading state
    this.hideLoadingState();
    
    // Update UI
    this.uiController.updateUIState();
    
    // Show status
    this.showStatus('Ready to play!', 2000);
    
    // Announce to screen readers
    A11yUtils.announce('Dreams and Poems video player ready');
    
    // Log performance
    console.log(`🚀 Initialization completed in ${this.performance.initTime.toFixed(2)}ms`);
    
    // Save metrics
    this.savePerformanceMetrics();
  }

  /**
   * Handle initialization error
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    console.error('❌ Initialization failed:', error);
    
    this.showErrorState(error);
    this.handleError(error, { context: 'initialization' });
    
    // Try to recover
    setTimeout(() => {
      this.attemptRecovery();
    }, 3000);
  }

  /**
   * Handle time update from video
   * @param {Object} data - Time update data
   */
  handleTimeUpdate(data) {
    const { currentTime, duration } = data;
    
    if (duration > 0) {
      // Handle autoplay transition
      if (this.state.autoplay && !this.videoManager.isTransitioning) {
        const timeRemaining = duration - currentTime;
        if (timeRemaining < 3.2) {
          this.playNext();
        }
      }
    }
  }

  /**
   * Handle video error
   * @param {Object} data - Error data
   */
  handleVideoError(data) {
    const { video, error } = data;
    
    console.error('Video error:', {
      src: video.src,
      error: error.message,
      readyState: video.readyState
    });
    
    this.showStatus('Video error. Loading next...', 3000);
    
    // Try next video after delay
    setTimeout(() => {
      this.playNext();
    }, 1000);
  }

  /**
   * Toggle sound
   * @param {boolean} muted - Mute state
   */
  toggleSound(muted) {
    this.state.muted = muted;
    
    if (this.videoManager.activeVideoElement) {
      this.videoManager.activeVideoElement.muted = muted;
    }
    if (this.videoManager.inactiveVideoElement) {
      this.videoManager.inactiveVideoElement.muted = muted;
    }
    
    // Handle autoplay policies
    if (!muted && this.videoManager.activeVideoElement) {
      const playPromise = this.videoManager.activeVideoElement.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.log('Playback prevented. User interaction required.');
          this.showStatus('Tap to enable sound', 3000);
        });
      }
    }
  }

  /**
   * Update video looping behavior
   */
  updateVideoLooping() {
    const shouldLoop = !this.state.autoplay;
    
    if (this.videoManager.activeVideoElement) {
      this.videoManager.activeVideoElement.loop = shouldLoop;
    }
    if (this.videoManager.inactiveVideoElement) {
      this.videoManager.inactiveVideoElement.loop = shouldLoop;
    }
  }

  /**
   * Play next video
   */
  async playNext() {
    if (this.videoManager.isTransitioning) return;
    
    try {
      await this.videoManager.playNext();
      this.state.currentVideoIndex = this.videoManager.currentIndex;
    } catch (error) {
      console.error('Failed to play next video:', error);
    }
  }

  /**
   * Play previous video
   */
  async playPrevious() {
    if (this.videoManager.isTransitioning) return;
    
    try {
      await this.videoManager.playPrevious();
      this.state.currentVideoIndex = this.videoManager.currentIndex;
    } catch (error) {
      console.error('Failed to play previous video:', error);
    }
  }

  /**
   * Play random video
   */
  async playRandom() {
    if (this.videoManager.isTransitioning) return;
    
    try {
      await this.videoManager.playRandom();
      this.state.currentVideoIndex = this.videoManager.currentIndex;
    } catch (error) {
      console.error('Failed to play random video:', error);
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (!this.videoManager.activeVideoElement) return;
    
    if (this.state.isPlaying) {
      this.pauseVideo();
    } else {
      this.resumeVideo();
    }
  }

  /**
   * Pause video
   */
  pauseVideo() {
    if (this.videoManager.activeVideoElement && !this.state.isPaused) {
      this.videoManager.activeVideoElement.pause();
      this.state.isPaused = true;
      this.state.isPlaying = false;
    }
  }

  /**
   * Resume video
   */
  resumeVideo() {
    if (this.videoManager.activeVideoElement && this.state.isPaused) {
      const playPromise = this.videoManager.activeVideoElement.play();
      if (playPromise) {
        playPromise.then(() => {
          this.state.isPaused = false;
          this.state.isPlaying = true;
        }).catch(error => {
          console.error('Resume failed:', error);
          this.showStatus('Cannot resume playback', 2000);
        });
      }
    }
  }

  /**
   * Handle tap gesture
   */
  handleTap() {
    // Resume if needed
    if (this.state.isPaused) {
      this.resumeVideo();
    }
  }

  /**
   * Handle page hidden
   */
  handlePageHidden() {
    if (this.state.isPlaying) {
      this.pauseVideo();
      this.state.pausedByPageHide = true;
    }
  }

  /**
   * Handle page visible
   */
  handlePageVisible() {
    if (this.state.pausedByPageHide) {
      this.resumeVideo();
      this.state.pausedByPageHide = false;
    }
  }

  /**
   * Handle window resize
   * @param {Object} data - Resize data
   */
  handleResize(data) {
    console.log('Window resized:', data);
    
    // Update video manager buffer size if device type changed
    const newBufferSize = data.isMobile ? 
      this.config.PRELOAD_BUFFER_SIZE_MOBILE : 
      this.config.PRELOAD_BUFFER_SIZE_DESKTOP;
    
    if (this.videoManager.config.preloadBufferSize !== newBufferSize) {
      this.videoManager.config.preloadBufferSize = newBufferSize;
      this.videoManager.updatePreloadQueue();
    }
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    // Create loading overlay if it doesn't exist
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <h2>Dreams and Poems</h2>
          <p>Loading your visual poetry experience...</p>
        </div>
      `;
      loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: sans-serif;
      `;
      document.body.appendChild(loadingOverlay);
    }
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 500);
    }
  }

  /**
   * Show error state
   * @param {Error} error - Error object
   */
  showErrorState(error) {
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'error-boundary';
    errorOverlay.innerHTML = `
      <h2>Something went wrong</h2>
      <p>${error.message}</p>
      <button onclick="location.reload()">Reload Application</button>
    `;
    document.body.appendChild(errorOverlay);
  }

  /**
   * Show status message
   * @param {string} message - Status message
   * @param {number} duration - Display duration in ms
   */
  showStatus(message, duration = 2000) {
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      statusIndicator.textContent = message;
      statusIndicator.style.opacity = '1';
      
      setTimeout(() => {
        statusIndicator.style.opacity = '0';
      }, duration);
    }
  }

  /**
   * Handle application errors
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   */
  handleError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.performance.errors.push(errorInfo);
    
    // Log to console
    console.error('Application error:', errorInfo);
    
    // Store in localStorage for debugging
    const errors = StorageUtils.getItem('dreamsAndPoems.errors', []);
    errors.push(errorInfo);
    
    // Keep only last 10 errors
    if (errors.length > 10) {
      errors.splice(0, errors.length - 10);
    }
    
    StorageUtils.setItem('dreamsAndPoems.errors', errors);
    
    // Announce to screen readers for critical errors
    if (context.type === 'critical') {
      A11yUtils.announce('An error occurred. Please try refreshing the page.');
    }
  }

  /**
   * Attempt error recovery
   */
  attemptRecovery() {
    console.log('Attempting recovery...');
    
    try {
      // Clear any corrupted state
      this.cleanup();
      
      // Reinitialize
      setTimeout(() => {
        this.initialize();
      }, 1000);
      
    } catch (error) {
      console.error('Recovery failed:', error);
      this.showErrorState(new Error('Recovery failed. Please reload the page.'));
    }
  }

  /**
   * Save performance metrics
   */
  savePerformanceMetrics() {
    const metrics = {
      initTime: this.performance.initTime,
      errorCount: this.performance.errors.length,
      timestamp: new Date().toISOString()
    };
    
    StorageUtils.setItem('dreamsAndPoems.performance', metrics);
  }

  /**
   * Get application status
   * @returns {Object} Application status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      state: { ...this.state },
      performance: {
        initTime: this.performance.initTime,
        errorCount: this.performance.errors.length,
        uptime: performance.now() - this.performance.startTime
      },
      videoInfo: this.videoManager?.getCurrentVideoInfo(),
      deviceInfo: {
        isMobile: DeviceUtils.isMobile(),
        hasTouch: DeviceUtils.hasTouch(),
        pixelRatio: DeviceUtils.getPixelRatio()
      }
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.videoManager) {
      this.videoManager.destroy();
    }
    
    if (this.uiController) {
      this.uiController.destroy();
    }
    
    // Clear any remaining timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new DreamsAndPoemsApp();
  app.initialize();
  
  // Make app available globally for debugging
  window.dreamsAndPoemsApp = app;
});

// Export for module systems
export default DreamsAndPoemsApp;
