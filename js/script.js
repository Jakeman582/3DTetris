// Vertex shader program
var VSHADER_SOURCE =
   'attribute vec4 a_Position;\n' +
   'attribute vec4 a_Color;\n' +
   'uniform mat4 u_MvpMatrix;\n' +
   'varying vec4 v_Color;\n' +
   'void main() {\n' +
   '   gl_Position = u_MvpMatrix * a_Position;\n' +
   '   v_Color = a_Color;\n' +
   '}\n';

// Fragment shader program
var FSHADER_SOURCE =
   '#ifdef GL_ES\n' +
   'precision mediump float;\n' +
   '#endif\n' +
   'varying vec4 v_Color;\n' +
   'void main() {\n' +
   '   gl_FragColor = v_Color;\n' +
   '}\n';

var Graphics = {
   gl: null
};

/*
 * This container allows easy modification
 * of Dom elements
 */
var DomElement = {
   scoreText: document.getElementById('scoreText'),
   lineText: document.getElementById('lineText')
};

/*
 * This container makes it easy to
 * manipulate the camera as needed
 */
var Camera = {
   eyeX: 0,
   eyeY: -30,
   eyeZ: 18,
   lookX: 0,
   lookY: 0,
   lookZ: 2,
   upX: 0,
   upY: 22,
   upZ: 40
};

/*
 * This container makes it easier to access
 * game data and allows for easy updates
 */
var GameData = {                                                               
   mainPlayField: new BlockMatrix(),
   column: 7,
   row: 3,
   angle: Math.PI / 5.0,
   forbiddenRow: 3,
   activePiece: null,
   lastTime: 0,
   isPaused: false,
   score: 0,
   lines: 0
};

/*
 * Having a container for all pieces
 * negates the need to continuosly
 * construct new pieces every time a
 * new piece needs to be generated
 */
var Piece = {
   I: new IBlock(),
   T: new TBlock(),
   L: new LBlock(),
   J: new JBlock(),
   S: new SBlock(),
   Z: new ZBlock(),
   O: new OBlock()
};

/*
 * Having a container for all matrices will
 * make modifying individual matrices easier
 * for when the data needs to be uploaded to
 * the GPU
 */
var RenderMatrix = {
   modelMatrix: new Matrix4(),
   viewMatrix: new Matrix4(),
   projectionMatrix: new Matrix4(),
   mvpMatrix: new Matrix4()
};

/* Having a container for key codes makes it easier
 * to determine what key is being tested for when
 * handling a keyDown event
 */
var Keyboard = {
   RIGHT: 39,
   LEFT: 37,
   DOWN: 40,
   UP: 38,
   SPACE: 32,
   Q: 81,
   W: 87,
   P: 80
};

function main() {
   // Retrieve <canvas> element
   var canvas = document.getElementById('webgl');

   // Initialize score and lines cleared text
   DomElement.scoreText.innerHTML = "" + GameData.score;
   DomElement.lineText.innerHTML = "" + GameData.lines;

   // Set the canvas width and height to match the size specified in style.css
   // so the graphics are not blurry.
   canvas.width = 600;
   canvas.height = 600;

   // Get the rendering context for WebGL
   Graphics.gl = getWebGLContext(canvas);
   if (!Graphics.gl) {
     console.log('Failed to get the rendering context for WebGL');
     return;
   }

   // Initialize shaders
   if (!initShaders(Graphics.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
     console.log('Failed to intialize shaders.');
     return;
   }

   // Set clear color and enable hidden surface removal
   Graphics.gl.clearColor(0.0, 0.0, 0.0, 1.0);
   Graphics.gl.enable(Graphics.gl.DEPTH_TEST);

   // Get the storage location of u_MvpMatrix
   var u_MvpMatrix = Graphics.gl.getUniformLocation(Graphics.gl.program, 'u_MvpMatrix');
   if (!u_MvpMatrix) { 
     console.log('Failed to get the storage location of u_MvpMatrix');
     return;
   }

   // Set the eye point and the viewing volume
   RenderMatrix.projectionMatrix.setPerspective(45, 1, 1, 100);
   RenderMatrix.viewMatrix.setLookAt(Camera.eyeX, Camera.eyeY, Camera.eyeZ, Camera.lookX, Camera.lookY, Camera.lookZ, Camera.upX, Camera.upY, Camera.upZ);
   RenderMatrix.modelMatrix.setIdentity();
   RenderMatrix.mvpMatrix.set(RenderMatrix.projectionMatrix).multiply(RenderMatrix.viewMatrix).multiply(RenderMatrix.modelMatrix);

   // Pass the model view projection matrix to u_MvpMatrix
   Graphics.gl.uniformMatrix4fv(u_MvpMatrix, false, RenderMatrix.mvpMatrix.elements);

   // Handle key down events.
   document.onkeydown = function(e) {
      keyDown(e, Graphics.gl, u_MvpMatrix);
      GameData.mainPlayField.drawField(Graphics.gl);
   }

   // Generate a game piece
   GameData.activePiece = generatePiece();

   // Set the piece
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }

   // Draw the playfield
   GameData.mainPlayField.drawField(Graphics.gl);

   // Start the animation
   requestAnimationFrame(playGame);
}

