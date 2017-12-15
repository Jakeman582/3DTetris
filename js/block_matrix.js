/*
 * Name: block_matrix.js
 * 
 * Author: Jacob Hiance
 * 
 * Purpose: Contains a matrix describing where polyominoes are placed on the 
 *          gamefield. The matrix will contain a matrix of block objects, each 
 *          of which will hold vertex and index data. Colors will change 
 *          depending on where blocks are located on the field. Empty 
 *          positions will be black blocks with alpha values of 0.0. When a 
 *          block is set, it's colors will change.
 *
 *          This file holds all the information needed to properly draw and
 *          color each block and the game grid.
 */

var BlockField = {
   width: 10,
   height: 24
};

var BlockGeometry = {
   startRadius: 2,
   width: 2.0,
   blockLength: Math.PI / 5.0,
   height: 1.0,
   meshSize: 4,
   normalization: 1.0
};

var BlockType = {
   noBlock: 0,
   IBlock: 1,
   TBlock: 2,
   LBlock: 3,
   JBlock: 4,
   SBlock: 5,
   ZBlock: 6,
   OBlock: 7
};

var BlockColors = {
   noBlock: new Color(0.0, 0.0, 0.0),
   IBlock: new Color(0.0, 1.0, 1.0),
   TBlock: new Color(1.0, 0.0, 1.0),
   LBlock: new Color(1.0, 0.647059, 0.0),
   JBlock: new Color(0.0, 0.0, 1.0),
   SBlock: new Color(0.0, 1.0, 0.0),
   ZBlock: new Color(1.0, 0.0, 0.0),
   OBlock: new Color(1.0, 1.0, 0.0)
};

