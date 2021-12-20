var phongMaterial = new THREE.MeshPhongMaterial( { color: __color_tonic});

// var CUBE_MATRIX_COLM = 0;
// var CUBE_MATRIX_ROWS = 0;

function formLandscape_old(sectorX, sectorY, altitudes) {
  // Geometries
  // var lambertMaterial = new THREE.MeshLambertMaterial( { color: __color_tonic } );
  

  var cubeW = MATRIX_W/altitudes.length;
  var cubeH = MATRIX_H/altitudes.length;
  var geometry = new THREE.BoxBufferGeometry( cubeW, 2, cubeH );
  for (var c = 0; c < altitudes.length; c++) {
    for (var r = 0; r < altitudes.length; r++) {
      var cube = new THREE.Mesh( geometry, phongMaterial);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.position.x = (MATRIX_W/2 - (altitudes.length - c) * cubeW + cubeW/2 + sectorX*MATRIX_W);// * 1.05;
      cube.position.y = 0;
      cube.position.z = (MATRIX_H/2 - (altitudes.length - r) * cubeH + cubeH/2 + sectorY*MATRIX_H);// * 1.05;
      cube.scale.y = Math.max(altitudes[c][r]/800, 0.01);

      if (cube.scale.y != 0.01) {
        // Change non flat cubes to brown for visual aesthetic
        if (cube.scale.y > 0.4) {
          // brown
          scale_max = 1
          scale_min = 0.4
          scale_spread = Math.min(cube.scale.y, scale_max) - scale_min
          scale = (Math.min(cube.scale.y, scale_max) - scale_min) / (scale_max - scale_min)
          min = {r: 112, g: 64, b: 16}
          max = {r: 222, g: 172, b: 97}
          d = {r: (max.r - min.r) * scale, g: (max.g - min.g) * scale, b: (max.b - min.b) * scale}
          // cube.material.color.set(`rgb(${min.r + d.r}, ${min.g + d.g}, ${min.b + d.b})`);
          cube.material.color.set("rgb(112, 64, 16)"); // brown
          // cube.material.color.set("rgb(222, 172, 97)"); // lightgray
        } else if (cube.scale.y > 0.02) {
          // green
          cube.material.color.set("rgb(40, 115, 0)");
        } else {
          // yellow
          cube.material.color.set("rgb(220, 193, 12)");
        }
      }

      scene.add(cube);
    }
  }
}






  // Ground
  var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
  var ground = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: __color_foreground}));
  ground.position.set( 0, 0, 0 );
  ground.rotation.x = - Math.PI / 2;
  ground.scale.set( 100, 100, 100 );
  ground.castShadow = false;
  ground.receiveShadow = true;
  scene.add( ground );









  const ELEVATION_DATA_FIDELITY = 10812;
  const REDUCTION = 100; // ensure reduction fidelity is available in elevation_data
  
  loadJSON('elevation_data/n34w119_f'+REDUCTION+'.json',
         function(data) {
           formLandscape(1, 0, data);
         },
         function(xhr) { console.error(xhr); }
  );
  loadJSON('elevation_data/n35w119_f'+REDUCTION+'.json',
         function(data) {
           formLandscape(0, 0, data);
         },
         function(xhr) { console.error(xhr); }
  );
  loadJSON('elevation_data/n34w118_f'+REDUCTION+'.json',
         function(data) {
           formLandscape(1, -1, data);
         },
         function(xhr) { console.error(xhr); }
  );
  loadJSON('elevation_data/n35w118_f'+REDUCTION+'.json',
         function(data) {
           formLandscape(0, -1, data);
         },
         function(xhr) { console.error(xhr); }
  );