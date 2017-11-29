/*
 * Name: color.js
 * 
 * Author: Jacob Hiance
 * 
 * Purpose: A color object describing the color of a vertex in rgba format
 *          where each of red, gree, blue, and alpha are between 0.0 and 
 *          1.0 as to be compatible with WebGL. The default color will be 
 *          black and fully visible (alpha = 1.0).
 */
function Color(red = 0.0, green = 0.0, blue = 0.0, alpha = 1.0) {
   // Initialize the color object.
   this.red = red;
   this.green = green;
   this.blue = blue;
   this.alpha = alpha;
}

/*
 * Purpose: Set a new value for the red component.
 *          Defaults to 0.0.
 * 
 * Parameters: newRed(float) -> New red component.
 * 
 * Returns: None.
 */
Color.prototype.setRed = function(newRed = 0.0) {
   this.red = newRed;
}

/*
 * Purpose: Set a new value for the green component.
 *          Defaults to 0.0.
 * 
 * Parameters: newGreen(float) -> New green component.
 * 
 * Returns: None.
 */
Color.prototype.setGreen = function(newGreen = 0.0) {
   this.green = newGreen;
}

/*
 * Purpose: Set a new value for the blue component.
 *          Defaults to 0.0.
 * 
 * Parameters: newBlue(float) -> New blue component.
 * 
 * Returns: None.
 */
Color.prototype.setBlue = function(newBlue = 0.0) {
   this.blue = newBlue;
}

/*
 * Purpose: Set a new value for the alpha component.
 *          Defaults to 1.0.
 * 
 * Parameters: newAlpha(float) -> New alpha component.
 * 
 * Returns: None.
 */
Color.prototype.setAlpha = function(newAlpha = 1.0) {
   this.alpha = newAlpha;
}

/*
 * Purpose: Returns the value for the red component.
 * 
 * Parameters: None.
 * 
 * Returns: The red component.
 */
Color.prototype.getRed = function() {
   return this.red;
}

/*
 * Purpose: Returns the value for the green component.
 * 
 * Parameters: None.
 * 
 * Returns: The green component.
 */
Color.prototype.getGreen = function() {
   return this.green;
}

/*
 * Purpose:Return the value for the blue component.
 * 
 * Parameters: None.
 * 
 * Returns: The blue component.
 */
Color.prototype.getBlue = function() {
   return this.blue;
}

/*
 * Purpose: Returns the value for the alpha component.
 * 
 * Parameters: None.
 * 
 * Returns: The alpha component.
 */
Color.prototype.getAlpha = function() {
   return this.alpha;
}

/*
 * Purpose: Returns an array-based view of this color
 *          component.
 * 
 * Parameters: None.
 * 
 * Returns: An array containing WebGL color data.
 */
Color.prototype.toArray = function() {
   return [this.red, this.green, this.blue, this.alpha];
}

/*
 * Purpose: Returns a string-based view of this color
 *          component.
 * 
 * Parameters: None.
 * 
 * Returns: A string containing WebGL color data.
 */
Color.prototype.toString = function() {
   return "(" + 
      this.red + ", " + 
      this.green + ", " + 
      this.blue + ", " + 
      this.alpha + 
      ")";
}