function BlockMatrix() {
   // Initialize this block matrix with blocks.
   this.activeBlocks = [];
   this.fieldBlocks = [];
   this.fieldCoordinates = [];
   this.fieldColors = [];
   this.fieldIndices = [];

   // Construct the gradient colors for each block type ------------------------------------------------------------------------
   this.IGradient = [];
   this.TGradient = [];
   this.LGradient = [];
   this.JGradient = [];
   this.SGradient = [];
   this.ZGradient = [];
   this.OGradient = [];

   var index = 0;
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(85, 217, 255), new Color(36, 128, 127));
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(29, 119, 145), new Color(65, 187, 174));
      this.IGradient.push(tempColor1.getRed());
      this.IGradient.push(tempColor1.getGreen());
      this.IGradient.push(tempColor1.getBlue());
      this.IGradient.push(tempColor1.getAlpha());
      this.IGradient.push(tempColor2.getRed());
      this.IGradient.push(tempColor2.getGreen());
      this.IGradient.push(tempColor2.getBlue());
      this.IGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(65, 187, 174), new Color(29, 119, 145));
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(36, 128, 127), new Color(85, 217, 255));
      this.IGradient.push(tempColor1.getRed());
      this.IGradient.push(tempColor1.getGreen());
      this.IGradient.push(tempColor1.getBlue());
      this.IGradient.push(tempColor1.getAlpha());
      this.IGradient.push(tempColor2.getRed());
      this.IGradient.push(tempColor2.getGreen());
      this.IGradient.push(tempColor2.getBlue());
      this.IGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(212, 122, 254), new Color(175, 25, 247));
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(66, 0, 100), new Color(193, 69, 255));
      this.TGradient.push(tempColor1.getRed());
      this.TGradient.push(tempColor1.getGreen());
      this.TGradient.push(tempColor1.getBlue());
      this.TGradient.push(tempColor1.getAlpha());
      this.TGradient.push(tempColor2.getRed());
      this.TGradient.push(tempColor2.getGreen());
      this.TGradient.push(tempColor2.getBlue());
      this.TGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(193, 69, 255), new Color(66, 0, 100));
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(175, 25, 247), new Color(212, 122, 254));
      this.TGradient.push(tempColor1.getRed());
      this.TGradient.push(tempColor1.getGreen());
      this.TGradient.push(tempColor1.getBlue());
      this.TGradient.push(tempColor1.getAlpha());
      this.TGradient.push(tempColor2.getRed());
      this.TGradient.push(tempColor2.getGreen());
      this.TGradient.push(tempColor2.getBlue());
      this.TGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(255, 164, 120), new Color(184, 99, 32)); // Bottom-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(197, 111, 88), new Color(251, 188, 111));// Bottom-Right
      this.LGradient.push(tempColor1.getRed());
      this.LGradient.push(tempColor1.getGreen());
      this.LGradient.push(tempColor1.getBlue());
      this.LGradient.push(tempColor1.getAlpha());
      this.LGradient.push(tempColor2.getRed());
      this.LGradient.push(tempColor2.getGreen());
      this.LGradient.push(tempColor2.getBlue());
      this.LGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(251, 188, 111), new Color(197, 111, 88));//Upper-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(184, 99, 32), new Color(255, 164, 120));//Upper-Right
      this.LGradient.push(tempColor1.getRed());
      this.LGradient.push(tempColor1.getGreen());
      this.LGradient.push(tempColor1.getBlue());
      this.LGradient.push(tempColor1.getAlpha());
      this.LGradient.push(tempColor2.getRed());
      this.LGradient.push(tempColor2.getGreen());
      this.LGradient.push(tempColor2.getBlue());
      this.LGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(33, 118, 172), new Color(34, 17, 119)); // Bottom-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(136, 171, 255), new Color(84, 136, 238));// Bottom-Right
      this.JGradient.push(tempColor1.getRed());
      this.JGradient.push(tempColor1.getGreen());
      this.JGradient.push(tempColor1.getBlue());
      this.JGradient.push(tempColor1.getAlpha());
      this.JGradient.push(tempColor2.getRed());
      this.JGradient.push(tempColor2.getGreen());
      this.JGradient.push(tempColor2.getBlue());
      this.JGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(84, 136, 238), new Color(136, 171, 255));//Upper-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(34, 17, 119), new Color(33, 118, 172));//Upper-Right
      this.JGradient.push(tempColor1.getRed());
      this.JGradient.push(tempColor1.getGreen());
      this.JGradient.push(tempColor1.getBlue());
      this.JGradient.push(tempColor1.getAlpha());
      this.JGradient.push(tempColor2.getRed());
      this.JGradient.push(tempColor2.getGreen());
      this.JGradient.push(tempColor2.getBlue());
      this.JGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(5, 225, 119), new Color(34, 238, 91)); // Bottom-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(156, 255, 136), new Color(61, 215, 21));// Bottom-Right
      this.SGradient.push(tempColor1.getRed());
      this.SGradient.push(tempColor1.getGreen());
      this.SGradient.push(tempColor1.getBlue());
      this.SGradient.push(tempColor1.getAlpha());
      this.SGradient.push(tempColor2.getRed());
      this.SGradient.push(tempColor2.getGreen());
      this.SGradient.push(tempColor2.getBlue());
      this.SGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(61, 215, 21), new Color(156, 255, 136));//Upper-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(34, 238, 91), new Color(5, 225, 119));//Upper-Right
      this.SGradient.push(tempColor1.getRed());
      this.SGradient.push(tempColor1.getGreen());
      this.SGradient.push(tempColor1.getBlue());
      this.SGradient.push(tempColor1.getAlpha());
      this.SGradient.push(tempColor2.getRed());
      this.SGradient.push(tempColor2.getGreen());
      this.SGradient.push(tempColor2.getBlue());
      this.SGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(254, 31, 32), new Color(108, 0, 0)); // Bottom-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(254, 132, 131), new Color(255, 77, 77));// Bottom-Right
      this.ZGradient.push(tempColor1.getRed());
      this.ZGradient.push(tempColor1.getGreen());
      this.ZGradient.push(tempColor1.getBlue());
      this.ZGradient.push(tempColor1.getAlpha());
      this.ZGradient.push(tempColor2.getRed());
      this.ZGradient.push(tempColor2.getGreen());
      this.ZGradient.push(tempColor2.getBlue());
      this.ZGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(255, 77, 77), new Color(254, 132, 131));//Upper-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(108, 0, 0), new Color(254, 31, 32));//Upper-Right
      this.ZGradient.push(tempColor1.getRed());
      this.ZGradient.push(tempColor1.getGreen());
      this.ZGradient.push(tempColor1.getBlue());
      this.ZGradient.push(tempColor1.getAlpha());
      this.ZGradient.push(tempColor2.getRed());
      this.ZGradient.push(tempColor2.getGreen());
      this.ZGradient.push(tempColor2.getBlue());
      this.ZGradient.push(tempColor2.getAlpha());
   }

   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(254, 238, 117), new Color(254, 186, 0)); // Bottom-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(238, 155, 15), new Color(255, 233, 0));// Bottom-Right
      this.OGradient.push(tempColor1.getRed());
      this.OGradient.push(tempColor1.getGreen());
      this.OGradient.push(tempColor1.getBlue());
      this.OGradient.push(tempColor1.getAlpha());
      this.OGradient.push(tempColor2.getRed());
      this.OGradient.push(tempColor2.getGreen());
      this.OGradient.push(tempColor2.getBlue());
      this.OGradient.push(tempColor2.getAlpha());
   }
   for(index = 0; index <= BlockGeometry.meshSize; index++) {
      var tempColor1 = getGradientColor(index / BlockGeometry.meshSize, new Color(255, 233, 0), new Color(238, 155, 15));//Upper-Left
      var tempColor2 = getGradientColor(index / BlockGeometry.meshSize, new Color(254, 186, 0), new Color(254, 238, 117));//Upper-Right
      this.OGradient.push(tempColor1.getRed());
      this.OGradient.push(tempColor1.getGreen());
      this.OGradient.push(tempColor1.getBlue());
      this.OGradient.push(tempColor1.getAlpha());
      this.OGradient.push(tempColor2.getRed());
      this.OGradient.push(tempColor2.getGreen());
      this.OGradient.push(tempColor2.getBlue());
      this.OGradient.push(tempColor2.getAlpha());
   }

   //--------------------------------------------------------------------------------------------------------------------------------------------------------

   // Data to draw a grid
   var innerRadius = BlockGeometry.startRadius + BlockGeometry.width;
   var outerRadius = innerRadius + 1.0;
   var startHeight = -14.0;
   this.gameGrid = new GameGrid(BlockField.width, BlockField.height - 4, innerRadius + 0.01, outerRadius, BlockGeometry.blockLength, BlockGeometry.height, startHeight, BlockGeometry.meshSize);

   // Insert blocks into this BlockMatrix.
   var rowIndex = 0;
   var columnIndex = 0;
   var currentAngle = 0.0;
   var currentHeight = 9.0;
   var currentRow = [];

   // Populate the active blocks array and initialize to 0
   for(rowIndex = 0; rowIndex < BlockField.height; rowIndex++) {
      currentRow = [];
      for(columnIndex = 0; columnIndex < BlockField.width; columnIndex++) {
         currentRow.push(0);
      }
      this.activeBlocks.push(currentRow);
   }

   // Construct all of the blocks
   for(rowIndex = 0; rowIndex < BlockField.height; rowIndex++) {
      currentAngle = 0.0;
      currentRow = [];
      for(columnIndex = 0; columnIndex < BlockField.width; columnIndex++) {
         currentRow.push(
            new CylindricalBlock(
               BlockGeometry.startRadius,
               BlockGeometry.width,
               currentAngle,
               BlockGeometry.blockLength,
               currentHeight,
               BlockGeometry.height,
               BlockGeometry.meshSize,
               BlockGeometry.normalization,
               new Color(0.0, 0.0, 0.0, 1.0)
            )
         );
         currentAngle += BlockGeometry.blockLength;
      }
      currentHeight -= BlockGeometry.height;
      this.fieldBlocks.push(currentRow);
   }
}

