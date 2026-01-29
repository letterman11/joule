/**
 * Board.js
 * Manages the game grid, collision detection, and line clearing
 */

class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
  }

  /**
   * Clear all blocks from the board
   */
  clear() {
    this.grid = [];
  }

  /**
   * Get the block at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Tetromino|null} - The tetromino type at this position, or null if empty
   */
  getBlock(x, y) {
    return (this.grid[x] ? this.grid[x][y] : null);
  }

  /**
   * Set a block at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Tetromino|null} type - The tetromino type to place, or null to clear
   */
  setBlock(x, y, type) {
    this.grid[x] = this.grid[x] || [];
    this.grid[x][y] = type;
  }

  /**
   * Check if a piece would collide at a given position
   * @param {Piece} piece - The piece to check
   * @returns {boolean} - True if the position is occupied/invalid
   */
  isOccupied(piece) {
    let occupied = false;
    piece.eachBlock((x, y) => {
      if ((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height) || this.getBlock(x, y)) {
        occupied = true;
      }
    });
    return occupied;
  }

  /**
   * Place a piece permanently on the board
   * @param {Piece} piece - The piece to drop
   */
  dropPiece(piece) {
    piece.eachBlock((x, y) => {
      this.setBlock(x, y, piece.type);
    });
  }

  /**
   * Remove all completed lines and return count
   * @returns {number} - Number of lines removed
   */
  removeCompletedLines() {
    let linesRemoved = 0;
    for (let y = this.height; y > 0; y--) {
      if (this.isLineComplete(y)) {
        this.removeLine(y);
        y++; // Recheck same line
        linesRemoved++;
      }
    }
    return linesRemoved;
  }

  /**
   * Check if a horizontal line is completely filled
   * @param {number} y - The line to check
   * @returns {boolean} - True if line is complete
   */
  isLineComplete(y) {
    for (let x = 0; x < this.width; x++) {
      if (!this.getBlock(x, y)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Remove a line and shift everything above it down
   * @param {number} n - The line number to remove
   */
  removeLine(n) {
    for (let y = n; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        this.setBlock(x, y, (y === 0) ? null : this.getBlock(x, y - 1));
      }
    }
  }
}
