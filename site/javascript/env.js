
// ID references
var renderPanel = document.getElementById("panel-render");

// ThreeJS
var renderer = new THREE.WebGLRenderer();
renderer.setSize( renderPanel.offsetWidth, renderPanel.offsetHeight );
renderer.setPixelRatio( window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
renderPanel.appendChild( renderer.domElement );
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, renderPanel.offsetWidth/renderPanel.offsetHeight, 10, 1000 );
camera.position.set(600, 100, 0);

// Controls
var controls = new THREE.OrbitControls( camera , renderer.domElement);
controls.maxPolarAngle = Math.PI/2 - Math.PI/180;
controls.enablePan = true;
controls.keyPanSpeed = 100;
controls.update();

const MATRIX_W = 12;
const MATRIX_H = 12;

(function initialObjects() {
  // Lights
  var light = new THREE.AmbientLight( __color_foreground, 0.5);
  scene.add( light );

  var light2 = new THREE.DirectionalLight( __color_foreground, 1);
  light2.position.set( 3, 4, 2 );
  light2.castShadow = true;
  scene.add( light2 );
})();

/**
 *  Landscape generation. Specifying a sector X and Y offsets the generated landscape by
 *  its full width;
 * @returns the created landscape
 */
function formLandscape(data, sectorX = 1, sectorY = 1) {
  let RENDER_W = 200, RENDER_H = 200
  let segments = data.length
  const geometry = new THREE.PlaneGeometry( RENDER_W, RENDER_H, segments - 1, segments - 1);
  // let mat = new THREE.MeshPhongMaterial( { color: __color_tonic});

  let buffAttr = geometry.getAttribute('position')
  let Z_DAMPER = 50

  // default color attribute
  const colors = [];

  let pushColor = z => {
    const COLOR = {
      OCEAN: [25, 25, 220].map(v => v / 255),
      SAND: [220, 193, 12].map(v => v / 255),
      GRASS: [40, 115, 0].map(v => v / 255),
      MOUNTAIN: [80, 80, 16].map(v => v / 255),
      MOUNTAIN_TALLER: [200, 100, 0].map(v => v / 255),
      SNOW: [1, 1, 1]
    }
    const DEPTH = {
      OCEAN: 4,
      SAND: 20,
      GRASS: 200 + Math.random() * 80,
      MOUNTAIN: 1200 + Math.random() * 400,
      SNOW: 9999
    }
    if (z <= DEPTH.OCEAN)
      colors.push(...COLOR.OCEAN)
    else if (z < DEPTH.SAND)
      colors.push(...COLOR.SAND)
    else if (z < DEPTH.GRASS)
      colors.push(...COLOR.GRASS)
    else if (z < DEPTH.MOUNTAIN) {
      let d = DEPTH.MOUNTAIN - DEPTH.GRASS
      let zD = Math.min((z - DEPTH.GRASS), d)
      let x = COLOR.MOUNTAIN[0] + (COLOR.MOUNTAIN_TALLER[0] - COLOR.MOUNTAIN[0]) * (zD / d)
      let y = COLOR.MOUNTAIN[1] + (COLOR.MOUNTAIN_TALLER[1] - COLOR.MOUNTAIN[1]) * (zD / d)
      let zz = COLOR.MOUNTAIN[2] + (COLOR.MOUNTAIN_TALLER[2] - COLOR.MOUNTAIN[2]) * (zD / d)
      colors.push(x, y, zz) // Gradient
    } else {
      colors.push(...COLOR.SNOW)
    }
  }

  for (let v = 0; v < buffAttr.count; v++) {
    let z = data[v % segments][parseInt(v / segments)]
    if (isNaN(z) || z < 0) z = 0
    pushColor(z)
    buffAttr.setZ(v, buffAttr.getZ(v) + z / Z_DAMPER)
  }

  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  geometry.translate(RENDER_W * sectorX, -1 * RENDER_H * sectorY, -100)
  geometry.rotateX(-Math.PI/2)

  // let buffAttrColor = geometry.getAttribute('color')

  geometry.computeVertexNormals()

  let newLandscape = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0xF5F5F5,
    vertexColors: true
  }))
  scene.add(newLandscape)
  return newLandscape
}

// ================================================================================================ Button Press Initialization =====

var updating = true;
document.onkeypress = function(e) {
	e = e || window.event;

	// pressing 'spacebar' example
	if (e.keyCode == 32) {
    updating = !updating;
    if (updating) update();
	}
};

// ======================================================================================================================== Clock =====
var RENDER_HERTZ = 1000 / 60; // Render update speed
var canvasMasterContext; // The primary canvas particles are drawn on
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
			window.setTimeout(callback, RENDER_HERTZ);
	};

function update() {
  if (!updating) {
    return;
  }

	window.requestAnimFrame(update);
	controls.update(); // need this for autoRotate or enableDamping on controls

	renderer.render(scene, camera);
}

// =================================================================================================================== JSON Loader ====

function loadJSON(path, sector) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve({data: JSON.parse(xhr.responseText), sector: sector})
        } else {
          reject(xhr)
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  })
}

// ===== Elevation Data

let generatedLandscapes = []
let elevationDataPath = '/projects/elevation-map/elevation_data'
function generateElevationAtResolution(resolution) {

  generatedLandscapes.forEach(landscape => landscape.removeFromParent())
  generatedLandscapes = []

  Promise.all([
    loadJSON(`${elevationDataPath}/n34w119_f${resolution}.json`, {x: 1, y: 0}),
    loadJSON(`${elevationDataPath}/n35w119_f${resolution}.json`, {x: 0, y: 0}),
    loadJSON(`${elevationDataPath}/n34w118_f${resolution}.json`, {x: 1, y: -1}),
    loadJSON(`${elevationDataPath}/n35w118_f${resolution}.json`, {x: 0, y: -1})
  ]).then(dataResolutions => {
    dataResolutions.forEach(d => {
      generatedLandscapes.push(formLandscape(d.data, d.sector.x, d.sector.y))
    })
    unlockResolutionControls(resolution)
  }).catch(() => {
    unlockResolutionControls("error")
  })
}

// ======================================================================================================================= Launch =====

(function start() {
  update();
  generateElevationAtResolution(100)
})();
