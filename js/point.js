/*
 * Name: point.js
 * 
 * Author: Jacob Hiance
 * 
 * Purpose: Creates and describes different types of coordinates 
 *          for the purpose of describing vertex data for WebGL 
 *          to help drawing specific types of objects. These 
 *          objects do not deal with normalized coordinates to
 *          allow the WebGL programmer to assign appropriate 
 *          values in a WebGL script.
 */

function Point(startFirst = 0.0, startSecond = 0.0, startThird = 0.0, startNormalization = 1.0) {

   //Initialize the coordinates of this point.
   this.first = startFirst;
   this.second = startSecond;
   this.third = startThird;
   this.normalization = startNormalization;

}

Point.prototype.setFirst = function(newFirst = 0.0) {
   this.first = newFirst;
}

Point.prototype.setSecond = function(newSecond = 0.0) {
   this.second = newSecond;
}

Point.prototype.setThird = function(newThird = 0.0) {
   this.third = newThird;
}

Point.prototype.setNormalization = function(newNormalization = 1.0) {
   this.normalization = newNormalization;
}

Point.prototype.getFirst = function() {
   return this.first;
}

Point.prototype.getSecond = function() {
   return this.second;
}

Point.prototype.getThird = function() {
   return this.third;
}

Point.prototype.toArray = function() {
   return [this.first, this.second, this.third, this.normalization];
}

Point.prototype.toString = function() {
   return "(" + 
   this.first + ", " + 
   this.second + ", " + 
   this.third + ", " + 
   this.normalization + 
   ")";
}

/*
 * A point containing the cartesian coordinates of a point in space.
 */
function BoxPoint(x = 0.0, y = 0.0, z = 0.0, normalization = 1.0) {
   Point.call(this, x, y, z, normalization);
}
BoxPoint.prototype = Object.create(Point.prototype);
BoxPoint.prototype.constructor = BoxPoint;

/*
 * Purpose: Converts this point from box/cartesian coordinates
 *          to cylindrical coordinates.
 *
 * Parameters: None
 * 
 * Returns: A CylindricalPoint describing the same
 *          position as this BoxPoint.
 */
BoxPoint.prototype.toCylindrical = function() {

   // Calculate the radius.
   var radius = Math.sqrt(this.first * this.first + this.second * this.second);

   // Calculate the angle.
   var angle = Math.atan2(this.second, this.first);

   // Return the new point.
   return new CylindricalPoint(radius, angle, this.third);
}

/*
 * Purpose: Converts this point from box/cartesian coordinates
 *          to American spherical coordinates.
 *
 * Parameters: None
 * 
 * Returns: A SphericalPoint describing the same
 *          position as this BoxPoint.
 */
BoxPoint.prototype.toSpherical = function() {

   // Calculate the radius.
   var radius = Math.sqrt(
      this.first * this.first + 
      this.second * this.second +
      this.third * this.third
   );

   // Calculate the polar angle
   var theta = Math.atan2(this.second, this.first);

   // Calculate the axial angle
   var planeRadius = Math.sqrt(this.first * this.first + this.second * this.second);
   var phi = Math.atan2(planeRadius, this.third);

   // Return the new point.
   return new SphericalPoint(radius, theta, phi);
}

/*
 * A point containing the cylindrical coordinates of a point in space.
 * The polar angle is expressed in radians and must be between 0 and
 * 2 * Math.PI radians and will be transformed to be in the appropriate
 * range if not already.
 */
function CylindricalPoint(radius = 0.0, angle = 0.0, height = 0.0, normalization = 1.0) {
   var newAngle = convertPolarAngle(angle);
   Point.call(this, radius, newAngle, height, normalization);
}
CylindricalPoint.prototype = Object.create(Point.prototype);
CylindricalPoint.prototype.constructor = CylindricalPoint;

CylindricalPoint.prototype.toBox = function() {
   // Calculate the x, y, and z coordinates
   var x = this.first * Math.cos(this.second);
   var y = this.first * Math.sin(this.second);
   var z = this.third;

   // Create and return a new BoxPoint.
   return new BoxPoint(x, y, z, this.normalization);
}

CylindricalPoint.prototype.toSpherical = function() {
   // Calculate the radius.
   var sphereRadius = Math.sqrt(
      this.first * this.first + 
      this.third * this.third
   );

   // Calculate the axial angle
   var phi = Math.atan2(this.first, this.third);

   // Return the new point.
   return new SphericalPoint(sphereRadius, this.second, phi);
}

/*
 * A point containing the American spherical coordinates of a point in space.
 * Both angles are expressed in radians.
 * The axial angle phi must be between 0 and Math.PI radians and will be transformed
 * to be in the correct range if not already.
 * The polar angle must be in the range of 0 and 2 * Math.PI and will be 
 * transformed if not already.
 */
function SphericalPoint(radius = 0.0, theta = 0.0, phi = 0.0, normalization = 1.0) {
   var newTheta = convertPolarAngle(theta);
   var newPhi = convertAxialAngle(phi);
   Point.call(this, radius, newTheta, newPhi, normalization);
}
SphericalPoint.prototype = Object.create(Point.prototype);
SphericalPoint.prototype.constructor = SphericalPoint;

SphericalPoint.prototype.toBox = function() {
   // Calculate the x, y, and z coordinates. Having a 
   // polar/planar radius will help calulate the x 
   // y coordinates.
   var planeRadius = this.first * Math.sin(this.third);
   var x = planeRadius * Math.cos(this.second);
   var y = planeRadius * Math.sin(this.second);
   var z = this.first * Math.cos(this.third);

   // Create and return a new BoxPoint.
   return new BoxPoint(x, y, z, this.normalization);
}

SphericalPoint.prototype.toCylindrical = function() {
   // Calculate the radius.
   var planeRadius = this.first * Math.sin(this.third);

   // Calculate the axial angle
   var height = this.first * Math.cos(this.third);

   // Return the new point.
   return new CylindricalPoint(planeRadius, this.second, height, this.normalization);
}

/*
* Purpose: Convert the polar angle so it is between 0 and 
*          2 * Math.PI radians.
* 
* Parameters: angle -> The angle to be converted.
* 
* Returns: newAngle -> An angle equivalent to the given angle
*                      that measures between 0 and 2 * Math.PI
*                      radians.
*/
function convertPolarAngle(angle) {

   var newAngle = angle;
   while(newAngle < 0.0 || newAngle > 2 * Math.PI) {
      if(newAngle < 0.0) {
         newAngle = newAngle + 2 * Math.PI;
	  }
	  if(newAngle > 2 * Math.PI) {
         newAngle = newAngle - 2 * Math.PI;
	  }
   }
   return newAngle;
}

/*
* Purpose: Convert the axial angle so it is between 0 and 
*          Math.PI radians.
* 
* Parameters: angle -> The angle to be converted.
* 
* Returns: newAngle -> An angle equivalent to the given angle
*                      that measures between 0 and Math.PI
*                      radians.
*/
function convertAxialAngle(angle) {

  var newAngle = angle;
  while(newAngle < 0.0 || newAngle > Math.PI) {
	 if(newAngle < 0.0) {
		newAngle = newAngle + Math.PI;
	 }
	 if(newAngle > Math.PI) {
		newAngle = newAngle - Math.PI;
	 }
  }
  return newAngle;
}