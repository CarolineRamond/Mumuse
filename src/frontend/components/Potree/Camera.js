// Define camera geometry & material
let camGeometry = new THREE.Geometry();
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

// Set from bundler data : https://github.com/snavely/bundler_sfm#output-format
let invert_yz_mat4 = new THREE.Matrix4();
invert_yz_mat4.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);

let camDefaultMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  name: "camDefaultMaterial"
});

let camSelectedMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
  name: "camSelectedMaterial"
});

// Define media plane geometry & material
// Init plane with correct UVs for displaying the image - same coords than base of camera pyramid cone, and uv as lower left, ... for the 2 faces (triangles)
var mediaGeometry = new THREE.Geometry();
mediaGeometry.vertices = [
  new THREE.Vector3(-0.5, -0.5, -1),
  new THREE.Vector3(-0.5, +0.5, -1),
  new THREE.Vector3(+0.5, +0.5, -1),
  new THREE.Vector3(+0.5, -0.5, -1)
];
mediaGeometry.faces = [
  new THREE.Face3(0, 1, 2), // Triangle 1 for image
  new THREE.Face3(0, 2, 3) // Triangle 2 for image
];
mediaGeometry.faceVertexUvs[0] = [
  [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)],
  [new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)]
];
mediaGeometry.faces[0].materialIndex = 0;
mediaGeometry.faces[1].materialIndex = 0;

var mediaMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  opacity: 1,
  transparent: true
});

var textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "";

export default class Camera extends THREE.Mesh {
  static mediaPlane = new THREE.Mesh(mediaGeometry, mediaMaterial);
  constructor(media) {
    super(camGeometry, camDefaultMaterial);
    let bundler_rot_0 = media.camera3d.rotationMatrix[0],
      bundler_rot_1 = media.camera3d.rotationMatrix[1],
      bundler_rot_2 = media.camera3d.rotationMatrix[2],
      bundler_pos = media.camera3d.translationMatrix;

    // Define world coordinates to cam coordinates matrix as the one described in the bundler format
    let world_cam_matrix = new THREE.Matrix4();
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
    let world_cam_matrix_inv = new THREE.Matrix4();
    world_cam_matrix_inv.getInverse(world_cam_matrix);
    world_cam_matrix_inv.multiplyMatrices(invert_yz_mat4, world_cam_matrix_inv);

    this.name = media.camera3d.filepath;
    this.userData.mediaId = media._id;

    // Apply matrix
    this.applyMatrix(world_cam_matrix_inv);

    // Cam scale
    let intrinsic_f_k1_k2 = [
        media.camera3d.f,
        media.camera3d.k1,
        media.camera3d.k2
      ],
      scaleCam = 1,
      pixel_Nx = 3992,
      pixel_Ny = 2953,
      cam_scale = get_pyramid_sensor_scale(intrinsic_f_k1_k2, scaleCam);
    this.scale.set(cam_scale.x, cam_scale.y, cam_scale.z);
    this.cam_scale = cam_scale;

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

  loadMedia() {
    if (!this.texture) {
      textureLoader.load(
        "http://localhost:9000\\userdrive\\media\\image\\" +
          this.userData.mediaId,
        mediaTexture => {
          this.texture = mediaTexture;
          this.setMediaPlanePositionAndTextureForThisCamera(mediaTexture);
        }
      );
    } else {
      this.setMediaPlanePositionAndTextureForThisCamera(this.texture);
    }
  }

  setMediaPlanePositionAndTextureForThisCamera(mediaTexture) {
    Camera.mediaPlane.material.map = mediaTexture;
    Camera.mediaPlane.material.needsUpdate = true;
    Camera.mediaPlane.matrix.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    Camera.mediaPlane.applyMatrix(this.matrix);
  }

  toggleSelection() {
    if (this.material.name === "camSelectedMaterial")
      this.material = camDefaultMaterial;
    else this.material = camSelectedMaterial;
  }
}