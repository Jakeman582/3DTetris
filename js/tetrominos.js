function Grid(row = 0, column = 0) {
   this.row = row;
   this.column = column;
}

Grid.prototype.setRow = function(newRow = 0) {
   this.row = newRow;
}

Grid.prototype.setColumn = function(newColumn = 0) {
   this.column = newColumn;
}

Grid.prototype.getRow = function() {
   return this.row;
}

Grid.prototype.getColumn = function() {
   return this.column;
}

function Block(startRow = 0, startColumn = 0) {

   this.row = startRow;
   this.column = startColumn;
   this.type = 0;

   this.orientationIndex = 1;
   this.orientation1 = [];
   this.orientation2 = [];
   this.orientation3 = [];
   this.orientation4 = [];

   this.nextRow1 = [];
   this.nextRow2 = [];
   this.nextRow3 = [];
   this.nextRow4 = [];

   this.leftData1 = [];
   this.leftData2 = [];
   this.leftData3 = [];
   this.leftData4 = [];

   this.rightData1 = [];
   this.rightData2 = [];
   this.rightData3 = [];
   this.rightData4 = [];

   this.clockwise1 = [];
   this.clockwise2 = [];
   this.clockwise3 = [];
   this.clockwise4 = [];

   this.counterClockwise1 = [];
   this.counterClockwise2 = [];
   this.counterClockwise3 = [];
   this.counterClockwise4 = [];

   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}

Block.prototype.rotateCounterClockwise = function() {
   switch(this.orientationIndex) {
      case 1:
         this.orientationIndex = 2;
         this.currentOrientation = this.orientation2;
         this.nextRow = this.nextRow2;
         this.leftData = this.leftData2;
         this.rightData = this.rightData2;
         this.clockwise = this.clockwise2;
         this.counterClockwise = this.counterClockwise2;
         break;
      case 2:
         this.orientationIndex = 3;
         this.currentOrientation = this.orientation3;
         this.nextRow = this.nextRow3;
         this.leftData = this.leftData3;
         this.rightData = this.rightData3;
         this.clockwise = this.clockwise3;
         this.counterClockwise = this.counterClockwise3;
         break;
      case 3:
         this.orientationIndex = 4;
         this.currentOrientation = this.orientation4;
         this.nextRow = this.nextRow4;
         this.leftData = this.leftData4;
         this.rightData = this.rightData4;
         this.clockwise = this.clockwise4;
         this.counterClockwise = this.counterClockwise4;
         break;
      case 4:
         this.orientationIndex = 1;
         this.currentOrientation = this.orientation1;
         this.nextRow = this.nextRow1;
         this.leftData = this.leftData1;
         this.rightData = this.rightData1;
         this.clockwise = this.clockwise1;
         this.counterClockwise = this.counterClockwise1;
         break;
      default:
         break;
   }
}

Block.prototype.rotateClockwise = function() {
   switch(this.orientationIndex) {
      case 1:
         this.orientationIndex = 4;
         this.currentOrientation = this.orientation4;
         this.nextRow = this.nextRow4;
         this.leftData = this.leftData4;
         this.rightData = this.rightData4;
         this.clockwise = this.clockwise4;
         this.counterClockwise = this.counterClockwise4;
         break;
      case 2:
         this.orientationIndex = 1;
         this.currentOrientation = this.orientation1;
         this.nextRow = this.nextRow1;
         this.leftData = this.leftData1;
         this.rightData = this.rightData1;
         this.clockwise = this.clockwise1;
         this.counterClockwise = this.counterClockwise1;
         break;
      case 3:
         this.orientationIndex = 2;
         this.currentOrientation = this.orientation2;
         this.nextRow = this.nextRow2;
         this.leftData = this.leftData2;
         this.rightData = this.rightData2;
         this.clockwise = this.clockwise2;
         this.counterClockwise = this.counterClockwise2;
         break;
      case 4:
         this.orientationIndex = 3;
         this.currentOrientation = this.orientation3;
         this.nextRow = this.nextRow3;
         this.leftData = this.leftData3;
         this.rightData = this.rightData3;
         this.clockwise = this.clockwise3;
         this.counterClockwise = this.counterClockwise3;
         break;
      default:
         break;
   }
}

Block.prototype.setRow = function(newRow = 0) {
   this.row = newRow;
}

Block.prototype.setColumn = function(newColumn = 0) {
   this.column = newColumn;
}

Block.prototype.getRow = function() {
   return this.row;
}

Block.prototype.getColumn = function() {
   return this.column;
}

Block.prototype.getOrientation = function() {
   return this.currentOrientation;
}

Block.prototype.getNextRow = function() {
   return this.nextRow;
}

Block.prototype.getLeft = function() {
   return this.leftData;
}

Block.prototype.getRight = function() {
   return this.rightData;
}

Block.prototype.getClockwise = function() {
   return this.clockwise;
}

Block.prototype.getCounterClockwise = function() {
   return this.counterClockwise;
}

Block.prototype.reset = function() {
   this.orientationIndex = 1;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}

Block.prototype.getType = function() {
   return this.type;
}

function IBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1),
      new Grid(this.row, this.column + 2)
   ];
   this.orientation2 = [
      new Grid(this.row - 2, this.column),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 2, this.column)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1),
      new Grid(this.row + 1, this.column + 2)
   ];
   this.nextRow2 = [
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 1, this.column - 2),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 3, this.column)
   ];

   this.leftData1 = [
      new Grid(this.row, this.column - 2)
   ];
   this.leftData2 = [
      new Grid(this.row - 2, this.column - 1),
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 3)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 2, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row, this.column + 3)
   ];
   this.rightData2 = [
      new Grid(this.row - 2, this.column + 1),
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 2)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1),
      new Grid(this.row + 2, this.column + 1)
   ];

   this.clockwise1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 2, this.column)
   ];
   this.clockwise2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row, this.column + 2)
   ];
   this.clockwise3 = [
      new Grid(this.row - 2, this.column),
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row - 2, this.column),
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise2 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 2, this.column)
   ];
   this.counterClockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row, this.column + 2)
   ];

   this.type = 1;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
