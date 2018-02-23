function init_buttons() {
    add_2D = document.createElement("button"); // bouton "add a 2D point"
    add_2D.innerHTML = "add a 2D point";
    add_2D.style.position = 'absolute';
    document.body.appendChild(add_2D);
    add_2D.addEventListener('click', change_addPix);
    place_buttons();
}
function init_text() {
    text_loading = document.createElement('div');
    text_loading.style.position = 'absolute';
    text_loading.innerHTML = "<br /><br /><br /><br /><br />loading...";
    text_loading.style.display = "none";
    document.body.appendChild(text_loading);
    
    text_mesh = document.createElement('input');
    text_mesh.type = 'file';
    text_mesh.multiple = false;
    text_mesh.style.position = 'absolute';
    text_mesh.addEventListener('change', loadMesh, false);
    document.body.appendChild(text_mesh);
    
    text_texture = document.createElement('input');
    text_texture.type = 'file';
    text_texture.multiple = false;
    text_texture.style.position = 'absolute';
    text_texture.addEventListener('change', loadTexture, false);
    document.body.appendChild(text_texture);
    
    text_image = document.createElement('input');
    text_image.type = 'file';
    text_image.multiple = false;
    text_image.style.position = 'absolute';
    text_image.addEventListener('change', loadPhoto, false);
    document.body.appendChild(text_image);
    
    text_cam = document.createElement('div');
    text_cam.style.position = 'absolute';
    text_cam.innerHTML = 
        "camera : <br/>" +
        "position <br/>" +
        "x : <br/>" +
        "y : <br/>" +
        "z : <br/>" +
        "rotation <br/>" +
        "x : <br/>" +
        "y : <br/>" +
        "z : ";
    text_cam.style.backgroundColor = 'white';
    text_cam.style.width = 100 + 'px';
    text_cam.addEventListener("mouseover", onMouseOver, false);
    text_cam.addEventListener("mouseout", onMouseOut, false);
    document.body.appendChild(text_cam);
    text_param_cam = document.createElement('div');
    text_param_cam.style.position = 'absolute';
    text_param_cam.innerHTML = 
        "focal : 30<br/>" +
        "sensor size : 35 <br/>" +
        "cx : 0<br/>" +
        "cy : 0<br/>";
    text_param_cam.style.backgroundColor = 'white';
    text_param_cam.style.width = 100 + 'px';
    text_param_cam.addEventListener("mouseover", onMouseOver, false);
    text_param_cam.addEventListener("mouseout", onMouseOut, false);
    document.body.appendChild(text_param_cam);
    
    place_text();
    
    text_P2D = document.createElement('div');
    text_P2D.style.position = 'absolute';
    text_P2D.innerHTML = "P ";
    text_P2D.style.display = "none";
    document.body.appendChild(text_P2D);
    text_P3D = document.createElement('div');
    text_P3D.style.position = 'absolute';
    text_P3D.innerHTML = "P ";
    text_P3D.style.display = "none";
    document.body.appendChild(text_P3D);
}

function place_buttons() {
    add_2D.style.top = 0 + 'px';
    add_2D.style.left = windowWidth*element_3D_sizeX + 'px';
}
function place_img( opacity ) {
    img.width = w;
    img.height = h;
    img.style.top = H - h - y_cam + 'px';
    img.style.left = x_cam + 'px';
    img.style.opacity = opacity;
}
function place_elements() {
    element_3D.style.width = element_3D_sizeX * windowWidth + 'px';
    element_3D.style.height = windowHeight + 'px';
    element_3D.style.top = 0 + 'px';
    element_3D.style.left = 0 + 'px';
    
    element_2D.style.width = (1-element_3D_sizeX) * windowWidth + 'px';
    element_2D.styleheight = windowHeight + 'px';
    element_2D.style.top = 0 + 'px';
    element_2D.style.left = element_3D_sizeX * windowWidth + 'px';
}
function place_text() {
    text_loading.style.top = 0 + 'px';
    text_loading.style.left = W/3 + 'px';
    
    text_mesh.style.top = 0 + 'px';
    text_mesh.style.left = 0 + 'px';
    text_texture.style.top = 22 + 'px';
    text_texture.style.left = 0 + 'px';
    text_image.style.top = 22 + 'px';
    text_image.style.left = W + 'px';
    
    text_cam.style.top = 0 + 'px';
    text_cam.style.left = (windowWidth*element_3D_sizeX - parseFloat(text_cam.style.width)) + 'px';
    text_param_cam.style.top = 0 + 'px';
    text_param_cam.style.left = (windowWidth*element_3D_sizeX - parseFloat(text_cam.style.width) - 110) + 'px';
}
function get_param() { //appelé si resize ou element_3D_sizeX changé ou nouvelle image chargée
    if ( img.width / img.height < element_3D_sizeX * windowWidth / windowHeight ) {
        w = img.naturalWidth * windowHeight / img.naturalHeight;
        h = windowHeight;
    }
    else {
        h = img.naturalHeight * element_3D_sizeX * windowWidth / img.naturalWidth;
        w = element_3D_sizeX * windowWidth;
    }
    W = element_3D_sizeX * windowWidth;
    H = windowHeight;
    x_cam = (W - w)/2;
    y_cam = (H - h)/2;    
    div_img.style.height = H + "px";
    div_img.style.width = W + "px";
}
function setupGui() {
    effectController = {
        compute: false,
        imgOpacity: 0.0,
        focal: 30.0,
        zoom: 3.0,
        ortho: false,
        //2D
        pixSize: 2,
        pix: [],
        //3D
        voxSize: 2,
        vox: [],
        //numero de la solution P3P à utiliser
        solution_n: 0,
        // taille du modèle 3D et de la photo (%)
        sizeX: 50,
        //texture sur le modèle 3D
        texture: true,
        reset: false
    };
    for ( var i = 0; i < N_POINTS; ++i ) {
        effectController.pix.push(false);
        effectController.vox.push(false);
    }
    
    var h;
    gui = new dat.GUI();
    
    h = gui.addFolder("Recalage");
    h.add(effectController, "compute").name("compute solution(s)")
        .onChange(function() {
            //choisir le controle adapté
            cameraControls_3D.enabled = (!effectController.ortho) && (!effectController.compute);
            cameraControls_ortho.enabled = effectController.ortho && (!effectController.compute);
            cameraControls_3D_1.enabled = (fixed_points == 1 && effectController.compute);
            cameraControls_3D_2.enabled = (fixed_points == 2 && effectController.compute);
            //recalculer
            set_converge(); })
        .listen();
    h.add(effectController, "imgOpacity", 0.0, 100.0, 1).name("image Opacity").onChange(imgOpacity);
    h.add(effectController, "reset").name("reset").onChange(resetPoints).listen();
    
    h = gui.addFolder("Camera");
    h.add(effectController, "focal", 10.0, 60.0).name("focal - perspective").onChange(camChanger_focal);
    h.add(effectController, "zoom", 0.01, 100.0).name("zoom - ortho").onChange(camChanger_zoom);
    h.add(effectController, "ortho").name("orthographic")
        .onChange(function() { noChange = false; });
        
    h = gui.addFolder("Points 2D");
    h.add(effectController, "pixSize", 1.0, 10, 2.0).name("size").onChange(resizePoints);
    for ( var i = 0; i < N_POINTS; ++i )
        h.add(effectController.pix, i, effectController.pix[0]).name("point " + (i+1-0)).onChange(checkPix).listen();
        
    h = gui.addFolder("Points 3D");
    h.add(effectController, "voxSize", 1.0, 10, 2.0).name("size").onChange(resizeEmpties);
    for ( var i = 0; i < N_POINTS; ++i )
        h.add(effectController.vox, i, effectController.vox[0]).name("point " + (i+1-0)).onChange(checkVox).listen();
    
    h = gui.addFolder("other");
    h.add(effectController, "sizeX", 0.0, 100.0, 1).name("Size X").onChange(onWindowResize);
    h.add(effectController, "solution_n", 0, 3, 1).name("solution for 3 points")
        .onFinishChange(function() { converge[2] = false });
    h.add(effectController, "texture").name("texture").onChange(show_texture).listen();
}