/*
 * Handle any appropriate keys that
 * affect gameplay
 */
function keyDown(e, gl, u_MvpMatrix) {
   if(e.keyCode === Keyboard.RIGHT) {
      if(canMoveRight()) {
         // Since we want to rotate the camera, we
         // need to update the camera and the data
         // on the GPU
         rotateZAxis(GameData.angle);
         RenderMatrix.viewMatrix.setLookAt(Camera.eyeX, Camera.eyeY, Camera.eyeZ, Camera.lookX, Camera.lookY, Camera.lookZ, Camera.upX, Camera.upY, Camera.upZ);
         RenderMatrix.mvpMatrix.set(RenderMatrix.projectionMatrix).multiply(RenderMatrix.viewMatrix).multiply(RenderMatrix.modelMatrix);
         gl.uniformMatrix4fv(u_MvpMatrix, false, RenderMatrix.mvpMatrix.elements);
         moveRight();
      }
   }else if(e.keyCode === Keyboard.LEFT) {
      if(canMoveLeft()) {
         // Since we want to rotate the camera, we
         // need to update the camera and the data
         // on the GPU
         rotateZAxis(-1.0 * GameData.angle);
         RenderMatrix.viewMatrix.setLookAt(Camera.eyeX, Camera.eyeY, Camera.eyeZ, Camera.lookX, Camera.lookY, Camera.lookZ, Camera.upX, Camera.upY, Camera.upZ);
         RenderMatrix.mvpMatrix.set(RenderMatrix.projectionMatrix).multiply(RenderMatrix.viewMatrix).multiply(RenderMatrix.modelMatrix);
         gl.uniformMatrix4fv(u_MvpMatrix, false, RenderMatrix.mvpMatrix.elements);
         moveLeft();
      }
   }else if(e.keyCode === Keyboard.DOWN) {
      if(canMoveDown()) {
         moveDown();
      }
   }else if(e.keyCode === Keyboard.Q) {
      if(canRotateClockwise()) {
         rotateClockwise();
      }
   }else if(e.keyCode === Keyboard.W) {
      if(canRotateCounterClockwise()) {
         rotateCounterClockwise();
      }
   }else if(e.keyCode === Keyboard.P) {
      GameData.isPaused = !GameData.isPaused;
   }

   // We need to redraw after every keyDown
   // because almost all keyDown events update
   // the playfield
   GameData.mainPlayField.drawField(gl);
}

/*
 * Purpose: Determine if the current peice can be
 *          moved to the left (no blocking blocks).
 *
 * Parameters: None
 * 
 * Returns: A boolean value determining if the current
 *          can be moved to the left.
 */
function canMoveLeft() {
   var grid = null;
   var checkRow = 0;
   var checkColumn = 0;
   for(grid of GameData.activePiece.getLeft()) {
      checkRow = GameData.row + grid.getRow();
      checkColumn = correctColumn(GameData.column + grid.getColumn());
      if(GameData.mainPlayField.getBlockType(checkRow, checkColumn) !== 0) {
         return false;
      }
   }
   return true;
}

