/**
 * Reusable State Management Module
 * Manages application state with subscription/listener pattern
 * Handles loading states, UI updates, and state notifications
 */

class StateManager {
  constructor() {
    this._state = {};
    this._listeners = {};
    this._loadingElements = new Map();
  }

  /**
   * Set state value and notify listeners
   * @param {string} key - State key
   * @param {*} value - State value
   */
  setState(key, value) {
    const oldValue = this._state[key];
    this._state[key] = value;
    
    // Only notify if value actually changed
    if (oldValue !== value) {
      this._notifyListeners(key, value);
    }
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {*} State value or undefined
   */
  getState(key) {
    return this._state[key];
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Callback function (receives new value)
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }
    
    this._listeners[key].push(callback);
    
    // Return unsubscribe function
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   * @private
   */
  _notifyListeners(key, value) {
    if (this._listeners[key]) {
      this._listeners[key].forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error(`State listener error for key "${key}":`, error);
        }
      });
    }
  }

  /**
   * Set button loading state with spinning indicator
   * @param {string} buttonId - Button element ID
   * @param {boolean} isLoading - Loading state
   * @param {Object} options - Optional configuration
   * @param {string} options.originalText - Original button text (stored if not provided)
   * @param {string} options.loadingText - Loading text to show (default: "Loading...")
   */
  setButtonLoading(buttonId, isLoading, options = {}) {
    const button = document.getElementById(buttonId);
    if (!button) {
      console.warn(`Button with ID "${buttonId}" not found`);
      return;
    }

    const stateKey = `button_${buttonId}_loading`;
    this.setState(stateKey, isLoading);

    // Store original text if not already stored
    if (!this._loadingElements.has(buttonId)) {
      this._loadingElements.set(buttonId, {
        originalText: options.originalText || button.textContent,
        loadingText: options.loadingText || 'Loading...'
      });
    }

    const config = this._loadingElements.get(buttonId);
    button.disabled = isLoading;

    if (isLoading) {
      button.classList.add('is-loading');
      button.dataset.originalText = config.originalText;
      button.textContent = config.loadingText;
    } else {
      button.classList.remove('is-loading');
      button.textContent = config.originalText;
    }
  }

  /**
   * Set loading state for any element
   * @param {string} elementId - Element ID
   * @param {boolean} isLoading - Loading state
   * @param {Object} options - Optional configuration
   * @param {string} options.className - CSS class to add/remove (default: "is-loading")
   */
  setElementLoading(elementId, isLoading, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found`);
      return;
    }

    const className = options.className || 'is-loading';
    const stateKey = `element_${elementId}_loading`;
    this.setState(stateKey, isLoading);

    if (isLoading) {
      element.classList.add(className);
      element.setAttribute('aria-busy', 'true');
    } else {
      element.classList.remove(className);
      element.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Check if element is loading
   * @param {string} elementId - Element ID
   * @returns {boolean} Loading state
   */
  isLoading(elementId) {
    const stateKey = `button_${elementId}_loading` || `element_${elementId}_loading`;
    return this.getState(stateKey) === true;
  }

  /**
   * Get all current state
   * @returns {Object} Complete state object
   */
  getAllState() {
    return { ...this._state };
  }

  /**
   * Clear specific state key
   * @param {string} key - State key to clear
   */
  clearState(key) {
    if (this._state.hasOwnProperty(key)) {
      delete this._state[key];
      this._notifyListeners(key, undefined);
    }
  }

  /**
   * Clear all state and listeners
   */
  reset() {
    const keys = Object.keys(this._state);
    this._state = {};
    this._listeners = {};
    this._loadingElements.clear();
    
    keys.forEach(key => {
      // Notify once that everything is cleared
      if (this._listeners[key]) {
        this._listeners[key].forEach(cb => {
          try {
            cb(undefined);
          } catch (error) {
            console.error(`State listener error during reset for key "${key}":`, error);
          }
        });
      }
    });
  }

  /**
   * Batch state updates
   * @param {Object} updates - Multiple state updates as key-value pairs
   */
  batchUpdate(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.setState(key, value);
    });
  }
}

// Export singleton instance
export const stateManager = new StateManager();

// Export class for testing/multiple instances if needed
export default StateManager;
