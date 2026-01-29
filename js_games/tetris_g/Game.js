/**
 * Game.js
 * Main game controller - orchestrates all game components
 */

class Game {
  constructor(config) {
    this.config = config;
    this.board = new Board(config.nx, config.ny);
    this.scoreManager = new ScoreManager(config.speed);
    this.pieceGenerator = new PieceGenerator();
    this.renderer = new Renderer(
      Utils.get('canvas'),
      Utils.get('upcoming'),
      config
    );
    this.inputHandler = new InputHandler(this);
    
    this.playing = false;
    this.dt = 0;
    this.current = null;
    this.next = null;
    this.stats = new Stats();
    
    this.initStats();
  }

  /**
   * Initialize the FPS stats display
   */
  initStats() {
    this.stats.domElement.id = 'stats';
    Utils.get('menu').appendChild(this.stats.domElement);
  }

  /**
   * Start a new game
   */
  play() {
    Utils.hide('start');
    this.reset();
    this.playing = true;
  }

  /**
   * End the game
   */
  lose() {
    Utils.show('start');
    this.scoreManager.visualScore = this.scoreManager.score;
    this.renderer.invalidateScore();
    this.playing = false;
  }

  /**
   * Check if game is currently active
   * @returns {boolean} - True if game is in progress
   */
  isPlaying() {
    return this.playing;
  }

  /**
   * Reset game state for a new game
   */
  reset() {
    this.dt = 0;
    this.inputHandler.clearActions();
    this.board.clear();
    this.scoreManager.reset();
    this.current = this.next || this.pieceGenerator.next(this.config.nx);
    this.next = this.pieceGenerator.next(this.config.nx);
    this.renderer.invalidateAll();
  }

  /**
   * Update game state
   * @param {number} idt - Time elapsed since last update (in seconds)
   */
  update(idt) {
    if (!this.playing) return;

    // Update visual score animation
    if (this.scoreManager.updateVisualScore()) {
      this.renderer.invalidateScore();
    }

    // Process user input
    this.handleInput(this.inputHandler.getNextAction());

    // Handle automatic piece dropping
    this.dt += idt;
    if (this.dt > this.scoreManager.getDropSpeed()) {
      this.dt -= this.scoreManager.getDropSpeed();
      this.drop();
    }
  }

  /**
   * Handle a user input action
   * @param {number} action - Direction constant (DIR.LEFT, DIR.RIGHT, etc.)
   */
  handleInput(action) {
    switch(action) {
      case DIR.LEFT:  this.move(DIR.LEFT);  break;
      case DIR.RIGHT: this.move(DIR.RIGHT); break;
      case DIR.UP:    this.rotate();        break;
      case DIR.DOWN:  this.drop();          break;
    }
  }

  /**
   * Move the current piece
   * @param {number} dir - Direction to move (DIR.LEFT, DIR.RIGHT, DIR.DOWN)
   * @returns {boolean} - True if move was successful
   */
  move(dir) {
    const newPiece = this.current.clone();
    
    switch(dir) {
      case DIR.RIGHT: newPiece.x++; break;
      case DIR.LEFT:  newPiece.x--; break;
      case DIR.DOWN:  newPiece.y++; break;
    }

    if (!this.board.isOccupied(newPiece)) {
      this.current = newPiece;
      this.renderer.invalidateCourt();
      return true;
    }
    return false;
  }

  /**
   * Rotate the current piece clockwise
   */
  rotate() {
    const newPiece = this.current.clone();
    newPiece.dir = (newPiece.dir === DIR.MAX ? DIR.MIN : newPiece.dir + 1);
    
    if (!this.board.isOccupied(newPiece)) {
      this.current = newPiece;
      this.renderer.invalidateCourt();
    }
  }

  /**
   * Drop the current piece one row (or lock it if it can't move down)
   */
  drop() {
    if (!this.move(DIR.DOWN)) {
      // Piece has landed - lock it in place
      this.scoreManager.addScore(10);
      this.board.dropPiece(this.current);
      
      // Check for completed lines
      const linesCleared = this.board.removeCompletedLines();
      if (linesCleared > 0) {
        this.scoreManager.addRows(linesCleared);
        this.scoreManager.addScore(this.scoreManager.calculateLineScore(linesCleared));
        this.renderer.invalidateRows();
      }

      // Spawn next piece
      this.current = this.next;
      this.next = this.pieceGenerator.next(this.config.nx);
      this.inputHandler.clearActions();
      this.renderer.invalidateCourt();
      this.renderer.invalidateNext();

      // Check for game over
      if (this.board.isOccupied(this.current)) {
        this.lose();
      }
    }
  }

  /**
   * Draw the current game state
   */
  draw() {
    this.renderer.draw(
      this.board,
      this.current,
      this.next,
      this.scoreManager,
      this.playing
    );
  }

  /**
   * Start the game loop
   */
  run() {
    let last = Utils.timestamp();
    
    const frame = () => {
      const now = Utils.timestamp();
      this.update(Math.min(1, (now - last) / 1000.0));
      this.draw();
      this.stats.update();
      last = now;
      requestAnimationFrame(frame, this.renderer.canvas);
    };

    this.reset();
    frame();
  }
}
