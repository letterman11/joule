/**
 * Piece.js
 * Represents an instance of a tetromino on the board
 */

class Piece {
  constructor(type, x, y, dir = DIR.UP) {
    this.type = type;  // Reference to a Tetromino
    this.x = x;        // X position on board
    this.y = y;        // Y position on board
    this.dir = dir;    // Current rotation (0-3)
  }

  /**
   * Iterate through each block of this piece at its current position
   * @param {Function} fn - Callback function (x, y) => void
   */
  eachBlock(fn) {
    this.type.eachBlock(this.x, this.y, this.dir, fn);
  }

  /**
   * Create a copy of this piece
   * @returns {Piece} - New piece instance with same properties
   */
  clone() {
    return new Piece(this.type, this.x, this.y, this.dir);
  }
}
