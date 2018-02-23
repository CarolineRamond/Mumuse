//gui events
function camChanger_focal() {
    camera_3D.setFocalLength(effectController.focal);
    if( !effectController.ortho )
        set_converge();
}
function camChanger_zoom() {
    camera_ortho.zoom = effectController.zoom;
    camera_ortho.updateProjectionMatrix();
    if( effectController.ortho )
        set_converge();
}
function imgOpacity() {
	img.style.opacity = 0.01*effectController.imgOpacity;
}
function resizeEmpties() {
	var s = effectController.voxSize;
	for ( var i = 0; i < N_POINTS; i++ )
		vox[i].scale.set(s, s, s);
}
function resizePoints() {
	var s = w * effectController.pixSize / 20;
	for ( var i = 0; i < N_POINTS; i++ )
		pix[i].scale.set(s, s, s);
}
function resetPoints() {
    for ( var i = 0; i < N_POINTS; ++i ) {
        effectController.pix[i] = false;
        effectController.vox[i] = false;
    }
    camera_3D.position.set(0, 0, 10);
    camera_3D.rotation.set(0, 0, 0, 'XYZ');
    camera_ortho.position.set(0, 10, 0);
    camera_ortho.rotation.set(0, 0, 0, 'XYZ');
    cameraControls_3D.reset();
    cameraControls_3D.enableRotate = true;
    cameraControls_ortho.reset();
    checkPix();
    checkVox();
    effectController.reset = false;
}
function show_texture() {
    if ( effectController.texture ) {
        mesh_site3D.material = textureMaterial;
        directionalLight.visible = false;
    } else {
        mesh_site3D.material = flatMaterial;
        directionalLight.visible = true;
    }
}