/*
 * Purpose: Determine if the current peice can be
 *          moved to the right (no blocking blocks).
 *
 * Parameters: None
 * 
 * Returns: A boolean value determining if the current
 *          can be moved to the right.
 */
function canMoveRight() {
   var grid = null;
   var checkRow = 0;
   var checkColumn = 0;
   for(grid of GameData.activePiece.getRight()) {
      checkRow = GameData.row + grid.getRow();
      checkColumn = correctColumn(GameData.column + grid.getColumn());
      if(GameData.mainPlayField.getBlockType(checkRow, checkColumn) !== 0) {
         return false;
      }
   }
   return true;
}

/*
 * Purpose: Determine if the current peice can be
 *          moved down (no blocking blocks and not
 *          at the bottom of the playfield).
 *
 * Parameters: None
 * 
 * Returns: A boolean value determining if the current
 *          can be moved down.
 */
function canMoveDown() {
   var grid = null;
   var checkRow = 0;
   var checkColumn = 0;
   for(grid of GameData.activePiece.getNextRow()) {
      checkRow = GameData.row + grid.getRow();
      if(checkRow >= GameData.mainPlayField.getFieldHeight()) {
         return false;
      }
      checkColumn = correctColumn(GameData.column + grid.getColumn());
      if(GameData.mainPlayField.getBlockType(checkRow, checkColumn) !== 0) {
         return false;
      }
   }
   return true;
}

/*
 * Purpose: Determine if the current peice can be
 *          rotated clockwise (no blocking blocks).
 *
 * Parameters: None
 * 
 * Returns: A boolean value determining if the current
 *          can be rotated clockwise.
 */
function canRotateClockwise() {
   var grid = null;
   var checkRow = 0;
   var checkColumn = 0;
   for(grid of GameData.activePiece.getClockwise()) {
      checkRow = GameData.row + grid.getRow();
      checkColumn = correctColumn(GameData.column + grid.getColumn());
      if(checkRow >= GameData.mainPlayField.getFieldHeight()) {
         return false;
      }
      if(GameData.mainPlayField.getBlockType(checkRow, checkColumn) !== 0) {
         return false;
      }
   }
   return true;
}

/*
 * Purpose: Determine if the current peice can be
 *          rotated counter-clockwise (no blocking blocks).
 *
 * Parameters: None
 * 
 * Returns: A boolean value determining if the current
 *          can be rotated counter-clockwise.
 */
function canRotateCounterClockwise() {
   var grid = null;
   var checkRow = 0;
   var checkColumn = 0;
   for(grid of GameData.activePiece.getCounterClockwise()) {
      checkRow = GameData.row + grid.getRow();
      checkColumn = correctColumn(GameData.column + grid.getColumn());
      if(checkRow >= GameData.mainPlayField.getFieldHeight()) {
         return false;
      }
      if(GameData.mainPlayField.getBlockType(checkRow, checkColumn) !== 0) {
         return false;
      }
   }
   return true;
}

/*
 * Purpose: Shift all blocks in the current piece
 *          one unit to the left (wrap around the
 *          playfield as necessary).
 *
 * Parameters: None
 *
 * Returns: None
 */
function moveLeft() {
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         0
      );
   }

   GameData.column = correctColumn(GameData.column - 1);

   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Shift all blocks in the current piece
 *          one unit to the right (wrap around the
 *          playfield as necessary).
 *
 * Parameters: None
 *
 * Returns: None
 */
function moveRight() {
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         0
      );
   }

   GameData.column = correctColumn(GameData.column + 1);

   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Shift all blocks in the current piece
 *          one unit down.
 *
 * Parameters: None
 *
 * Returns: None
 */
function moveDown() {
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         0
      );
   }

   GameData.row++;

   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Shift all blocks in the current piece
 *          to their rotated positions (wrap around the
 *          playfield as necessary).
 *
 * Parameters: None
 *
 * Returns: None
 */
