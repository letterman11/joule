/**
 * Renderer.js
 * Handles all drawing and rendering operations
 */

class Renderer {
  constructor(canvas, upcomingCanvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.upcomingCanvas = upcomingCanvas;
    this.uctx = upcomingCanvas.getContext('2d');
    this.config = config;
    this.dx = 0;  // Pixel width of a block
    this.dy = 0;  // Pixel height of a block
    this.invalid = {};  // Tracks what needs to be redrawn
    
    this.setupResize();
  }

  /**
   * Set up window resize handling
   */
  setupResize() {
    window.addEventListener('resize', () => this.resize(), false);
    this.resize();
  }

  /**
   * Handle canvas resize
   */
  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.upcomingCanvas.width = this.upcomingCanvas.clientWidth;
    this.upcomingCanvas.height = this.upcomingCanvas.clientHeight;
    
    this.dx = this.canvas.width / this.config.nx;
    this.dy = this.canvas.height / this.config.ny;
    
    this.invalidateAll();
  }

  /**
   * Mark all elements as needing redraw
   */
  invalidateAll() {
    this.invalid.court = true;
    this.invalid.next = true;
    this.invalid.score = true;
    this.invalid.rows = true;
  }

  invalidateCourt() { this.invalid.court = true; }
  invalidateNext() { this.invalid.next = true; }
  invalidateScore() { this.invalid.score = true; }
  invalidateRows() { this.invalid.rows = true; }

  /**
   * Main draw method - draws all game elements
   */
  draw(board, currentPiece, nextPiece, scoreManager, isPlaying) {
    this.ctx.save();
    this.ctx.lineWidth = 1;
    this.ctx.translate(0.5, 0.5);  // For crisp 1px lines
    
    this.drawCourt(board, currentPiece, isPlaying);
    this.drawNext(nextPiece);
    this.drawScore(scoreManager.visualScore);
    this.drawRows(scoreManager.rows);
    
    this.ctx.restore();
  }

  /**
   * Draw the main game court
   */
  drawCourt(board, currentPiece, isPlaying) {
    if (!this.invalid.court) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw current falling piece
    if (isPlaying && currentPiece) {
      this.drawPiece(this.ctx, currentPiece);
    }

    // Draw placed blocks
    for (let y = 0; y < this.config.ny; y++) {
      for (let x = 0; x < this.config.nx; x++) {
        const block = board.getBlock(x, y);
        if (block) {
          this.drawBlock(this.ctx, x, y, block.color);
        }
      }
    }

    // Draw board boundary
    this.ctx.strokeRect(0, 0, this.config.nx * this.dx - 1, this.config.ny * this.dy - 1);
    this.invalid.court = false;
  }

  /**
   * Draw the next piece preview
   */
  drawNext(nextPiece) {
    if (!this.invalid.next) return;

    const padding = (this.config.nu - nextPiece.type.size) / 2;
    this.uctx.save();
    this.uctx.translate(0.5, 0.5);
    this.uctx.clearRect(0, 0, this.config.nu * this.dx, this.config.nu * this.dy);
    
    this.drawPiece(this.uctx, new Piece(nextPiece.type, padding, padding, nextPiece.dir));
    
    this.uctx.strokeStyle = 'black';
    this.uctx.strokeRect(0, 0, this.config.nu * this.dx - 1, this.config.nu * this.dy - 1);
    this.uctx.restore();
    this.invalid.next = false;
  }

  /**
   * Update the score display
   */
  drawScore(visualScore) {
    if (!this.invalid.score) return;
    Utils.html('score', ("00000" + Math.floor(visualScore)).slice(-5));
    this.invalid.score = false;
  }

  /**
   * Update the rows display
   */
  drawRows(rows) {
    if (!this.invalid.rows) return;
    Utils.html('rows', rows);
    this.invalid.rows = false;
  }

  /**
   * Draw a tetromino piece
   */
  drawPiece(ctx, piece) {
    piece.eachBlock((x, y) => {
      this.drawBlock(ctx, x, y, piece.type.color);
    });
  }

  /**
   * Draw a single block
   */
  drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
    ctx.strokeRect(x * this.dx, y * this.dy, this.dx, this.dy);
  }
}
