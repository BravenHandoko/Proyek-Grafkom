function createVertexBuffer(GL, data){
  var VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.vertices), GL.STATIC_DRAW);
  return VERTEX;
}

function createFacesBuffer(GL, data){
  var FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.faces), GL.STATIC_DRAW);
  return FACES;
}

function createColorBuffer(GL, data){
  var COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data.colors), GL.STATIC_DRAW);
  return COLORS;
}

function main() {
  var CANVAS = document.getElementById("myCanvas");

  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  var drag = false;
  var x_prev = 0;
  var y_prev = 0;

  var dx = 0;
  var dy = 0;

  var alpha = 0;
  var theta = 0;

  var friction = 0.98;

  var mouseDown = function (e) {
    drag = true;
    x_prev = e.pageX;
    y_prev = e.pageY;
    console.log("DOWN");
  };
  var mouseUP = function (e) {
    drag = false;
    console.log("UP");
  };
  var mouseOut = function (e) {
    console.log("OUTTT");
  };
  var mouseMove = function (e) {
    if (!drag) {
      return false;
    }

    dx = e.pageX - x_prev;
    dy = e.pageY - y_prev;

    console.log(dx + " " + dy);
    x_prev = e.pageX;
    y_prev = e.pageY;

    theta += (dx * 2 * Math.PI) / CANVAS.width;
    alpha += (dy * 2 * Math.PI) / CANVAS.height;
  };

  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUP, false);
  CANVAS.addEventListener("mouseout", mouseOut, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);

  var GL;
  try {
    GL = CANVAS.getContext("webgl", { antialias: true });
    var EXT = GL.getExtension("OES_element_index_uint");
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

  //shaders
  var shader_vertex_source = `
          attribute vec3 position;
          attribute vec3 color;
      
          uniform mat4 PMatrix;
          uniform mat4 VMatrix;
          uniform mat4 MMatrix;
         
          varying vec3 vColor;
          void main(void) {
          gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
          vColor = color;
          }`;
  var shader_fragment_source = `
          precision mediump float;
          varying vec3 vColor;
          // uniform vec3 color;
          void main(void) {
          gl_FragColor = vec4(vColor, 1.);
         
          }`;
  var compile_shader = function (source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  //uniform
  var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
  var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
  var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  GL.useProgram(SHADER_PROGRAM);

  // 
  // COLOR
  // 
  var bodyColor = [186/255, 143/255, 24/255]
  var bodyColor2 = [240/255, 230/255, 153/255]
  var collarColor = [230/255, 42/255, 21/255]
  var grassColor =[10/255, 161/255, 70/255]
  var eyeColor = [79/255, 57/255, 4/255, 250/255, 250/255, 250/255]
  var woodenColor= [84/225, 60/225, 4/225]
  var leafColor=[5/225, 150/225, 82/225]
  var doorColor=[145/225, 112/225, 26/225]
  var barnColor=[153/225, 18/225, 38/225]
  

  //
  //BASE
  //
  var base = generateTube(-4, -4.1 , .55, grassColor[0], grassColor[1], grassColor[2], 3, 3, 45, 100, 0, 0,0);
  var pohon = generateTube(-20, -1, 3, woodenColor[0], woodenColor[1], woodenColor[2], 35, 3, 3, 100, 0, 0, 0);
  var daun1 = generateCurvedTriangle(-20, 30, 3, leafColor[0], leafColor[1], leafColor[2],3,8,100,100);
  var daun2 = generateCurvedTriangle(-20, 25, 3, leafColor[0], leafColor[1], leafColor[2],2,7,100,100);
  var daun3 = generateCurvedTriangle(-20, 20, 3, leafColor[0], leafColor[1], leafColor[2],2,6,100,100);
  var pohon2 = generateTube(-33, -1, 1, woodenColor[0], woodenColor[1], woodenColor[2], 13, 3, 3, 100, 0, 0, 0);
  var daun4 = generateCurvedTriangle(-33, 10, 1, leafColor[0], leafColor[1], leafColor[2],1,6.5,100,100);
  var daun5 = generateCurvedTriangle(-33, 6, 1, leafColor[0], leafColor[1], leafColor[2],1,4.5,100,100);
  var barn = generateCurvedTriangle(-10, 17, -25, collarColor[0], collarColor[1], collarColor[2],7,20,100,100);
  var door = generateTube(-10, -1, -9, doorColor[0], doorColor[1], doorColor[2], 15, 3, 1, 100, 0, 0,0);
  var bangun = generateCube(-10,13, -25, barnColor[0], barnColor[1], barnColor[2],30,0,0,0); 
 // 

  // LEHER 
  //
  var leher1 = generateTube(-1.65, 3.3, -2.3, bodyColor[0], bodyColor[1], bodyColor[2], 1, 3, 1, 100, 90, 0,10);

  //
  //COLLAR
  //
  var leher2 = generateTorus(-1.65, 3.5, -0.9, collarColor[0], collarColor[1], collarColor[2], 1.5, .4, 100, 100, 100, 0, 0);

  //  
  // KEPALA 
  //
  var kepala1 = generateTorus(-1.65, 3.8, 1, bodyColor[0], bodyColor[1], bodyColor[2], 1.2, 1.2, 100, 100, 1.55, 0, 0);
  var kepala2 = generateTorus(-1.65, 4.8, 1, bodyColor[0], bodyColor[1], bodyColor[2], .1, 2, 100, 100, 1.55, 0, 0);

  //
  //TELINGA
  //
  var telinga1 = generateEllipticParaboloid(0,6,-1, 1, 1, bodyColor[0], bodyColor[1], bodyColor[2], 100, 16, 0, 0);
  var telinga2 = generateEllipticParaboloid(3,6,-1, 1, 1, bodyColor[0], bodyColor[1], bodyColor[2], 100, 16, 0,0);

  //
 // BADAN
  // 
  var badan1 = generateTube(-1.65, 1.4, -6.8, bodyColor[0], bodyColor[1], bodyColor[2], 5, 2, 3, 100, 20, 0, 0);

  //
  //EKOR
  //
  var ekor = generateHalfTorus(-1.65, 3.5, -7.3, bodyColor[0], bodyColor[1], bodyColor[2], .9, .3, 100, 100, 4, 0, 5,10);

  //
// PITA
// 
var pita = generateHyperboloid(-1.65, 5.3, -1.8, .8, .5, .8, collarColor[0], collarColor[1], collarColor[2], 100, 20,40,90)

  // 
  // MATA
  // 
  var mata1 = generateEllipsoid(-2.3 , 5, 3 , .5, .6, .2, eyeColor[0], eyeColor[1], eyeColor[2], 100);
  var mata2 = generateEllipsoid(-2., 5, 3 , .2, .28, .2, eyeColor[3], eyeColor[4], eyeColor[5], 100);
  var mata3 = generateEllipsoid(-.8 , 5, 3 , .5, .6, .2, eyeColor[0], eyeColor[1], eyeColor[2], 100);
  var mata4 = generateEllipsoid(-1., 5, 3., .3, .3, .2, eyeColor[3], eyeColor[4], eyeColor[5], 100);

  // 
  // MULUT
  // 

  var rahang = generateTorus(-1.65, 3.6, 2.66, bodyColor2[0], bodyColor2[1], bodyColor2[2], .4, 1, 100, 100, 1.55, 0, 0);

  // 
  // HIDUNG 
  // 
  var hidung = generateEllipsoid(-1.43, 4, 4, .4, .3, .2, eyeColor[0], eyeColor[1], eyeColor[2], 100);
  
  //
  // KAKI KIRI BELAKANG
  // 
  var kakiKiri3 = generateSphere(-1, -.8, -1.5, bodyColor[0], bodyColor[1], bodyColor[2], .3, 50);
  var kakiKiri4 = generateTube(-1, -1, -2, bodyColor2[0], bodyColor2[1], bodyColor2[2], 2, .7, .5, 100, 0, 0, 0);

  //
  // KAKI KIRI DEPAN
  // 
  var kakiKirii3 = generateSphere(-2.9, -.8, -1.5, bodyColor[0], bodyColor[1], bodyColor[2], .3, 50);
  var kakiKirii4 = generateTube(-2.9, -1, -2, bodyColor2[0], bodyColor2[1], bodyColor2[2], 2, .7, .5, 100, 0, 0, 0);

  //
  // KAKI KANAN BELAKANG
  // 
  var kakiKanan3 = generateSphere(-2.9, -.8, -4.5, bodyColor[0], bodyColor[1], bodyColor[2], .3, 50);
  var kakiKanan4 = generateTube(-2.9, -1, -5, bodyColor2[0], bodyColor2[1], bodyColor2[2], 1, .5, .3, 100, 0, 0, 0);

    //
  // KAKI KANAN DEPAN
  // 
  var kakiKanann3 = generateSphere(-1, -.8, -4.5, bodyColor[0], bodyColor[1], bodyColor[2], .3,50);
  var kakiKanann4 = generateTube(-1, -1, -5, bodyColor2[0], bodyColor2[1], bodyColor2[2], 1, .5, .3, 100, 0, 0, 0);

  //
  var BASE_VERTEX = createVertexBuffer(GL, base);
    var BASE_COLORS = createColorBuffer(GL, base);
    var BASE_FACES = createFacesBuffer(GL, base);

    var POHON_VERTEX = createVertexBuffer(GL, pohon);
    var POHON_COLORS = createColorBuffer(GL, pohon);
    var POHON_FACES = createFacesBuffer(GL, pohon);

    var DAUN1_VERTEX = createVertexBuffer(GL, daun1);
    var DAUN1_COLORS = createColorBuffer(GL, daun1);
    var DAUN1_FACES = createFacesBuffer(GL, daun1);

    var DAUN2_VERTEX = createVertexBuffer(GL, daun2);
    var DAUN2_COLORS = createColorBuffer(GL, daun2);
    var DAUN2_FACES = createFacesBuffer(GL, daun2);

    var DAUN3_VERTEX = createVertexBuffer(GL, daun3);
    var DAUN3_COLORS = createColorBuffer(GL, daun3);
    var DAUN3_FACES = createFacesBuffer(GL, daun3);

    var POHON2_VERTEX = createVertexBuffer(GL, pohon2);
    var POHON2_COLORS = createColorBuffer(GL, pohon2);
    var POHON2_FACES = createFacesBuffer(GL, pohon2);

    var DAUN4_VERTEX = createVertexBuffer(GL, daun4);
    var DAUN4_COLORS = createColorBuffer(GL, daun4);
    var DAUN4_FACES = createFacesBuffer(GL, daun4);

    var DAUN5_VERTEX = createVertexBuffer(GL, daun5);
    var DAUN5_COLORS = createColorBuffer(GL, daun5);
    var DAUN5_FACES = createFacesBuffer(GL, daun5);

    var DOOR_VERTEX = createVertexBuffer(GL, door);
    var DOOR_COLORS = createColorBuffer(GL, door);
    var DOOR_FACES = createFacesBuffer(GL, door);

    var BARN_VERTEX = createVertexBuffer(GL, barn);
    var BARN_COLORS = createColorBuffer(GL, barn);
    var BARN_FACES = createFacesBuffer(GL, barn);

    var BANGUN_VERTEX = createVertexBuffer(GL, bangun);
    var BANGUN_COLORS = createColorBuffer(GL, bangun);
    var BANGUN_FACES = createFacesBuffer(GL, bangun);

  /////////////////////////////////////////////////////////////////////////////////// COW //////////////////////////////////////////////////////////////////////////////////////////////////

  var bodyCowColor = [0/255, 0/255, 0/255]
  var bodyCowColor2 = [255/255, 255/255, 255/255]
  var collarCowColor = [128/255, 0/255, 0/255]
  var CowEyeColor = [235/255, 236/255, 240/255, 42/255, 42/255, 39/255]
  var CowTailColor = [170/255, 170/255, 170/255];

  //TELINGA
  var Cowtelinga1 = generateEllipticParaboloid1(7, 9, 1, 0.8, 1.3, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 50, 0, 0, 0);
  var Cowtelinga2 = generateEllipticParaboloid1(10, 9, 1, 0.8, 1.3, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 50, 0, 0,0);
  var Cowtelinga3 = generateEllipticParaboloid1(7, 9, 1, 0.5, 0.8, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 50, 0, 0, 0);
  var Cowtelinga4 = generateEllipticParaboloid1(10, 9, 1, 0.5, 0.8, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 50, 0, 0,0);

  //buntut
  var Cowbuntut = generateTube1(8.65, 3.5, -8.3, CowTailColor[0], CowTailColor[1], CowTailColor[2], 1, 0.5, 0.2, 50, -40, 0, 10);


  // LEHER 
  //
  var Cowleher1 = generateTube1(8.65, 6.5, -2.3, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 1, 3, 1, 100, 20, 0, 0);
  var Cowleher2 = generateTorus(8.65, 7.1, -1.5, collarCowColor[0], collarCowColor[1], collarCowColor[2], 1.3, .4, 100, 100, 100, 0, 0);

  // KEPALA 
  //
  var Cowkepala1 = generateTorus(8.65, 6.5, 1, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1.2, 1.2, 100, 100, 1.55, 0, 0);
  var Cowkepala2 = generateTorus(8.65, 7.8, 1, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .1, 2, 100, 100, 1.55, 0, 0);

  // BADAN
  // 
  var Cowbadan1 = generateTube1(8.65, 4.5, -6.8, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 5, 2, 3, 100, 20, 0, 0);
  var Cowbadan2 = generateTube1(8.65, 5, -6, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 4.3, 1.4, 2.2, 100, 20, 0, 0);

  // BADAN BAWAH
  // 
  var CowbadanBawah = generateTube1(8.65, 3.75 , -8.6, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 2, .5, 2, 100, 20, 0 ,0);

  // MATA
  // 
  var Cowmata1 = generateEllipsoid(8 , 8, 3 , .5, .6, .2, CowEyeColor[0], CowEyeColor[1], CowEyeColor[2], 100);
  var Cowmata2 = generateEllipsoid(8, 7.8, 3.2 , .2, .3, .2, CowEyeColor[3], CowEyeColor[4], CowEyeColor[5], 100);
  var Cowmata3 = generateEllipsoid(9.5, 8, 3 , .5, .6, .2, CowEyeColor[0], CowEyeColor[1], CowEyeColor[2], 100);
  var Cowmata4 = generateEllipsoid(9.5, 7.8, 3.2 , .2, .3, .2, CowEyeColor[3], CowEyeColor[4], CowEyeColor[5], 100);

  // BADAN
  // 
  var BADAN1COW_VERTEX = createVertexBuffer(GL, Cowbadan1);
  var BADAN1COW_COLORS = createColorBuffer(GL, Cowbadan1);
  var BADAN1COW_FACES = createFacesBuffer(GL, Cowbadan1);

  var BADAN2COW_VERTEX = createVertexBuffer(GL, Cowbadan2);
  var BADAN2COW_COLORS = createColorBuffer(GL, Cowbadan2);
  var BADAN2COW_FACES = createFacesBuffer(GL, Cowbadan2);

  // BADAN BAWAH
  // 
  var BADAN_BAWAHCOW_VERTEX = createVertexBuffer(GL, CowbadanBawah);
  var BADAN_BAWAHCOW_COLORS = createColorBuffer(GL, CowbadanBawah);
  var BADAN_BAWAHCOW_FACES = createFacesBuffer(GL, CowbadanBawah);

  // KAKI KIRI DEPAN
  // 

  var kakiKiriCow1 = generateSphere(7.5, 3, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 1, 50);
  var kakiKiriCow2 = generateTube(7.5, 1, -2, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1.5, .3, .7, 100, 0, 0, 0);
  var kakiKiriCow3 = generateSphere(7.5, 0.8, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);
  var kakiKiriCow4 = generateTube(7.5, -0.5, -2, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1, .3, .3, 100, 0, 0, 0);
  var kakiKiriCow5 = generateSphere(7.5, -0.7, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);

  // KAKI KIRI BELAKANG
  // 

  var kakiKiriiCow1 = generateSphere(7.5, 3.2, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 1, 50);
  var kakiKiriiCow2 = generateTube(7.5, 0.9, -5.5, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1.5, .3, .7, 100, 0, 0, 0);
  var kakiKiriiCow3 = generateSphere(7.5, 0.7, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);
  var kakiKiriiCow4 = generateTube(7.5, -0.5, -5.5, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1, .3, .3, 100, 0, 0, 0);
  var kakiKiriiCow5 = generateSphere(7.5, -0.7, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);


  // KAKI KANAN DEPAN
  // 

  var kakiKananCow1 = generateSphere(9.5, 3, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 1, 50);
  var kakiKananCow2 = generateTube(9.5, 1, -2, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1.5, .3, .7, 100, 0, 0, 0);
  var kakiKananCow3 = generateSphere(9.5, 0.8, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);
  var kakiKananCow4 = generateTube(9.5, -0.5, -2, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1, .3, .3, 100, 0, 0, 0);
  var kakiKananCow5 = generateSphere(9.5, -0.7, -1.5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);

  // KAKI KANAN BELAKANG
  // 

  var kakiKanannCow1 = generateSphere(9.5, 3.2, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], 1, 50);
  var kakiKanannCow2 = generateTube(9.5, 0.9, -5.5, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1.5, .3, .7, 100, 0, 0, 0);
  var kakiKanannCow3 = generateSphere(9.5, 0.7, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);
  var kakiKanannCow4 = generateTube(9.5, -0.5, -5.5, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], 1, .3, .3, 100, 0, 0, 0);
  var kakiKanannCow5 = generateSphere(9.5, -0.7, -5, bodyCowColor[0], bodyCowColor[1], bodyCowColor[2], .3, 50);

  //rahang
  var Cowrahang = generateTorus(8.65, 6.6, 2.66, bodyCowColor2[0], bodyCowColor2[1], bodyCowColor2[2], .5, .9, 100, 100, 1.55, 0, 0);


  // HIDUNG 
  // 
  var Cowhidung = generateEllipsoid(8.73, 7, 4, .2, .2, .2, CowEyeColor[3], CowEyeColor[4], CowEyeColor[5], 100);
  