function rotateClockwise() {
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         0
      );
   }

   GameData.activePiece.rotateClockwise();

   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Shift all blocks in the current piece
 *          to their rotated positions (wrap around the
 *          playfield as necessary).
 *
 * Parameters: None
 *
 * Returns: None
 */
function rotateCounterClockwise() {
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         0
      );
   }

   GameData.activePiece.rotateCounterClockwise();

   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Clear rows and update the user's score
 *          and generate a new piece when the current
 *          piece can no longer move.
 *
 * Parameters: None
 *
 * Returns: None
 */
function setPiece() {
   clearCompleteRows();

   // To prevent dis-orientation, keep
   // the column where the user left it,
   // otherwise, put the new piece near
   // the top of the playfield.
   GameData.row = 3;
   GameData.activePiece = generatePiece();
   GameData.activePiece.reset();
   var grid = null;
   for(grid of GameData.activePiece.getOrientation()) {
      GameData.mainPlayField.setBlock(
         GameData.row + grid.getRow(),
         correctColumn(GameData.column + grid.getColumn()),
         GameData.activePiece.getType()
      );
   }
}

/*
 * Purpose: Rotate camera around the Z-axis.
 *
 * Parameters: angle(double) -> The angle by which the
 *                              camera needs to be
 *                              rotated.
 *
 * Returns: None
 */
function rotateZAxis(angle) {
   // Store the current values in temporary buffers
   // so they can be used when calculating the new
   // values.
   var tempEyeX = Camera.eyeX;
   var tempEyeY = Camera.eyeY;
   var tempLookX = Camera.upX;
   var tempLookY = Camera.upY;

   // Update the camera's position.
   Camera.eyeX = (Math.cos(angle) * tempEyeX) - (Math.sin(angle) * tempEyeY);
   Camera.eyeY = (Math.sin(angle) * tempEyeX) + (Math.cos(angle) * tempEyeY);

   // Update the camera's up direction.
   Camera.upX = (Math.cos(angle) * tempLookX) - (Math.sin(angle) * tempLookY);
   Camera.upY = (Math.sin(angle) * tempLookX) + (Math.cos(angle) * tempLookY);
}

/*
 * Purpose: Generate a new piece for the player to place.
 *
 * Parameters: None
 *
 * Returns: An integer that represents the new piece
 *          to be generated.
 */
function generatePiece() {
   switch(Math.floor(7 * Math.random() + 1)) {
      case 1:
         return Piece.I;
      case 2:
         return Piece.T;
      case 3:
         return Piece.L;
      case 4:
         return Piece.J;
      case 5:
         return Piece.S;
      case 6:
         return Piece.Z;
      default:
         return Piece.O;
   }
}

/*
 * Purpose: Determine which rows are complete, and if so,
 *          drop blocks row by row. Update scores as needed.
 *
 * Parameters: None
 *
 * Returns: None
 */
function clearCompleteRows() {
   // Create a buffer to hold which rows are complete
   var completeRows = [];
   var isComplete = true;
   var startRow = 0;
   var droppedRows = 0;
   var rowIndex = 0;
   var columnIndex = 0;

   // Check for any completed rows
   for(rowIndex = GameData.mainPlayField.getFieldHeight() - 1; rowIndex > GameData.forbiddenRow; rowIndex--) {
      isComplete = true;
      for(columnIndex = 0; columnIndex < GameData.mainPlayField.getFieldWidth(); columnIndex++) {
         if(GameData.mainPlayField.getBlockType(rowIndex, columnIndex) === 0) {
            isComplete = false;
         }
      }
      if(isComplete) {
         completeRows.push(rowIndex);
      }
   }

   // Drop blocks row by row
   for(startRow of completeRows) {
      for(rowIndex = startRow + droppedRows; rowIndex > 0; rowIndex--) {
         for(columnIndex = 0; columnIndex < GameData.mainPlayField.getFieldWidth(); columnIndex++) {
            GameData.mainPlayField.setBlock(rowIndex, columnIndex, GameData.mainPlayField.getBlockType(rowIndex - 1, columnIndex));
         }
      }
      droppedRows++;
   }

   // Clear the top row, if there were any rows to drop
   if(completeRows.length > 0) {
      for(rowIndex = 0; rowIndex <= GameData.forbiddenRow; rowIndex++) {
         for(columnIndex = 0; columnIndex < GameData.mainPlayField.getFieldWidth(); columnIndex++) {
            GameData.mainPlayField.setBlock(rowIndex, columnIndex, 0);
         }
      }
   }

   // If there were any cleared rows, then update the score
   if(completeRows.length > 0) {
      increaseScore(completeRows.length)
   }
}