BlockMatrix.prototype.getFieldWidth = function() {
   return BlockField.width;
}

BlockMatrix.prototype.getFieldHeight = function() {
   return BlockField.height;
}

BlockMatrix.prototype.getBlocks = function() {
   return this.fieldBlocks;
}

BlockMatrix.prototype.drawField = function(gl) {
   // Helper variables
   var rowIndex = 0;
   var columnIndex = 0;
   var fVertexSize = 0;
   var fColorSize = 0;
   var width = BlockField.width;
   var height = BlockField.height;
   var vertices = [];
   var colors = [];
   var indices = [];
   var blocks = this.fieldBlocks;

   // Create a buffer object for the block information
   var vertexBuffer = gl.createBuffer();
   var colorBuffer = gl.createBuffer();
   var indexBuffer = gl.createBuffer();
   if (!vertexBuffer || !colorBuffer || !indexBuffer) {
      return -1;
   }

   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
   var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

   // Clear the canvas.
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Draw the active blocks in the field
   for(rowIndex = 0; rowIndex < height; rowIndex++) {
      currentAngle = 0.0;
      for(columnIndex = 0; columnIndex < width; columnIndex++) {
         if(this.activeBlocks[rowIndex][columnIndex] !== 0) {
            vertices = blocks[rowIndex][columnIndex].getWebGLCoordinates();
            colors = blocks[rowIndex][columnIndex].getWebGLColors();
            indices = blocks[rowIndex][columnIndex].getWebGLIndices();

            fVertexSize = vertices.BYTES_PER_ELEMENT;
            fColorSize = colors.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fVertexSize * 3, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, fColorSize * 4, 0);
            gl.enableVertexAttribArray(a_Color);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
         }
      }
   }

   // Draw the game grid
   vertices = this.gameGrid.getWebGLCoordinates();
   colors = this.gameGrid.getWebGLColors();
   indices = this.gameGrid.getWebGLIndices();

   fVertexSize = vertices.BYTES_PER_ELEMENT;
   fColorSize = colors.BYTES_PER_ELEMENT;

   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, fVertexSize * 3, 0);
   gl.enableVertexAttribArray(a_Position);

   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

   gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, fColorSize * 4, 0);
   gl.enableVertexAttribArray(a_Color);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

   gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
}