//
//BASE
//
  var BASE_VERTEX = createVertexBuffer(GL, base);
  var BASE_COLORS = createColorBuffer(GL, base);
  var BASE_FACES = createFacesBuffer(GL, base);
    //
   // BADAN
  // 
  var BADAN1_VERTEX = createVertexBuffer(GL, badan1);
  var BADAN1_COLORS = createColorBuffer(GL, badan1);
  var BADAN1_FACES = createFacesBuffer(GL, badan1);

  //
  //EKOR
  //
  var EKOR_VERTEX = createVertexBuffer(GL, ekor);
  var EKOR_COLORS = createColorBuffer(GL, ekor);
  var EKOR_FACES = createFacesBuffer(GL, ekor);

  //
  // LEHER
  // 
  var LEHER1_VERTEX = createVertexBuffer(GL, leher1);
  var LEHER1_COLORS = createColorBuffer(GL, leher1);
  var LEHER1_FACES = createFacesBuffer(GL, leher1);

  var LEHER2_VERTEX = createVertexBuffer(GL, leher2);
  var LEHER2_COLORS = createColorBuffer(GL, leher2);
  var LEHER2_FACES = createFacesBuffer(GL, leher2);


  //
  // PITA
  //
  var PITA_VERTEX = createVertexBuffer(GL, pita);
  var PITA_COLORS = createColorBuffer(GL, pita);
  var PITA_FACES = createFacesBuffer(GL, pita);
  
  // 
  // KEPALA
  // 
  var KEPALA1_VERTEX = createVertexBuffer(GL, kepala1);
  var KEPALA1_COLORS = createColorBuffer(GL, kepala1);
  var KEPALA1_FACES = createFacesBuffer(GL, kepala1);

  var KEPALA2_VERTEX = createVertexBuffer(GL, kepala2);
  var KEPALA2_COLORS = createColorBuffer(GL, kepala2);
  var KEPALA2_FACES = createFacesBuffer(GL, kepala2);

  //
  //TELINGA
  //

  var TELINGA1_VERTEX = createVertexBuffer(GL, telinga1);
  var TELINGA1_COLORS = createColorBuffer(GL, telinga1);
  var TELINGA1_FACES = createFacesBuffer(GL, telinga1);
  
  var TELINGA2_VERTEX = createVertexBuffer(GL, telinga2);
  var TELINGA2_COLORS = createColorBuffer(GL, telinga2);
  var TELINGA2_FACES = createFacesBuffer(GL, telinga2);

  // 
  // HIDUNG
  // 

  var HIDUNG_VERTEX = createVertexBuffer(GL, hidung);
  var HIDUNG_COLORS = createColorBuffer(GL, hidung);
  var HIDUNG_FACES = createFacesBuffer(GL, hidung);

  // 
  // MATA
  // 

  var MATA1_VERTEX = createVertexBuffer(GL, mata1);
  var MATA1_COLORS = createColorBuffer(GL, mata1);
  var MATA1_FACES = createFacesBuffer(GL, mata1);

  var MATA2_VERTEX = createVertexBuffer(GL, mata2);
  var MATA2_COLORS = createColorBuffer(GL, mata2);
  var MATA2_FACES = createFacesBuffer(GL, mata2);

  var MATA3_VERTEX = createVertexBuffer(GL, mata3);
  var MATA3_COLORS = createColorBuffer(GL, mata3);
  var MATA3_FACES = createFacesBuffer(GL, mata3);

  var MATA4_VERTEX = createVertexBuffer(GL, mata4);
  var MATA4_COLORS = createColorBuffer(GL, mata4);
  var MATA4_FACES = createFacesBuffer(GL, mata4);

  //
  // RAHANG
  //
  var RAHANG_VERTEX = createVertexBuffer(GL, rahang);
  var RAHANG_COLORS = createColorBuffer(GL, rahang);
  var RAHANG_FACES = createFacesBuffer(GL, rahang);

    //
   // KAKI KIRI BELAKANG
  // 
  var KAKI_KIRI3_VERTEX = createVertexBuffer(GL, kakiKiri3);
  var KAKI_KIRI3_COLORS = createColorBuffer(GL, kakiKiri3);
  var KAKI_KIRI3_FACES = createFacesBuffer(GL, kakiKiri3);

  var KAKI_KIRI4_VERTEX = createVertexBuffer(GL, kakiKiri4);
  var KAKI_KIRI4_COLORS = createColorBuffer(GL, kakiKiri4);
  var KAKI_KIRI4_FACES = createFacesBuffer(GL, kakiKiri4);
  
  //
  // KAKI KIRI BELAKANG
  // 
  var KAKI_KIRII3_VERTEX = createVertexBuffer(GL, kakiKirii3);
  var KAKI_KIRII3_COLORS = createColorBuffer(GL, kakiKirii3);
  var KAKI_KIRII3_FACES = createFacesBuffer(GL, kakiKirii3);

  var KAKI_KIRII4_VERTEX = createVertexBuffer(GL, kakiKirii4);
  var KAKI_KIRII4_COLORS = createColorBuffer(GL, kakiKirii4);
  var KAKI_KIRII4_FACES = createFacesBuffer(GL, kakiKirii4);
  
    //
  // KAKI KANAN BELAKANG
  // 
  var KAKI_KANAN3_VERTEX = createVertexBuffer(GL, kakiKanan3);
  var KAKI_KANAN3_COLORS = createColorBuffer(GL, kakiKanan3);
  var KAKI_KANAN3_FACES = createFacesBuffer(GL, kakiKanan3);

  var KAKI_KANAN4_VERTEX = createVertexBuffer(GL, kakiKanan4);
  var KAKI_KANAN4_COLORS = createColorBuffer(GL, kakiKanan4);
  var KAKI_KANAN4_FACES = createFacesBuffer(GL, kakiKanan4);
  

  //
  // KAKI KANAN DEPAN
  // 
  var KAKI_KANANN3_VERTEX = createVertexBuffer(GL, kakiKanann3);
  var KAKI_KANANN3_COLORS = createColorBuffer(GL, kakiKanann3);
  var KAKI_KANANN3_FACES = createFacesBuffer(GL, kakiKanann3);

  var KAKI_KANANN4_VERTEX = createVertexBuffer(GL, kakiKanann4);
  var KAKI_KANANN4_COLORS = createColorBuffer(GL, kakiKanann4);
  var KAKI_KANANN4_FACES = createFacesBuffer(GL, kakiKanann4);
  ////////////////////////////////////////////////////////////////////////////////////////// HUMAN //////////////////////////////////////////////////////////////////////////////////////

  var humanbodyColor = [255/255, 253/255, 208/255]
  var humanbodyColor2 = [255/255, 255/255, 255/255]
  var humanhatColor = [255/255, 165/255, 0/255]
  var humancltColor = [0/255, 0/255, 255/255]
  var humancollarColor = [255/255, 0/255, 0/255]
  var humanshoeColor = [0/255, 0/255, 0/255]
  var humaneyeColor = [235/255, 236/255, 240/255, 42/255, 42/255, 39/255]
   // 
  //  TANGAN KIRI
  // 
  var humantanganKiri1 = generateSphere(-13.4, 5, .55, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], .8, 50);
  var humantanganKiri2 = generateTube3(-13.4, 2.4, .05, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], 2.5, .8, .8, 100);
  var humantanganKiri3 = generateSphere(-13.5, 1.5, .55, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 0, 50);
  var humantanganKiri4 = generateTube3(-13.4, -0.6, .05, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 3.5, .6, .6, 100);
  var humantanganKiri5 = generateSphere(-13.4, -0.9, .55, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], 1, 50);

  // 
  // TANGAN KANAN
  // 
  var humantanganKanan1 = generateSphere(-6.6, 5, .55, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], .8, 50);
  var humantanganKanan2 = generateTube3(-6.6, 2.4, .05, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], 2.5, .8, .8, 100);
  var humantanganKanan3 = generateSphere(-6.6, 1.5, .55, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 0, 50);
  var humantanganKanan4 = generateTube3(-6.6, -0.6, .05, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 3.5, .6, .6, 100);
  var humantanganKanan5 = generateSphere(-6.6, -0.9, .55, humanbodyColor2[0], humanbodyColor2[1], humanbodyColor2[2], 1, 50);

  // 
  // BADAN
  // 
  var humanbadan1 = generateTube3(-10, 1, 0,  humancltColor[0], humancltColor[1], humancltColor[2], 4, 2.5, 2.5, 100);
  var humanbadan2 = generateTube3(-10, 1, 1,  humanhatColor[0], humanhatColor[1], humanhatColor[2], 2, 1.4, 2, 100);

  // 
  // BADAN BAWAH
  // 
  var humanbadanBawah = generateTube3(-10, 0, 0, humancltColor[0], humancltColor[1], humancltColor[2], 1, 1, 2.5, 100);

  // 
  // LEHER 
  //
  var humanleher1 = generateTube3(-10, 5, 0, humancltColor[0],   humancltColor[1],  humancltColor[2], 1, 2.5, 1, 100);
  var humanleher2 = generateTorus(-10, 6, .6, humancollarColor[0], humancollarColor[1], humancollarColor[2], 1.8, .4, 100, 100, 2, 0, 0);
  var humanleher3 = generateTube3(-10, 5, .3, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 1, 1, 1, 100);
  

  // 
  // KEPALA 
  //
  var humankepala1 = generateTorus(-10, 8.1, 0.7, humancltColor[0], humancltColor[1], humancltColor[2], 0, 2.3, 100, 100, 1.55, 0, 0);
  var humankepala2 = generateTorus(-10, 8, 0.7, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], 0, 2.3, 100, 100, 1.55, 0, 0);
  var humankepala3 = generateTorus(-12, 7, .6, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], .2, .2, 100, 100, -1, 0, .1);
  var humankepala4 = generateTorus(-8, 7, .6, humanbodyColor[0], humanbodyColor[1], humanbodyColor[2], .2, .2, 100, 100, -1, 0, .1);

  //
  //TOPI
  //
  var humantopi1 = generateTube3(-10, 7, -1,  humanhatColor[0], humanhatColor[1], humanhatColor[2], 1, 0, 2.2, 100);


  // 
  // TELINGA
  // 

  //
  //TAS
  //
  var humantas1 = generateTorus(-7.3, 3.7, 0, humanhatColor[0], humanhatColor[1], humanhatColor[2], 2, .3, 100, 100, 0, 1.5, 0);
  var humantas2 = generateTorus(-12.7, 3.7, 0, humanhatColor[0], humanhatColor[1], humanhatColor[2], 2, .3, 100, 100, 0, 1.5, 0);
  var humantas3 = generateTube3(-10, 2, -3.3, humanhatColor[0], humanhatColor[1], humanhatColor[2], 2, 2.5, 3, 100);
  var humantas4 = generateSphere(-10, 4, -2.8, humanhatColor[0], humanhatColor[1], humanhatColor[2], 3, 100);
  var humantas5 = generateSphere(-10, 2, -2.8, humanhatColor[0], humanhatColor[1], humanhatColor[2], 2.5, 100);

  // 
  // MATA
  // 
  var humanmata1 = generateEllipsoid(-11 , 7.4, 2.6 , .3, .4, .3, humaneyeColor[0], humaneyeColor[1], humaneyeColor[2], 100);
  var humanmata2 = generateEllipsoid(-11, 7.3, 2.8 , .2, .3, .2, humaneyeColor[3], humaneyeColor[4], humaneyeColor[5], 100);
  var humanmata3 = generateEllipsoid(-9 , 7.4, 2.6 , .3, .4, .3, humaneyeColor[0], humaneyeColor[1], humaneyeColor[2], 100);
  var humanmata4 = generateEllipsoid(-9, 7.3, 2.8 , .2, .3, .2, humaneyeColor[3], humaneyeColor[4], humaneyeColor[5], 100);

  // 
  // KAKI KIRI
  // 

  var humankakiKiri1 = generateSphere(-11.4, 0, .55, humancltColor[0], humancltColor[1], humancltColor[2], 1, 100);
  var humankakiKiri2 = generateTube3(-11.4, -2, .05, humancltColor[0], humancltColor[1], humancltColor[2], 2, .7, .7, 100);
  var humankakiKiri3 = generateSphere(-11.4, -2.3, .55, humancltColor[0], humancltColor[1], humancltColor[2],1 , 100);
  var humankakiKiri4 = generateTube3(-11.4, -5, .05, humancltColor[0], humancltColor[1], humancltColor[2], 2, .7, .7, 100);
  var humankakiKiri5 = generateSphere(-11.4, -4.5, 1.7, humanshoeColor[0], humanshoeColor[1], humanshoeColor[2], 1, 100);


  // 
  // KAKI KANAN
  // 

  var humankakiKanan1 = generateSphere(-8.6, 0, .55, humancltColor[0], humancltColor[1], humancltColor[2], 1, 100);
  var humankakiKanan2 = generateTube3(-8.6, -2, .05, humancltColor[0], humancltColor[1], humancltColor[2], 2, .7, .7, 100);
  var humankakiKanan3 = generateSphere(-8.6, -2.3, .55, humancltColor[0], humancltColor[1], humancltColor[2],1 , 100);
  var humankakiKanan4 = generateTube3(-8.6, -5, .05, humancltColor[0], humancltColor[1], humancltColor[2], 2, .7, .7, 100);
  var humankakiKanan5 = generateSphere(-8.6, -4.5, 1.7, humanshoeColor[0], humanshoeColor[1], humanshoeColor[2], 1, 100);

  // Create buffers

  // 
  // TANGAN KIRI
  // 
  var HUMANTANGAN_KIRI1_VERTEX = createVertexBuffer(GL, humantanganKiri1);
  var HUMANTANGAN_KIRI1_COLORS = createColorBuffer(GL, humantanganKiri1);
  var HUMANTANGAN_KIRI1_FACES = createFacesBuffer(GL, humantanganKiri1);

  var HUMANTANGAN_KIRI2_VERTEX = createVertexBuffer(GL, humantanganKiri2);
  var HUMANTANGAN_KIRI2_COLORS = createColorBuffer(GL, humantanganKiri2);
  var HUMANTANGAN_KIRI2_FACES = createFacesBuffer(GL, humantanganKiri2);

  var HUMANTANGAN_KIRI3_VERTEX = createVertexBuffer(GL, humantanganKiri3);
  var HUMANTANGAN_KIRI3_COLORS = createColorBuffer(GL, humantanganKiri3);
  var HUMANTANGAN_KIRI3_FACES = createFacesBuffer(GL, humantanganKiri3);

  var HUMANTANGAN_KIRI4_VERTEX = createVertexBuffer(GL, humantanganKiri4);
  var HUMANTANGAN_KIRI4_COLORS = createColorBuffer(GL, humantanganKiri4);
  var HUMANTANGAN_KIRI4_FACES = createFacesBuffer(GL, humantanganKiri4);
  
  var HUMANTANGAN_KIRI5_VERTEX = createVertexBuffer(GL, humantanganKiri5);
  var HUMANTANGAN_KIRI5_COLORS = createColorBuffer(GL, humantanganKiri5);
  var HUMANTANGAN_KIRI5_FACES = createFacesBuffer(GL, humantanganKiri5);

  // 
  // TANGAN KANAN
  // 
  var HUMANTANGAN_KANAN1_VERTEX = createVertexBuffer(GL, humantanganKanan1);
  var HUMANTANGAN_KANAN1_COLORS = createColorBuffer(GL, humantanganKanan1);
  var HUMANTANGAN_KANAN1_FACES = createFacesBuffer(GL, humantanganKanan1);

  var HUMANTANGAN_KANAN2_VERTEX = createVertexBuffer(GL, humantanganKanan2);
  var HUMANTANGAN_KANAN2_COLORS = createColorBuffer(GL, humantanganKanan2);
  var HUMANTANGAN_KANAN2_FACES = createFacesBuffer(GL, humantanganKanan2);

  var HUMANTANGAN_KANAN3_VERTEX = createVertexBuffer(GL, humantanganKanan3);
  var HUMANTANGAN_KANAN3_COLORS = createColorBuffer(GL, humantanganKanan3);
  var HUMANTANGAN_KANAN3_FACES = createFacesBuffer(GL, humantanganKanan3);

  var HUMANTANGAN_KANAN4_VERTEX = createVertexBuffer(GL, humantanganKanan4);
  var HUMANTANGAN_KANAN4_COLORS = createColorBuffer(GL, humantanganKanan4);
  var HUMANTANGAN_KANAN4_FACES = createFacesBuffer(GL, humantanganKanan4);
  
  var HUMANTANGAN_KANAN5_VERTEX = createVertexBuffer(GL, humantanganKanan5);
  var HUMANTANGAN_KANAN5_COLORS = createColorBuffer(GL, humantanganKanan5);
  var HUMANTANGAN_KANAN5_FACES = createFacesBuffer(GL, humantanganKanan5);


  // 
  // BADAN
  // 
  var HUMANBADAN1_VERTEX = createVertexBuffer(GL, humanbadan1);
  var HUMANBADAN1_COLORS = createColorBuffer(GL, humanbadan1);
  var HUMANBADAN1_FACES = createFacesBuffer(GL, humanbadan1);

  var HUMANBADAN2_VERTEX = createVertexBuffer(GL, humanbadan2);
  var HUMANBADAN2_COLORS = createColorBuffer(GL, humanbadan2);
  var HUMANBADAN2_FACES = createFacesBuffer(GL, humanbadan2);

  // 
  // BADAN BAWAH
  // 
  var HUMANBADAN_BAWAH_VERTEX = createVertexBuffer(GL, humanbadanBawah);
  var HUMANBADAN_BAWAH_COLORS = createColorBuffer(GL, humanbadanBawah);
  var HUMANBADAN_BAWAH_FACES = createFacesBuffer(GL, humanbadanBawah);

  // 
  // LEHER
  // 
  var HUMANLEHER1_VERTEX = createVertexBuffer(GL, humanleher1);
  var HUMANLEHER1_COLORS = createColorBuffer(GL, humanleher1);
  var HUMANLEHER1_FACES = createFacesBuffer(GL, humanleher1);

  var HUMANLEHER2_VERTEX = createVertexBuffer(GL, humanleher2);
  var HUMANLEHER2_COLORS = createColorBuffer(GL, humanleher2);
  var HUMANLEHER2_FACES = createFacesBuffer(GL, humanleher2);

  var HUMANLEHER3_VERTEX = createVertexBuffer(GL, humanleher3);
  var HUMANLEHER3_COLORS = createColorBuffer(GL, humanleher3);
  var HUMANLEHER3_FACES = createFacesBuffer(GL, humanleher3);

  //
  //TAS
  //
  var HUMANTAS1_VERTEX = createVertexBuffer(GL, humantas1);
  var HUMANTAS1_COLORS = createColorBuffer(GL, humantas1);
  var HUMANTAS1_FACES = createFacesBuffer(GL, humantas1);

  var HUMANTAS2_VERTEX = createVertexBuffer(GL, humantas2);
  var HUMANTAS2_COLORS = createColorBuffer(GL, humantas2);
  var HUMANTAS2_FACES = createFacesBuffer(GL, humantas2);

  var HUMANTAS3_VERTEX = createVertexBuffer(GL, humantas3);
  var HUMANTAS3_COLORS = createColorBuffer(GL, humantas3);
  var HUMANTAS3_FACES = createFacesBuffer(GL, humantas3);

  var HUMANTAS4_VERTEX = createVertexBuffer(GL, humantas4);
  var HUMANTAS4_COLORS = createColorBuffer(GL, humantas4);
  var HUMANTAS4_FACES = createFacesBuffer(GL, humantas4);
  
  var HUMANTAS5_VERTEX = createVertexBuffer(GL, humantas5);
  var HUMANTAS5_COLORS = createColorBuffer(GL, humantas5);
  var HUMANTAS5_FACES = createFacesBuffer(GL, humantas5);
  // 
  // KEPALA
  // 
  var HUMANKEPALA1_VERTEX = createVertexBuffer(GL, humankepala1);
  var HUMANKEPALA1_COLORS = createColorBuffer(GL, humankepala1);
  var HUMANKEPALA1_FACES = createFacesBuffer(GL, humankepala1);

  var HUMANKEPALA2_VERTEX = createVertexBuffer(GL, humankepala2);
  var HUMANKEPALA2_COLORS = createColorBuffer(GL, humankepala2);
  var HUMANKEPALA2_FACES = createFacesBuffer(GL, humankepala2);

  var HUMANKEPALA3_VERTEX = createVertexBuffer(GL, humankepala3);
  var HUMANKEPALA3_COLORS = createColorBuffer(GL, humankepala3);
  var HUMANKEPALA3_FACES = createFacesBuffer(GL, humankepala3);

  var HUMANKEPALA4_VERTEX = createVertexBuffer(GL, humankepala4);
  var HUMANKEPALA4_COLORS = createColorBuffer(GL, humankepala4);
  var HUMANKEPALA4_FACES = createFacesBuffer(GL, humankepala4);
  //
  //TOPI
  //
  var HUMANTOPI1_VERTEX = createVertexBuffer(GL, humantopi1);
  var HUMANTOPI1_COLORS = createColorBuffer(GL, humantopi1);
  var HUMANTOPI1_FACES = createFacesBuffer(GL, humantopi1);

  // 
  // MATA
  // 
  var HUMANMATA1_VERTEX = createVertexBuffer(GL, humanmata1);
  var HUMANMATA1_COLORS = createColorBuffer(GL, humanmata1);
  var HUMANMATA1_FACES = createFacesBuffer(GL, humanmata1);

  var HUMANMATA2_VERTEX = createVertexBuffer(GL, humanmata2);
  var HUMANMATA2_COLORS = createColorBuffer(GL, humanmata2);
  var HUMANMATA2_FACES = createFacesBuffer(GL, humanmata2);

  var HUMANMATA3_VERTEX = createVertexBuffer(GL, humanmata3);
  var HUMANMATA3_COLORS = createColorBuffer(GL, humanmata3);
  var HUMANMATA3_FACES = createFacesBuffer(GL, humanmata3);

  var HUMANMATA4_VERTEX = createVertexBuffer(GL, humanmata4);
  var HUMANMATA4_COLORS = createColorBuffer(GL, humanmata4);
  var HUMANMATA4_FACES = createFacesBuffer(GL, humanmata4);


  // 
  // TELINGA
  //

  // 
  // KAKI KIRI
  // 
  var HUMANKAKI_KIRI1_VERTEX = createVertexBuffer(GL, humankakiKiri1);
  var HUMANKAKI_KIRI1_COLORS = createColorBuffer(GL, humankakiKiri1);
  var HUMANKAKI_KIRI1_FACES = createFacesBuffer(GL, humankakiKiri1);

  var HUMANKAKI_KIRI2_VERTEX = createVertexBuffer(GL, humankakiKiri2);
  var HUMANKAKI_KIRI2_COLORS = createColorBuffer(GL, humankakiKiri2);
  var HUMANKAKI_KIRI2_FACES = createFacesBuffer(GL, humankakiKiri2);

  var HUMANKAKI_KIRI3_VERTEX = createVertexBuffer(GL, humankakiKiri3);
  var HUMANKAKI_KIRI3_COLORS = createColorBuffer(GL, humankakiKiri3);
  var HUMANKAKI_KIRI3_FACES = createFacesBuffer(GL, humankakiKiri3);

  var HUMANKAKI_KIRI4_VERTEX = createVertexBuffer(GL, humankakiKiri4);
  var HUMANKAKI_KIRI4_COLORS = createColorBuffer(GL, humankakiKiri4);
  var HUMANKAKI_KIRI4_FACES = createFacesBuffer(GL, humankakiKiri4);
  
  var HUMANKAKI_KIRI5_VERTEX = createVertexBuffer(GL, humankakiKiri5);
  var HUMANKAKI_KIRI5_COLORS = createColorBuffer(GL, humankakiKiri5);
  var HUMANKAKI_KIRI5_FACES = createFacesBuffer(GL, humankakiKiri5);

  // 
  // KAKI KANAN
  // 
  var HUMANKAKI_KANAN1_VERTEX = createVertexBuffer(GL, humankakiKanan1);
  var HUMANKAKI_KANAN1_COLORS = createColorBuffer(GL, humankakiKanan1);
  var HUMANKAKI_KANAN1_FACES = createFacesBuffer(GL, humankakiKanan1);

  var HUMANKAKI_KANAN2_VERTEX = createVertexBuffer(GL, humankakiKanan2);
  var HUMANKAKI_KANAN2_COLORS = createColorBuffer(GL, humankakiKanan2);
  var HUMANKAKI_KANAN2_FACES = createFacesBuffer(GL, humankakiKanan2);

  var HUMANKAKI_KANAN3_VERTEX = createVertexBuffer(GL, humankakiKanan3);
  var HUMANKAKI_KANAN3_COLORS = createColorBuffer(GL, humankakiKanan3);
  var HUMANKAKI_KANAN3_FACES = createFacesBuffer(GL, humankakiKanan3);

  var HUMANKAKI_KANAN4_VERTEX = createVertexBuffer(GL, humankakiKanan4);
  var HUMANKAKI_KANAN4_COLORS = createColorBuffer(GL, humankakiKanan4);
  var HUMANKAKI_KANAN4_FACES = createFacesBuffer(GL, humankakiKanan4);
  
  var HUMANKAKI_KANAN5_VERTEX = createVertexBuffer(GL, humankakiKanan5);
  var HUMANKAKI_KANAN5_COLORS = createColorBuffer(GL, humankakiKanan5);
  var HUMANKAKI_KANAN5_FACES = createFacesBuffer(GL, humankakiKanan5);

  //////////////////////////////////////////////////////////////////////////////////// COW ///////////////////////////////////////////////////////////////////////////////////////////////

  //BUNTUT

  var buntutCow_VERTREX = createVertexBuffer(GL, Cowbuntut);
  var buntutCow_COLORS = createColorBuffer(GL, Cowbuntut);
  var buntutCow_FACES = createFacesBuffer(GL, Cowbuntut);


  //TELINGA
  var TELINGA1COW_VERTEX = createVertexBuffer(GL, Cowtelinga1);
  var TELINGA1COW_COLORS = createColorBuffer(GL, Cowtelinga1);
  var TELINGA1COW_FACES = createFacesBuffer(GL, Cowtelinga1);
  
  var TELINGA2COW_VERTEX = createVertexBuffer(GL, Cowtelinga2);
  var TELINGA2COW_COLORS = createColorBuffer(GL, Cowtelinga2);
  var TELINGA2COW_FACES = createFacesBuffer(GL, Cowtelinga2);

  var TELINGA3COW_VERTEX = createVertexBuffer(GL, Cowtelinga3);
  var TELINGA3COW_COLORS = createColorBuffer(GL, Cowtelinga3);
  var TELINGA3COW_FACES = createFacesBuffer(GL, Cowtelinga3);

  var TELINGA4COW_VERTEX = createVertexBuffer(GL, Cowtelinga4);
  var TELINGA4COW_COLORS = createColorBuffer(GL, Cowtelinga4);
  var TELINGA4COW_FACES = createFacesBuffer(GL, Cowtelinga4);

  // LEHER
  // 
  var LEHER1COW_VERTEX = createVertexBuffer(GL, Cowleher1);
  var LEHER1COW_COLORS = createColorBuffer(GL, Cowleher1);
  var LEHER1COW_FACES = createFacesBuffer(GL, Cowleher1);

  var LEHER2COW_VERTEX = createVertexBuffer(GL, Cowleher2);
  var LEHER2COW_COLORS = createColorBuffer(GL, Cowleher2);
  var LEHER2COW_FACES = createFacesBuffer(GL, Cowleher2);

  // KEPALA
  // 
  var KEPALA1COW_VERTEX = createVertexBuffer(GL, Cowkepala1);
  var KEPALA1COW_COLORS = createColorBuffer(GL, Cowkepala1);
  var KEPALA1COW_FACES = createFacesBuffer(GL, Cowkepala1);

  var KEPALA2COW_VERTEX = createVertexBuffer(GL, Cowkepala2);
  var KEPALA2COW_COLORS = createColorBuffer(GL, Cowkepala2);
  var KEPALA2COW_FACES = createFacesBuffer(GL, Cowkepala2);

  // HIDUNG
  // 

  var HIDUNGCOW_VERTEX = createVertexBuffer(GL, Cowhidung);
  var HIDUNGCOW_COLORS = createColorBuffer(GL, Cowhidung);
  var HIDUNGCOW_FACES = createFacesBuffer(GL, Cowhidung);

  // MATA
  // 
  var MATA1COW_VERTEX = createVertexBuffer(GL, Cowmata1);
  var MATA1COW_COLORS = createColorBuffer(GL, Cowmata1);
  var MATA1COW_FACES = createFacesBuffer(GL, Cowmata1);

  var MATA2COW_VERTEX = createVertexBuffer(GL, Cowmata2);
  var MATA2COW_COLORS = createColorBuffer(GL, Cowmata2);
  var MATA2COW_FACES = createFacesBuffer(GL, Cowmata2);

  var MATA3COW_VERTEX = createVertexBuffer(GL, Cowmata3);
  var MATA3COW_COLORS = createColorBuffer(GL, Cowmata3);
  var MATA3COW_FACES = createFacesBuffer(GL, Cowmata3);

  var MATA4COW_VERTEX = createVertexBuffer(GL, Cowmata4);
  var MATA4COW_COLORS = createColorBuffer(GL, Cowmata4);
  var MATA4COW_FACES = createFacesBuffer(GL, Cowmata4);

  // KAKI KIRI BELAKANG
  // 
  var KAKI_KIRI1COW_VERTEX = createVertexBuffer(GL, kakiKiriCow1);
  var KAKI_KIRI1COW_COLORS = createColorBuffer(GL, kakiKiriCow1);
  var KAKI_KIRI1COW_FACES = createFacesBuffer(GL, kakiKiriCow1);

  var KAKI_KIRI2COW_VERTEX = createVertexBuffer(GL, kakiKiriCow2);
  var KAKI_KIRI2COW_COLORS = createColorBuffer(GL, kakiKiriCow2);
  var KAKI_KIRI2COW_FACES = createFacesBuffer(GL, kakiKiriCow2);

  var KAKI_KIRI3COW_VERTEX = createVertexBuffer(GL, kakiKiriCow3);
  var KAKI_KIRI3COW_COLORS = createColorBuffer(GL, kakiKiriCow3);
  var KAKI_KIRI3COW_FACES = createFacesBuffer(GL, kakiKiriCow3);

  var KAKI_KIRI4COW_VERTEX = createVertexBuffer(GL, kakiKiriCow4);
  var KAKI_KIRI4COW_COLORS = createColorBuffer(GL, kakiKiriCow4);
  var KAKI_KIRI4COW_FACES = createFacesBuffer(GL, kakiKiriCow4);
  
  var KAKI_KIRI5COW_VERTEX = createVertexBuffer(GL, kakiKiriCow5);
  var KAKI_KIRI5COW_COLORS = createColorBuffer(GL, kakiKiriCow5);
  var KAKI_KIRI5COW_FACES = createFacesBuffer(GL, kakiKiriCow5);

  // KAKI KIRI BELAKANG
  // 
  var KAKI_KIRII1COW_VERTEX = createVertexBuffer(GL, kakiKiriiCow1);
  var KAKI_KIRII1COW_COLORS = createColorBuffer(GL, kakiKiriiCow1);
  var KAKI_KIRII1COW_FACES = createFacesBuffer(GL, kakiKiriiCow1);

  var KAKI_KIRII2COW_VERTEX = createVertexBuffer(GL, kakiKiriiCow2);
  var KAKI_KIRII2COW_COLORS = createColorBuffer(GL, kakiKiriCow2);
  var KAKI_KIRII2COW_FACES = createFacesBuffer(GL, kakiKiriiCow2);

  var KAKI_KIRII3COW_VERTEX = createVertexBuffer(GL, kakiKiriiCow3);
  var KAKI_KIRII3COW_COLORS = createColorBuffer(GL, kakiKiriiCow3);
  var KAKI_KIRII3COW_FACES = createFacesBuffer(GL, kakiKiriiCow3);

  var KAKI_KIRII4COW_VERTEX = createVertexBuffer(GL, kakiKiriiCow4);
  var KAKI_KIRII4COW_COLORS = createColorBuffer(GL, kakiKiriiCow4);
  var KAKI_KIRII4COW_FACES = createFacesBuffer(GL, kakiKiriiCow4);
  
  var KAKI_KIRII5COW_VERTEX = createVertexBuffer(GL, kakiKiriiCow5);
  var KAKI_KIRII5COW_COLORS = createColorBuffer(GL, kakiKiriiCow5);
  var KAKI_KIRII5COW_FACES = createFacesBuffer(GL, kakiKiriiCow5);


  // KAKI KANAN BELAKANG
  // 
  var KAKI_KANAN1COW_VERTEX = createVertexBuffer(GL, kakiKananCow1);
  var KAKI_KANAN1COW_COLORS = createColorBuffer(GL, kakiKananCow1);
  var KAKI_KANAN1COW_FACES = createFacesBuffer(GL, kakiKananCow1);

  var KAKI_KANAN2COW_VERTEX = createVertexBuffer(GL, kakiKananCow2);
  var KAKI_KANAN2COW_COLORS = createColorBuffer(GL, kakiKananCow2);
  var KAKI_KANAN2COW_FACES = createFacesBuffer(GL, kakiKananCow2);

  var KAKI_KANAN3COW_VERTEX = createVertexBuffer(GL, kakiKananCow3);
  var KAKI_KANAN3COW_COLORS = createColorBuffer(GL, kakiKananCow3);
  var KAKI_KANAN3COW_FACES = createFacesBuffer(GL, kakiKananCow3);

  var KAKI_KANAN4COW_VERTEX = createVertexBuffer(GL, kakiKananCow4);
  var KAKI_KANAN4COW_COLORS = createColorBuffer(GL, kakiKananCow4);
  var KAKI_KANAN4COW_FACES = createFacesBuffer(GL, kakiKananCow4);
  
  var KAKI_KANAN5COW_VERTEX = createVertexBuffer(GL, kakiKananCow5);
  var KAKI_KANAN5COW_COLORS = createColorBuffer(GL, kakiKananCow5);
  var KAKI_KANAN5COW_FACES = createFacesBuffer(GL, kakiKananCow5);

  // KAKI KANAN DEPAN
  // 
  var KAKI_KANANN1COW_VERTEX = createVertexBuffer(GL, kakiKanannCow1);
  var KAKI_KANANN1COW_COLORS = createColorBuffer(GL, kakiKanannCow1);
  var KAKI_KANANN1COW_FACES = createFacesBuffer(GL, kakiKanannCow1);

  var KAKI_KANANN2COW_VERTEX = createVertexBuffer(GL, kakiKanannCow2);
  var KAKI_KANANN2COW_COLORS = createColorBuffer(GL, kakiKanannCow2);
  var KAKI_KANANN2COW_FACES = createFacesBuffer(GL, kakiKanannCow2);

  var KAKI_KANANN3COW_VERTEX = createVertexBuffer(GL, kakiKanannCow3);
  var KAKI_KANANN3COW_COLORS = createColorBuffer(GL, kakiKanannCow3);
  var KAKI_KANANN3COW_FACES = createFacesBuffer(GL, kakiKanannCow3);

  var KAKI_KANANN4COW_VERTEX = createVertexBuffer(GL, kakiKanannCow4);
  var KAKI_KANANN4COW_COLORS = createColorBuffer(GL, kakiKanannCow4);
  var KAKI_KANANN4COW_FACES = createFacesBuffer(GL, kakiKanannCow4);
  
  var KAKI_KANANN5COW_VERTEX = createVertexBuffer(GL, kakiKanannCow5);
  var KAKI_KANANN5COW_COLORS = createColorBuffer(GL, kakiKanannCow5);
  var KAKI_KANANN5COW_FACES = createFacesBuffer(GL, kakiKanannCow5);


  // RAHANG
  var RAHANGCOW_VERTEX = createVertexBuffer(GL, Cowrahang);
  var RAHANGCOW_COLORS = createColorBuffer(GL, Cowrahang);
  var RAHANGCOW_FACES = createFacesBuffer(GL, Cowrahang);

  //////////////////////////////////////////////////////////////////////////////////////// HUMAN //////////////////////////////////////////////////////////////////////////////////////
  
  //matrix
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -70);


  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var time_prev = 0;

    function drawObject(vertexBuffer, colorBuffer, facesBuffer, facesLength) {
      GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, facesBuffer);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, facesLength, GL.UNSIGNED_SHORT, 0);
  };
  
  var animate = function(time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    
      // TIME CONTROL
      var dt = time - time_prev;
      time_prev = time;

      MODEL_MATRIX = LIBS.get_I4();
    
      if (!drag) {
        dx *= friction;
        dy *= friction;
    
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }
    
      LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
  

  GL.flush();

  window.requestAnimationFrame(animate);

  

};

