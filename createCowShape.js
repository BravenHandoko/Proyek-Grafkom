function generateTorus(x, y, z, c1, c2, c3, radius1, radius2, segments1, segments2, rotationX, rotationY, rotationZ) {
    var vertices = [];
    var colors = [];
  
    for (var i = 0; i <= segments1; i++) {
        var u = (2 * Math.PI * i) / segments1;
  
        for (var j = 0; j <= segments2; j++) {
            var v = (2 * Math.PI * j) / segments2;
  
            // Calculate vertex position relative to torus's center
            var torusCenterX = x + ((radius1 + radius2 * Math.cos(v)) * Math.cos(u));
            var torusCenterY = y + ((radius1 + radius2 * Math.cos(v)) * Math.sin(u));
            var torusCenterZ = z + (radius2 * Math.sin(v));
  
            // Apply rotations relative to the torus's center
            var rotatedX = torusCenterX - x;
            var rotatedY = torusCenterY - y;
            var rotatedZ = torusCenterZ - z;
  
            // Rotate around X axis
            var tempY = rotatedY;
            rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
            rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
  
            // Rotate around Y axis
            var tempX = rotatedX;
            rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
            rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
  
            // Rotate around Z axis
            var tempX2 = rotatedX;
            rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
            rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
  
            // Translate the vertex back to its original position relative to the torus's center
            rotatedX += x;
            rotatedY += y;
            rotatedZ += z;
  
            vertices.push(rotatedX, rotatedY, rotatedZ);
          
            colors.push(c1,c2,c3);
        }
    }
  
    var faces = [];
    for (var i = 0; i < segments1; i++) {
        for (var j = 0; j < segments2; j++) {
            var index = i * (segments2 + 1) + j;
            var nextIndex = index + segments2 + 1;
  
            faces.push(index, nextIndex, index + 1);
            faces.push(nextIndex, nextIndex + 1, index + 1);
        }
    }
  
    return { vertices: vertices, colors: colors, faces: faces };
  }
  
  function drawBezierCurve(GL, shaderProgram, points, segments) {
    var vertices = [];
    
    // Calculate Bezier curve points
    for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var point = calculateBezierPoint(points, t);
        vertices.push(point[0], point[1]-0.5, point[2]);
    }
    
    // Create buffer for the curve vertices
    var curveBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, curveBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
    
    // Specify vertex attributes
    var positionAttribLocation = GL.getAttribLocation(shaderProgram, "position");
    GL.vertexAttribPointer(positionAttribLocation, 3, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray(positionAttribLocation);
    
    // Draw the curve
    GL.drawArrays(GL.LINE_STRIP, 0, vertices.length / 3);
    
    // Clean up
    GL.deleteBuffer(curveBuffer);
  }
  
  function calculateBezierPoint(points, t) {
    var n = points.length - 1;
    var result = [0, 0, 0];
    for (var i = 0; i <= n; i++) {
        var coefficient = binomialCoefficient(n, i) * Math.pow((1 - t), n - i) * Math.pow(t, i);
        result[0] += coefficient * points[i][0];
        result[1] += coefficient * points[i][1];
        result[2] += coefficient * points[i][2];
    }
    return result;
  }
  
  function binomialCoefficient(n, k) {
    if (k === 0 || k === n) return 1;
    if (k === 1 || k === n - 1) return n;
    var numerator = 1;
    var denominator = 1;
    for (var i = 1; i <= k; i++) {
        numerator *= (n - i + 1);
        denominator *= i;
    }
    return numerator / denominator;
  }
  
  
  
  function generateCurvedTriangle(x, y, z, c1, c2, c3, radius1, radius2, segments1, segments2) {
      var vertices = [];
      var colors = [];
    
      for (var i = 0; i <= segments1; i++) {
          var u = (2 * Math.PI * i) / segments1;
    
          for (var j = 0; j <= segments2; j++) {
              var v = (2 * Math.PI * j) / segments2;
    
              var xCoord = x + ((radius1 + radius2 * Math.cos(u)) * Math.cos(v));
              var yCoord = y + ((radius1 + radius2 * Math.sin(u)) * Math.sin(u));
              var zCoord = z + (radius2 * Math.sin(v));
    
              vertices.push(xCoord, yCoord, zCoord);
    
              colors.push(c1,c2,c3);
          }
      }
    
      var faces = [];
      for (var i = 0; i < segments1; i++) {
          for (var j = 0; j < segments2; j++) {
              var index = i * (segments2 + 1) + j;
              var nextIndex = index + segments2 + 1;
    
              faces.push(index, nextIndex, index + 1);
              faces.push(nextIndex, nextIndex + 1, index + 1);
          }
      }
    
      return { vertices: vertices, colors: colors, faces: faces };
  }
  
  
  function generateSphere(x, y, z, c1, c2, c3, radius, segments) {
      var vertices = [];
      var colors = [];
  
      var ball_color = [
          [c1,c2,c3]
      ];
    
      for (var i = 0; i <= segments; i++) {
          var latAngle = Math.PI * (-0.5 + (i / segments));
          var sinLat = Math.sin(latAngle);
          var cosLat = Math.cos(latAngle);
    
          for (var j = 0; j <= segments; j++) {
              var lonAngle = 2 * Math.PI * (j / segments);
              var sinLon = Math.sin(lonAngle);
              var cosLon = Math.cos(lonAngle);
    
              var xCoord = cosLon * cosLat;
              var yCoord = sinLon * cosLat;
              var zCoord = sinLat;
    
              var vertexX = x + radius * xCoord;
              var vertexY = y + radius * yCoord;
              var vertexZ = z + radius * zCoord;
    
              vertices.push(vertexX, vertexY, vertexZ -0.5);
    
              var colorIndex = j % ball_color.length;
              colors = colors.concat(ball_color[colorIndex]);
          }
      }
    
      var ball_faces = [];
      for (var i = 0; i < segments; i++) {
          for (var j = 0; j < segments; j++) {
              var index = i * (segments + 1) + j;
              var nextIndex = index + segments + 1;
    
              ball_faces.push(index, nextIndex, index + 1);
              ball_faces.push(nextIndex, nextIndex + 1, index + 1);
          }
      }
    
      return { vertices: vertices, colors: colors, faces: ball_faces };
    }
    
    function generateTube(x, y, z, c1, c2, c3, height, bottomRadius, topRadius, segments, rotationX, rotationY, rotationZ) {
        var angle_increment = (2 * Math.PI) / segments;
        var vertices = [];
        var colors = [];
        var faces = [];
        
        for (var i = 0; i < segments; i++) {
            var angle1 = i * angle_increment;
            var angle2 = (i + 1) * angle_increment;
    
            // Bottom vertices
            var bottomX1 = x + bottomRadius * Math.cos(angle1);
            var bottomY1 = y;
            var bottomZ1 = z + bottomRadius * Math.sin(angle1);
    
            var bottomX2 = x + bottomRadius * Math.cos(angle2);
            var bottomY2 = y;
            var bottomZ2 = z + bottomRadius * Math.sin(angle2);
    
            // Top vertices
            var topX1 = x + topRadius * Math.cos(angle1);
            var topY1 = y + height;
            var topZ1 = z + topRadius * Math.sin(angle1);
    
            var topX2 = x + topRadius * Math.cos(angle2);
            var topY2 = y + height;
            var topZ2 = z + topRadius * Math.sin(angle2);
    
            // Apply rotations
            var rotatedBottom1 = rotatePoint(bottomX1, bottomY1, bottomZ1, rotationX, rotationY, rotationZ, x, y, z);
            var rotatedBottom2 = rotatePoint(bottomX2, bottomY2, bottomZ2, rotationX, rotationY, rotationZ, x, y, z);
            var rotatedTop1 = rotatePoint(topX1, topY1, topZ1, rotationX, rotationY, rotationZ, x, y, z);
            var rotatedTop2 = rotatePoint(topX2, topY2, topZ2, rotationX, rotationY, rotationZ, x, y, z);
    
            // Push rotated vertices to array
            vertices.push(rotatedBottom1[0], rotatedBottom1[1], rotatedBottom1[2]);
            vertices.push(rotatedBottom2[0], rotatedBottom2[1], rotatedBottom2[2]);
            vertices.push(rotatedTop1[0], rotatedTop1[1], rotatedTop1[2]);
            vertices.push(rotatedTop2[0], rotatedTop2[1], rotatedTop2[2]);
    
            // Colors for all vertices
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
            colors.push(c1, c2, c3);
    
            // Faces for this segment
            var baseIndex = i * 4;
            faces.push(baseIndex, baseIndex + 1, baseIndex + 2); // Triangle 1
            faces.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // Triangle 2
        }
    
        // Closing faces for top and bottom circles
        for (var i = 0; i < segments - 1; i++) {
            // Bottom circle
            faces.push(i * 4, (i + 1) * 4, vertices.length / 3 - 2);
            // Top circle
            faces.push(i * 4 + 2, (i + 1) * 4 + 2, vertices.length / 3 - 1);
        }
    
        // Close the last segment with the first one
        faces.push((segments - 1) * 4, 0, vertices.length / 3 - 2);
        faces.push((segments - 1) * 4 + 2, 2, vertices.length / 3 - 1);
    
        return { vertices: vertices, colors: colors, faces: faces };
    }

    function generateTube1(x, y, z, c1, c2, c3, height, bottomRadius, topRadius, segments, rotationX, rotationY, rotationZ) {
        var angle_increment = (2 * Math.PI) / segments;
        var vertices = [];
        var colors = [];
        var faces = [];
      
        for (var i = 0; i < segments; i++) {
            var angle1 = i * angle_increment;
            var angle2 = (i + 1) * angle_increment;
      
            // Bottom vertices
            var bottomVertex1X = x + bottomRadius * Math.cos(angle1);
            var bottomVertex1Y = y;
            var bottomVertex1Z = z + bottomRadius * Math.sin(angle1);
      
            var bottomVertex2X = x + bottomRadius * Math.cos(angle2);
            var bottomVertex2Y = y;
            var bottomVertex2Z = z + bottomRadius * Math.sin(angle2);
      
            // Top vertices
            var topVertex1X = x + topRadius * Math.cos(angle1);
            var topVertex1Y = y + height;
            var topVertex1Z = z + topRadius * Math.sin(angle1);
      
            var topVertex2X = x + topRadius * Math.cos(angle2);
            var topVertex2Y = y + height;
            var topVertex2Z = z + topRadius * Math.sin(angle2);
      
            // Apply rotations
            var rotatedBottomVertex1X = bottomVertex1X - x;
            var rotatedBottomVertex1Y = bottomVertex1Y - y;
            var rotatedBottomVertex1Z = bottomVertex1Z - z;
      
            var rotatedBottomVertex2X = bottomVertex2X - x;
            var rotatedBottomVertex2Y = bottomVertex2Y - y;
            var rotatedBottomVertex2Z = bottomVertex2Z - z;
      
            var rotatedTopVertex1X = topVertex1X - x;
            var rotatedTopVertex1Y = topVertex1Y - y;
            var rotatedTopVertex1Z = topVertex1Z - z;
      
            var rotatedTopVertex2X = topVertex2X - x;
            var rotatedTopVertex2Y = topVertex2Y - y;
            var rotatedTopVertex2Z = topVertex2Z - z;
      
            // Rotate around X axis
            var tempBottom1Y = rotatedBottomVertex1Y;
            rotatedBottomVertex1Y = tempBottom1Y * Math.cos(rotationX) - rotatedBottomVertex1Z * Math.sin(rotationX);
            rotatedBottomVertex1Z = tempBottom1Y * Math.sin(rotationX) + rotatedBottomVertex1Z * Math.cos(rotationX);
      
            var tempBottom2Y = rotatedBottomVertex2Y;
            rotatedBottomVertex2Y = tempBottom2Y * Math.cos(rotationX) - rotatedBottomVertex2Z * Math.sin(rotationX);
            rotatedBottomVertex2Z = tempBottom2Y * Math.sin(rotationX) + rotatedBottomVertex2Z * Math.cos(rotationX);
      
            var tempTop1Y = rotatedTopVertex1Y;
            rotatedTopVertex1Y = tempTop1Y * Math.cos(rotationX) - rotatedTopVertex1Z * Math.sin(rotationX);
            rotatedTopVertex1Z = tempTop1Y * Math.sin(rotationX) + rotatedTopVertex1Z * Math.cos(rotationX);
      
            var tempTop2Y = rotatedTopVertex2Y;
            rotatedTopVertex2Y = tempTop2Y * Math.cos(rotationX) - rotatedTopVertex2Z * Math.sin(rotationX);
            rotatedTopVertex2Z = tempTop2Y * Math.sin(rotationX) + rotatedTopVertex2Z * Math.cos(rotationX);
      
            // Rotate around Y axis
            var tempBottom1X = rotatedBottomVertex1X;
            rotatedBottomVertex1X = tempBottom1X * Math.cos(rotationY) - rotatedBottomVertex1Z * Math.sin(rotationY);
            rotatedBottomVertex1Z = -tempBottom1X * Math.sin(rotationY) + rotatedBottomVertex1Z * Math.cos(rotationY);
      
            var tempBottom2X = rotatedBottomVertex2X;
            rotatedBottomVertex2X = tempBottom2X * Math.cos(rotationY) - rotatedBottomVertex2Z * Math.sin(rotationY);
            rotatedBottomVertex2Z = -tempBottom2X * Math.sin(rotationY) + rotatedBottomVertex2Z * Math.cos(rotationY);
      
            var tempTop1X = rotatedTopVertex1X;
            rotatedTopVertex1X = tempTop1X * Math.cos(rotationY) - rotatedTopVertex1Z * Math.sin(rotationY);
            rotatedTopVertex1Z = -tempTop1X * Math.sin(rotationY) + rotatedTopVertex1Z * Math.cos(rotationY);
      
            var tempTop2X = rotatedTopVertex2X;
            rotatedTopVertex2X = tempTop2X * Math.cos(rotationY) - rotatedTopVertex2Z * Math.sin(rotationY);
            rotatedTopVertex2Z = -tempTop2X * Math.sin(rotationY) + rotatedTopVertex2Z * Math.cos(rotationY);
      
            // Rotate around Z axis
            var tempBottom1X2 = rotatedBottomVertex1X;
            rotatedBottomVertex1X = tempBottom1X2 * Math.cos(rotationZ) - rotatedBottomVertex1Y * Math.sin(rotationZ);
            rotatedBottomVertex1Y = tempBottom1X2 * Math.sin(rotationZ) + rotatedBottomVertex1Y * Math.cos(rotationZ);
      
            var tempBottom2X2 = rotatedBottomVertex2X;
            rotatedBottomVertex2X = tempBottom2X2 * Math.cos(rotationZ) - rotatedBottomVertex2Y * Math.sin(rotationZ);
            rotatedBottomVertex2Y = tempBottom2X2 * Math.sin(rotationZ) + rotatedBottomVertex2Y * Math.cos(rotationZ);
      
            var tempTop1X2 = rotatedTopVertex1X;
            rotatedTopVertex1X = tempTop1X2 * Math.cos(rotationZ) - rotatedTopVertex1Y * Math.sin(rotationZ);
            rotatedTopVertex1Y = tempTop1X2 * Math.sin(rotationZ) + rotatedTopVertex1Y * Math.cos(rotationZ);
      
            var tempTop2X2 = rotatedTopVertex2X;
            rotatedTopVertex2X = tempTop2X2 * Math.cos(rotationZ) - rotatedTopVertex2Y * Math.sin(rotationZ);
            rotatedTopVertex2Y = tempTop2X2 * Math.sin(rotationZ) + rotatedTopVertex2Y * Math.cos(rotationZ);
      
            // Translate the vertices back to their original position relative to the tube's center
            rotatedBottomVertex1X += x;
            rotatedBottomVertex1Y += y;
            rotatedBottomVertex1Z += z;
      
            rotatedBottomVertex2X += x;
            rotatedBottomVertex2Y += y;
            rotatedBottomVertex2Z += z;
      
            rotatedTopVertex1X += x;
            rotatedTopVertex1Y += y;
            rotatedTopVertex1Z += z;
      
            rotatedTopVertex2X += x;
            rotatedTopVertex2Y += y;
            rotatedTopVertex2Z += z;
      
            // Push vertices and colors
            vertices.push(
                rotatedBottomVertex1X, rotatedBottomVertex1Y, rotatedBottomVertex1Z,
                rotatedBottomVertex2X, rotatedBottomVertex2Y, rotatedBottomVertex2Z,
                rotatedTopVertex1X, rotatedTopVertex1Y, rotatedTopVertex1Z,
                rotatedTopVertex2X, rotatedTopVertex2Y, rotatedTopVertex2Z
            );
      
            colors.push(
                c1, c2, c3,
                c1, c2, c3,
                c1, c2, c3,
                c1, c2, c3
            );
      
            // Faces for this segment
            var baseIndex = i * 4;
            faces.push(baseIndex, baseIndex + 1, baseIndex + 2); // Triangle 1
            faces.push(baseIndex + 1, baseIndex + 3, baseIndex + 2); // Triangle 2
        }
      
        // Closing faces for top and bottom circles
        for (var i = 0; i < segments - 1; i++) {
            // Bottom circle
            faces.push(i * 4, (i + 1) * 4, vertices.length / 3 - 2);
            // Top circle
            faces.push(i * 4 + 2, (i + 1) * 4 + 2, vertices.length / 3 - 1);
        }
      
        // Close the last segment with the first one
        faces.push((segments - 1) * 4, 0, vertices.length / 3 - 2);
        faces.push((segments - 1) * 4 + 2, 2, vertices.length / 3 - 1);
      
        return { vertices: vertices, colors: colors, faces: faces };
    }
    
    // Function to rotate a point around a specified axis
    function rotatePoint(x, y, z, rx, ry, rz, cx, cy, cz) {
        var cosrx = Math.cos(rx);
        var sinrx = Math.sin(rx);
        var cosry = Math.cos(ry);
        var sinry = Math.sin(ry);
        var cosrz = Math.cos(rz);
        var sinrz = Math.sin(rz);
    
        var translatedX = x - cx;
        var translatedY = y - cy;
        var translatedZ = z - cz;
    
        // Rotate around X axis
        var tempY = translatedY;
        translatedY = tempY * cosrx - translatedZ * sinrx;
        translatedZ = tempY * sinrx + translatedZ * cosrx;
    
        // Rotate around Y axis
        var tempX = translatedX;
        translatedX = tempX * cosry - translatedZ * sinry;
        translatedZ = -tempX * sinry + translatedZ * cosry;
    
        // Rotate around Z axis
        var tempX2 = translatedX;
        translatedX = tempX2 * cosrz - translatedY * sinrz;
        translatedY = tempX2 * sinrz + translatedY * cosrz;
    
        // Translate the point back to its original position
        translatedX += cx;
        translatedY += cy;
        translatedZ += cz;
    
        return [translatedX, translatedY, translatedZ];
    }
    
    
    function generateEllipsoid(x, y, z, a, b, c, c1, c2, c3, segments) {
      var vertices = [];
      var colors = [];
    
      for (var i = 0; i <= segments; i++) {
        var u = -Math.PI + (2 * Math.PI * i) / segments;
    
        for (var j = 0; j <= segments; j++) {
          var v = -Math.PI + (2 * Math.PI * j) / segments;
    
          var xCoord = x + (a * Math.cos(v) * Math.cos(u));
          var yCoord = y + (b * Math.cos(v) * Math.sin(u));
          var zCoord = z + (c * Math.sin(v));
    
          vertices.push(xCoord, yCoord, zCoord);
    
          colors.push(c1,c2,c3);
        }
      }
    
      var faces = [];
      for (var i = 0; i < segments; i++) {
        for (var j = 0; j < segments; j++) {
          var index = i * (segments + 1) + j;
          var nextIndex = index + segments + 1;
    
          faces.push(index, nextIndex, index + 1);
          faces.push(nextIndex, nextIndex + 1, index + 1);
        }
      }
    
      return { vertices: vertices, colors: colors, faces: faces };
    }

    function generateHyperboloid(x, y, z, a, b, c, r, g, bl, segments, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
    
        for (var i = 0; i <= segments; i++) {
            var u = -Math.PI + (2 * Math.PI * i) / segments;
    
            for (var j = 0; j <= segments; j++) {
                var v = -Math.PI / 3 + ((Math.PI / 1.5) * j) / segments;
    
                var xCoord = x + (a / Math.cos(v)) * Math.cos(u);
                var yCoord = y + (b / Math.cos(v)) * Math.sin(u);
                var zCoord = z + (c * Math.tan(v));
    
                // Apply rotations
                var rotatedX = xCoord - x;
                var rotatedY = yCoord - y;
                var rotatedZ = zCoord - z;
    
                // Rotate around X axis
                var tempY = rotatedY;
                rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
    
                // Rotate around Y axis
                var tempX = rotatedX;
                rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
    
                // Rotate around Z axis
                var tempX2 = rotatedX;
                rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
                rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
    
                // Translate the vertex back to its original position
                rotatedX += x;
                rotatedY += y;
                rotatedZ += z;
    
                vertices.push(rotatedX, rotatedY, rotatedZ);
                colors.push(r, g, bl);
            }
        }
    
        var faces = [];
        for (var i = 0; i < segments; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
        return { vertices: vertices, colors: colors, faces: faces };
    }

    function generateHalfTorus(x, y, z, c1, c2, c3, radius1, radius2, segments1, segments2, rotationX, rotationY, rotationZ, halfLength) {
        var vertices = [];
        var colors = [];
    
        for (var i = 0; i <= segments1; i++) {
            var u = (Math.PI * i) / segments1;
    
            for (var j = 0; j <= segments2; j++) {
                var v = (2 * Math.PI * j) / segments2;
    
                // Calculate vertex position relative to torus's center
                var torusCenterX = x + ((radius1 + radius2 * Math.cos(v)) * Math.cos(u));
                var torusCenterY = y + ((radius1 + radius2 * Math.cos(v)) * Math.sin(u));
                var torusCenterZ = z + (radius2 * Math.sin(v));
    
                // Apply rotations relative to the torus's center
                var rotatedX = torusCenterX - x;
                var rotatedY = torusCenterY - y;
                var rotatedZ = torusCenterZ - z;
    
                // Rotate around X axis
                var tempY = rotatedY;
                rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
    
                // Rotate around Y axis
                var tempX = rotatedX;
                rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
    
                // Rotate around Z axis
                var tempX2 = rotatedX;
                rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
                rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
    
                // Translate the vertex back to its original position relative to the torus's center
                rotatedX += x;
                rotatedY += y;
                rotatedZ += z;
    
                // Check if the vertex is within the specified half length
                if (rotatedZ >= z - halfLength) {
                    vertices.push(rotatedX, rotatedY, rotatedZ);
                    colors.push(c1, c2, c3);
                }
            }
        }
    
        var faces = [];
        for (var i = 0; i < segments1; i++) {
            for (var j = 0; j < segments2; j++) {
                var index = i * (segments2 + 1) + j;
                var nextIndex = index + segments2 + 1;
    
                // Only add faces for vertices within the specified half length
                if (vertices[index * 3 + 2] >= z - halfLength && vertices[nextIndex * 3 + 2] >= z - halfLength && vertices[index * 3 + 2 + segments2 + 1] >= z - halfLength) {
                    faces.push(index, nextIndex, index + 1);
                    faces.push(nextIndex, nextIndex + 1, index + 1);
                }
            }
        }
    
        return { vertices: vertices, colors: colors, faces: faces };
    }

    function generateCube(x, y, z, c1, c2, c3, size, rotationX, rotationY, rotationZ) {
        var halfSize = size / 2;
        var vertices = [
            // Front face
            x - halfSize, y - halfSize, z + halfSize, // 0
            x + halfSize, y - halfSize, z + halfSize, // 1
            x + halfSize, y + halfSize, z + halfSize, // 2
            x - halfSize, y + halfSize, z + halfSize, // 3
            // Back face
            x - halfSize, y - halfSize, z - halfSize, // 4
            x + halfSize, y - halfSize, z - halfSize, // 5
            x + halfSize, y + halfSize, z - halfSize, // 6
            x - halfSize, y + halfSize, z - halfSize  // 7
        ];
        
        // Apply rotations
        for (var i = 0; i < vertices.length; i += 3) {
            var rotated = rotatePoint(vertices[i], vertices[i + 1], vertices[i + 2], rotationX, rotationY, rotationZ, x, y, z);
            vertices[i] = rotated[0];
            vertices[i + 1] = rotated[1];
            vertices[i + 2] = rotated[2];
        }
    
        var colors = [
            c1, c2, c3, // Front face
            c1, c2, c3, // Front face
            c1, c2, c3, // Front face
            c1, c2, c3, // Front face
            c1, c2, c3, // Back face
            c1, c2, c3, // Back face
            c1, c2, c3, // Back face
            c1, c2, c3  // Back face
        ];
    
        var faces = [
            0, 1, 2, 0, 2, 3,    // Front face
            4, 6, 5, 4, 7, 6,    // Back face
            4, 5, 1, 4, 1, 0,    // Left face
            3, 2, 6, 3, 6, 7,    // Right face
            1, 5, 6, 1, 6, 2,    // Top face
            4, 0, 3, 4, 3, 7     // Bottom face
        ];
    
        return { vertices: vertices, colors: colors, faces: faces };
    }

    function generateEllipticParaboloid1(x, y, z, a, b, r, g, bl, segments, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
    
        for (var i = 0; i <= segments; i++) {
            var u = -Math.PI + (2 * Math.PI * i) / segments;
    
            for (var j = 0; j <= segments; j++) {
                var v = (j) / segments;
                var xCoord = x + (a * v * Math.cos(u));
                var yCoord = y + (b * v * Math.sin(u));
                var zCoord = z + (Math.pow(v, 2));
    
                // Apply rotations
                var rotatedX = xCoord - x;
                var rotatedY = yCoord - y;
                var rotatedZ = zCoord - z;
    
                // Rotate around X axis
                var tempY = rotatedY;
                rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
    
                // Rotate around Y axis
                var tempX = rotatedX;
                rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
    
                // Rotate around Z axis
                var tempX2 = rotatedX;
                rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
                rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
    
                // Translate the vertex back to its original position relative to the center
                rotatedX += x;
                rotatedY += y;
                rotatedZ += z;
    
                vertices.push(rotatedX, rotatedY, rotatedZ);
                colors.push(r, g, bl);
            }
        }
    
        var faces = [];
        for (var i = 0; i < segments; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }
    
        return { vertices: vertices, colors: colors, faces: faces };
    }
    
    
    
    function generateEllipticParaboloid(x, y, z, a, b, r, g, bl, segments, rotationX, rotationY, rotationZ) {
        var vertices = [];
        var colors = [];
    
        for (var i = 0; i <= segments; i++) {
            var u = -Math.PI + (2 * Math.PI * i) / segments;
    
            for (var j = 0; j <= segments; j++) {
                var v = (j) / segments;
                var xCoord = x + (a * v * Math.cos(u));
                var yCoord = y + (b * v * Math.sin(u));
                var zCoord = z + (Math.pow(v, 2));
    
                // Apply rotations
                var rotatedX = xCoord - x;
                var rotatedY = yCoord - y;
                var rotatedZ = zCoord - z;
    
                // Rotate around X axis
                var tempY = rotatedY;
                rotatedY = tempY * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX);
                rotatedZ = tempY * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX);
    
                // Rotate around Y axis
                var tempX = rotatedX;
                rotatedX = tempX * Math.cos(rotationY) - rotatedZ * Math.sin(rotationY);
                rotatedZ = -tempX * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
    
                // Rotate around Z axis
                var tempX2 = rotatedX;
                rotatedX = tempX2 * Math.cos(rotationZ) - rotatedY * Math.sin(rotationZ);
                rotatedY = tempX2 * Math.sin(rotationZ) + rotatedY * Math.cos(rotationZ);
    
                // Translate the vertex back to its original position relative to the center
                rotatedX += x;
                rotatedY += y;
                rotatedZ += z;
    
                vertices.push(rotatedX, rotatedY, rotatedZ);
                colors.push(r, g, bl);
            }
        }
    
        var faces = [];
        for (var i = 0; i < segments; i++) {
            for (var j = 0; j < segments; j++) {
                var index = i * (segments + 1) + j;
                var nextIndex = index + segments + 1;
                faces.push(index, nextIndex, index + 1);
                faces.push(nextIndex, nextIndex + 1, index + 1);
            }
        }

        function rotateY(vertices, angle) {
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var newVertices = [];

            for (var i = 0; i < vertices.length; i += 3) {
                var x = vertices[i];
                var z = vertices[i + 2];

                newVertices.push(
                cos * x + sin * z,
                vertices[i + 1],
                -sin * x + cos * z
                );
            }
            
            return newVertices;
        }

        function rotateX(vertices, angle) {
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var newVertices = [];

            for (var i = 0; i < vertices.length; i += 3) {
                var y = vertices[i + 1];
                var z = vertices[i + 2];

                newVertices.push(
                vertices[i],
                cos * y - sin * z,
                sin * y + cos * z
                );
            }

            return newVertices;
        }

        

        return { vertices: (rotateY(vertices,Math.PI)), colors: colors, faces: faces };
    }
    
    
    
