// //chargement des photos, mesh et textures
// function loadPhoto ( event ) { 
//     if ( text_image.files[0].type.match('image.*') )
//         img.src = URL.createObjectURL(text_image.files[0]);
// }
// function loadMesh ( event ) {
//     if ( text_mesh.files[0].type.match('json.*') ) {
//         text_loading.style.display = "block";
//         loader.load(URL.createObjectURL(text_mesh.files[0]), 
//             function( geometry, materials ) { //onload
//                 mesh_site3D.geometry = geometry;
//                 effectController.texture = false;
//                 show_texture();
//                 resetPoints();
//                 text_loading.style.display = "none";
//             });

//     }
// }
// function loadTexture ( event ) {
//     if ( text_texture.files[0].type.match('image.*') ) {
//         textureMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture(URL.createObjectURL(text_texture.files[0])) });
//         effectController.texture = true;
//         show_texture();
//     }
// }