var animateCow = function (time) {
  GL.viewport(0, 0, CANVAS.width, CANVAS.height);
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

  // 
  // TIME CONTROL
  // 
  var dt = time - time_prev;
  time_prev = time;

  if (!drag) {
    dx *= friction;
    dy *= friction;

    theta += (dx * 2 * Math.PI) / CANVAS.width;
    alpha += (dy * 2 * Math.PI) / CANVAS.height;
  }

  MODEL_MATRIX = LIBS.get_I4();
  LIBS.rotateY(MODEL_MATRIX, theta);
  LIBS.rotateX(MODEL_MATRIX, alpha);


  //BASE
  drawObject(BASE_VERTEX, BASE_COLORS, BASE_FACES, base.faces.length);

  // LEHER
  drawObject(LEHER1_VERTEX, LEHER1_COLORS, LEHER1_FACES, leher1.faces.length);
  drawObject(LEHER2_VERTEX, LEHER2_COLORS, LEHER2_FACES, leher2.faces.length);
  
  // Pita
  drawObject(PITA_VERTEX, PITA_COLORS, PITA_FACES, pita.faces.length);
  
  // BADAN
  drawObject(BADAN1_VERTEX, BADAN1_COLORS, BADAN1_FACES, badan1.faces.length);
  
  // EKOR
  drawObject(EKOR_VERTEX, EKOR_COLORS, EKOR_FACES, ekor.faces.length);
  
  //KAKI
  drawObject(KAKI_KIRI3_VERTEX, KAKI_KIRI3_COLORS, KAKI_KIRI3_FACES, kakiKiri3.faces.length);
  drawObject(KAKI_KIRI4_VERTEX, KAKI_KIRI4_COLORS, KAKI_KIRI4_FACES, kakiKiri4.faces.length);
  drawObject(KAKI_KANAN3_VERTEX, KAKI_KANAN3_COLORS, KAKI_KANAN3_FACES, kakiKanan3.faces.length);
  drawObject(KAKI_KANAN4_VERTEX, KAKI_KANAN4_COLORS, KAKI_KANAN4_FACES, kakiKanan4.faces.length);
  drawObject(KAKI_KIRII3_VERTEX, KAKI_KIRII3_COLORS, KAKI_KIRII3_FACES, kakiKirii3.faces.length);
  drawObject(KAKI_KIRII4_VERTEX, KAKI_KIRII4_COLORS, KAKI_KIRII4_FACES, kakiKirii4.faces.length);
  drawObject(KAKI_KANANN3_VERTEX, KAKI_KANANN3_COLORS, KAKI_KANANN3_FACES, kakiKanann3.faces.length); 
  drawObject(KAKI_KANANN4_VERTEX, KAKI_KANANN4_COLORS, KAKI_KANANN4_FACES, kakiKanann4.faces.length); 

          //BASE
          drawObject(BASE_VERTEX, BASE_COLORS, BASE_FACES, base.faces.length);
          drawObject(POHON_VERTEX, POHON_COLORS, POHON_FACES, pohon.faces.length);
          drawObject(DAUN1_VERTEX, DAUN1_COLORS, DAUN1_FACES, daun1.faces.length);
          drawObject(DAUN2_VERTEX, DAUN2_COLORS, DAUN2_FACES, daun2.faces.length);
          drawObject(DAUN3_VERTEX, DAUN3_COLORS, DAUN3_FACES, daun3.faces.length);
          drawObject(POHON2_VERTEX, POHON2_COLORS, POHON2_FACES, pohon2.faces.length);
          drawObject(DAUN4_VERTEX, DAUN4_COLORS, DAUN4_FACES, daun4.faces.length);
          drawObject(DAUN5_VERTEX, DAUN5_COLORS, DAUN5_FACES, daun5.faces.length);
          drawObject(DOOR_VERTEX, DOOR_COLORS, DOOR_FACES, door.faces.length);
          drawObject(BARN_VERTEX, BARN_COLORS, BARN_FACES, barn.faces.length);
          drawObject(BANGUN_VERTEX, BANGUN_COLORS, BANGUN_FACES, bangun.faces.length);


  /////////////////////////////////////////////////////////////////////////////////////// COW ////////////////////////////////////////////////////////////////////////////////////


  // BADAN
  // 

  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN1COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowbadan1.faces.length, GL.UNSIGNED_SHORT, 0);

  // Badan Warna
  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN2COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowbadan2.faces.length, GL.UNSIGNED_SHORT, 0);


  // 
  // BADAN BAWAH
  // 

  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN_BAWAHCOW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, BADAN_BAWAHCOW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BADAN_BAWAHCOW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, CowbadanBawah.faces.length, GL.UNSIGNED_SHORT, 0);

   // TUBE ATAS KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN1COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow1.faces.length, GL.UNSIGNED_SHORT, 0);

   //BALL ATAS KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN2COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


  GL.drawElements(GL.TRIANGLES, kakiKananCow2.faces.length, GL.UNSIGNED_SHORT, 0);

  //BALL BAWAH KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN3COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow3.faces.length, GL.UNSIGNED_SHORT, 0);

  // TUBE BAWAH KAKI KANAN
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN4COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow4.faces.length, GL.UNSIGNED_SHORT, 0);

   // SPHERE KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);     
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN5COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow5.faces.length, GL.UNSIGNED_SHORT, 0);


    // TUBE ATAS KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN1COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow1.faces.length, GL.UNSIGNED_SHORT, 0);

   //BALL ATAS KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN2COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


  GL.drawElements(GL.TRIANGLES, kakiKananCow2.faces.length, GL.UNSIGNED_SHORT, 0);

  //BALL BAWAH KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN3COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow3.faces.length, GL.UNSIGNED_SHORT, 0);

  // TUBE BAWAH KAKI KANAN
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN4COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow4.faces.length, GL.UNSIGNED_SHORT, 0);

   // SPHERE KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);     
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN5COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow5.faces.length, GL.UNSIGNED_SHORT, 0);

    // TUBE ATAS KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN1COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN1COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow1.faces.length, GL.UNSIGNED_SHORT, 0);

   //BALL ATAS KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN2COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


  GL.drawElements(GL.TRIANGLES, kakiKananCow2.faces.length, GL.UNSIGNED_SHORT, 0);

  //BALL BAWAH KAKI KANAN

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN3COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow3.faces.length, GL.UNSIGNED_SHORT, 0);

  // TUBE BAWAH KAKI KANAN
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN4COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKananCow4.faces.length, GL.UNSIGNED_SHORT, 0);

   // SPHERE KAKI KANAN
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);     
   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANAN5COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANAN5COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKananCow5.faces.length, GL.UNSIGNED_SHORT, 0);



    // TUBE ATAS KAKI KANAN DEPAN
    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN1COW_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN1COW_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANANN1COW_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakiKanannCow1.faces.length, GL.UNSIGNED_SHORT, 0);

    //BALL ATAS KAKI KANAN DEPAN

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN2COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN2COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANANN2COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


   GL.drawElements(GL.TRIANGLES, kakiKanannCow2.faces.length, GL.UNSIGNED_SHORT, 0);

   //BALL BAWAH KAKI KANAN DEPAN

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN3COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN3COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANANN3COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKanannCow3.faces.length, GL.UNSIGNED_SHORT, 0);

   // TUBE BAWAH KAKI KANAN DEPAN

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN4COW_VERTEX);
   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN4COW_COLORS);
   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANANN4COW_FACES);

   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

   GL.drawElements(GL.TRIANGLES, kakiKanannCow4.faces.length, GL.UNSIGNED_SHORT, 0);

    // SPHERE KAKI KANAN DEPAN

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN5COW_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);     
    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KANANN5COW_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KANANN5COW_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, kakiKanannCow5.faces.length, GL.UNSIGNED_SHORT, 0);


  // TUBE ATAS KAKI KIRI
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRI1COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKiriCow1.faces.length, GL.UNSIGNED_SHORT, 0);

  //BALL ATAS KAKI KIRI
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRI2COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


  GL.drawElements(GL.TRIANGLES, kakiKiriCow2.faces.length, GL.UNSIGNED_SHORT, 0);

  //BALL BAWAH KAKI KIRI 
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRI3COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKiriCow3.faces.length, GL.UNSIGNED_SHORT, 0);


  // TUBE BAWAH KAKI KIRI
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRI4COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKiriCow4.faces.length, GL.UNSIGNED_SHORT, 0);

  // SPHERE KAKI KIRI
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI5COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRI5COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRI5COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, kakiKiriCow5.faces.length, GL.UNSIGNED_SHORT, 0);

        // TUBE ATAS KAKI KIRI
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII1COW_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII1COW_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRII1COW_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kakiKiriiCow1.faces.length, GL.UNSIGNED_SHORT, 0);
    
        //BALL ATAS KAKI KIRI
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII2COW_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII2COW_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRII2COW_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    
        GL.drawElements(GL.TRIANGLES, kakiKiriiCow2.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
        //BALL BAWAH KAKI KIRI
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII3COW_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII3COW_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRII3COW_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kakiKiriiCow3.faces.length, GL.UNSIGNED_SHORT, 0);
    
    
        // TUBE BAWAH KAKI KIRI
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII4COW_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII4COW_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRII4COW_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kakiKiriiCow4.faces.length, GL.UNSIGNED_SHORT, 0);
    
        // SPHERE KAKI KIRI
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII5COW_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_KIRII5COW_COLORS);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_KIRII5COW_FACES);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
        GL.drawElements(GL.TRIANGLES, kakiKiriiCow5.faces.length, GL.UNSIGNED_SHORT, 0);

    ////////////////////////////////////////////////////////////////////////////////////////// HUMAN ////////////////////////////////////////////////////////////////////////////////

    // TUBE ATAS
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KIRI1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKiri1.faces.length, GL.UNSIGNED_SHORT, 0);

    //BALL ATAS

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KIRI2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


    GL.drawElements(GL.TRIANGLES, humantanganKiri2.faces.length, GL.UNSIGNED_SHORT, 0);


    //BALL Bawah

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KIRI3_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKiri3.faces.length, GL.UNSIGNED_SHORT, 0);


    // TUBE BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KIRI4_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKiri4.faces.length, GL.UNSIGNED_SHORT, 0);

    // SPHERE TANGAN
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KIRI5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KIRI5_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKiri5.faces.length, GL.UNSIGNED_SHORT, 0);

    // 
    // TANGAN KANAN
    //

    // TUBE ATAS
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KANAN1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKanan1.faces.length, GL.UNSIGNED_SHORT, 0);

    //BALL ATAS

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KANAN2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


    GL.drawElements(GL.TRIANGLES, humantanganKanan2.faces.length, GL.UNSIGNED_SHORT, 0);


    //BALL Bawah

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KANAN3_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKanan3.faces.length, GL.UNSIGNED_SHORT, 0);


    // TUBE BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KANAN4_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKanan4.faces.length, GL.UNSIGNED_SHORT, 0);

    // SPHERE TANGAN
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTANGAN_KANAN5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTANGAN_KANAN5_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantanganKanan5.faces.length, GL.UNSIGNED_SHORT, 0);


    // 
    // BADAN
    // 

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANBADAN1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanbadan1.faces.length, GL.UNSIGNED_SHORT, 0);

    // Badan Warna
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANBADAN2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanbadan2.faces.length, GL.UNSIGNED_SHORT, 0);


    // 
    // BADAN BAWAH
    // 

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN_BAWAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANBADAN_BAWAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANBADAN_BAWAH_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanbadanBawah.faces.length, GL.UNSIGNED_SHORT, 0);

    // 
    // LEHER
    // 

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANLEHER1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanleher1.faces.length, GL.UNSIGNED_SHORT, 0);

    //Leher
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANLEHER3_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanleher3.faces.length, GL.UNSIGNED_SHORT, 0);

    // Collar
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANLEHER2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANLEHER2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humanleher2.faces.length, GL.UNSIGNED_SHORT, 0);

    //
    //TAS
    //
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTAS1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humantas1.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTAS2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humantas2.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTAS3_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humantas3.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTAS4_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humantas4.faces.length, GL.UNSIGNED_SHORT, 0);

    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTAS5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTAS5_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humantas5.faces.length, GL.UNSIGNED_SHORT, 0);



    // 
    // KEPALA
    // 

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKEPALA1_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humankepala1.faces.length, GL.UNSIGNED_SHORT, 0);


    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKEPALA2_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humankepala2.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKEPALA3_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humankepala3.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKEPALA4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKEPALA4_FACES);
    
    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
    
    GL.drawElements(GL.TRIANGLES, humankepala4.faces.length, GL.UNSIGNED_SHORT, 0);

    //
    //TOPI
    //
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTOPI1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANTOPI1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANTOPI1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humantopi1.faces.length, GL.UNSIGNED_SHORT, 0);

    // 
    // KAKI KIRI
    //

    // TUBE ATAS
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KIRI1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKiri1.faces.length, GL.UNSIGNED_SHORT, 0);

    //BALL ATAS

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KIRI2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


    GL.drawElements(GL.TRIANGLES, humankakiKiri2.faces.length, GL.UNSIGNED_SHORT, 0);


    //BALL Bawah

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KIRI3_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKiri3.faces.length, GL.UNSIGNED_SHORT, 0);


    // TUBE BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KIRI4_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKiri4.faces.length, GL.UNSIGNED_SHORT, 0);

    // SPHERE KAKI
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KIRI5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KIRI5_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKiri5.faces.length, GL.UNSIGNED_SHORT, 0);

    // 
    // MATA 
    // 
    
    // RETINA
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANMATA1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humanmata1.faces.length, GL.UNSIGNED_SHORT, 0);

    // PUPIL

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANMATA2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


    GL.drawElements(GL.TRIANGLES, humanmata2.faces.length, GL.UNSIGNED_SHORT, 0);


    // RETINA
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANMATA3_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humanmata3.faces.length, GL.UNSIGNED_SHORT, 0);


    // PUPIL
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANMATA4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANMATA4_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humanmata4.faces.length, GL.UNSIGNED_SHORT, 0);


    // 
    // KAKI KANAN
    //

    // TUBE ATAS
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KANAN1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKanan1.faces.length, GL.UNSIGNED_SHORT, 0);

    //BALL ATAS

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KANAN2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


    GL.drawElements(GL.TRIANGLES, humankakiKanan2.faces.length, GL.UNSIGNED_SHORT, 0);


    //BALL Bawah

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN3_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN3_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KANAN3_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKanan3.faces.length, GL.UNSIGNED_SHORT, 0);


    // TUBE BAWAH
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN4_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN4_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KANAN4_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKanan4.faces.length, GL.UNSIGNED_SHORT, 0);

    // SPHERE KAKI
    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN5_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HUMANKAKI_KANAN5_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HUMANKAKI_KANAN5_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, humankakiKanan5.faces.length, GL.UNSIGNED_SHORT, 0);
    GL.flush();
    


    ///////////////////////////////////////////////////////////////////////////////////// ANIMATION /////////////////////////////////////////////////////////////////////////////////

  
  window.requestAnimationFrame(animateCow);
};
  var jalanKanan = 0;
  var speedJalanKanan = 0.03;
  var angleKanan;
  var rangeKanan;
  var animateCowHead = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
  
    // TIME CONTROL
    var dt = time - time_prev;
    time_prev = time;

    MODEL_MATRIX = LIBS.get_I4();
  
    if (!drag) {
      dx *= friction;
      dy *= friction;
  
      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }
  
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    jalanKanan += speedJalanKanan;

    rangeKanan = Math.PI/150; 

    angleKanan = Math.sin(jalanKanan)*rangeKanan;

    LIBS.rotateZ(MODEL_MATRIX, angleKanan);

    // Draw each object

    // RAHANG
  GL.bindBuffer(GL.ARRAY_BUFFER, RAHANGCOW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, RAHANGCOW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RAHANGCOW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, Cowrahang.faces.length, GL.UNSIGNED_SHORT, 0);


  // RETINA
  GL.bindBuffer(GL.ARRAY_BUFFER, MATA1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, MATA1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA1COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, Cowmata1.faces.length, GL.UNSIGNED_SHORT, 0);

  // PUPIL

  GL.bindBuffer(GL.ARRAY_BUFFER, MATA2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, MATA2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA2COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);


  GL.drawElements(GL.TRIANGLES, Cowmata2.faces.length, GL.UNSIGNED_SHORT, 0);


  // RETINA
  GL.bindBuffer(GL.ARRAY_BUFFER, MATA3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, MATA3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA3COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, Cowmata3.faces.length, GL.UNSIGNED_SHORT, 0);


  // PUPIL
  GL.bindBuffer(GL.ARRAY_BUFFER, MATA4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, MATA4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA4COW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, Cowmata4.faces.length, GL.UNSIGNED_SHORT, 0);


  // HIDUNG
  GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNGCOW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, HIDUNGCOW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HIDUNGCOW_FACES);

  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

  GL.drawElements(GL.TRIANGLES, Cowhidung.faces.length, GL.UNSIGNED_SHORT, 0);

    // TELINGA 

  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA1COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowtelinga1.faces.length, GL.UNSIGNED_SHORT, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA2COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowtelinga2.faces.length, GL.UNSIGNED_SHORT, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA3COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA3COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA3COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowtelinga3.faces.length, GL.UNSIGNED_SHORT, 0);


  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA4COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, TELINGA4COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELINGA4COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowtelinga4.faces.length, GL.UNSIGNED_SHORT, 0);


  // LEHER
  // 

  GL.bindBuffer(GL.ARRAY_BUFFER, LEHER1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, LEHER1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEHER1COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowleher1.faces.length, GL.UNSIGNED_SHORT, 0);

  // Collar
  GL.bindBuffer(GL.ARRAY_BUFFER, LEHER2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, LEHER2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEHER2COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowleher2.faces.length, GL.UNSIGNED_SHORT, 0);

  // BUNTUT

  GL.bindBuffer(GL.ARRAY_BUFFER, buntutCow_VERTREX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, buntutCow_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buntutCow_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowbuntut.faces.length, GL.UNSIGNED_SHORT, 0);


  // 
  // KEPALA
  // 

  GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA1COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA1COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KEPALA1COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowkepala1.faces.length, GL.UNSIGNED_SHORT, 0);

  GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA2COW_VERTEX);
  GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ARRAY_BUFFER, KEPALA2COW_COLORS);
  GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KEPALA2COW_FACES);
  
  GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
  GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
  GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
  GL.drawElements(GL.TRIANGLES, Cowkepala2.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.flush();
  
    window.requestAnimationFrame(animateCowHead);
  };

  var animateDogHead = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);

    // TIME CONTROL
    var dt = time - time_prev;
    time_prev = time;

    MODEL_MATRIX = LIBS.get_I4();

    if (!drag) {
        dx *= friction;
        dy *= friction;

        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    jalanKanan += speedJalanKanan;

    rangeKanan = Math.PI / 25; // jarak

    angleKanan = Math.sin(jalanKanan) * rangeKanan; // sudut

    // Ubah sudut rotasi dari X menjadi Z untuk membuat gerakan maju mundur
    LIBS.rotateX(MODEL_MATRIX, angleKanan);

    // Draw each object

    // KEPALA
  drawObject(KEPALA1_VERTEX, KEPALA1_COLORS, KEPALA1_FACES, kepala1.faces.length);
  drawObject(KEPALA2_VERTEX, KEPALA2_COLORS, KEPALA2_FACES, kepala2.faces.length);
  
  // TELINGA
  drawObject(TELINGA1_VERTEX, TELINGA1_COLORS, TELINGA1_FACES, telinga1.faces.length);
  drawObject(TELINGA2_VERTEX, TELINGA2_COLORS, TELINGA2_FACES, telinga2.faces.length);
    // RAHANG
  drawObject(RAHANG_VERTEX, RAHANG_COLORS, RAHANG_FACES, rahang.faces.length);
  
  // MATA
  drawObject(MATA1_VERTEX, MATA1_COLORS, MATA1_FACES, mata1.faces.length);
  drawObject(MATA2_VERTEX, MATA2_COLORS, MATA2_FACES, mata2.faces.length);
  drawObject(MATA3_VERTEX, MATA3_COLORS, MATA3_FACES, mata3.faces.length);
  drawObject(MATA4_VERTEX, MATA4_COLORS, MATA4_FACES, mata4.faces.length);
  
  // HIDUNG
  drawObject(HIDUNG_VERTEX, HIDUNG_COLORS, HIDUNG_FACES, hidung.faces.length);
    

    GL.flush();

    window.requestAnimationFrame(animateDogHead);
};

  animate(0);
  animateCow(0);
  animateDogHead(0);
  animateCowHead(0);


}

window.addEventListener("load", main);
