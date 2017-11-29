function main() {
   // Test converting the origin
   var zeroBoxPoint = new BoxPoint();
   var zeroCylindricalPoint = new CylindricalPoint();
   var zeroSphericalPoint = new SphericalPoint();
   
   console.log("Converting origin from Cartesian to Cylindrical and Spherical.");
   console.log(zeroBoxPoint.toString());
   console.log(zeroBoxPoint.toCylindrical().toString());
   console.log(zeroBoxPoint.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting origin from Cylindrical to Cartesian and Spherical.");
   console.log(zeroCylindricalPoint.toString());
   console.log(zeroCylindricalPoint.toBox().toString());
   console.log(zeroCylindricalPoint.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting origin from Spherical to Cartesian and Cylindrical.");
   console.log(zeroSphericalPoint.toString());
   console.log(zeroSphericalPoint.toBox().toString());
   console.log(zeroSphericalPoint.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along unit right direction
   var unitRightBox = new BoxPoint(1.0, 0.0, 0.0);
   var unitRightCylinder = new CylindricalPoint(1.0, 0.0, 0.0);
   var unitRightSphere = new SphericalPoint(1.0, 0.0, Math.PI/2);
   
   console.log("Converting unit right from Cartesian to Cylindrical and Spherical.");
   console.log(unitRightBox.toString());
   console.log(unitRightBox.toCylindrical().toString());
   console.log(unitRightBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit right from Cylindrical to Cartesian and Spherical.");
   console.log(unitRightCylinder.toString());
   console.log(unitRightCylinder.toBox().toString());
   console.log(unitRightCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit right from Spherical to Cartesian and Cylindrical.");
   console.log(unitRightSphere.toString());
   console.log(unitRightSphere.toBox().toString());
   console.log(unitRightSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along the unit forward direction
   var unitForwardBox = new BoxPoint(0.0, 1.0, 0.0);
   var unitForwardCylinder = new CylindricalPoint(1.0, Math.PI/2, 0.0);
   var unitForwardSphere = new SphericalPoint(1.0, Math.PI/2, Math.PI/2);
   
   console.log("Converting unit forward from Cartesian to Cylindrical and Spherical.");
   console.log(unitForwardBox.toString());
   console.log(unitForwardBox.toCylindrical().toString());
   console.log(unitForwardBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit forward from Cylindrical to Cartesian and Spherical.");
   console.log(unitForwardCylinder.toString());
   console.log(unitForwardCylinder.toBox().toString());
   console.log(unitForwardCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit forward from Spherical to Cartesian and Cylindrical.");
   console.log(unitForwardSphere.toString());
   console.log(unitForwardSphere.toBox().toString());
   console.log(unitForwardSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along the unit left direction
   var unitLeftBox = new BoxPoint(-1.0, 0.0, 0.0);
   var unitLeftCylinder = new CylindricalPoint(1.0, Math.PI, 0.0);
   var unitLeftSphere = new SphericalPoint(1.0, Math.PI, Math.PI/2);
   
   console.log("Converting unit left from Cartesian to Cylindrical and Spherical.");
   console.log(unitLeftBox.toString());
   console.log(unitLeftBox.toCylindrical().toString());
   console.log(unitLeftBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit left from Cylindrical to Cartesian and Spherical.");
   console.log(unitLeftCylinder.toString());
   console.log(unitLeftCylinder.toBox().toString());
   console.log(unitLeftCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit left from Spherical to Cartesian and Cylindrical.");
   console.log(unitLeftSphere.toString());
   console.log(unitLeftSphere.toBox().toString());
   console.log(unitLeftSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along the unit back direction
   var unitBackBox = new BoxPoint(0.0, -1.0, 0.0);
   var unitBackCylinder = new CylindricalPoint(1.0, 3*Math.PI/2, 0.0);
   var unitBackSphere = new SphericalPoint(1.0, 3*Math.PI/2, Math.PI/2);
   
   console.log("Converting unit back from Cartesian to Cylindrical and Spherical.");
   console.log(unitBackBox.toString());
   console.log(unitBackBox.toCylindrical().toString());
   console.log(unitBackBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit back from Cylindrical to Cartesian and Spherical.");
   console.log(unitBackCylinder.toString());
   console.log(unitBackCylinder.toBox().toString());
   console.log(unitBackCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit back from Spherical to Cartesian and Cylindrical.");
   console.log(unitBackSphere.toString());
   console.log(unitBackSphere.toBox().toString());
   console.log(unitBackSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along the unit up direction
   var unitUpBox = new BoxPoint(0.0, 0.0, 1.0);
   var unitUpCylinder = new CylindricalPoint(0.0, 0.0, 1.0);
   var unitUpSphere = new SphericalPoint(1.0, 0.0, 0.0);
   
   console.log("Converting unit up from Cartesian to Cylindrical and Spherical.");
   console.log(unitUpBox.toString());
   console.log(unitUpBox.toCylindrical().toString());
   console.log(unitUpBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit up from Cylindrical to Cartesian and Spherical.");
   console.log(unitUpCylinder.toString());
   console.log(unitUpCylinder.toBox().toString());
   console.log(unitUpCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit up from Spherical to Cartesian and Cylindrical.");
   console.log(unitUpSphere.toString());
   console.log(unitUpSphere.toBox().toString());
   console.log(unitUpSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting along the unit down direction
   var unitDownBox = new BoxPoint(0.0, 0.0, -1.0);
   var unitDownCylinder = new CylindricalPoint(0.0, 0.0, -1.0);
   var unitDownSphere = new SphericalPoint(1.0, 0.0, Math.PI);
   
   console.log("Converting unit down from Cartesian to Cylindrical and Spherical.");
   console.log(unitDownBox.toString());
   console.log(unitDownBox.toCylindrical().toString());
   console.log(unitDownBox.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit down from Cylindrical to Cartesian and Spherical.");
   console.log(unitDownCylinder.toString());
   console.log(unitDownCylinder.toBox().toString());
   console.log(unitDownCylinder.toSpherical().toString());
   console.log("\n");
   
   console.log("Converting unit down from Spherical to Cartesian and Cylindrical.");
   console.log(unitDownSphere.toString());
   console.log(unitDownSphere.toBox().toString());
   console.log(unitDownSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting the cartesian coordinate (1, 1, 1)
   var testBox = new BoxPoint(1.0, 1.0, 1.0);
   console.log(testBox.toString());
   console.log(testBox.toCylindrical().toString());
   console.log(testBox.toSpherical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting the Cylindrical coordinate (2, Math.PI/4, 2)
   var testCylinder = new CylindricalPoint(2.0, Math.PI/4, 2.0);
   console.log(testCylinder.toString());
   console.log(testCylinder.toBox().toString());
   console.log(testCylinder.toSpherical().toString());
   console.log("-------------------------------------------------------------------");
   
   // Test converting the Spherical coordinate (0.5, 5 * Math.PI / 4, Math.PI / 4)
   var testSphere = new SphericalPoint(0.5, 5 * Math.PI / 4, Math.PI / 4);
   console.log(testSphere.toString());
   console.log(testSphere.toBox().toString());
   console.log(testSphere.toCylindrical().toString());
   console.log("-------------------------------------------------------------------");
}