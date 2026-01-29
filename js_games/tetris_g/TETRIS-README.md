# Tetris - Modular JavaScript Version

A refactored implementation of Tetris with each major class in its own file for better maintainability and organization.

## File Structure

```
├── tetris-modular.html    # Main HTML file
├── stats.js               # FPS counter library
├── Utils.js               # Constants and utility functions
├── Tetromino.js           # Piece type definitions
├── Piece.js               # Individual piece instances
├── PieceGenerator.js      # Random piece generation
├── Board.js               # Game grid and collision
├── ScoreManager.js        # Scoring and speed
├── InputHandler.js        # Keyboard controls
├── Renderer.js            # Drawing and display
└── Game.js                # Main game controller
```

## Class Descriptions

### Utils.js
- **Constants**: KEY codes, DIR(ection) values
- **Utility functions**: DOM helpers, random number generation, timestamps
- **Polyfills**: requestAnimationFrame for older browsers

### Tetromino.js
- Defines the 7 tetromino types (I, J, L, O, S, T, Z)
- Each type has: size, rotation states (as bit masks), and color
- Provides `eachBlock()` method to iterate through occupied blocks

### Piece.js
- Represents a specific instance of a tetromino on the board
- Properties: type, x/y position, rotation direction
- Methods: `eachBlock()`, `clone()`

### PieceGenerator.js
- Implements the "bag" randomization algorithm
- Ensures fair distribution (all 7 pieces appear before any repeat)
- Returns properly positioned pieces for the game board

### Board.js
- Manages the game grid (10x20 by default)
- Handles collision detection
- Manages line completion and removal
- Methods for getting/setting blocks

### ScoreManager.js
- Tracks current score and completed rows
- Manages visual score animation (counting up effect)
- Calculates game speed based on progression
- Scoring: 1 line=100pts, 2=200pts, 3=400pts, 4=800pts

### InputHandler.js
- Listens for keyboard events
- Queues player actions (left, right, rotate, drop)
- Handles both gameplay and menu controls

### Renderer.js
- Draws the game board and pieces
- Draws the next piece preview
- Updates score and row displays
- Implements dirty rectangle optimization (only redraws when needed)

### Game.js
- Main game loop and state management
- Coordinates all other classes
- Handles piece movement, rotation, and dropping
- Manages game start/end conditions

## How to Run

1. Place all files in the same directory
2. Open `tetris-modular.html` in a web browser
3. Press Space to start
4. Use arrow keys to play:
   - ← → : Move left/right
   - ↑ : Rotate
   - ↓ : Drop faster
   - ESC : End game

## Dependencies

The files must be loaded in this order (as shown in tetris-modular.html):

1. stats.js (external library)
2. Utils.js (constants needed by all classes)
3. Tetromino.js (used by Piece)
4. Piece.js (used by PieceGenerator, Board, Game)
5. PieceGenerator.js (used by Game)
6. Board.js (used by Game)
7. ScoreManager.js (used by Game)
8. InputHandler.js (uses Game)
9. Renderer.js (uses Board, Piece, ScoreManager)
10. Game.js (orchestrates everything)

## Benefits of This Structure

- **Modularity**: Each class has a single, clear responsibility
- **Maintainability**: Easy to find and modify specific functionality
- **Testability**: Classes can be tested independently
- **Readability**: Clear separation of concerns
- **Reusability**: Components like Board or ScoreManager could be reused in other games
- **Collaboration**: Multiple developers can work on different files simultaneously

## Future Enhancements

With this modular structure, you could easily add:
- Hold piece functionality (new HoldManager class)
- Ghost piece preview (extend Renderer)
- Different game modes (extend Game)
- Sound effects (new AudioManager class)
- High score persistence (new StorageManager class)
- Touch controls for mobile (extend InputHandler)
