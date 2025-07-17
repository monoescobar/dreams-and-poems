/**
 * Dreams and Poems - UI Controller
 * Advanced UI management with accessibility, responsive design, and enhanced UX
 * Auto-hide UI after 3 seconds of inactivity
 * 
 * @author Carlos Escobar
 */

import { DeviceUtils, PerformanceUtils, StorageUtils, A11yUtils, AnimationUtils } from './utils.js';

export class UIController {
  constructor(config = {}) {
    this.config = {
      uiTimeout: 3000,
      gestureFeedbackDuration: 1000,
      keyboardEnabled: true,
      touchEnabled: DeviceUtils.hasTouch(),
      ...config
    };

    this.elements = {};
    this.state = {
      uiVisible: false,  // Start with UI hidden
      muted: true,
      autoplay: true,
      fullscreen: false,
      mobileControlMode: 'sound'
    };

    this.eventListeners = new Map();
    this.timeouts = new Map();
    this.gestures = new Map();
    
    // Load saved preferences
    this.loadPreferences();
    
    this.setupEventHandlers();
  }

  /**
   * Initialize UI controller with DOM elements
   * @param {Object} elements - DOM elements object
   */
  initialize(elements) {
    this.elements = { ...elements };
    this.validateElements();
    this.setupElements();
    this.setupEventListeners();
    this.setupAccessibility();
    this.updateUIState();
    
    // Force UI to start hidden
    document.body.classList.add('ui-hidden');
    this.elements.uiOverlay.classList.add('ui-hidden');
    this.state.uiVisible = false;
    
    // Initialize responsive behavior
    this.setupResponsiveHandlers();
    
    A11yUtils.announce('User interface initialized');
  }

