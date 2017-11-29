/*
 * Name: vertex.js
 * 
 * Author: Jacob Hiance
 * 
 * Purpose: Describes an object containing point and color data
 *          for use in WebGL applications. When constructing a new
 *          vertex, it will default to have coordinates at the 
 *          origin and will be black and fully visible.
 */
function Vertex(vertexPoint = new BoxPoint(0.0, 0.0, 0.0, 1.0), vertexColor = new Color(0.0, 0.0, 0.0, 1.0)) {

   this.vertexPoint = vertexPoint;
   this.vertexColor = vertexColor;

}