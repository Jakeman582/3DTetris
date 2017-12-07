/*
 * Name: cylindrical_block.js
 * 
 * Author: Jacob Hiance
 * 
 * Purpose: Creates blocks that result from taking parts of a hollowed-out
 *          cylinder. As a result, these blocks have rounded outer edges 
 *          and rounded inner edges. The enclosing cylinder will be 
 *          centered at the origin, and the bottom face will be 
 *          embedded in the x-y plane (z = 0). The first points will be 
 *          created such that they lie on the positive x axis.
 * 
 *          This block is intended to be compatible with 
 *          WebGL. Each object will provide methods returning 
 *          array indices to be used for gl.drawElements().
 */

/*
 * Purpose: Describe a block with rounded edges, like removing the
 *          center of a cylinder and taking what is left between 
 *          two given angles.
 *          
 * 
 * Parameters: startRadius(float) ---> The distance from the inner edge to the center 
 *                                     of the enclosing cylinder.
 *             width(float) ---------> The distance from the outer edge to the inner edge 
 *                                     of the cylindrical block.
 *             startAngle(float) ----> Describes the angle at which the block will start 
 *                                     being drawn.
 *             blockLength(float) ---> How large of an angle the block takes up.
 *             startHeight(float) ---> The base level where the block will start to be drawn.
 *             height(float) --------> Describes the height of the block.
 *             meshSize(int) --------> Describes in how many intervals the parameter angle 
 *                                     is to be divided. Each rounded edge will have 
 *                                     (meshSize + 1) points.
 *             normalization(float) -> The value of the fourth parameter to be used when
 *                                     constructing normalized coordinates.
 *             color(Color) ---------> The color for this block.
 */
