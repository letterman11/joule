/**
 * Utils.js
 * Constants and utility functions
 */

// Key codes
const KEY = { 
  ESC: 27, 
  SPACE: 32, 
  LEFT: 37, 
  UP: 38, 
  RIGHT: 39, 
  DOWN: 40 
};

// Direction constants (also used for rotations)
const DIR = { 
  UP: 0, 
  RIGHT: 1, 
  DOWN: 2, 
  LEFT: 3, 
  MIN: 0, 
  MAX: 3 
};

// Utility functions
const Utils = {
  /**
   * Get DOM element by ID
   */
  get(id) { 
    return document.getElementById(id); 
  },
  
  /**
   * Hide element
   */
  hide(id) { 
    this.get(id).style.visibility = 'hidden'; 
  },
  
  /**
   * Show element
   */
  show(id) { 
    this.get(id).style.visibility = null; 
  },
  
  /**
   * Set element's innerHTML
   */
  html(id, html) { 
    this.get(id).innerHTML = html; 
  },
  
  /**
   * Get current timestamp in milliseconds
   */
  timestamp() { 
    return new Date().getTime(); 
  },
  
  /**
   * Generate random number between min and max
   */
  random(min, max) { 
    return (min + (Math.random() * (max - min))); 
  },
  
  /**
   * Pick random element from array
   */
  randomChoice(choices) { 
    return choices[Math.round(this.random(0, choices.length - 1))]; 
  }
};

// RequestAnimationFrame polyfill for older browsers
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                 window.mozRequestAnimationFrame ||
                                 window.oRequestAnimationFrame ||
                                 window.msRequestAnimationFrame ||
                                 function(callback) {
                                   window.setTimeout(callback, 1000 / 60);
                                 };
}
