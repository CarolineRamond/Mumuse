import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import potree from "@iconem/iconem-potree";

import { clickMedias } from '../../modules/medias/medias.actions'
import { getSelectedMedias } from "../../modules/medias";

// import styles from "./potree.css";

// this is to set up component's props
// component's props will be an excerpt
// of the store
// + some functions like dispatch (to fire actions)
@connect(store => {
  const selectedMedias = getSelectedMedias(store.medias);
  return {
    potree: store.potree,
    selectedMedias: selectedMedias
  };
})
export default class Potree extends React.Component {
  componentDidMount() {
    this.initViewer();
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props);
    if (!this.props.potree.pointCloud.metaData && nextProps.potree.pointCloud.metaData) {
      console.log('LOADING POTREE');
      potree.loadPointCloud(
        `potreeviewer/potreedataset/${nextProps.potree.pointCloud.metaData
          ._id}/cloud.js`,
        nextProps.potree.pointCloud.metaData.name,
        function(e) {
          viewer.scene.addPointCloud(e.pointcloud);
          viewer.fitToScreen();
        }
      );

      let pointCloudMedias = JSON.parse(
        nextProps.potree.pointCloud.metaData.visus
      );
      this.addCamerasToPotree(pointCloudMedias);
    }

    if (
      this.props.potree.pointCloud.metaData &&
      nextProps.selectedMedias.length === 1
    ) {
      let mediaMesh = this.potree.scene.scene.children.find(
        mesh => mesh.mediaId === nextProps.selectedMedias[0].properties._id
      );

      if(mediaMesh){
        this.goToMediaMesh(mediaMesh);
        this.addMediaToCamera(mediaMesh);
      } 
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div
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
  }

