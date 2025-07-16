/**
 * Dreams and Poems - Error Boundary
 * Comprehensive error handling and recovery system
 * 
 * @version 2.0.0
 * @author Carlos Escobar
 */

import { A11yUtils, StorageUtils } from './utils.js';

export class ErrorBoundary {
  constructor(options = {}) {
    this.options = {
      enableRecovery: true,
      maxRecoveryAttempts: 3,
      recoveryDelay: 2000,
      enableReporting: true,
      enableUserFeedback: true,
      ...options
    };

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
      lastErrorTime: null
    };

    this.errorQueue = [];
    this.recoveryStrategies = new Map();
    this.setupGlobalErrorHandlers();
    this.setupRecoveryStrategies();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'promise_rejection',
        promise: event.promise
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true);

    // Network errors
    window.addEventListener('offline', () => {
      this.handleNetworkError('offline');
    });

    window.addEventListener('online', () => {
      this.handleNetworkError('online');
    });
  }

  /**
   * Setup recovery strategies
   */
  setupRecoveryStrategies() {
    this.recoveryStrategies.set('video_load_error', async () => {
      console.log('Attempting video recovery...');
      
      // Clear video cache
      this.clearVideoCache();
      
      // Reset video elements
      await this.resetVideoElements();
      
      // Try alternative video source
      return this.tryAlternativeVideoSource();
    });

    this.recoveryStrategies.set('ui_error', async () => {
      console.log('Attempting UI recovery...');
      
      // Reset UI state
      this.resetUIState();
      
      // Reinitialize UI components
      return this.reinitializeUI();
    });

    this.recoveryStrategies.set('memory_error', async () => {
      console.log('Attempting memory recovery...');
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      // Clear caches
      await this.clearAllCaches();
      
      // Reduce buffer sizes
      return this.reduceMemoryUsage();
    });

    this.recoveryStrategies.set('network_error', async () => {
      console.log('Attempting network recovery...');
      
      // Wait for network
      await this.waitForNetwork();
      
      // Retry failed requests
      return this.retryFailedRequests();
    });
  }

  /**
   * Handle error with context
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   */
  handleError(error, context = {}) {
    const errorInfo = this.createErrorInfo(error, context);
    
    // Add to error queue
    this.errorQueue.push(errorInfo);
    
    // Update state
    this.state.hasError = true;
    this.state.error = error;
    this.state.errorInfo = errorInfo;
    this.state.lastErrorTime = Date.now();

    // Log error
    console.error('Error boundary caught error:', errorInfo);

    // Store error for debugging
    this.storeError(errorInfo);

    // Determine error severity
    const severity = this.assessErrorSeverity(error, context);

    // Handle based on severity
    switch (severity) {
      case 'critical':
        this.handleCriticalError(errorInfo);
        break;
      case 'major':
        this.handleMajorError(errorInfo);
        break;
      case 'minor':
        this.handleMinorError(errorInfo);
        break;
      default:
        this.handleGenericError(errorInfo);
    }

    // Attempt recovery if enabled
    if (this.options.enableRecovery && this.state.recoveryAttempts < this.options.maxRecoveryAttempts) {
      this.attemptRecovery(errorInfo);
    }

    // Show user feedback if enabled
    if (this.options.enableUserFeedback) {
      this.showUserFeedback(errorInfo, severity);
    }

    // Report error if enabled
    if (this.options.enableReporting) {
      this.reportError(errorInfo);
    }
  }

  /**
   * Create comprehensive error information
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   * @returns {Object} Error information
   */
  createErrorInfo(error, context) {
    return {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: this.getMemoryInfo(),
      performance: this.getPerformanceInfo(),
      connectionType: this.getConnectionType(),
      retryCount: 0
    };
  }

  /**
   * Generate unique error ID
   * @returns {string} Unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get memory information
   * @returns {Object} Memory info
   */
  getMemoryInfo() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Get performance information
   * @returns {Object} Performance info
   */
  getPerformanceInfo() {
    return {
      navigationStart: performance.timing?.navigationStart,
      loadEventEnd: performance.timing?.loadEventEnd,
      domContentLoaded: performance.timing?.domContentLoadedEventEnd,
      now: performance.now()
    };
  }

  /**
   * Get connection type
   * @returns {string} Connection type
   */
  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Assess error severity
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   * @returns {string} Severity level
   */
  assessErrorSeverity(error, context) {
    // Critical errors
    if (error.name === 'SecurityError' || 
        error.message.includes('Script error') ||
        context.type === 'initialization_failure') {
      return 'critical';
    }

    // Major errors
    if (error.name === 'TypeError' ||
        error.name === 'ReferenceError' ||
        context.type === 'video_load_error' ||
        context.type === 'ui_error') {
      return 'major';
    }

    // Minor errors
    if (error.name === 'NetworkError' ||
        context.type === 'resource_load_error') {
      return 'minor';
    }

    return 'minor';
  }

  /**
   * Handle critical errors
   * @param {Object} errorInfo - Error information
   */
  handleCriticalError(errorInfo) {
    console.error('CRITICAL ERROR:', errorInfo);
    
    // Stop all operations
    this.stopAllOperations();
    
    // Show critical error UI
    this.showCriticalErrorUI(errorInfo);
    
    // Announce to screen readers
    A11yUtils.announce('Critical error occurred. Page may need to be reloaded.');
  }

  /**
   * Handle major errors
   * @param {Object} errorInfo - Error information
   */
  handleMajorError(errorInfo) {
    console.error('MAJOR ERROR:', errorInfo);
    
    // Pause non-essential operations
    this.pauseNonEssentialOperations();
    
    // Show error message
    this.showErrorMessage(errorInfo, 'major');
  }

  /**
   * Handle minor errors
   * @param {Object} errorInfo - Error information
   */
  handleMinorError(errorInfo) {
    console.warn('MINOR ERROR:', errorInfo);
    
    // Log and continue
    this.showErrorMessage(errorInfo, 'minor');
  }

  /**
   * Handle generic errors
   * @param {Object} errorInfo - Error information
   */
  handleGenericError(errorInfo) {
    console.warn('ERROR:', errorInfo);
  }

  /**
   * Handle resource loading errors
   * @param {Event} event - Error event
   */
  handleResourceError(event) {
    const target = event.target;
    const resourceType = target.tagName.toLowerCase();
    
    const error = new Error(`Failed to load ${resourceType}: ${target.src || target.href}`);
    
    this.handleError(error, {
      type: 'resource_load_error',
      resourceType,
      url: target.src || target.href,
      element: target
    });
  }

  /**
   * Handle network errors
   * @param {string} status - Network status
   */
  handleNetworkError(status) {
    const error = new Error(`Network ${status}`);
    
    this.handleError(error, {
      type: 'network_error',
      status,
      online: navigator.onLine
    });
  }

  /**
   * Attempt error recovery
   * @param {Object} errorInfo - Error information
   */
  async attemptRecovery(errorInfo) {
    if (this.state.recoveryAttempts >= this.options.maxRecoveryAttempts) {
      console.log('Max recovery attempts reached');
      return;
    }

    this.state.recoveryAttempts++;
    
    console.log(`Attempting recovery (${this.state.recoveryAttempts}/${this.options.maxRecoveryAttempts})...`);
    
    try {
      // Wait before recovery attempt
      await this.wait(this.options.recoveryDelay);
      
      // Determine recovery strategy
      const strategyKey = this.getRecoveryStrategy(errorInfo);
      const strategy = this.recoveryStrategies.get(strategyKey);
      
      if (strategy) {
        const success = await strategy();
        
        if (success) {
          console.log('Recovery successful');
          this.state.hasError = false;
          this.state.recoveryAttempts = 0;
          this.hideErrorUI();
          
          A11yUtils.announce('Error recovered successfully');
          return true;
        }
      }
      
      // Fallback recovery
      return await this.fallbackRecovery();
      
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      
      this.handleError(recoveryError, {
        type: 'recovery_error',
        originalError: errorInfo
      });
      
      return false;
    }
  }

  /**
   * Determine recovery strategy
   * @param {Object} errorInfo - Error information
   * @returns {string} Strategy key
   */
  getRecoveryStrategy(errorInfo) {
    const { context } = errorInfo;
    
    if (context.type?.includes('video')) {
      return 'video_load_error';
    }
    
    if (context.type?.includes('ui')) {
      return 'ui_error';
    }
    
    if (context.type?.includes('memory') || 
        errorInfo.message.includes('memory')) {
      return 'memory_error';
    }
    
    if (context.type?.includes('network') || 
        !navigator.onLine) {
      return 'network_error';
    }
    
    return 'generic';
  }

  /**
   * Fallback recovery strategy
   * @returns {Promise<boolean>} Recovery success
   */
  async fallbackRecovery() {
    try {
      // Clear all caches
      await this.clearAllCaches();
      
      // Reset application state
      this.resetApplicationState();
      
      // Reload critical resources
      await this.reloadCriticalResources();
      
      return true;
      
    } catch (error) {
      console.error('Fallback recovery failed:', error);
      return false;
    }
  }

  /**
   * Clear video cache
   */
  clearVideoCache() {
    // Clear preloaded videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
  }

  /**
   * Reset video elements
   */
  async resetVideoElements() {
    const videoA = document.getElementById('video-a');
    const videoB = document.getElementById('video-b');
    
    if (videoA) {
      videoA.pause();
      videoA.currentTime = 0;
      videoA.style.opacity = '0';
    }
    
    if (videoB) {
      videoB.pause();
      videoB.currentTime = 0;
      videoB.style.opacity = '0';
    }
    
    return true;
  }

  /**
   * Try alternative video source
   */
  async tryAlternativeVideoSource() {
    // Implementation depends on available alternatives
    return true;
  }

  /**
   * Reset UI state
   */
  resetUIState() {
    // Reset UI visibility
    const uiOverlay = document.getElementById('ui-overlay');
    if (uiOverlay) {
      uiOverlay.classList.remove('ui-visible');
    }
    
    // Reset control states
    const controls = document.querySelectorAll('button, input');
    controls.forEach(control => {
      control.disabled = false;
    });
  }

  /**
   * Reinitialize UI components
   */
  async reinitializeUI() {
    // This would reinitialize UI components
    return true;
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    try {
      // Clear browser caches if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Clear session storage
      sessionStorage.clear();
      
      return true;
    } catch (error) {
      console.warn('Failed to clear caches:', error);
      return false;
    }
  }

  /**
   * Reduce memory usage
   */
  async reduceMemoryUsage() {
    // Reduce preload buffer
    if (window.dreamsAndPoemsApp?.videoManager) {
      window.dreamsAndPoemsApp.videoManager.config.preloadBufferSize = 1;
      window.dreamsAndPoemsApp.videoManager.cleanupPreloadQueue();
    }
    
    return true;
  }

  /**
   * Wait for network
   */
  async waitForNetwork() {
    if (navigator.onLine) return true;
    
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (navigator.onLine) {
          window.removeEventListener('online', checkConnection);
          resolve(true);
        }
      };
      
      window.addEventListener('online', checkConnection);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        window.removeEventListener('online', checkConnection);
        resolve(false);
      }, 10000);
    });
  }

  /**
   * Retry failed requests
   */
  async retryFailedRequests() {
    // Implementation for retrying failed requests
    return true;
  }

  /**
   * Stop all operations
   */
  stopAllOperations() {
    // Pause all videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.pause());
    
    // Cancel all timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    
    // Cancel all intervals
    const highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }
  }

  /**
   * Pause non-essential operations
   */
  pauseNonEssentialOperations() {
    // Pause preloading
    if (window.dreamsAndPoemsApp?.videoManager) {
      window.dreamsAndPoemsApp.videoManager.config.preloadBufferSize = 0;
    }
  }

  /**
   * Reset application state
   */
  resetApplicationState() {
    // Reset any global state
    if (window.dreamsAndPoemsApp) {
      window.dreamsAndPoemsApp.state = {
        isPlaying: false,
        isPaused: false,
        currentVideoIndex: -1,
        autoplay: true,
        muted: true
      };
    }
  }

  /**
   * Reload critical resources
   */
  async reloadCriticalResources() {
    // Reload essential scripts if needed
    return true;
  }

  /**
   * Show user feedback
   * @param {Object} errorInfo - Error information
   * @param {string} severity - Error severity
   */
  showUserFeedback(errorInfo, severity) {
    const message = this.getUserFriendlyMessage(errorInfo, severity);
    
    if (severity === 'critical') {
      this.showCriticalErrorUI(errorInfo);
    } else {
      this.showErrorMessage(errorInfo, severity);
    }
    
    // Announce to screen readers
    A11yUtils.announce(message);
  }

  /**
   * Get user-friendly error message
   * @param {Object} errorInfo - Error information
   * @param {string} severity - Error severity
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(errorInfo, severity) {
    const messages = {
      critical: 'A critical error occurred. Please reload the page.',
      major: 'Something went wrong. Attempting to recover...',
      minor: 'Temporary issue detected. Continuing...'
    };
    
    return messages[severity] || 'An error occurred.';
  }

  /**
   * Show critical error UI
   * @param {Object} errorInfo - Error information
   */
  showCriticalErrorUI(errorInfo) {
    const errorOverlay = document.createElement('div');
    errorOverlay.id = 'critical-error-overlay';
    errorOverlay.className = 'error-boundary';
    errorOverlay.innerHTML = `
      <div class="error-content">
        <h2>🚨 Critical Error</h2>
        <p>Dreams and Poems encountered a critical error and cannot continue.</p>
        <div class="error-details">
          <p><strong>Error:</strong> ${errorInfo.message}</p>
          <p><strong>Time:</strong> ${new Date(errorInfo.timestamp).toLocaleString()}</p>
        </div>
        <div class="error-actions">
          <button onclick="location.reload()" class="primary-button">
            Reload Page
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="secondary-button">
            Dismiss
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(errorOverlay);
  }

  /**
   * Show error message
   * @param {Object} errorInfo - Error information
   * @param {string} severity - Error severity
   */
  showErrorMessage(errorInfo, severity) {
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      const message = this.getUserFriendlyMessage(errorInfo, severity);
      statusIndicator.textContent = message;
      statusIndicator.style.opacity = '1';
      statusIndicator.className = `status-${severity}`;
      
      setTimeout(() => {
        statusIndicator.style.opacity = '0';
      }, severity === 'critical' ? 10000 : 5000);
    }
  }

  /**
   * Hide error UI
   */
  hideErrorUI() {
    const errorOverlay = document.getElementById('critical-error-overlay');
    if (errorOverlay) {
      errorOverlay.remove();
    }
    
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      statusIndicator.style.opacity = '0';
    }
  }

  /**
   * Store error for debugging
   * @param {Object} errorInfo - Error information
   */
  storeError(errorInfo) {
    const errors = StorageUtils.getItem('dreamsAndPoems.errors', []);
    errors.push(errorInfo);
    
    // Keep only last 20 errors
    if (errors.length > 20) {
      errors.splice(0, errors.length - 20);
    }
    
    StorageUtils.setItem('dreamsAndPoems.errors', errors);
  }

  /**
   * Report error to external service
   * @param {Object} errorInfo - Error information
   */
  reportError(errorInfo) {
    // In a real application, this would send to an error reporting service
    console.log('Error reported:', errorInfo.id);
  }

  /**
   * Wait for specified time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Wait promise
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const errors = StorageUtils.getItem('dreamsAndPoems.errors', []);
    
    return {
      totalErrors: errors.length,
      recentErrors: errors.filter(error => 
        Date.now() - new Date(error.timestamp).getTime() < 24 * 60 * 60 * 1000
      ).length,
      errorsByType: this.groupErrorsByType(errors),
      recoveryAttempts: this.state.recoveryAttempts,
      hasActiveError: this.state.hasError
    };
  }

  /**
   * Group errors by type
   * @param {Array} errors - Error array
   * @returns {Object} Grouped errors
   */
  groupErrorsByType(errors) {
    return errors.reduce((groups, error) => {
      const type = error.context?.type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
      return groups;
    }, {});
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    StorageUtils.removeItem('dreamsAndPoems.errors');
    this.errorQueue = [];
    this.state.hasError = false;
    this.state.error = null;
    this.state.errorInfo = null;
    this.state.recoveryAttempts = 0;
  }
}

// Create and export global error boundary instance
const errorBoundary = new ErrorBoundary();

export default errorBoundary;