function CylindricalBlock(startRadius = 0.0, width = 0.0, startAngle = 0.0, blockLength = 0.0, startHeight = 0.0, height = 0.0, meshSize = 0, normalization = 1.0, color = new Color(0.0, 0.0, 0.0, 1.0)) {

   // Initialze helper variables.
   var index = 0;
   var arrayOffset = 0;
   var coordinatesPerPoint = 3;
   var deltaAngle = 0.0;
   var currentAngle = 0.0;
   var startPoint = null;
   var endPoint = null;
   var currentCoordinates = [];
   var bottomFace = [];
   var topFace = [];

   // Initialize the properties of this block object.
   this.startRadius = startRadius;
   this.width = width;
   this.startAngle = startAngle;
   this.blockLength = blockLength;
   this.startHeight = startHeight;
   this.height = height;
   this.meshSize = meshSize;
   this.normalization = normalization;
   this.color = color;

   // Calculate the number of points needed to describe
   // this block. There are 4 rounded edges, each with
   // (meshSize + 1) points.
   this.pointsPerRoundedFace = 2 * (this.meshSize + 1);
   this.numberOfPoints = 2 * this.pointsPerRoundedFace;
   this.cornerPoints = [
      0,
      1,
      this.meshSize * 2,
      this.meshSize * 2 + 1,
      this.pointsPerRoundedFace,
      this.pointsPerRoundedFace + 1,
      this.pointsPerRoundedFace + (this.meshSize * 2),
      this.pointsPerRoundedFace + (this.meshSize * 2) + 1
   ];

   // Create an array containing the points used to
   // describe this block and the indices used to 
   // determine which triangles are drawn. Store colors.
   this.points = [];
   this.coordinates = [];
   this.colors = [];
   this.triangles = [];

   // Calculate the angle width to use for construction.
   deltaAngle = this.blockLength / this.meshSize;

   // Start creating the bottom face.
   for(index = 0; index <= this.meshSize; index++) {
      currentAngle = this.startAngle + (index * deltaAngle);
      startPoint = new CylindricalPoint(this.startRadius, currentAngle, this.startHeight, this.normalization);
      endPoint = new CylindricalPoint(this.startRadius + this.width, currentAngle, this.startHeight, this.normalization);
      this.points.push(startPoint.toBox());
      this.points.push(endPoint.toBox());
   }

   // Start creating the top face. The height of these
   // points should be this.height. Extract the 4 corner points so 
   // the side faces can be easily drawn.
   for(index = 0; index <= this.meshSize; index++) {
      currentAngle = this.startAngle + (index * deltaAngle);
      startPoint = new CylindricalPoint(this.startRadius, currentAngle, this.startHeight + this.height, this.normalization);
      endPoint = new CylindricalPoint(this.startRadius + this.width, currentAngle, this.startHeight + this.height, this.normalization);
      this.points.push(startPoint.toBox());
      this.points.push(endPoint.toBox());
   }

   // Populate the array of coordinates from each point.
   for(index = 0; index < this.numberOfPoints; index++) {
      currentCoordinates = this.points[index].toArray();
      this.coordinates.push(currentCoordinates[0]);
      this.coordinates.push(currentCoordinates[1]);
      this.coordinates.push(currentCoordinates[2]);
   }

   // Populate the array of colors.
   for(index = 0; index < this.numberOfPoints; index++) {
      this.colors.push(this.color.getRed());
      this.colors.push(this.color.getGreen());
      this.colors.push(this.color.getBlue());
      this.colors.push(this.color.getAlpha());
   }

   // Create an array of indices that will be used to 
   // determine how triangles of the face are to be 
   // drawn. Start with the bottom face.
   for(index = 0; index < this.meshSize; index++) {
      // First triangle
      this.triangles.push(2 * index);
      this.triangles.push(2 * index + 1);
      this.triangles.push(2 * index + 2);
      // Second triangle
      this.triangles.push(2 * index + 1);
      this.triangles.push(2 * index + 2);
      this.triangles.push(2 * index + 3);
   }

   // Proceed to draw the top face.
   for(index = 0; index < this.meshSize; index++) {
      // Get points from the second half of the 
      // points array.
      arrayOffset = this.pointsPerRoundedFace + (2 * index);
      // First triangle
      this.triangles.push(arrayOffset);
      this.triangles.push(arrayOffset + 1);
      this.triangles.push(arrayOffset + 2);
      // Second triangle
      this.triangles.push(arrayOffset + 1);
      this.triangles.push(arrayOffset + 2);
      this.triangles.push(arrayOffset + 3);
   }

   // Proceed to draw the back face
   for(index = 0; index < this.meshSize; index++) {
      // Get points from the second half of the 
      // points array.
      arrayOffset = this.pointsPerRoundedFace + (2 * index);
      // First triangle
      this.triangles.push(2 * index);
      this.triangles.push(arrayOffset);
      this.triangles.push(2 * index + 2);
      // Second triangle
      this.triangles.push(arrayOffset);
      this.triangles.push(2 * index + 2);
      this.triangles.push(arrayOffset + 2);
   }

   // Proceed to draw the front face
   for(index = 0; index < this.meshSize; index++) {
      // Get points from the second half of the 
      // points array.
      arrayOffset = this.pointsPerRoundedFace + (2 * index);
      // First triangle
      this.triangles.push(2 * index + 1);
      this.triangles.push(arrayOffset + 1);
      this.triangles.push(2 * index + 3);
      // Second triangle
      this.triangles.push(arrayOffset + 1);
      this.triangles.push(2 * index + 3);
      this.triangles.push(arrayOffset + 3);
   }

   // Proceed to draw the left face
   this.triangles.push(0);
   this.triangles.push(this.pointsPerRoundedFace);
   this.triangles.push(1);
   this.triangles.push(this.pointsPerRoundedFace);
   this.triangles.push(1);
   this.triangles.push(this.pointsPerRoundedFace + 1);

   // Proceed to draw the right, and final, face
   this.triangles.push(this.pointsPerRoundedFace - 2);
   this.triangles.push(this.numberOfPoints - 2);
   this.triangles.push(this.pointsPerRoundedFace - 1);
   this.triangles.push(this.numberOfPoints - 2);
   this.triangles.push(this.pointsPerRoundedFace - 1);
   this.triangles.push(this.numberOfPoints - 1);
   
}

// Declare functions common to every CylindricalBlock.
CylindricalBlock.prototype.getPoints = function() {
   return this.points;
}

CylindricalBlock.prototype.getCoordinates = function() {
   return this.coordinates;
}

CylindricalBlock.prototype.getColors = function() {
   return this.colors;
}

CylindricalBlock.prototype.getIndices = function() {
   return this.triangles;
}

CylindricalBlock.prototype.getWebGLCoordinates = function() {
   return new Float32Array(this.coordinates);
}

CylindricalBlock.prototype.getWebGLColors = function() {
   return new Float32Array(this.colors);
}

CylindricalBlock.prototype.getWebGLIndices = function() {
   return new Uint16Array(this.triangles);
}

CylindricalBlock.prototype.setColor = function(newColor) {
   var index = 0;
   this.colors = [];
   for(index = 0; index < this.numberOfPoints; index++) {
      this.colors.push(newColor.getRed());
      this.colors.push(newColor.getGreen());
      this.colors.push(newColor.getBlue());
      this.colors.push(newColor.getAlpha());
   }
}

CylindricalBlock.prototype.setCornerColors = function(newColor) {
   var index = 0;
   for(index of this.cornerPoints) {
      this.colors[4 * index + 0] = newColor.getRed();
      this.colors[4 * index + 1] = newColor.getGreen();
      this.colors[4 * index + 2] = newColor.getBlue();
      this.colors[4 * index + 3] = newColor.getAlpha();
   }
}