  /**
   * Validate required DOM elements
   */
  validateElements() {
    const required = [
      'videoContainer', 'uiOverlay', 'toggleSoundBtn', 
      'autoPlayCheckbox', 'gestureFeedback'
    ];
    
    const missing = required.filter(key => !this.elements[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required UI elements: ${missing.join(', ')}`);
    }
  }

  /**
   * Setup DOM elements with enhanced properties
   */
  setupElements() {
    // Setup video container
    this.elements.videoContainer.setAttribute('role', 'application');
    this.elements.videoContainer.setAttribute('aria-label', 'Dreams and Poems video player');
    
    // Setup control buttons with accessibility
    this.setupControlButton(this.elements.toggleSoundBtn, 'Toggle sound', 'M');
    if (this.elements.fullscreenBtn) {
      this.setupControlButton(this.elements.fullscreenBtn, 'Toggle fullscreen', 'F');
    }
    
    // Setup autoplay toggle
    this.setupAutoplayToggle();
    
    // Setup gesture feedback
    this.setupGestureFeedback();
    
    // Setup navigation links
    this.setupNavigationLinks();
  }

  /**
   * Setup control button with accessibility features
   * @param {HTMLElement} button - Button element
   * @param {string} label - Accessible label
   * @param {string} key - Keyboard shortcut
   */
  setupControlButton(button, label, key) {
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', `${label} (${key})`);
    button.setAttribute('title', `${label} (${key})`);
    
    // Add keyboard shortcut hint
    const shortcut = document.createElement('span');
    shortcut.className = 'sr-only';
    shortcut.textContent = ` Press ${key} to ${label.toLowerCase()}`;
    button.appendChild(shortcut);
  }

  /**
   * Setup autoplay toggle with enhanced accessibility
   */
  setupAutoplayToggle() {
    const checkbox = this.elements.autoPlayCheckbox;
    const toggleSwitch = checkbox.closest('.toggle-switch');
    
    if (toggleSwitch) {
      toggleSwitch.setAttribute('role', 'switch');
      toggleSwitch.setAttribute('aria-checked', checkbox.checked);
      toggleSwitch.setAttribute('aria-label', 'Toggle autoplay (A)');
      toggleSwitch.setAttribute('tabindex', '0');
      
      // Update aria-checked when state changes
      checkbox.addEventListener('change', () => {
        toggleSwitch.setAttribute('aria-checked', checkbox.checked);
        this.savePreference('autoplay', checkbox.checked);
      });
    }
  }

  /**
   * Setup gesture feedback system
   */
  setupGestureFeedback() {
    this.elements.gestureFeedback.setAttribute('aria-live', 'polite');
    this.elements.gestureFeedback.setAttribute('aria-atomic', 'true');
    this.elements.gestureFeedback.setAttribute('role', 'status');
  }

  /**
   * Setup navigation links with enhanced accessibility
   */
  setupNavigationLinks() {
    if (this.elements.aboutLink) {
      this.elements.aboutLink.setAttribute('aria-label', 'About Carlos Escobar - Opens LinkedIn profile');
    }
    
    if (this.elements.portfolioLink) {
      this.elements.portfolioLink.setAttribute('aria-label', 'View Portfolio - Opens PDF document');
    }
    
    if (this.elements.versionNumber) {
      this.elements.versionNumber.setAttribute('aria-label', `Application version ${this.elements.versionNumber.textContent}`);
    }
  }

  /**
   * Setup comprehensive event handlers
   */
  setupEventHandlers() {
    // UI visibility handlers
    this.uiVisibilityHandler = PerformanceUtils.throttle(() => {
      // Only show UI if it's currently hidden
      if (!this.state.uiVisible) {
        this.showUI();
      }
    }, 100);

    // Keyboard handlers
    this.keyboardHandler = this.createKeyboardHandler();
    
    // Touch handlers for mobile
    this.touchHandler = this.createTouchHandler();
    
    // Mouse handlers for desktop
    this.mouseHandler = this.createMouseHandler();
    
    // Resize handler
    this.resizeHandler = PerformanceUtils.debounce(() => {
      this.handleResize();
    }, 250);
  }

  /**
   * Setup event listeners for all interactions
   */
  setupEventListeners() {
    // Desktop interactions
    if (DeviceUtils.isDesktop()) {
      this.setupDesktopEventListeners();
    }
    
    // Mobile interactions
    if (DeviceUtils.isMobile() || DeviceUtils.hasTouch()) {
      this.setupMobileEventListeners();
    }
    
    // Common event listeners
    this.setupCommonEventListeners();
  }

  /**
   * Setup desktop-specific event listeners
   */
  setupDesktopEventListeners() {
    // Mouse movement for UI visibility
    this.elements.videoContainer.addEventListener('mousemove', this.uiVisibilityHandler);
    this.elements.videoContainer.addEventListener('mouseenter', this.uiVisibilityHandler);
    
    // Mouse interactions for video control
    this.elements.videoContainer.addEventListener('mousedown', this.mouseHandler.down);
    this.elements.videoContainer.addEventListener('mouseup', this.mouseHandler.up);
    
    // Keyboard controls
    if (this.config.keyboardEnabled) {
      document.addEventListener('keydown', this.keyboardHandler);
    }
    
    // Control button events
    this.elements.toggleSoundBtn.addEventListener('click', () => this.toggleSound());
    
    if (this.elements.fullscreenBtn) {
      this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
      document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }
  }

  /**
   * Setup mobile-specific event listeners
   */
  setupMobileEventListeners() {
    // Touch interactions
    this.elements.videoContainer.addEventListener('touchstart', this.touchHandler.start, { passive: false });
    this.elements.videoContainer.addEventListener('touchmove', this.touchHandler.move, { passive: false });
    this.elements.videoContainer.addEventListener('touchend', this.touchHandler.end, { passive: false });
    
    // Prevent context menu on long press
    this.elements.videoContainer.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Setup common event listeners
   */
  setupCommonEventListeners() {
    // Window resize
    window.addEventListener('resize', this.resizeHandler);
    
    // Global interaction listeners for UI visibility
    document.addEventListener('mousemove', this.uiVisibilityHandler);
    document.addEventListener('mousedown', this.uiVisibilityHandler);
    document.addEventListener('touchstart', this.uiVisibilityHandler, { passive: true });
    // Removed touchmove - it fires too frequently and prevents auto-hide
    document.addEventListener('keydown', this.uiVisibilityHandler);
    
    // Autoplay toggle
    this.elements.autoPlayCheckbox.addEventListener('change', () => {
      this.state.autoplay = this.elements.autoPlayCheckbox.checked;
      this.emit('autoplayToggle', this.state.autoplay);
      A11yUtils.announce(`Autoplay ${this.state.autoplay ? 'enabled' : 'disabled'}`);
    });
    
    // Link interactions
    if (this.elements.aboutLink) {
      this.elements.aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLinkedInProfile();
      });
    }
  }

  /**
   * Create keyboard event handler
   * @returns {Function} Keyboard handler function
   */
  createKeyboardHandler() {
    return (event) => {
      // Ignore if typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const { code, key } = event;
      let handled = false;

      switch (code) {
        case 'KeyM':
          this.toggleSound(true);
          handled = true;
          break;
        case 'KeyF':
          this.toggleFullscreen();
          handled = true;
          break;
        case 'KeyA':
          this.toggleAutoplay(true);
          handled = true;
          break;
        case 'Space':
          this.emit('playPause');
          handled = true;
          break;
        case 'ArrowRight':
          this.emit('nextVideo');
          handled = true;
          break;
        case 'ArrowLeft':
          this.emit('previousVideo');
          handled = true;
          break;
        case 'KeyR':
          this.emit('randomVideo');
          handled = true;
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            this.toggleFullscreen();
            handled = true;
          }
          break;
      }

      if (handled) {
        event.preventDefault();
        this.showUI();
      }
    };
  }

  /**
   * Create touch event handler for mobile interactions
   * @returns {Object} Touch handler functions
   */
  createTouchHandler() {
    let touchStart = { x: 0, y: 0, time: 0 };
    let holdTimeout = null;
    let isHolding = false;

    return {
      start: (event) => {
        const touch = event.touches[0];
        touchStart = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
        
        isHolding = false;
        
        // Setup hold gesture
        holdTimeout = setTimeout(() => {
          isHolding = true;
          this.emit('holdStart');
          this.showGestureFeedback('hold', 'Hold to pause');
        }, 300);
      },

      move: (event) => {
        if (!holdTimeout) return;
        
        const touch = event.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStart.x);
        const deltaY = Math.abs(touch.clientY - touchStart.y);
        
        // Cancel hold if user moves finger too much
        if (deltaX > 10 || deltaY > 10) {
          clearTimeout(holdTimeout);
          holdTimeout = null;
        }
      },

      end: (event) => {
        clearTimeout(holdTimeout);
        
        if (isHolding) {
          this.emit('holdEnd');
          return;
        }
        
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const deltaTime = Date.now() - touchStart.time;
        
        // Show UI on tap
        this.showUI();
        
        // Handle swipe gestures
        if (deltaTime < 500 && (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50)) {
          this.handleSwipeGesture(deltaX, deltaY);
        } else if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          // Handle tap
          this.handleTap();
        }
      }
    };
  }

  /**
   * Create mouse event handler for desktop interactions
   * @returns {Object} Mouse handler functions
   */
  createMouseHandler() {
    return {
      down: () => {
        this.emit('mouseDown');
      },
      
      up: () => {
        this.emit('mouseUp');
      }
    };
  }

  /**
   * Handle swipe gestures on mobile
   * @param {number} deltaX - Horizontal swipe distance
   * @param {number} deltaY - Vertical swipe distance
   */
  handleSwipeGesture(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (this.state.mobileControlMode === 'sound') {
        this.toggleSound(true);
      } else {
        this.toggleAutoplay(true);
      }
    } else {
      // Vertical swipe - switch control mode
      this.state.mobileControlMode = this.state.mobileControlMode === 'sound' ? 'autoplay' : 'sound';
      this.showGestureFeedback('mode', `${this.state.mobileControlMode} control`);
      this.savePreference('mobileControlMode', this.state.mobileControlMode);
    }
  }

  /**
   * Handle tap gesture
   */
  handleTap() {
    this.emit('tap');
  }

  /**
   * Setup responsive design handlers
   */
  setupResponsiveHandlers() {
    // Media query listeners
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    mobileQuery.addListener(() => this.handleMediaQueryChange());
    reducedMotionQuery.addListener(() => this.handleReducedMotion(reducedMotionQuery.matches));
    highContrastQuery.addListener(() => this.handleHighContrast(highContrastQuery.matches));
    
    // Initial setup
    this.handleReducedMotion(reducedMotionQuery.matches);
    this.handleHighContrast(highContrastQuery.matches);
  }

  /**
   * Handle media query changes
   */
  handleMediaQueryChange() {
    // Re-setup event listeners based on new device type
    this.removeAllEventListeners();
    this.setupEventListeners();
  }

  /**
   * Handle reduced motion preference
   * @param {boolean} prefersReduced - Whether user prefers reduced motion
   */
  handleReducedMotion(prefersReduced) {
    document.body.classList.toggle('reduced-motion', prefersReduced);
    
    if (prefersReduced) {
      // Disable animations for accessibility
      this.config.uiTimeout = 5000; // Longer timeout for reduced motion
    }
  }

  /**
   * Handle high contrast preference
   * @param {boolean} prefersHigh - Whether user prefers high contrast
   */
  handleHighContrast(prefersHigh) {
    document.body.classList.toggle('high-contrast', prefersHigh);
  }

  /**
   * Toggle sound with feedback
   * @param {boolean} showFeedback - Whether to show visual feedback
   */
  toggleSound(showFeedback = false) {
    this.state.muted = !this.state.muted;
    this.emit('soundToggle', this.state.muted);
    
    this.updateSoundButton();
    this.savePreference('muted', this.state.muted);
    
    if (showFeedback) {
      this.showGestureFeedback('sound', this.state.muted ? 'Off' : 'On');
    }
    
    A11yUtils.announce(`Sound ${this.state.muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Toggle autoplay with feedback
   * @param {boolean} showFeedback - Whether to show visual feedback
   */
  toggleAutoplay(showFeedback = false) {
    this.state.autoplay = !this.state.autoplay;
    this.elements.autoPlayCheckbox.checked = this.state.autoplay;
    
    // Trigger change event to maintain consistency
    this.elements.autoPlayCheckbox.dispatchEvent(new Event('change'));
    
    if (showFeedback) {
      this.showGestureFeedback('autoplay', this.state.autoplay ? 'On' : 'Off');
    }
  }

  /**
   * Toggle fullscreen mode
   */
  async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
      A11yUtils.announce('Fullscreen not supported');
    }
  }

  /**
   * Handle fullscreen change
   */
  handleFullscreenChange() {
    this.state.fullscreen = !!document.fullscreenElement;
    this.updateFullscreenButton();
    this.emit('fullscreenToggle', this.state.fullscreen);
    
    A11yUtils.announce(`${this.state.fullscreen ? 'Entered' : 'Exited'} fullscreen mode`);
  }

  /**
   * Show UI with auto-hide timeout
   */
  showUI() {
    this.state.uiVisible = true;
    this.elements.uiOverlay.classList.add('ui-visible');
    this.elements.uiOverlay.classList.remove('ui-hidden');
    document.body.classList.remove('ui-hidden');
    
    // Clear existing timeout
    if (this.timeouts.has('uiHide')) {
      clearTimeout(this.timeouts.get('uiHide'));
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      this.hideUI();
    }, this.config.uiTimeout);
    
    this.timeouts.set('uiHide', timeout);
  }

  /**
   * Hide UI
   */
  hideUI() {
    this.state.uiVisible = false;
    this.elements.uiOverlay.classList.remove('ui-visible');
    this.elements.uiOverlay.classList.add('ui-hidden');
    document.body.classList.add('ui-hidden');
    
    if (this.timeouts.has('uiHide')) {
      clearTimeout(this.timeouts.get('uiHide'));
      this.timeouts.delete('uiHide');
    }
  }

  /**
   * Show gesture feedback
   * @param {string} type - Gesture type
   * @param {string} message - Feedback message
   */
  showGestureFeedback(type, message) {
    if (!this.elements.gestureFeedback) return;
    
    const iconElement = this.elements.gestureFeedback.querySelector('#gesture-icon');
    const textElement = this.elements.gestureFeedback.querySelector('#gesture-text');
    
    if (iconElement && textElement) {
      iconElement.innerHTML = this.getGestureIcon(type);
      textElement.textContent = message;
      
      this.elements.gestureFeedback.classList.add('visible');
      
      // Clear existing timeout
      if (this.timeouts.has('gestureFeedback')) {
        clearTimeout(this.timeouts.get('gestureFeedback'));
      }
      
      // Set new timeout
      const timeout = setTimeout(() => {
        this.elements.gestureFeedback.classList.remove('visible');
      }, this.config.gestureFeedbackDuration);
      
      this.timeouts.set('gestureFeedback', timeout);
    }
    
    // Announce to screen readers
    A11yUtils.announce(`${type}: ${message}`);
  }

  /**
   * Get icon for gesture feedback
   * @param {string} type - Gesture type
   * @returns {string} SVG icon HTML
   */
  getGestureIcon(type) {
    const icons = {
      sound: this.state.muted ? this.getSoundOffIcon() : this.getSoundOnIcon(),
      autoplay: this.getAutoplayIcon(),
      hold: this.getPauseIcon(),
      mode: this.getModeIcon()
    };
    
    return icons[type] || icons.autoplay;
  }

  /**
   * Update sound button icon and state
   */
  updateSoundButton() {
    if (this.elements.toggleSoundBtn) {
      this.elements.toggleSoundBtn.innerHTML = this.state.muted ? 
        this.getSoundOffIcon() : this.getSoundOnIcon();
      
      this.elements.toggleSoundBtn.setAttribute('aria-label', 
        `${this.state.muted ? 'Unmute' : 'Mute'} sound (M)`);
    }
  }

  /**
   * Update fullscreen button icon and state
   */
  updateFullscreenButton() {
    if (this.elements.fullscreenBtn) {
      this.elements.fullscreenBtn.innerHTML = this.state.fullscreen ? 
        this.getFullscreenExitIcon() : this.getFullscreenEnterIcon();
      
      this.elements.fullscreenBtn.setAttribute('aria-label', 
        `${this.state.fullscreen ? 'Exit' : 'Enter'} fullscreen (F)`);
    }
  }

  /**
   * Update UI state based on current configuration
   */
  updateUIState() {
    this.updateSoundButton();
    this.updateFullscreenButton();
    
    // Update autoplay checkbox
    if (this.elements.autoPlayCheckbox) {
      this.elements.autoPlayCheckbox.checked = this.state.autoplay;
    }
    
    // Start with UI hidden
    if (!this.state.uiVisible) {
      this.elements.uiOverlay.classList.add('ui-hidden');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update responsive behavior
    this.emit('resize', {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: DeviceUtils.isMobile()
    });
  }

  /**
   * Open LinkedIn profile with enhanced mobile support
   */
  openLinkedInProfile() {
    const profileUrl = 'https://www.linkedin.com/in/carlos-escobar-32156b24/';
    const appUrl = 'linkedin://in/carlos-escobar-32156b24';
    
    if (DeviceUtils.isMobile()) {
      // Try to open in LinkedIn app first
      window.location.href = appUrl;
      
      // Fallback to web version
      setTimeout(() => {
        window.open(profileUrl, '_blank', 'noopener,noreferrer');
      }, 2500);
    } else {
      window.open(profileUrl, '_blank', 'noopener,noreferrer');
    }
    
    A11yUtils.announce('Opening LinkedIn profile');
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link for keyboard navigation
    this.createSkipLink();
    
    // Setup focus management
    this.setupFocusManagement();
    
    // Add ARIA landmarks
    this.setupLandmarks();
  }

  /**
   * Create skip link for accessibility
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      z-index: 9999;
      padding: 8px;
      background: #000;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in UI when visible
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && this.state.uiVisible) {
        this.manageFocus(event);
      }
    });
  }

  /**
   * Manage focus for accessibility
   * @param {KeyboardEvent} event - Keyboard event
   */
  manageFocus(event) {
    const focusableElements = this.elements.uiOverlay.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        event.preventDefault();
      }
    }
  }

