import React from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';

var camera, camera2, controls, scene, scene2, renderer, renderer2, lightHolder
var raycaster, mouse, intersected
var faces, geomEdges
var controlMovement = false;
var clickOutside = false;
var mouseIn = true;

// colors:
var faceUnselectedColor = 0x156289;
var faceSelectedColor = 0xe0590b;

var edgeUnselectedColor = 0x000000;
var edgeSelectedColor = 0xffff00;


class ThreeJSViewer extends React.Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this)
    this.viewCube = this.viewCube.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.delete3DOBJ = this.delete3DOBJ.bind(this)
    this.cameraSmoothMove = this.cameraSmoothMove.bind(this)
    this.cameraPosition = this.cameraPosition.bind(this)
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this)
    this.onFaceClick = this.onFaceClick.bind(this)
    this.onEdgeClick = this.onEdgeClick.bind(this)
    this.setDefultFaceColor = this.setDefultFaceColor.bind(this)
    this.setDefultEdgeColor = this.setDefultEdgeColor.bind(this)

  }

  animate = function () {
    requestAnimationFrame(this.animate);
    controls.update();

    // cube orientation update based on the main scene camera
    camera2.position.copy(camera.position);
    camera2.position.sub(controls.target);
    camera2.position.setLength(300);
    camera2.lookAt(scene2.position);

    // fix the light 
    lightHolder.quaternion.copy(camera.quaternion);

    // show raycaster effects 
    if (this.props.visualizerItems.select.enabled) {
      raycaster.setFromCamera(mouse, camera);

      switch (this.props.visualizerItems.select.type) {
        case "face":
          var intersects = raycaster.intersectObjects(faces.children, true);
          break;
        case "edge":
          var intersects = raycaster.intersectObjects(geomEdges.children, true);
          break
      }

      // this is for highlighting the selection
      if (intersects.length > 0) {
        if (intersects[0].object != intersected) {
          if (intersected)
            intersected.material.color.setHex(intersected.currentHex);
          intersected = intersects[0].object;
          intersected.currentHex = intersected.material.color.getHex();
          intersected.material.color.setHex(0xff0000);
        }
      }
      else // there are no intersections
      {
        if (intersected)
          intersected.material.color.setHex(intersected.currentHex);
        intersected = null;
      }
    }
    // render 
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);
  };

  cameraSmoothMove(newCameraPosition, newTargetPosition) {
    var numSteps = 15;
    var timeOut = 10;
    var oldCameraPosition = camera.position;
    var difPosition = {
      dx: (newCameraPosition.x - oldCameraPosition.x) / numSteps,
      dy: (newCameraPosition.y - oldCameraPosition.y) / numSteps,
      dz: (newCameraPosition.z - oldCameraPosition.z) / numSteps
    }
    var oldTargetPosition = controls.target
    var difTarget = {
      dx: (newTargetPosition.x - oldTargetPosition.x) / numSteps,
      dy: (newTargetPosition.y - oldTargetPosition.y) / numSteps,
      dz: (newTargetPosition.z - oldTargetPosition.z) / numSteps
    }

    var step = 1;
    var move = setInterval(() => {
      camera.position.x += difPosition.dx;
      camera.position.y += difPosition.dy;
      camera.position.z += difPosition.dz;
      controls.target.x += difTarget.dx;
      controls.target.y += difTarget.dy;
      controls.target.z += difTarget.dz;

      if (step == numSteps) {
        clearInterval(move);
      }
      step += 1;
    }, timeOut);
  }

  setDefultFaceColor() {
    faces.children.forEach(
      (e) => {
        e.material.color.set(faceUnselectedColor)
      })
  }

  setDefultEdgeColor() {
    geomEdges.children.forEach(
      (e) => {
        e.material.color.set(edgeUnselectedColor);
      }
    )
  }

  onFaceClick(face) {
    var intersects = raycaster.intersectObjects(face.children, true);
    if (intersects.length > 0) {
      clickOutside = false;
      var intersect = intersects[0].object;
      if (intersect.currentHex != faceSelectedColor) {
        intersected.currentHex = faceSelectedColor;
        this.props.addBoundaryCondition(intersected.name, "face")
      } else {
        this.props.removeBoundaryCondition(intersected.name, "face")
        intersected.currentHex = faceUnselectedColor;
      }
    } else if (mouseIn) { clickOutside = true }

    if (!controlMovement && clickOutside) {
      this.props.removeBoundaryCondition(null, "removeAll");
      this.setDefultFaceColor();
    }
    controlMovement = false;
  }


  onEdgeClick(edge) {
    var intersects = raycaster.intersectObjects(edge.children, true);
    if (intersects.length > 0) {
      clickOutside = false;
      var intersect = intersects[0].object;
      if (intersect.currentHex != edgeSelectedColor) {
        intersected.currentHex = edgeSelectedColor;
        this.props.addBoundaryCondition(intersected.name, "edge")
      } else {
        this.props.removeBoundaryCondition(intersected.name, "edge")
        intersected.currentHex = edgeUnselectedColor;
      }
    } else if (mouseIn) { clickOutside = true }

    if (!controlMovement && clickOutside) {
      this.props.removeBoundaryCondition(null, "removeAll");
      this.setDefultEdgeColor();
    }
    controlMovement = false;
  }

  delete3DOBJ(objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
    this.animate();
  }

  cameraPosition() {
    return ({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    })
  }

  cameraUp() {
    return ({
      x: camera.up.x,
      y: camera.up.y,
      z: camera.up.z,
    })
  }


  onWindowResize = function () {
    var width = this.mainScene.clientWidth;
    var height = 0.97 * (window.document.documentElement.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  viewCube() {

    var size = 150;
    // renderer for view cube
    renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer2.setSize(200, 200);
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.sortObjects = false;
    this.cubeView.appendChild(renderer2.domElement);

    // scene for orientation view cube
    scene2 = new THREE.Scene();

    // lighting
    scene2.add(new THREE.AmbientLight(0xffffff));

    // camera
    camera2 = new THREE.PerspectiveCamera(70, 200 / 200, 1, 500);
    camera2.up = camera.up; // important!
    camera2.lookAt(0, 0, 0);

    // axes helper      
    var axes = [
      [-size / 2, -size / 2, -size / 2, size / 2 + size / 4, -size / 2, -size / 2],
      [-size / 2, -size / 2, -size / 2, -size / 2, size / 2 + size / 4, -size / 2],
      [-size / 2, -size / 2, -size / 2, -size / 2, -size / 2, size / 2 + size / 4]
    ];

    var axesColor = [0xff0000, 0x00ff00, 0x0000ff];
    for (var i = 0; i < 3; i++) {
      var geometry = new LineGeometry();
      geometry.setPositions(axes[i]);
      var axesMat = new LineMaterial({
        color: axesColor[i],
        linewidth: .01, // in pixels
        dashed: false,
      });
      var line = new Line2(geometry, axesMat);
      scene2.add(line);
    }

    // box
    var boxGroup = new THREE.Group();

    // box cube
    var box = new THREE.BoxGeometry(size, size, size);
    box.rotateX(-Math.PI / 2); // due to camera.up = Z dir
    box.rotateZ(Math.PI);
    box.translate(1, 1, 1)

    // adding text to each side of the cube
    var texts = ["LEFT", "RIGHT", "BOT", "TOP", "FRONT", "BACK"];
    var materials = [];
    for (var i = 0; i < 6; i++) {
      var x = document.createElement("canvas");
      x.width = x.height = size;
      var xc = x.getContext("2d");
      xc.translate(size / 2, size / 2);
      xc.rotate(Math.PI);
      xc.translate(-size / 2, -size / 2);
      xc.fillStyle = "#eeeeee";
      xc.fillRect(0, 0, size, size);
      xc.fillStyle = "black";
      xc.font = "25pt arial bold";
      xc.textAlign = 'center'
      xc.fillText(texts[i], size / 2, size / 2 + 10);

      var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(x), transparent: true, opacity: 0.8 });
      xm.map.needsUpdate = true;
      xm.map.minFilter = THREE.LinearFilter;
      xm.map.tra
      materials.push(xm);
    }
    var cube = new THREE.Mesh(box, materials);
    cube.doubleSided = true;
    boxGroup.add(cube);

    // box wireframe
    var geometry = new LineSegmentsGeometry();
    geometry.setPositions(new THREE.EdgesGeometry(box).attributes.position.array);

    var matLine = new LineMaterial({

      color: 0x555555,
      linewidth: 0.01, // in pixels
      dashed: false

    });
    var wireframe = new Line2(geometry, matLine);
    boxGroup.add(wireframe);


    scene2.add(boxGroup);
  }

  componentDidMount() {
    var width = this.mainScene.clientWidth;
    var height = (window.document.documentElement.clientHeight);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, width / height, 0.005, 100);
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 1);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    this.mainScene.appendChild(renderer.domElement);

    // lighting
    var light = new THREE.HemisphereLight(0x888888, 0xffffff, 2);
    light.position.set(1000, 0, 0)
    scene.add(light);

    // keep the light fixed
    lightHolder = new THREE.Group();
    lightHolder.add(light);
    scene.add(lightHolder);

    // control
    controls = new TrackballControls(camera, renderer.domElement);
    controls.addEventListener('change', () => { controlMovement = true });
    // define raycaster for selection
    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 1;
    mouse = new THREE.Vector2();
    mouse.x = 1000;
    mouse.y = 1000;

    // view cube
    this.viewCube()

    // add event listeners
    window.addEventListener('resize', this.onWindowResize, false);

    this.animate();

    // window.scene = scene;
    // window.THREE = THREE;

  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    var rect = event.target.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
  }

  componentDidUpdate() {

    if (this.props.visualizerItems.cameraUpdated) {
      var cameraPosition = this.props.visualizerItems.camera.position;
      var lookAt = this.props.visualizerItems.camera.lookAt;
      var cameraUp = this.props.visualizerItems.camera.up;
      this.cameraSmoothMove(cameraPosition, lookAt);
      camera.up.set(cameraUp.x, cameraUp.y, cameraUp.z);
    }

    if (this.props.visualizerItems.geometryUpdated) {
      let faceData = this.props.visualizerItems.faces;
      let edgeData = this.props.visualizerItems.edges;
      let pointData = this.props.visualizerItems.points;
      this.delete3DOBJ("faces");
      this.delete3DOBJ("geomEdges");
      this.delete3DOBJ("geomPoints");
      this.delete3DOBJ("meshwWireframe");
      faces = new THREE.Object3D();
      var meshwWireframe = new THREE.Object3D();
      Object.keys(faceData.data).forEach(function (faceName) {
        var faceGeometry = new THREE.BufferGeometry();
        faceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(faceData.data[faceName], 3));

        // show mesh edges if required
        if (faceData.visibility) {
          var faceWireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            wireframe: true,
            wireframeLinewidth: 3
          });
          var faceWireframe = new THREE.Mesh(faceGeometry, faceWireframeMaterial);
          faceWireframe.name = `wireframe_${faceName}`;
          meshwWireframe.add(faceWireframe)
        }
        var faceMaterial = new THREE.MeshPhongMaterial({
          color: faceUnselectedColor,
          emissive: 0x000000,
          side: THREE.DoubleSide,
          flatShading: true,
        });
        var geometry = new THREE.Mesh(faceGeometry, faceMaterial);
        geometry.name = `${faceName}`
        faces.add(geometry)
      });
      faces.name = "faces";
      scene.add(faces);
      meshwWireframe.name = "meshwWireframe";
      scene.add(meshwWireframe);

      // geometry edges
      geomEdges = new THREE.Object3D();
      Object.keys(edgeData.data).forEach(function (edgeName) {
        var edgeGeometry = new LineGeometry();
        edgeGeometry.setPositions(edgeData.data[edgeName]);
        var edgeUnselectedMaterial = new LineMaterial({
          color: edgeUnselectedColor,
          linewidth: .003, // in pixels
          dashed: false,
        });
        var line = new Line2(edgeGeometry, edgeUnselectedMaterial);
        line.name = `${edgeName}`
        geomEdges.add(line);
      });
      geomEdges.name = "geomEdges"
      scene.add(geomEdges);

      // points
      if (pointData.visibility) {
        var geomPoints = new THREE.Object3D();
        Object.keys(pointData.data).forEach(function (pointName) {
          var pointGeometry = new THREE.Geometry();
          pointGeometry.vertices.push(new THREE.Vector3(
            pointData.data[pointName][0],
            pointData.data[pointName][1],
            pointData.data[pointName][2]))
          var pointMaterial = new THREE.PointsMaterial({ size: .01, color: 0x9b34eb, visible: false });
          var point = new THREE.Points(pointGeometry, pointMaterial);
          point.name = `point_${pointName}`
          geomPoints.add(point);
        });
        geomPoints.name = "geomPoints"
        scene.add(geomPoints);
      }
    }

    // raycasting to select geometries
    if (this.props.visualizerItems.select.enabled) {
      let type = this.props.visualizerItems.select.type;
      this.mainScene.onmousemove = this.onDocumentMouseMove

      //remove previous event listeners

      switch (type) {
        case "face":
          this.mainScene.onclick = this.onFaceClick.bind(this, faces);
          this.setDefultEdgeColor();
          break;
        case "edge":
          this.mainScene.onclick = this.onEdgeClick.bind(this, geomEdges);
          this.setDefultFaceColor();
          break;
        default:
          console.log("check the selector name")
      }

    } else if (faces) {
      this.mainScene.onmousemove = '';
      this.mainScene.onclick = '';
      this.setDefultFaceColor();
      this.setDefultEdgeColor();
    }

  }
  render() {
    return (
        <div style={{ position: "fixed", width:"75%", height: "100vh" }}>
          <div
            ref={ref => (this.mainScene = ref)}
            onMouseOut={() => { mouseIn = false }}
            onMouseOver={() => { mouseIn = true }} />
          <div ref={ref => (this.cubeView = ref)}
            style={{ position: "absolute", right: "0", bottom: "0", height: "200px", width: "200px" }} />
        </div>
    )
  }
}

export default ThreeJSViewer