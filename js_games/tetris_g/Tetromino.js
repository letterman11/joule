/**
 * Tetromino.js
 * Defines the tetromino piece types and their rotations
 */

class Tetromino {
  constructor(size, blocks, color) {
    this.size = size;
    this.blocks = blocks;
    this.color = color;
  }

  /**
   * Iterate through each occupied block for a given rotation
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} dir - Direction/rotation (0-3)
   * @param {Function} fn - Callback function (x, y) => void
   */
  eachBlock(x, y, dir, fn) {
    const blocks = this.blocks[dir];
    let row = 0, col = 0;
    for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
      if (blocks & bit) {
        fn(x + col, y + row);
      }
      if (++col === 4) {
        col = 0;
        ++row;
      }
    }
  }

  /**
   * Get all available tetromino piece types
   * Each piece is defined by:
   * - size: the size of the piece grid
   * - blocks: 4 rotations encoded as 16-bit integers (4x4 grid)
   * - color: the display color
   */
  static get pieces() {
    return {
      I: new Tetromino(4, [0x0F00, 0x2222, 0x00F0, 0x4444], 'cyan'),
      J: new Tetromino(3, [0x44C0, 0x8E00, 0x6440, 0x0E20], 'blue'),
      L: new Tetromino(3, [0x4460, 0x0E80, 0xC440, 0x2E00], 'orange'),
      O: new Tetromino(2, [0xCC00, 0xCC00, 0xCC00, 0xCC00], 'yellow'),
      S: new Tetromino(3, [0x06C0, 0x8C40, 0x6C00, 0x4620], 'green'),
      T: new Tetromino(3, [0x0E40, 0x4C40, 0x4E00, 0x4640], 'purple'),
      Z: new Tetromino(3, [0x0C60, 0x4C80, 0xC600, 0x2640], 'red')
    };
  }
}