BlockMatrix.prototype.setBlock = function(row, column, blockType) {
   this.activeBlocks[row][column] = blockType;
   switch(blockType) {
      case BlockType.IBlock:
         this.fieldBlocks[row][column].setMultiColors(this.IGradient);
         break;
      case BlockType.TBlock:
         this.fieldBlocks[row][column].setMultiColors(this.TGradient);
         break;
      case BlockType.LBlock:
         this.fieldBlocks[row][column].setMultiColors(this.LGradient);
         break;
      case BlockType.JBlock:
         this.fieldBlocks[row][column].setMultiColors(this.JGradient);
         break;
      case BlockType.SBlock:
         this.fieldBlocks[row][column].setMultiColors(this.SGradient);
         break;
      case BlockType.ZBlock:
         this.fieldBlocks[row][column].setMultiColors(this.ZGradient);
         break;
      case BlockType.OBlock:
         this.fieldBlocks[row][column].setMultiColors(this.OGradient);
         break;
      default:
         this.fieldBlocks[row][column].setColor(BlockColors.noBlock);
         break;
   }
}

BlockMatrix.prototype.getBlockType = function(row, column) {
   return this.activeBlocks[row][column];
}

BlockMatrix.prototype.dropRows = function(deletedRow) {
   var rowIndex = 0;
   var columnIndex = 0;
   for(rowIndex = deletedRow; rowIndex > 0; rowIndex--) {
      for(columnIndex = 0; columnIndex < BlockField.width; columnIndex++) {
         this.activeBlocks[rowIndex][columnIndex] = this.activeBlocks[rowIndex - 1][columnIndex];
      }
   }

   for(columnIndex = 0; columnIndex < BlockField.width; columnIndex++) {
      this.activeBlocks[0][columnIndex] = 0;
   }
}

BlockMatrix.prototype.getActiveBlocks = function() {
   return this.activeBlocks;
}

function getGradientColor(step, color1, color2) {
   var newRed = Math.round((1 - step) * color1.getRed() + step * color2.getRed());
   var newGreen = Math.round((1 - step) * color1.getGreen() + step * color2.getGreen());
   var newBlue = Math.round((1 - step) * color1.getBlue() + step * color2.getBlue());
   return new Color(newRed / 255.0, newGreen / 255.0, newBlue/ 255.0);
}