function GameGrid(fieldWidth = 0, fieldHeight = 0, innerRadius = 0.0, outerRadius = 0.0, gridWidth = 0.0, gridHeight = 0.0, startHeight = 0.0, meshSize = 1) {
   this.fieldWidth = fieldWidth;
   this.fieldHeight = fieldHeight;
   this.innerRadius = innerRadius;
   this.outerRadius = outerRadius;
   this.gridWidth = gridWidth;
   this.gridHeight = gridHeight;
   this.startHeight = startHeight;
   this.meshSize = meshSize;

   this.gradientColors = [
      new Color(255, 61, 69),
      new Color(255, 78, 157),
      new Color(251, 101, 252),
      new Color(162, 110, 255),
      new Color(53, 119, 252),
      new Color(18, 205, 255),
      new Color(95, 214, 159),
      new Color(145, 201, 64),
      new Color(224, 191, 67),
      new Color(254, 130, 58)
   ];

   this.points = [];
   this.coordinates = [];
   this.colorGradient = [];
   this.colors = [];
   this.indices = [];

   this.circlesPerCylinder = this.fieldHeight + 1;
   this.numberOfCircles = this.circlesPerCylinder;
   this.pointsPerCircle = this.fieldWidth * this.meshSize;
   this.numberOfPoints = this.pointsPerCircle * this.numberOfCircles;

   // Helper variables
   var rowIndex = 0;
   var columnIndex = 0;
   var pointIndex = 0;
   var colorIndex = 0;
   var circleIndex = 0;
   var indexOffset = 0;
   var outerCylinderOffset = this.pointsPerCircle * this.circlesPerCylinder;
   var angle = 0;
   var deltaAngle = (2 * Math.PI) / this.pointsPerCircle;
   var step = 0;

   // Construct the points for the inner grid
   for(rowIndex = 0; rowIndex < this.circlesPerCylinder; rowIndex++) {
      for(columnIndex = 0; columnIndex < this.pointsPerCircle; columnIndex++) {
         this.points.push(new CylindricalPoint(this.innerRadius, angle, this.startHeight + rowIndex * this.gridHeight).toBox());
         angle += deltaAngle;
      }
      angle = 0.0;
   }

   // Extract the coordinates from each point
   for(pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
      this.coordinates.push(this.points[pointIndex].getFirst());
      this.coordinates.push(this.points[pointIndex].getSecond());
      this.coordinates.push(this.points[pointIndex].getThird());
   }

   // Construct the colors for each point
   // To create a gradient effect, parameterize
   // between every point.
   for(columnIndex = 0; columnIndex < this.fieldWidth - 1; columnIndex++) {
      for(colorIndex = 0; colorIndex < this.meshSize; colorIndex++) {
         step = colorIndex / this.meshSize;
         this.colorGradient.push(getGradientColor(step, this.gradientColors[columnIndex], this.gradientColors[columnIndex + 1]));
      }
   }
   for(colorIndex = 0; colorIndex < this.meshSize; colorIndex++) {
      step = colorIndex / this.meshSize;
      this.colorGradient.push(getGradientColor(step, this.gradientColors[this.fieldWidth - 1], this.gradientColors[0]));
   }

   // For every point in the inner grid, assign one of the gradient colors
   for(rowIndex = 0; rowIndex < this.fieldHeight + 1; rowIndex++) {
      for(pointIndex = 0; pointIndex < this.pointsPerCircle; pointIndex++) {
         this.colors.push(this.colorGradient[pointIndex].getRed());
         this.colors.push(this.colorGradient[pointIndex].getGreen());
         this.colors.push(this.colorGradient[pointIndex].getBlue());
         this.colors.push(this.colorGradient[pointIndex].getAlpha());
      }
   }

   // Populate the indices array in order to allow WebGL to draw the
   // appropriate lines. Start with the circles.
   for(circleIndex = 0; circleIndex < this.numberOfCircles; circleIndex++) {
      indexOffset = circleIndex * this.pointsPerCircle;
      for(pointIndex = 0; pointIndex < this.pointsPerCircle; pointIndex++) {
         if(pointIndex === this.pointsPerCircle - 1) {
            this.indices.push(indexOffset + (this.pointsPerCircle - 1));
            this.indices.push(indexOffset);
         }else {
            this.indices.push(indexOffset + pointIndex);
            this.indices.push(indexOffset + pointIndex + 1);
         }
      }
   }

   // Draw a vertical line for each column of the game grid
   for(columnIndex = 0; columnIndex < this.fieldWidth; columnIndex++) {
      this.indices.push(columnIndex * this.meshSize);
      this.indices.push((columnIndex * this.meshSize) + ((this.circlesPerCylinder - 1) * this.pointsPerCircle));
   }
   
}

GameGrid.prototype.getPoints = function() {
   return this.points;
}

GameGrid.prototype.getCoordinates = function() {
   return this.coordinates;
}

GameGrid.prototype.getColors = function() {
   return this.colors;
}

GameGrid.prototype.getIndices = function() {
   return this.indices;
}

GameGrid.prototype.getWebGLCoordinates = function() {
   return new Float32Array(this.coordinates);
}

GameGrid.prototype.getWebGLColors = function() {
   return new Float32Array(this.colors);
}

GameGrid.prototype.getWebGLIndices = function() {
   return new Uint16Array(this.indices);
}

function getGradientColor(step, color1, color2) {
   var newRed = Math.round((1 - step) * color1.getRed() + step * color2.getRed());
   var newGreen = Math.round((1 - step) * color1.getGreen() + step * color2.getGreen());
   var newBlue = Math.round((1 - step) * color1.getBlue() + step * color2.getBlue());
   return new Color(newRed / 255.0, newGreen / 255.0, newBlue/ 255.0);
}