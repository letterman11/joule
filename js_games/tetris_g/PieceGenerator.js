/**
 * PieceGenerator.js
 * Manages random piece generation using the "bag" algorithm
 * Ensures fair distribution of pieces (all 7 pieces appear once before repeating)
 */

class PieceGenerator {
  constructor() {
    this.bag = [];
  }

  /**
   * Get the next random piece
   * @param {number} nx - Width of the board (to calculate starting position)
   * @returns {Piece} - New piece instance
   */
  next(nx) {
    if (this.bag.length === 0) {
      this.fillBag();
    }
    const type = this.bag.splice(Utils.random(0, this.bag.length - 1), 1)[0];
    const x = Math.round(Utils.random(0, nx - type.size));
    return new Piece(type, x, 0);
  }

  /**
   * Fill the bag with 4 instances of each piece type
   * This implements the "random bag" algorithm for fair piece distribution
   */
  fillBag() {
    const pieces = Object.values(Tetromino.pieces);
    pieces.forEach(piece => {
      for (let i = 0; i < 4; i++) {
        this.bag.push(piece);
      }
    });
  }
}
