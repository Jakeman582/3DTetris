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

var DomElement = {
   scoreText: document.getElementById('scoreText'),
   lineText: document.getElementById('lineText')
};

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

var GameData = {                                                               
   mainPlayField: new BlockMatrix(),
   column: 7,
   row: 3,
   angle: Math.PI / 5.0,
   forbiddenRow: 3,
   activePiece: null,
   lastTime: 0,
   score: 0,
   lines: 0
};

var Piece = {
   I: new IBlock(),
   T: new TBlock(),
   L: new LBlock(),
   J: new JBlock(),
   S: new SBlock(),
   Z: new ZBlock(),
   O: new OBlock()
};

var RenderMatrix = {
   modelMatrix: new Matrix4(),
   viewMatrix: new Matrix4(),
   projectionMatrix: new Matrix4(),
   mvpMatrix: new Matrix4()
};

var Keyboard = {
   RIGHT: 39,
   LEFT: 37,
   DOWN: 40,
   UP: 38,
   SPACE: 32,
   Q: 81,
   W: 87
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

   // Draw the tetris play field.
   GameData.mainPlayField.drawField(Graphics.gl);

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

   GameData.mainPlayField.drawField(Graphics.gl);

   requestAnimationFrame(playGame);
}

// Still need to handle all appropriate keys
function keyDown(e, gl, u_MvpMatrix) {
   if(e.keyCode === Keyboard.RIGHT) {
      if(canMoveRight()) {
         rotateZAxis(GameData.angle);
         RenderMatrix.viewMatrix.setLookAt(Camera.eyeX, Camera.eyeY, Camera.eyeZ, Camera.lookX, Camera.lookY, Camera.lookZ, Camera.upX, Camera.upY, Camera.upZ);
         RenderMatrix.mvpMatrix.set(RenderMatrix.projectionMatrix).multiply(RenderMatrix.viewMatrix).multiply(RenderMatrix.modelMatrix);
         gl.uniformMatrix4fv(u_MvpMatrix, false, RenderMatrix.mvpMatrix.elements);
         moveRight();
      }
   }else if(e.keyCode === Keyboard.LEFT) {
      if(canMoveLeft()) {
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
   }

   GameData.mainPlayField.drawField(gl);

}

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

function setPiece() {
   clearCompleteRows();
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

//Rotate camera around the Z-axis.
function rotateZAxis(angle) {
   var tempEyeX = Camera.eyeX;
   var tempEyeY = Camera.eyeY;
   var tempLookX = Camera.upX;
   var tempLookY = Camera.upY;

   Camera.eyeX = (Math.cos(angle) * tempEyeX) - (Math.sin(angle) * tempEyeY);
   Camera.eyeY = (Math.sin(angle) * tempEyeX) + (Math.cos(angle) * tempEyeY);

   Camera.upX = (Math.cos(angle) * tempLookX) - (Math.sin(angle) * tempLookY);
   Camera.upY = (Math.sin(angle) * tempLookX) + (Math.cos(angle) * tempLookY);
}

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

function clearCompleteRows() {
   // Check for completed rows
   var lastRow = GameData.forbiddenRow;
   var completeRows = [];
   var isComplete = true;
   var startRow = 0;
   var droppedRows = 0;
   var rowIndex = 0;
   var columnIndex = 0;
   for(rowIndex = GameData.mainPlayField.getFieldHeight() - 1; rowIndex > lastRow; rowIndex--) {
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

function increaseScore(numberOfRows) {
   GameData.lines += numberOfRows;
   GameData.score += Math.pow(2, numberOfRows - 1);
   DomElement.scoreText.innerHTML = "" + GameData.score;
   DomElement.lineText.innerHTML = "" + GameData.lines;
}

function incrementColumn() {
   GameData.column = correctColumn(GameData.column++);
}

function decrementColumn() {
   GameData.column = correctColumn(GameData.column--);
}

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

function playGame(now) {
   if(now - GameData.lastTime >= 1 * 1000) {
      GameData.lastTime = now;
      if(canMoveDown()) {
         moveDown();
      }else {
         if(inForbiddenZone()) {
            return;
         }
         setPiece();
      }
      GameData.mainPlayField.drawField(Graphics.gl);
   }
   requestAnimationFrame(playGame);
}