  /**
   * Setup ARIA landmarks
   */
  setupLandmarks() {
    // Add main landmark
    this.elements.videoContainer.setAttribute('role', 'main');
    this.elements.videoContainer.id = 'main-content';
    
    // Add navigation landmark for controls
    if (this.elements.desktopControls) {
      this.elements.desktopControls.setAttribute('role', 'navigation');
      this.elements.desktopControls.setAttribute('aria-label', 'Video player controls');
    }
  }

  /**
   * Save user preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   */
  savePreference(key, value) {
    StorageUtils.setItem(`dreamsAndPoems.${key}`, value);
  }

  /**
   * Load user preferences
   */
  loadPreferences() {
    this.state.muted = StorageUtils.getItem('dreamsAndPoems.muted', true);
    this.state.autoplay = StorageUtils.getItem('dreamsAndPoems.autoplay', true);
    this.state.mobileControlMode = StorageUtils.getItem('dreamsAndPoems.mobileControlMode', 'sound');
  }

  /**
   * Remove all event listeners
   */
  removeAllEventListeners() {
    // Remove all stored event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.eventListeners.clear();
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
   * Icon getter methods
   */
  getSoundOnIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
  }

  getSoundOffIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`;
  }

  getFullscreenEnterIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>`;
  }

  getFullscreenExitIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3v4m0 0h4m-4 0l7-7M3 9v4m0 0h4m-4 0l7-7m11 5v4m0 0h-4m4 0l-7 7M3 15v-4m0 0h4m-4 0l7 7" /></svg>`;
  }

  getAutoplayIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c1.48 0 2.77-.8 3.46-2" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 14c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4c-1.48 0-2.77-.8-3.46 2" /></svg>`;
  }

  getPauseIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  }

  getModeIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>`;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    
    // Remove all event listeners
    this.removeAllEventListeners();
    
    // Clear references
    this.elements = {};
    this.eventListeners.clear();
  }
}
