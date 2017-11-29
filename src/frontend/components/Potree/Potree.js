import React from "react";
import { connect } from "react-redux";
import potree from "@iconem/iconem-potree";
import Camera from "./camera";

import { selectors } from "../../modules"
const { getSelectedMedias, getSelectFilterPending, getVisibleMedias, getSelectedPointCloud } = selectors;
import { actions } from "../../modules"
const { clickMedias, selectMediaById } = actions;

@connect(store => {
  return {
    pointCloud: getSelectedPointCloud(store),
    selectedMedias: getSelectedMedias(store),
    visibleMedias: getVisibleMedias(store),
    selectFilterPending: getSelectFilterPending(store)
  };
})
export default class Potree extends React.Component {
  hovered_cam_matrix = new THREE.Matrix4();
  viewer_cam_matrix = new THREE.Matrix4();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  mediaCamera_intersected = null;
  potreeIsLoading = false;

  componentDidMount() {
    this.initViewer();
  }

  componentWillUnmount(){
    //remove pointcloud from potree (for now potree is always running event when)
    this.potree.scene.pointclouds = [];
    viewer.stopRendering();
  }

  componentWillReceiveProps(nextProps) {
    // Load pointcloud and add cameraMedia to potree
    if (
      !this.potreeIsLoading &&
      nextProps.pointCloud.metaData &&
      (this.potree.scene.pointclouds.length === 0 ||
      (nextProps.pointCloud.metaData && (nextProps.pointCloud.metaData._id !== this.props.pointCloud.metaData._id)))
    ) {
        if(nextProps.pointCloud.metaData._id !== this.props.pointCloud.metaData._id) { 
          this.potree.scene.pointclouds = []; 
        }
        this.potreeIsLoading = true;
        potree.loadPointCloud(
          `potreeviewer/potreedataset/${nextProps.pointCloud.metaData
            ._id}/cloud.js`,
          nextProps.pointCloud.metaData.name,
          (e) => {
            this.potreeIsLoading = false;
            viewer.scene.addPointCloud(e.pointcloud);
            viewer.fitToScreen();
          }
        );

        let pointCloudMedias = JSON.parse(
          nextProps.pointCloud.metaData.visus
        );
        this.addCamerasToPotree(pointCloudMedias);
    }

    // Select media on 3D viewer when a media is selected, else reset viewer view
    var currentMedia = this.props.selectedMedias[0];
    var nextMedia = nextProps.selectedMedias[0];
    if (
      this.props.pointCloud.metaData &&
      nextMedia &&
      (!currentMedia || currentMedia.properties._id !== nextMedia.properties._id)
    ) {
      let mediaCamera = this.potree.scene.scene.children.find(
        mesh => mesh.userData.mediaId === nextMedia.properties._id
      );

      if (mediaCamera) {
        this.goToMediaCamera(mediaCamera);
        mediaCamera.loadMedia();
      }
    }
    else if(!nextMedia){
      viewer.fitToScreen();
    }

    //Hide or show camera based on timeline filtering
    if (
      nextProps.visibleMedias &&
      nextProps.visibleMedias.length !== this.props.visibleMedias.length
    ) {
      this.potree.scene.scene.children.map(function(camera) {
        var isCameraVisible = nextProps.visibleMedias.some(function(f) {
          return f.properties._id === camera.userData.mediaId;
        });
        if (isCameraVisible) camera.visible = true;
        else camera.visible = false;
      });
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
        id="potree"
        style={{ position: "absolute", width: "100%", height: "100%" }}
        ref={el => (this.potreeContainer = el)}
      />
    );
  }

  initViewer(pointCloudId, pointCloudName) {
    window.viewer = this.potree = new potree.Viewer(this.potreeContainer);
    viewer.setEDLEnabled(false);
    viewer.setPointSize(3);
    viewer.setMaterial("RGB");
    viewer.setFOV(60);
    // viewer.setPointSizing("Fixed");
    viewer.setQuality("Squares");
    viewer.setPointBudget(10 * 1000 * 1000);
    viewer.startRendering();

    this.potreeContainer.addEventListener(
      "mousemove",
      e => {
        this.onMouseMove(e);
      },
      false
    );
    this.potreeContainer.addEventListener(
      "mousedown",
      e => {
        this.onMouseClick(e);
      },
      false
    );

    viewer.scene.scene.add(Camera.mediaPlane);
  }

  addCamerasToPotree(pointCloudMedias) {
    pointCloudMedias.map(function(media) {
      if (media.camera3d && media.camera3d.filename) {
        var camera = new Camera(media);
        viewer.scene.scene.add(camera);
      }
    });
  }

