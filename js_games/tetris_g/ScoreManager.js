/**
 * ScoreManager.js
 * Handles scoring, row counting, and level/speed progression
 */

class ScoreManager {
  constructor(speedConfig) {
    this.score = 0;
    this.visualScore = 0;  // Animated score that "catches up" to actual score
    this.rows = 0;
    this.speedConfig = speedConfig;
    this.step = speedConfig.start;
  }

  /**
   * Reset all scores to initial state
   */
  reset() {
    this.score = 0;
    this.visualScore = 0;
    this.rows = 0;
    this.step = this.speedConfig.start;
  }

  /**
   * Add points to the score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * Add completed rows and update game speed
   * @param {number} count - Number of rows completed
   */
  addRows(count) {
    this.rows += count;
    this.step = Math.max(
      this.speedConfig.min,
      this.speedConfig.start - (this.speedConfig.decrement * this.rows)
    );
  }

  /**
   * Update the visual score (animates toward actual score)
   * @returns {boolean} - True if visual score was updated
   */
  updateVisualScore() {
    if (this.visualScore < this.score) {
      this.visualScore++;
      return true;
    }
    return false;
  }

  /**
   * Get current drop speed (time between automatic drops)
   * @returns {number} - Drop interval in seconds
   */
  getDropSpeed() {
    return this.step;
  }

  /**
   * Calculate score for clearing lines
   * Scoring: 1 line = 100, 2 lines = 200, 3 lines = 400, 4 lines = 800
   * @param {number} linesCleared - Number of lines cleared at once
   * @returns {number} - Points earned
   */
  calculateLineScore(linesCleared) {
    if (linesCleared > 0) {
      return 100 * Math.pow(2, linesCleared - 1);
    }
    return 0;
  }
}