  addCamerasToPotree(camerasParameters) {
    // Potree interactions (might be refactored);
    var that = this;
    var mesh_intersected;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var hovered_cam_matrix = new THREE.Matrix4();
    var viewer_cam_matrix = new THREE.Matrix4();
    this.potreeContainer.addEventListener("mousemove", onMouseMove, false);
    this.potreeContainer.addEventListener("mousedown", onMouseClick, false);

    // Define camera geometry & material
    var camGeometry = new THREE.Geometry();
    camGeometry.vertices = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.5, -0.5, -1),
      new THREE.Vector3(-0.5, +0.5, -1),
      new THREE.Vector3(+0.5, +0.5, -1),
      new THREE.Vector3(+0.5, -0.5, -1)
    ];
    camGeometry.faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(0, 3, 2),
      new THREE.Face3(0, 4, 3),
      new THREE.Face3(0, 1, 4),
      // Last two faces are needed for handling picking from this side (when facing the camera)
      new THREE.Face3(1, 2, 3), // Triangle 1 for image
      new THREE.Face3(1, 3, 4) // Triangle 2 for image
    ];

    var camDefaultMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });

    var camSelectedMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });

    // Define media plane geometry & material
    // Init plane with correct UVs for displaying the image - same coords than base of camera pyramid cone, and uv as lower left, ... for the 2 faces (triangles)
    var plane_geometry = new THREE.Geometry();
    plane_geometry.vertices = [
      new THREE.Vector3(-0.5, -0.5, -1),
      new THREE.Vector3(-0.5, +0.5, -1),
      new THREE.Vector3(+0.5, +0.5, -1),
      new THREE.Vector3(+0.5, -0.5, -1)
    ];
    plane_geometry.faces = [
      new THREE.Face3(0, 1, 2), // Triangle 1 for image
      new THREE.Face3(0, 2, 3) // Triangle 2 for image
    ];
    plane_geometry.faceVertexUvs[0] = [
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0, 1),
        new THREE.Vector2(1, 1)
      ],
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(1, 0)
      ]
    ];
    plane_geometry.faces[0].materialIndex = 0;
    plane_geometry.faces[1].materialIndex = 0;

    var plane_material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      opacity: 1,
      transparent: true
    });
    this.plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
    viewer.scene.scene.add(this.plane_mesh);

    // Set from bundler data : https://github.com/snavely/bundler_sfm#output-format
    var invert_yz_mat4 = new THREE.Matrix4();
    invert_yz_mat4.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);

    camerasParameters.map(function(camera) {
      if (camera.camera3d && camera.camera3d.filename) {
        var bundler_rot_0 = camera.camera3d.rotationMatrix[0],
          bundler_rot_1 = camera.camera3d.rotationMatrix[1],
          bundler_rot_2 = camera.camera3d.rotationMatrix[2],
          bundler_pos = camera.camera3d.translationMatrix;

        // Define world coordinates to cam coordinates matrix as the one described in the bundler format
        var world_cam_matrix = new THREE.Matrix4();
        world_cam_matrix.set(
          parseFloat(bundler_rot_0[0]),
          parseFloat(bundler_rot_1[0]),
          parseFloat(bundler_rot_2[0]),
          0,
          parseFloat(bundler_rot_0[1]),
          parseFloat(bundler_rot_1[1]),
          parseFloat(bundler_rot_2[1]),
          0,
          parseFloat(bundler_rot_0[2]),
          parseFloat(bundler_rot_1[2]),
          parseFloat(bundler_rot_2[2]),
          0,
          parseFloat(bundler_pos[0]),
          parseFloat(bundler_pos[1]),
          parseFloat(bundler_pos[2]),
          1
        );
        world_cam_matrix.transpose();

        // Invert it to get the cam to world transformation, and therefore get cam origin and rotation / Transpose and axes inversion between Y-Z
        var world_cam_matrix_inv = new THREE.Matrix4();
        world_cam_matrix_inv.getInverse(world_cam_matrix);
        world_cam_matrix_inv.multiplyMatrices(
          invert_yz_mat4,
          world_cam_matrix_inv
        );

        // Add mesh to scene
        var pyramidMesh = new THREE.Mesh(camGeometry, camDefaultMaterial);
        pyramidMesh.name = camera.camera3d.filepath;
        pyramidMesh.mediaId = camera._id;

        // Apply matrix
        pyramidMesh.applyMatrix(world_cam_matrix_inv);

        // Cam scale
        var intrinsic_f_k1_k2 = [
            camera.camera3d.f,
            camera.camera3d.k1,
            camera.camera3d.k2
          ],
          scaleCam = 1,
          pixel_Nx = 4928,
          pixel_Ny = 3264,
          cam_scale = get_pyramid_sensor_scale(intrinsic_f_k1_k2, scaleCam);
        pyramidMesh.scale.set(cam_scale.x, cam_scale.y, cam_scale.z);
        pyramidMesh.cam_scale = cam_scale;

        viewer.scene.scene.add(pyramidMesh);

        // Deal with focal
        // focal length in pixels = (image width in pixels) * (focal length in mm) / (CCD width in mm)
        // http://phototour.cs.washington.edu/focal.html
        // Scale is obtained through focal, image ratio, we can let the sensor size as equivalent 35mm
        function get_pyramid_sensor_scale(intrinsic_f_k1_k2) {
          var focal_pixel = intrinsic_f_k1_k2[0];
          var scaleZ = 1 * scaleCam,
            scaleX = scaleZ / focal_pixel * pixel_Nx,
            scaleY = scaleZ / focal_pixel * pixel_Ny;
          return new THREE.Vector3(scaleX, scaleY, scaleZ);
        }
      }
    });

    function onMouseMove(e) {
      // calculate mouse position in normalized device coordinates (-1 to +1) for both components
      var rect = that.potree.renderer.domElement.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
      mouse.y =
        -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

      // Pick camera
      // Raycaster for picking selected camera mesh, see github source
      // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, viewer.scene.camera);

      // find objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(viewer.scene.scene.children);

      if (intersects.length > 0 && intersects[0].object.mediaId) {
        if (
          !mesh_intersected ||
          mesh_intersected.uuid !== intersects[0].object.uuid
        ) {
          if (mesh_intersected) mesh_intersected.material = camDefaultMaterial;
          mesh_intersected = intersects[0].object;
          mesh_intersected.material = camSelectedMaterial;
          //add media texture to plane
          that.addMediaToCamera(mesh_intersected);
        }
      } else {
        if (mesh_intersected) {
          mesh_intersected.material = camDefaultMaterial;
          mesh_intersected = null;
        }
      }

      if (event.buttons == 4) {
        // Set pitch yaw using middle button
        if (mesh_intersected) {
          // viewer.setFOV(mesh_intersected.viewerFOV / 2);

          // Compute pitch and yaw from mouse position on screen
          var mouseX =
              (event.clientX - this.offsetLeft) / this.clientWidth * 2 - 1,
            mouseY =
              -((event.clientY - this.offsetTop) / this.clientHeight) * 2 + 1,
            yaw = 0.25 * mouseX * Math.PI,
            pitch = -0.5 * mouseY * Math.PI / 2,
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
          hovered_cam_matrix = mesh_intersected.matrix.clone();
          camToWorld.copy(viewer_cam_matrix);
          rotLookAt.multiplyMatrices(camToWorld, rotLookAt);

          // Compute rotated view direction
          var rotatedViewDir = new THREE.Vector3(
            rotLookAt.elements[8],
            rotLookAt.elements[9],
            rotLookAt.elements[10]
          );
          var rotatedCamLookat = new THREE.Vector3(
            hovered_cam_matrix.elements[12],
            hovered_cam_matrix.elements[13],
            hovered_cam_matrix.elements[14]
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

    function isRightMB(e) {
      e = e || window.event;
      if (
        "which" in e // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      )
        return e.which == 3;
      else if (
        "button" in e // IE, Opera
      )
        return e.button == 2;
      return false;
    }

    function onMouseClick(e) {
      // Get in camera view if right button clicked
      if (isRightMB(e) && mesh_intersected) {
        // Useful issue from bugdanov, working on doxel viewer: https://github.com/potree/potree/issues/300
        // Set camera position (mesh pos), then lookAt as cam position + a small vector towards camera direction (third column of rotation matrix, cam z in world coordinates)
        hovered_cam_matrix.copy(mesh_intersected.matrix);

        // var viewDir = new THREE.Vector3(
        //   mesh_intersected.matrix.elements[8],
        //   mesh_intersected.matrix.elements[9],
        //   mesh_intersected.matrix.elements[10]
        // );
        // var camLookAt = mesh_intersected.position.clone();
        // camLookAt.add(viewDir.multiplyScalar(-1));
        var viewDir = new THREE.Vector3(
          mesh_intersected.matrix.elements[8],
          mesh_intersected.matrix.elements[9],
          mesh_intersected.matrix.elements[10]
        );
        var camLookAt = mesh_intersected.position.clone().sub(viewDir);

        var camPositionTween = new TWEEN.Tween(viewer.scene.view.position)
          .to(
            {
              x: mesh_intersected.position.x,
              y: mesh_intersected.position.y,
              z: mesh_intersected.position.z
            },
            1000
          )
          .start();

        var fromLookAt = viewer.scene.view.position.clone();
        var dir = viewer.scene.view.direction.clone();
        fromLookAt.add(dir.multiplyScalar(1));

        var camLookAtTween = new TWEEN.Tween(fromLookAt)
          .to({ x: camLookAt.x, y: camLookAt.y, z: camLookAt.z }, 1000)
          .onUpdate(function(obj) {
            viewer.scene.view.lookAt(obj);
          })
          .start();

        var localToViewer = new THREE.Matrix4();

        var camFovTween = new TWEEN.Tween(mesh_intersected)
          .to(mesh_intersected, 1000)
          .onUpdate(function(obj) {
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
              viewerFov =
                2 * Math.atan(newHeight * 1.1 / (2 * obj.cam_scale.z));
            viewerFov = viewerFov * 180 / Math.PI;

            // Store camera with rotated axes
            viewer_cam_matrix = viewer.scene.camera.matrix.clone();
            viewer.setFOV(viewerFov);
          })
          .start();

          // SHOULD USE SELECTED MEDIA BY ID
          // that.props.dispatch(clickMedias({ features, ctrlKey }));

        // Roll is still missing, rotatino around camera view axis to correctly have all info
        // Non working tests, potree reinitializes camera position in its render or animate loop probably
        // Useful issue from bugdanov, working on doxel viewer: https://github.com/potree/potree/issues/300
      }
    }
  }

  addMediaToCamera(mesh_intersected) {
    var that = this;
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "";
    textureLoader.load(
      "http://localhost:9000\\userdrive\\media\\image\\" +
        mesh_intersected.mediaId,
      function(plane_texture) {
        that.plane_mesh.material.map = plane_texture;
        that.plane_mesh.material.needsUpdate = true;
        that.plane_mesh.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        that.plane_mesh.applyMatrix(mesh_intersected.matrix);
      }
    );
  }

  goToMediaMesh(mediaMesh) {
    var hovered_cam_matrix = new THREE.Matrix4();
    var viewer_cam_matrix = new THREE.Matrix4();

    var viewDir = new THREE.Vector3(
      mediaMesh.matrix.elements[8],
      mediaMesh.matrix.elements[9],
      mediaMesh.matrix.elements[10]
    );
    var camLookAt = mediaMesh.position.clone().sub(viewDir);

    var camPositionTween = new TWEEN.Tween(viewer.scene.view.position)
      .to(
        {
          x: mediaMesh.position.x,
          y: mediaMesh.position.y,
          z: mediaMesh.position.z
        },
        1000
      )
      .start();

    var fromLookAt = viewer.scene.view.position.clone();
    var dir = viewer.scene.view.direction.clone();
    fromLookAt.add(dir.multiplyScalar(1));

    var camLookAtTween = new TWEEN.Tween(fromLookAt)
      .to({ x: camLookAt.x, y: camLookAt.y, z: camLookAt.z }, 1000)
      .onUpdate(function(obj) {
        viewer.scene.view.lookAt(obj);
      })
      .start();

    var localToViewer = new THREE.Matrix4();

    var camFovTween = new TWEEN.Tween(mediaMesh)
      .to(mediaMesh, 1000)
      .onUpdate(function(obj) {
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
          viewerFov =
            2 * Math.atan(newHeight * 1.1 / (2 * obj.cam_scale.z));
        viewerFov = viewerFov * 180 / Math.PI;

        // Store camera with rotated axes
        viewer_cam_matrix = viewer.scene.camera.matrix.clone();
        viewer.setFOV(viewerFov);
      })
      .start();
  }
}