  goToMediaCamera(mediaCamera) {
    var fromLookAt = viewer.scene.view.position.clone();
    var dir = viewer.scene.view.direction.clone();
    fromLookAt.add(dir.multiplyScalar(1));

    var viewDir = mediaCamera.getWorldDirection();
    var camLookAt = mediaCamera.position.clone().sub(viewDir);

    var localToViewer = new THREE.Matrix4();

    // Move to mediaCamera position
    var camPositionTween = new TWEEN.Tween(viewer.scene.view.position)
      .to(
        {
          x: mediaCamera.position.x,
          y: mediaCamera.position.y,
          z: mediaCamera.position.z
        },
        1000
      )
      .start();

    // Look in the same direction as the mediaCamera
    var camLookAtTween = new TWEEN.Tween(fromLookAt)
      .to({ x: camLookAt.x, y: camLookAt.y, z: camLookAt.z }, 1000)
      .onUpdate(function(obj) {
        viewer.scene.view.lookAt(obj);
      })
      .start();

    // Set camera fov equal to the mediaCamera fov
    var camFovTween = new TWEEN.Tween(mediaCamera)
      .to(mediaCamera, 1000)
      .onUpdate(obj => {
        // Get transformation matrix from local camera coordinates to viewer coordinates - by passing by world coordinates using
        // localToViewer = viewerMatrixT * obj_cam.matrix = localToWorld * worldToViewer
        var viewerMatrixT = viewer.scene.camera.matrix.clone();
        viewerMatrixT.transpose();
        // localToViewer = viewerMatrixT * obj.matrix = localToWorld * worldToViewer

        localToViewer.multiplyMatrices(viewerMatrixT, obj.matrix);
        // Set viewer dimensions arbitrarily using aspect ratio, and compute a scale factor to fit bounding box of dimensions boxWidth, boxHeight
        var viewerHeight = 1,
          viewerWidth = viewer.scene.camera.aspect;
        var boxWidth =
            Math.abs(localToViewer.elements[0]) +
            Math.abs(localToViewer.elements[4]),
          boxHeight =
            Math.abs(localToViewer.elements[1]) +
            Math.abs(localToViewer.elements[5]);
        // Compute scale factor, deduce, real viewer height that adapt to fit bounding box of camera + a 10% margin, and compute vertical fov from it
        var scaleFactor = Math.max(
            boxWidth / viewerWidth,
            boxHeight / viewerHeight
          ),
          newHeight = viewerHeight * scaleFactor,
          viewerMargin = 1.1,
          viewerFov = 2 * Math.atan(newHeight * 1.1 / (2 * obj.cam_scale.z));
        viewerFov = viewerFov * 180 / Math.PI;

        // Store camera with rotated axes
        this.viewer_cam_matrix = viewer.scene.camera.matrix.clone();
        viewer.setFOV(viewerFov);
      })
      .start();

    // Roll is still missing, rotation around camera view axis to correctly have all info
    // Non working tests, potree reinitializes camera position in its render or animate loop probably
    // Useful issue from bugdanov, working on doxel viewer: https://github.com/potree/potree/issues/300
  }

  onMouseMove(e) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    var rect = this.potree.renderer.domElement.getBoundingClientRect();
    this.mouse.x =
      (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
    this.mouse.y =
      -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    // Pick camera
    // Raycaster for picking selected camera mesh, see github source
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, viewer.scene.camera);

    // find objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(
      viewer.scene.scene.children
    );

    if (intersects.length > 0 && intersects[0].object.userData.mediaId) {
      if (
        !this.mediaCamera_intersected ||
        this.mediaCamera_intersected.uuid !== intersects[0].object.uuid
      ) {
        if (this.mediaCamera_intersected)
          this.mediaCamera_intersected.toggleSelection();
        this.mediaCamera_intersected = intersects[0].object;
        this.mediaCamera_intersected.toggleSelection();
        this.mediaCamera_intersected.loadMedia();
      }
    } else {
      if (this.mediaCamera_intersected) {
        this.mediaCamera_intersected.toggleSelection();
        this.mediaCamera_intersected = null;
      }
    }

    // mousemove with middle click
    if (event.buttons == 4) {
      // Set pitch yaw using middle button
      if (this.mediaCamera_intersected) {
        // viewer.setFOV(this.mediaCamera_intersected.viewerFOV / 2);

        // Compute pitch and yaw from mouse position on screen
        var yaw = 0.25 * this.mouse.x * Math.PI,
          pitch = -0.5 * this.mouse.y * Math.PI / 2,
          roll = 0;
        // Define rotation matrix from euler angles to apply to view direction
        var rotLookAt = new THREE.Matrix4(),
          rotPitchX = new THREE.Matrix4(), // rotate around local X, to get lookAt in Y direction of camera
          rotYawY = new THREE.Matrix4(), // rotate around local Y, to get lookAt in X direction of camera
          camToWorld = new THREE.Matrix4();
        // yaw (Y) first, pitch (X) second // rotation.order = "YXZ"; // three.js r.65
        rotPitchX.makeRotationX(pitch);
        rotYawY.makeRotationY(yaw);
        rotLookAt.multiplyMatrices(rotPitchX, rotYawY);
        this.hovered_cam_matrix = this.mediaCamera_intersected.matrix.clone();
        camToWorld.copy(this.viewer_cam_matrix);
        rotLookAt.multiplyMatrices(camToWorld, rotLookAt);

        // Compute rotated view direction
        var rotatedViewDir = new THREE.Vector3(
          rotLookAt.elements[8],
          rotLookAt.elements[9],
          rotLookAt.elements[10]
        );
        var rotatedCamLookat = new THREE.Vector3(
          this.hovered_cam_matrix.elements[12],
          this.hovered_cam_matrix.elements[13],
          this.hovered_cam_matrix.elements[14]
        );
        rotatedCamLookat.sub(rotatedViewDir);
        viewer.scene.view.lookAt(rotatedCamLookat);

        // Hint using transformDirection
        // rotLookAt.makeRotationFromEuler(new THREE.Euler( pitch, yaw, roll, 'YXZ' )); // or try pitch, roll, yaw, 'ZXY' // ZYX
        //var rayOrigin = new THREE.Vector3(),
        //  rayDirection = new THREE.Vector3();
        //rayOrigin.setFromMatrixPosition( camera.matrixWorld );
        //rayDirection.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();
      }
    }
  }

  onMouseClick(e) {
    e = e || window.event;
    //right button click
    if (
      ("which" in e && e.which == 3) || // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      ("button" in e && e.button == 2) // IE, Opera
    ) {
      this.goToMediaCamera(this.mediaCamera_intersected);
      this.props.dispatch(
        selectMediaById({
          mediaId: this.mediaCamera_intersected.userData.mediaId
        })
      );
    }
  }
}