function onWindowResize( event ) {
    element_3D_sizeX = effectController.sizeX / 100;
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;
    get_param();
    place_img(0.01 * effectController.imgOpacity);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    camera2.left = W / -2;
    camera2.right = W / 2;
    camera2.top = H / 2;
    camera2.bottom = H / -2;
    camera2.updateProjectionMatrix();
    camera_2D.left = (1-element_3D_sizeX) * windowWidth / -2;
    camera_2D.right = (1-element_3D_sizeX) * windowWidth / 2;
    camera_2D.top = windowHeight / 2;
    camera_2D.bottom = windowHeight / -2;
    camera_2D.updateProjectionMatrix();
 renderer.setSize(windowWidth, windowHeight);
    place_text();
    place_elements();
    place_buttons();
    update_cam();
    stats.domElement.style.top = (windowHeight - 58) + 'px'; //48px de large + 10 bordure
    stats.domElement.style.left = (windowWidth - 90) + 'px'; //80px de haut + 10 bordure
}


function render_cam() {
    update_cam();
    /*
    * coordonnées THREE.js vers blender:
    * rotation de 90° autour de l'axe x (x->x, y->z, z->-y)
    * THREE js ZYX = blender XYZ
    */
    var cam = ( effectController.ortho ? camera_ortho : camera_3D );    
    var rot;
    if ( cam.rotation.order != "ZYX" )
        rot = new THREE.Euler().setFromQuaternion(
                    new THREE.Quaternion().setFromEuler(cam.rotation), 'ZYX');
    else rot = cam.rotation;
    text_cam.innerHTML = 
        "camera :<br/>" +
        "position <br/>" +
        "x : " + cam.position.x.toFixed(4) + "<br/>" +
        "y : " + (-cam.position.z).toFixed(4) + "<br/>" +
        "z : " + cam.position.y.toFixed(4) + "<br/>" +
        "rotation <br/>" +
        "x : " + (rot.x * 180 / Math.PI + 90).toFixed(4) + "<br/>" +
        "y : " + (rot.z * 180 / Math.PI).toFixed(4) + "<br/>" +
        "z : " + (rot.y * 180 / Math.PI).toFixed(4) + "<br/>" +
        "XYZ";
    if ( effectController.ortho )
        text_param_cam.innerHTML = "scale :" + (Math.max(w, h) / effectController.zoom).toFixed(4);
    else
        text_param_cam.innerHTML = 
            "focal : " + effectController.focal.toFixed(4) + "<br/>" + 
            "sensor size : 35 <br/>" +
            "cx : " + cx.toFixed(4) + "<br/>" +
            "cy : " + (-cy).toFixed(4);
    if ( effectController.ortho ){    
        effectController.zoom = camera_ortho.zoom;
        gui.__folders["Camera"].__controllers[1].updateDisplay();
    }
    if ( effectController.compute && ((effectController.ortho && fixed_points > 3) || fixed_points > 5) )
        text_param_cam.innerHTML += "<br/>error :" + (err.toFixed(4));
}