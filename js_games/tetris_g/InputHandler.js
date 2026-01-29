/**
 * InputHandler.js
 * Manages keyboard input and user actions
 */

class InputHandler {
  constructor(game) {
    this.game = game;
    this.actions = [];  // Queue of pending actions
    this.setupListeners();
  }

  /**
   * Set up keyboard event listeners
   */
  setupListeners() {
    document.addEventListener('keydown', (ev) => this.handleKeyDown(ev), false);
  }

  /**
   * Handle keydown events
   * @param {KeyboardEvent} ev - The keyboard event
   */
  handleKeyDown(ev) {
    let handled = false;
    
    if (this.game.isPlaying()) {
      switch(ev.keyCode) {
        case KEY.LEFT:   this.actions.push(DIR.LEFT);  handled = true; break;
        case KEY.RIGHT:  this.actions.push(DIR.RIGHT); handled = true; break;
        case KEY.UP:     this.actions.push(DIR.UP);    handled = true; break;
        case KEY.DOWN:   this.actions.push(DIR.DOWN);  handled = true; break;
        case KEY.ESC:    this.game.lose();             handled = true; break;
      }
    } else if (ev.keyCode === KEY.SPACE) {
      this.game.play();
      handled = true;
    }

    if (handled) {
      ev.preventDefault();
    }
  }

  /**
   * Get and remove the next action from the queue
   * @returns {number|undefined} - The next action direction, or undefined if queue is empty
   */
  getNextAction() {
    return this.actions.shift();
  }

  /**
   * Clear all pending actions
   */
  clearActions() {
    this.actions = [];
  }
}