/*
 * Purpose: Determine if there any blocks in the
 *          forbidden zone, and if so, end the game.
 *
 * Parameters: None
 *
 * Returns: A boolean value specifying whether or not
 *          the game must end.
 */
function inForbiddenZone() {
   var rowIndex = 0;
   var columnIndex = 0;
   for(rowIndex = 0; rowIndex <= GameData.forbiddenRow; rowIndex++) {
      for(columnIndex = 0; columnIndex < GameData.mainPlayField.getFieldWidth(); columnIndex++) {
         if(GameData.mainPlayField.getBlockType(rowIndex, columnIndex) !== 0) {
            return true;
         }
      }
   }
   return false;
}

/*
 * Purpose: Update the user's score based on
 *          how many lines have been cleared.
 *
 * Parameters: numberOfRows(integer) -> The number of rows that have been
 *                                      completed.
 *
 * Returns: None
 */
function increaseScore(numberOfRows) {
   // Update the scores
   GameData.lines += numberOfRows;
   GameData.score += Math.pow(2, numberOfRows - 1);

   // Update the Dom elements so the user knows what their scores are
   DomElement.scoreText.innerHTML = "" + GameData.score;
   DomElement.lineText.innerHTML = "" + GameData.lines;
}

/*
 * Purpose: Change the active column to be the column to
 *          the right of the current column, and wrap-around
 *          as necessary.
 *
 * Parameters: None
 *
 * Returns: None
 */
function incrementColumn() {
   GameData.column = correctColumn(GameData.column++);
}

/*
 * Purpose: Change the active column to be the column to
 *          the left of the current column, and wrap-around
 *          as necessary.
 *
 * Parameters: None
 *
 * Returns: None
 */
function decrementColumn() {
   GameData.column = correctColumn(GameData.column--);
}

/*
 * Purpose: Make sure the column wraps around correctly
 *          by mapping the current column number into
 *          the appropriate range. This helps create
 *          the rotating camera effect.
 *
 * Parameters: currentColumn(int) -> The current column, which may need
 *                                   to be remapped to the appropriate
 *                                   range.
 *
 * Returns: A new column number which is gauranteed to be in the correct
 *          range.
 */
function correctColumn(currentColumn) {
   var correctedColumn = currentColumn;
   while(correctedColumn < 0) {
      correctedColumn += GameData.mainPlayField.getFieldWidth();
   }
   while(correctedColumn >= GameData.mainPlayField.getFieldWidth()) {
      correctedColumn -= GameData.mainPlayField.getFieldWidth();
   }
   return correctedColumn;
}

/*
 * Purpose: Perform the necessary checks and animations to run
 *          the game.
 *
 * Parameters: now(int) -> The time this function is called by
 *                         requestAnimationFrame, to be used in
 *                         calculating how much time has passed
 *                         this function was last called.
 *
 * Returns: None, the method simply exits, forcing play to stop.
 */
function playGame(now) {
   // Only play the game if not paused
   if(!GameData.isPaused) {
      // Check if enough time has passed between moves
      if(now - GameData.lastTime >= 1000) {
         GameData.lastTime = now;
         // When enough time has passed, force the current
         // piece down
         if(canMoveDown()) {
            moveDown();
         }else {
            if(inForbiddenZone()) {
               return;
            }
            setPiece();
         }
         // Redraw the playfield, since the piece moved down
         GameData.mainPlayField.drawField(Graphics.gl);
      }
   }
   // Start the animation process
   requestAnimationFrame(playGame);
}