IBlock.prototype = Object.create(Block.prototype);
IBlock.prototype.constructor = IBlock;

function TBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 2)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 2)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.clockwise1 = [
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise2 = [
      new Grid(this.row, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row - 1, this.column)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise2 = [
      new Grid(this.row, this.column + 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row - 1, this.column)
   ];
   this.counterClockwise4 = [
      new Grid(this.row, this.column - 1)
   ];

   this.type = 2;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
TBlock.prototype = Object.create(Block.prototype);
TBlock.prototype.constructor = TBlock;

function LBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 2, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 2, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column - 2)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 2),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 2)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column + 2),
      new Grid(this.row, this.column + 2)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 2)
   ];

   this.clockwise1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.clockwise2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row - 1, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.counterClockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row - 1, this.column + 1)
   ];

   this.type = 3;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
LBlock.prototype = Object.create(Block.prototype);
LBlock.prototype.constructor = LBlock;

function JBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row - 1, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row + 2, this.column - 1),
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 2, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 2, this.column),
      new Grid(this.row, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column - 2),
      new Grid(this.row, this.column - 2)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 2)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column + 2)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 2)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 2),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.clockwise1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];

   this.type = 4;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
JBlock.prototype = Object.create(Block.prototype);
JBlock.prototype.constructor = JBlock;

function SBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row - 1, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 2, this.column - 1),
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 2, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 2)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 2),
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 2)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column + 2),
      new Grid(this.row, this.column + 1)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 2)
   ];

   this.clockwise1 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.clockwise2 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row - 1, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column - 1)
   ];
   this.clockwise4 = [
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise2 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.counterClockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column - 1)
   ];

   this.type = 5;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
SBlock.prototype = Object.create(Block.prototype);
SBlock.prototype.constructor = SBlock;

function ZBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.orientation4 = [
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row + 2, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 2, this.column + 1)
   ];
   this.nextRow4 = [
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column - 2),
      new Grid(this.row, this.column - 1)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 2)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.leftData4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 2)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 2)
   ];
   this.rightData4 = [
      new Grid(this.row - 1, this.column + 2),
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.clockwise1 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row + 1, this.column)
   ];
   this.clockwise2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];
   this.counterClockwise2 = [
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.counterClockwise3 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row - 1, this.column + 1)
   ];
   this.counterClockwise4 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column)
   ];

   this.type = 6;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
ZBlock.prototype = Object.create(Block.prototype);
ZBlock.prototype.constructor = ZBlock;

function OBlock(startRow = 0, startColumn = 0) {

   Block.call(this, startRow, startColumn);

   this.orientation1 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column),
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1)
   ];
   this.orientation2 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1),
      new Grid(this.row - 1, this.column),
      new Grid(this.row, this.column)
   ];
   this.orientation3 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column)
   ];
   this.orientation4 = [
      new Grid(this.row, this.column),
      new Grid(this.row + 1, this.column),
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];

   this.nextRow1 = [
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.nextRow2 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.nextRow3 = [
      new Grid(this.row + 2, this.column - 1),
      new Grid(this.row + 2, this.column)
   ];
   this.nextRow4 = [
      new Grid(this.row + 2, this.column),
      new Grid(this.row + 2, this.column + 1)
   ];

   this.leftData1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1)
   ];
   this.leftData2 = [
      new Grid(this.row - 1, this.column - 2),
      new Grid(this.row, this.column - 2)
   ];
   this.leftData3 = [
      new Grid(this.row, this.column - 2),
      new Grid(this.row + 1, this.column - 2)
   ];
   this.leftData4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.rightData1 = [
      new Grid(this.row - 1, this.column + 2),
      new Grid(this.row, this.column + 2)
   ];
   this.rightData2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1)
   ];
   this.rightData3 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.rightData4 = [
      new Grid(this.row, this.column + 2),
      new Grid(this.row + 1, this.column + 2)
   ];

   this.clockwise1 = [
      new Grid(this.row + 1, this.column),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.clockwise2 = [
      new Grid(this.row - 1, this.column + 1),
      new Grid(this.row, this.column + 1)
   ];
   this.clockwise3 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row - 1, this.column)
   ];
   this.clockwise4 = [
      new Grid(this.row, this.column - 1),
      new Grid(this.row + 1, this.column - 1)
   ];

   this.counterClockwise1 = [
      new Grid(this.row - 1, this.column - 1),
      new Grid(this.row, this.column - 1)
   ];
   this.counterClockwise2 = [
      new Grid(this.row + 1, this.column - 1),
      new Grid(this.row + 1, this.column)
   ];
   this.counterClockwise3 = [
      new Grid(this.row, this.column + 1),
      new Grid(this.row + 1, this.column + 1)
   ];
   this.counterClockwise4 = [
      new Grid(this.row - 1, this.column),
      new Grid(this.row - 1, this.column + 1)
   ];

   this.type = 7;
   this.currentOrientation = this.orientation1;
   this.nextRow = this.nextRow1;
   this.leftData = this.leftData1;
   this.rightData = this.rightData1;
   this.clockwise = this.clockwise1;
   this.counterClockwise = this.counterClockwise1;
}
OBlock.prototype = Object.create(Block.prototype);
OBlock.prototype.constructor = OBlock;