/*
* Recalage interactif d'un caméra perspective ou ortho dans un modele 3D
*
*
--- UTILISATION ---
***** DIVERS *****
*   Choose file : sélectionner un fichier (loadPhoto)
*   add 2D point : rajoute un point 2D à placer (change_addPix)
*   clic gauche sur un point : replacer le point
*   CTRL+clic gauche sur un point : placer l'équivalent du point sur l'autre document
****** GUI *******
*   "Compute" : lance le calcul pour les points donnés et réduit les degrés de liberté correspondant
*   "Solutions for 3" : choisit une autre solution possible au problème P3P
**** CONTROLS ****
*   Controle de la caméra : molette/avancer, clic gauche/rotation, clic droit/translation
*   Navigation dans la caméra : SHIFT+molette/zoom, SHIFT+clic droit translation
*   Navigation dans la photo : molette/zoom, clic droit translation
*
--- ALGORITHMES ---
*   fixfirst, fixsecond --> voir commentaires
*   fixthird : P3P/ http://iplimage.com/blog/p3p-perspective-point-overview/
*              Position-rotation de la caméra/ http://nghiaho.com/?page_id=671
*   fixfourth : fixthird + ajustement de la distance focale
*   fixthird_ortho : systeme d'équation avec contrainte caméra horizontale ou verticale
*   fixnth : 3js/C++/src/camCalibNode.cpp
* 
*/
'use strict';

var windowWidth  = window.innerWidth;
var windowHeight = window.innerHeight;
//largeur du modele 3D (fraction de la taille totale de l'image)
var element_3D_sizeX = 0.5;

//mouse
var mouseX = 0, mouseY = 0;
var mouse_3D = new THREE.Vector2();
var mouse_2D = new THREE.Vector2();

//modele 3D
var scene1, scene2;
var parentEmpties_3D; //sous scène qui contient les empties (pour le raycast)
var parentEmpties_2D;
var parentTransform; //sous scène qui contient le mesh
var parentTransform_2D;

//cameras
var camera, camera2; //caméras 3D perspective et ortho derrière la caméra recalée
var camera_3D, camera_ortho; //caméras recalées affichées
var camera_2D; //caméra de l'image 2D
var element_3D, element_2D; //canvas délimitant les zones de controle des caméras
var cameraHelper_p, cameraHelper_o; //dessins de la caméra

//controls
var cameraControls_3D, cameraControls_3D_1, cameraControls_3D_2; //controles de la caméra perspective pour 0,1 et 2 points fixés
var cameraControls_ortho; //controle de la caméra ortho
var cameraControls_2D; //controle de l'image 2D
var move_inside_cam = false; var translate_inside_cam = false; //controles des zoom/navigation dans la caméra (shift+mouse...)

//gui
var effectController; //variable du gui
var gui;

//button
var add_2D;

var raycaster;

const N_POINTS = 20;
//2D&3D points
var pix = []; // tableaux 2D contenant les objets emtpies
var vox = [];// tableaux 3D contenant les objets emtpies

//ctrl+drag and drop corresponding point
var inverse_vox_pix = false; //Ctrl appuyé
var pix_to_replace = N_POINTS; //point surligné en vert
var vox_to_replace = N_POINTS;

//indices des prochains points à placer
var voxIdx = 0; //prochain point à placer
var pixIdx = 0;
//points placés
var voxCount = 0; //nombre de points
var pixCount = 0;
var previous_fixed_points = 0;
var fixed_points = 0;
var addPix = false;
var addVox = false;

//convergence des calculs
var converge = [false, false, false, false, false]; //img fixée pour 1...n points
var prevdf1 = 0; var prevdf2 = 0; //distances focales obtenues aux deux précédantes itérations (4points)
var noChange = true; // booléen forcant le recalcul des paramètres caméra


//empties
var emptyGeometry = new THREE.Geometry();
{
    var v1 = new THREE.Vector3(0.1, 0, 0);
    var v2 = new THREE.Vector3(-0.1, 0 , 0);
    var v3 = new THREE.Vector3(0, 0.1, 0);
    var v4 = new THREE.Vector3(0, -0.1, 0);
    var v5 = new THREE.Vector3(0, 0, 0.1);
    var v6 = new THREE.Vector3(0, 0, -0.1);
    emptyGeometry.vertices.push(v1);
    emptyGeometry.vertices.push(v2);
    emptyGeometry.vertices.push(v3);
    emptyGeometry.vertices.push(v4);
    emptyGeometry.vertices.push(v5);
    emptyGeometry.vertices.push(v6);
}
var materialRed = new THREE.LineBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.5, linewidth: 3 });
var materialGreen = new THREE.LineBasicMaterial({ color: 0x00cc00, transparent: true, opacity: 0.5, linewidth: 3 });

//textures 3D
var flatMaterial = new THREE.MeshPhongMaterial({ color: 0x777777, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 }); //texture grise
var textureMaterial; //texture image

//mesh
var loader = new THREE.JSONLoader();
var mesh_site3D;

//lumieres 
var light = new THREE.AmbientLight(0xffffff);
var ambientLight = new THREE.AmbientLight(0xffffff);
var directionalLight = new THREE.DirectionalLight(0xffffff); //activé si pas de texture
directionalLight.position.set(10, 10, 10);
directionalLight.visible = false;

//photo
var div_img = document.createElement("div"); // div pour couper l'image caméra 2D affichée par dessus la scène 3D
var img = document.createElement("IMG");
img.onload = function() {
        onWindowResize();
        // pour le futur recalage 3d-3d plane.visible = true;
        plane_w = w;
        plane_h = h;
        plane.geometry = new THREE.PlaneGeometry(plane_w, plane_h);
        plane.material = new THREE.MeshPhongMaterial({ map:new THREE.Texture(img) });
        plane.material.map.needsUpdate = true;
        // set cameras parameters
        camera_3D.aspect = w / h;
        camera_3D.updateProjectionMatrix();
        camera_ortho.left = w/-2
        camera_ortho.right = w/2;
        camera_ortho.top = h/2;
        camera_ortho.bottom = h/-2;
        camera_ortho.updateProjectionMatrix();
        resetPoints();
}
var w, h; //taille de l'image rendue dans camera_3D/camera_ortho
var W, H; //taille de l'image rendue dans camera/camera2 = taille du canvas camera 3D
var x_cam, y_cam; //distances entre le coin de camera et celui de camera_3D
var plane_w, plane_h; //taille de l'image pour correspondre à un zoom de 1
var plane; //plan avec l'image

//paramètres caméra et recalage
var cx = 0; var cy = 0;
var err = 0;

//renderer
var renderer;

var stats;

//texts
var text_mesh, text_texture, text_image; //loaders mesh, texture, photo
var text_P3D, text_P2D; //indicateurs des points
var text_cam, text_param_cam; //paramètres de la caméra convertis pour blender
var text_loading; //chargement

init();
animate();
//initialisation
function init() {
    document.body.style.overflow = "hidden";
    
    //paramètres de taille des images, caméras...
	W = element_3D_sizeX * windowWidth;
    H = windowHeight;
    w = W;
	h = H;
    x_cam = 0;
    y_cam = 0;            
    
    //placement de l'image (img) dans une div (div_img)
    document.body.appendChild(div_img);
	div_img.appendChild(img);
    img.style.position = 'relative';
    div_img.style.top = 0 + "px";
    div_img.style.position = "absolute";
    div_img.style.overflow = "hidden"; //permet de ne pas dépasser sur le reste de l'écran
    div_img.style.height = H + "px";
    div_img.style.width = W + "px";

    //plan de l'image
    plane_w = w;
    plane_h = h;
	plane = new THREE.Mesh(new THREE.PlaneGeometry(plane_w, plane_h), flatMaterial);
	plane.overdraw = true;
		
    //scenes
	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();
	parentTransform = new THREE.Object3D();
	parentTransform_2D = new THREE.Object3D();
    parentEmpties_2D = new THREE.Object3D();
    parentEmpties_3D = new THREE.Object3D();
	parentTransform_2D.add(plane);
	scene1.add(parentTransform);
	scene2.add(parentTransform_2D);
    scene1.add(parentEmpties_3D);
    scene2.add(parentEmpties_2D);
	scene1.add(light);
	scene1.add(directionalLight);
	scene2.add(ambientLight);

	//cameras de la 3D en perspective: camera regarde camera_3D, visualisée par cameraHelper_p
    camera = new THREE.PerspectiveCamera(75, W / H, 0.01, 1000);
    camera.layers.enable(1);
	camera_3D = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
	camera_3D.position.set(0, 5, 10);
    cameraHelper_p = new THREE.CameraHelper(camera_3D);
    cameraHelper_p.layers.set(1);
    scene1.add(cameraHelper_p);
    //cameras de la 3D ortho: camera2 regarde camera_ortho, visualisée par cameraHelper_o
    camera2 = new THREE.OrthographicCamera(W/-2, W/2, H/2, H/-2, 0.01, 100);
    camera2.layers.enable(2);
    camera_ortho = new THREE.OrthographicCamera(w/-2, w/2, h/2, h/-2, 1, 100);
	camera_ortho.position.set(0, 10, 0);
    camera_ortho.rotation.set(-Math.PI/2, 0, 0, "XYZ");
    cameraHelper_o = new THREE.CameraHelper(camera_ortho);
    cameraHelper_o.layers.set(2);
    scene1.add(cameraHelper_o);

    //caméra de la 2D
    camera_2D = new THREE.OrthographicCamera((1-element_3D_sizeX) * windowWidth/-2,
                                             (1-element_3D_sizeX) * windowWidth/2,
                                             windowHeight/2,
                                             windowHeight/-2,
                                             1, 100);
	camera_2D.position.set(0,0,5);
	
	//renderer
	renderer = new THREE.WebGLRenderer(/*{antialias:true}*/);
	renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(renderer.domElement);

    //points 3D	
	for ( var i = 0; i < N_POINTS; i++ ) {
        var empty = new THREE.LineSegments(emptyGeometry, materialRed);
        empty.scale.set(2, 2, 2);
		parentEmpties_3D.add(empty);
		vox.push(empty);
		empty.visible = false;
		var point = new THREE.LineSegments(emptyGeometry, materialRed);
		point.scale.set(w/10, w/10, w/10);
		parentEmpties_2D.add(point);
		pix.push(point);
		point.visible = false;
	}
    
    //stats
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = (windowHeight - 58) + 'px'; //48px de large + 10 bordure
    stats.domElement.style.left = (windowWidth - 90) + 'px'; //80px de haut + 10 bordure
    document.body.appendChild(stats.dom);

	init_controls();
	init_buttons();
	init_text();
	setupGui();
	camChanger_focal();
    render_cam();
	
    //raycast
	raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 3;
	
    //event
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
	window.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('keyup', onKeyUp, false); 
    window.addEventListener('resize', onWindowResize, false);
    
    textureMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('Amrit/textures/Amrit_002_u1_v1_8k.jpg') });
    loader.load('Amrit/mesh/amrit.json', function(geometry, materials) {
        mesh_site3D = new THREE.Mesh(geometry, textureMaterial);
        parentTransform.add(mesh_site3D);
    });
    /*mesh_site3D = new THREE.Mesh(new THREE.CubeGeometry(10,10,10), textureMaterial);
    parentTransform.add(mesh_site3D);*/
    img.src = "img/melqart_temple_amrit.jpg";
}

function init_controls() {
	element_3D = document.createElement("canvas");
	element_3D.style.position = 'absolute';
	document.body.appendChild(element_3D);
    
    element_3D.addEventListener('mousewheel', onMouseWheel, false);
    element_3D.addEventListener('MozMousePixelScroll', onMouseWheel, false); 
	
	cameraControls_3D = new THREE.OrbitControls(camera_3D, element_3D);
	cameraControls_3D.enableKeys = false;
    cameraControls_3D.addEventListener('change', render_cam);
    cameraControls_3D_1 = new THREE.Fixed1PointControls(camera_3D, element_3D);
	cameraControls_3D_1.enabled = false;
    cameraControls_3D_1.addEventListener('change', render_cam_converge);
    cameraControls_3D_2 = new THREE.Fixed2PointsControls(camera_3D, element_3D);
	cameraControls_3D_2.enabled = false;
    cameraControls_3D_2.addEventListener('change', render_cam_converge);
    
    cameraControls_ortho = new THREE.OrbitControls(camera_ortho, element_3D);
    cameraControls_ortho.enableKeys = false;
    cameraControls_ortho.enabled = false;
    cameraControls_ortho.addEventListener('change', render_cam);
    	
	element_2D = document.createElement("canvas");
	element_2D.style.position = 'absolute';
	document.body.appendChild(element_2D);
	
	cameraControls_2D = new THREE.OrthoControls(camera_2D, element_2D);
	
	place_elements();
}

//animate
function animate() {
    //placer un point
	rayCast_3D();
	rayCast_2D();
    //récupérer un point
    rayCast_replace_2D();
    rayCast_replace_3D();
	render();
	control_3D();
    fix_3D();
    stats.update();
	requestAnimationFrame(animate);
}
function rayCast_replace_2D() {
    //Colorie en vert le pixel où passe la souris (pix_to_replace) et le vox correspondant
    if ( addPix || addVox || pixCount == 0 ) {
        text_P2D.style.display = "none";
        return;
    }
    raycaster.setFromCamera(mouse_2D, camera_2D);
	var intersects = raycaster.intersectObjects(parentEmpties_2D.children, true);
	if ( intersects.length > 0 ) {
        for ( var i = 0; i < N_POINTS; ++i ) {
            if ( intersects[0].object == pix[i] ) {   
                pix[i].material = materialGreen;
                vox[i].material = materialGreen;
                pix_to_replace = i;
                text_P2D.innerHTML = "P " + (i + 1);
                text_P2D.style.left = (mouseX + 10) + "px";
                text_P2D.style.top = (mouseY + 10) + "px"; 
                text_P2D.style.display = "block";
            } else {
                pix[i].material = materialRed;
                vox[i].material = materialRed;
            } 
        }        
	} else {
        text_P2D.style.display = "none";
        for ( var i = 0; i < N_POINTS; ++i ) {
            pix[i].material = materialRed;
            vox[i].material = materialRed;
        }
        pix_to_replace = N_POINTS;
	}
}
function rayCast_replace_3D() {
    // Colorie en vert le point 3D où passe la souris (vox_to_replace) et le pix correspondant
	if ( addVox || addPix || voxCount == 0 || mouseX > W ) {
        text_P3D.style.display = "none";
        return;
    }
    if ( effectController.ortho )
        raycaster.setFromCamera( mouse_3D, camera_ortho );
    else
        raycaster.setFromCamera( mouse_3D, camera_3D );
	var intersects = raycaster.intersectObjects( parentEmpties_3D.children, true);
	if ( intersects.length > 0 ) {
        for ( var i = 0; i < N_POINTS; ++i )
            if ( intersects[0].object == vox[i] ) {
                vox[i].material = materialGreen;
                pix[i].material = materialGreen;
                vox_to_replace = i;
                text_P3D.innerHTML = "P " + (i + 1);
                text_P3D.style.left = (mouseX + 10) + "px";
                text_P3D.style.top = (mouseY + 10) + "px";
                text_P3D.style.display = "block";
            }
	} else {
        text_P3D.style.display = "none";
        vox_to_replace = N_POINTS;
	}
}
function rayCast_3D() {
    // lors d'un ajout d'un point 3D : placement au bout de la souris
	if ( (!addVox) || voxIdx == N_POINTS )
		return;
    if ( effectController.ortho )
        raycaster.setFromCamera(mouse_3D, camera_ortho);
    else
        raycaster.setFromCamera(mouse_3D, camera_3D);
	var intersects = raycaster.intersectObjects(parentTransform.children, true);
	if ( intersects.length > 0 ) {
		vox[voxIdx].visible = true;
		vox[voxIdx].position.copy(intersects[ 0 ].point);
	} else 
		vox[voxIdx].visible = false;
}
function rayCast_2D() {
    // Place le marqueur sur la photo, au bout de la souris
	if ( (!addPix) || pixIdx == N_POINTS )
		return;
	raycaster.setFromCamera(mouse_2D, camera_2D);
	var intersects = raycaster.intersectObjects(parentTransform_2D.children, true);
	if ( intersects.length > 0 ) {
		pix[pixIdx].visible = true;
		pix[pixIdx].position.copy(intersects[ 0 ].point);
	} else
		pix[pixIdx].visible = false;
}
function control_3D() {
    // Active ou désactive les controles en fonctions des points déjà placés, du bouton compute et du type de caméra
    if( addPix || addVox )
        return;
    // recomptage des points fixés
	previous_fixed_points = fixed_points;
	fixed_points = 0;
	var fixed = [];
	for ( var i = 0; i < N_POINTS; i++ )
		if ( effectController.pix[i] && effectController.vox[i] ) {
			fixed.push(i);
			fixed_points ++;
		}	
    if ( noChange && previous_fixed_points == fixed_points )
        return;
    noChange = true;
    // active les controles adéquats
    if ( fixed_points < 5 || !effectController.compute ) { //reset de l'offset
        camera_3D.setViewOffset(w,h,0,0,w,h);
        cx = 0; cy = 0;
        camera_3D.updateProjectionMatrix();
    }
	if ( fixed_points < 1 || !effectController.compute ) { //aucun point fixé, liberté de caméra
        effectController.compute = false;
        cameraControls_3D.enabled = !effectController.ortho;
        cameraControls_ortho.enabled = effectController.ortho;
        render_cam();
	}
    if ( fixed_points == 1 ) { //un point : cameraControls_3D_1, maj du point fixé
        if ( effectController.compute )
            cameraControls_3D_1.enabled = true;
        var fx = camera_3D.projectionMatrix.elements[0];
        var fy = camera_3D.projectionMatrix.elements[5];
        var pixel = new THREE.Vector3().copy(pix[fixed[0]].position);
        var pixel_in_cam = new THREE.Vector3(2/plane_w / fx * pixel.x, 2/plane_h * 1/fy * pixel.y, -1);
        cameraControls_3D_1.setPoint_2D(pixel_in_cam);
        cameraControls_3D_1.setPoint_3D(vox[fixed[0]].position);
    }
    else 
        cameraControls_3D_1.enabled = false;
    if ( fixed_points == 2 ) { //deux points : cameraControls_3D_2, maj des points fixés
        if( effectController.compute )
            cameraControls_3D_2.enabled = true;
        var fx = camera_3D.projectionMatrix.elements[0];
        var fy = camera_3D.projectionMatrix.elements[5];
        var pixel1 = new THREE.Vector3().copy(pix[fixed[0]].position);
        var pixel1_in_cam = new THREE.Vector3(2/plane_w / fx * pixel1.x, 2/plane_h * 1/fy * pixel1.y, -1);
        var pixel2 = new THREE.Vector3().copy(pix[fixed[1]].position);
        var pixel2_in_cam = new THREE.Vector3(2/plane_w / fx * pixel2.x, 2/plane_h * 1/fy * pixel2.y, -1);
        cameraControls_3D_2.setPoints_2D(pixel1_in_cam, pixel2_in_cam);
        cameraControls_3D_2.setPoints_3D(vox[fixed[0]].position, vox[fixed[1]].position);
    }
    else 
        cameraControls_3D_2.enabled = false;
    //cas d'une focale très grande/petite trouvée avec 5 points -> remettre une focal à 30
    if ( fixed_points == 4 && previous_fixed_points > 3 && !effectController.ortho )
    if ( camera_3D.getFocalLength() > 60 || camera_3D.getFocalLength() < 15) {
        camera_3D.setFocalLength(30);
        effectController.focal = 30;
        gui.__folders["Camera"].__controllers[0].updateDisplay();
    }
}
function fix_3D() {
    if ( addPix || addVox || !effectController.compute )
        return;
    //calcul des points fixés
	var fixed = [];
	for ( var i = 0; i < N_POINTS; i++ )
		if ( effectController.pix[i] && effectController.vox[i] )
            fixed.push(i);
    //lance le calcul adéquat
    if ( effectController.ortho && fixed_points > 3 && !converge[4] ) //ortho et > 3 points
        fixnth(fixed);
    else if ( effectController.ortho && fixed_points == 3 && !converge[2] ) //ortho et 3 points
        fixthird_ortho(fixed[0], fixed[1], fixed[2]);
    else if ( effectController.ortho ) //ortho et 0,1,2 points
        return;
    else if ( fixed_points == 1 && !converge[0] ) //1 point
        fixfirst(fixed[0]);
    else if ( fixed_points == 2 && !converge[1] ) //2 points
        fixsecond(fixed[0], fixed[1]);
	else if ( fixed_points == 3 && !converge[2] ) { // 3 points
        var newcamera_3D = fixthird(fixed[0], fixed[1], fixed[2]);
        if ( newcamera_3D.length < 1 )
            console.log("pas de solution");
        else {
            var idx = Math.floor(0.5+effectController.solution_n) %(newcamera_3D.positions.length);
            camera_3D.position.set(newcamera_3D.positions[idx].x, 
                                   newcamera_3D.positions[idx].y,
                                   newcamera_3D.positions[idx].z);
            camera_3D.rotation.set(newcamera_3D.rotations[idx].x,
                                   newcamera_3D.rotations[idx].y,
                                   newcamera_3D.rotations[idx].z,
                                   newcamera_3D.rotations[idx].order);
        }
        converge[2] = true;
    }
	else if ( fixed_points == 4 && !converge[3] ) //4 points
        fixfourth(fixed[0], fixed[1], fixed[2], fixed[3]);
    else if ( fixed_points > 4 && !converge[4] ) //>4 points
        fixnth(fixed);
    else //si convergé
        return;
    render_cam();
}
//render
function render() {
//rendu modele
    render_model();
//rendu recalage 2D
	render_2D();
}
function render_model() {
    renderer.setViewport(0, 0, W, H);
	renderer.setScissor(0, 0, W, H);
	renderer.setScissorTest(true);
	renderer.setClearColor(new THREE.Color().setRGB(0.5, 0.5, 0.7));
    if ( effectController.ortho )
        renderer.render(scene1, camera2); //ortho
    else
        renderer.render(scene1, camera); //perspective
}

function render_2D() {
	renderer.setViewport(windowWidth * element_3D_sizeX, 0, 
                         windowWidth * (1-element_3D_sizeX), windowHeight);
	renderer.setScissor(windowWidth * element_3D_sizeX, 0, 
                        windowWidth * (1-element_3D_sizeX), windowHeight);
	renderer.setScissorTest(true);
	renderer.setClearColor(new THREE.Color().setRGB(0.5, 0.7, 0.5));
	renderer.render(scene2, camera_2D);
}
function update_cam() {
    //maj de la caméra recalée
    if ( effectController.ortho ) {
        //update de la caméra affichée
        camera_ortho.updateMatrixWorld(true);
        camera_ortho.matrixWorldInverse.getInverse(camera_ortho.matrixWorld);
        cameraHelper_o.update();  
        // placement de la caméra qui fait le rendu 
        camera2.position.set(camera_ortho.position.x, camera_ortho.position.y, camera_ortho.position.z);        camera2.rotation.set(camera_ortho.rotation.x, camera_ortho.rotation.y, camera_ortho.rotation.z, camera_ortho.rotation.order);
        camera2.zoom = camera_ortho.zoom * h / camera_ortho.top/2;
        camera2.setViewOffset(W, H, (W - w)/2 - x_cam, y_cam - (H - h)/2, W, H);
    } else {
        camera_3D.updateMatrixWorld(true);
        camera_3D.matrixWorldInverse.getInverse(camera_3D.matrixWorld);
        cameraHelper_p.update();
        camera.position.set(camera_3D.position.x, camera_3D.position.y, camera_3D.position.z);
        camera.rotation.set(camera_3D.rotation.x, camera_3D.rotation.y, camera_3D.rotation.z, camera_3D.rotation.order);
        camera.setFocalLength(camera_3D.getFocalLength() * Math.max(w, h) / Math.max(W, H));
        camera.setViewOffset(W, H, (W - w)/2 - x_cam + w * cx, y_cam - (H - h)/2 + h * cy, W, H);
    }
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
}
function render_cam_converge () {
    render_cam();
    set_converge();
}


//points events
function change_addPix() { //appelé quand on clique sur "add a 2D point"
    pix_to_replace = N_POINTS;
    vox_to_replace = N_POINTS;
	addVox = false;
	if ( voxCount < N_POINTS )
		vox[voxIdx].visible = false;
	addPix = !addPix;
	if ( pixCount == N_POINTS )
		addPix = false;
    if( addPix ) { //illumine le point à ajouter
        pix[pixIdx].material = materialGreen;
        vox[pixIdx].material = materialGreen;
    }
}
function checkVox(){
    // Calcule le nombre de Pt3D placés (voxCount) et le prochain point à placer (voxIdx). 
    // Appelé quand on vient de changer un point 3D
	addVox = false;
	voxCount = 0;
	voxIdx = 0;
	for ( var i = 0; i < N_POINTS; i++ ) {
		vox[i].visible = effectController.vox[i];
		if ( effectController.vox[i] )
			voxCount++;
	}
	while ( voxIdx < N_POINTS && effectController.vox[voxIdx] )
		voxIdx++;
    set_converge();
}
function checkPix(){
    // Calcule le nombre de Pt2D placés (pixCount) et le prochain point à placer (pixIdx)
    // Appelé quand on vient de changer un point 2D
	addPix = false;
	pixCount = 0;
	pixIdx = 0;
	for ( var i = 0; i < N_POINTS; i++ ) {
		pix[i].visible = effectController.pix[i];
		if ( effectController.pix[i] )
			pixCount++;
	}
	while ( pixIdx < N_POINTS && effectController.pix[pixIdx] )
		pixIdx++;
    set_converge();
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
//reset des paramètres de convergence
function set_converge() {
    for ( var i = 0; i < Math.min(N_POINTS, 5); ++i )
        converge[i] = false;
    noChange = false;
    prevdf1 = 0;
    prevdf2 = 0;
}
//events
function onMouseWheel( event ) { //zoom dans la caméra 3D
    if ( !(move_inside_cam || (effectController.ortho && effectController.compute)) )
        return;
    event.stopPropagation();
    event.preventDefault();
    var delta = 0;
    var mult = 0.95;
    if ( event.wheelDelta !== undefined ) // WebKit / Opera / Explorer 9
        delta = event.wheelDelta;
    else if ( event.detail !== undefined ) // Firefox
        delta = - event.detail;
    if ( move_inside_cam ) {
        if ( delta > 0 )
            mult = 1/0.95;
        x_cam += w * (1 - mult) / 2;
        y_cam += h * (1 - mult) / 2;
        w *= mult;
        h *= mult;
        place_img(effectController.imgOpacity / 100);
        update_cam();
    } else if ( effectController.ortho && effectController.compute ) {
        if ( delta > 0 )
            mult *= -1;
        camera_ortho.translateZ(mult);
        update_cam();
        render_cam();
    }
}
function onMouseMove( event ) {
	mouse_3D.x = 2 * (event.clientX - x_cam) / w - 1;
	mouse_3D.y = -2 * (event.clientY + y_cam+h - H) / h + 1;
	mouse_2D.x = 2 * (event.clientX - element_3D_sizeX * windowWidth) / windowWidth / (1-element_3D_sizeX) - 1;
	mouse_2D.y = -2 * event.clientY / windowHeight + 1;
    mouseX = event.clientX;
    mouseY = event.clientY;
    if ( move_inside_cam && translate_inside_cam ) { //translation dans la caméra 3D
        event.preventDefault();
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0; 
        x_cam += movementX;
        y_cam += -movementY;
        place_img(effectController.imgOpacity / 100);
        update_cam();
    }
}
function onMouseDown( event ) {
    if ( event.button === THREE.MOUSE.RIGHT && move_inside_cam && event.clientX < W )
        translate_inside_cam = true;
    if ( event.button !== THREE.MOUSE.LEFT )
        return;
    //placer le point 2D/3D correspondant au point 3D/2D sélectionné
    if ( inverse_vox_pix ) { //ctrl
        if ( pix_to_replace > -1 && pix_to_replace < N_POINTS ) {
            if ( addVox && voxCount < N_POINTS )
                vox[voxIdx].visible = false;
            addVox = true;
            voxIdx = pix_to_replace;
            addPix = false;
            pix_to_replace = N_POINTS;
            cameraControls_3D.enableRotate = false;
            cameraControls_3D_1.enableRotate = false;
            cameraControls_ortho.enableRotate = false;
        }
        if ( vox_to_replace > -1 && vox_to_replace < N_POINTS ) {
            if ( addPix && pixCount < N_POINTS )
                pix[pixIdx].visible = false;
            addPix = true;
            pixIdx = vox_to_replace;
            addVox = false;
            vox_to_replace = N_POINTS;
            cameraControls_3D.enableRotate = false;
            cameraControls_3D_1.enableRotate = false;
            cameraControls_ortho.enableRotate = false;
        }
        return;
    } 
    //resélectionner un point 2D
    if ( pix_to_replace < N_POINTS && pix_to_replace > -1 ) {
        addVox = false;
        if ( voxCount < N_POINTS )
            vox[voxIdx].visible = false;
        addPix = true;
        pixIdx = pix_to_replace;
        pix_to_replace = N_POINTS;
    }
    //resélectionner un point 3D
    if ( vox_to_replace < N_POINTS && vox_to_replace > -1 ) {
        addPix = false;
        if ( pixCount < N_POINTS )
            pix[pixIdx].visible = false;
        addVox = true;
        voxIdx = vox_to_replace;
        vox_to_replace = N_POINTS;
        cameraControls_3D.enableRotate = false;
        cameraControls_3D_1.enableRotate = false;
        cameraControls_ortho.enableRotate = false;
    }
    //zoom sur le pixel à ajouter
    if ( addPix && 
         event.clientX > windowWidth * element_3D_sizeX && 
         event.clientY < windowHeight ) {
        var x = pix[pixIdx].position.x; 
        var y = pix[pixIdx].position.y;
        camera_2D.position.x = x - windowWidth * (1-element_3D_sizeX) * mouse_2D.x/20;
        camera_2D.position.y = y - windowHeight * mouse_2D.y/20;
        camera_2D.zoom = 10; 
        camera_2D.updateProjectionMatrix();
    }
}
function onMouseUp( event ) {
    if( event.button !== THREE.MOUSE.LEFT ) { //arrêter la translation dans la caméra
        translate_inside_cam = false;
        return;
    }
	//placer un point 2D
    if ( pixIdx < N_POINTS 
        && event.clientX > windowWidth * element_3D_sizeX
        && addPix && pix[pixIdx].visible ) {
		effectController.pix[pixIdx] = true;
        cameraControls_3D.enableRotate = true;
        cameraControls_3D_1.enableRotate = true;
        cameraControls_ortho.enableRotate = true;
        checkPix();        
        camera_2D.zoom = 1;
        camera_2D.position.x = 0; camera_2D.position.y = 0;
        camera_2D.updateProjectionMatrix();
        return;
	}
    //placer un point 3D
	if ( voxIdx < N_POINTS 
        && event.clientX < windowWidth * element_3D_sizeX
        && addVox && vox[voxIdx].visible ) {
		effectController.vox[voxIdx] = true;
        cameraControls_3D.enableRotate = true;
        cameraControls_3D_1.enableRotate = true;
        cameraControls_ortho.enableRotate = true;
        checkVox();
	}
}
function onKeyDown( event ) {
	if ( event.keyCode == 27 || event.keyCode == 46 ) { //Esc or Suppr
        if ( addPix ) {
            camera_2D.zoom = 1;
            camera_2D.position.x = 0; camera_2D.position.y = 0;
            camera_2D.updateProjectionMatrix();
        }
        if ( addVox && voxIdx < N_POINTS ) {
            effectController.pix[voxIdx] = false;
            effectController.vox[voxIdx] = false;
            checkPix();
            checkVox();
        }
		if ( addPix && pixIdx < N_POINTS ) {
            effectController.pix[pixIdx] = false;
            effectController.vox[pixIdx] = false;
            checkPix();
            checkVox();
        }
		addVox = false;
		addPix = false;
	}
    if ( event.keyCode == 17 ) //ctrl
        inverse_vox_pix = true;
    if ( event.keyCode == 16 ) { //shift
        move_inside_cam = true;
        cameraControls_3D.enabled = false;
        cameraControls_3D_1.enabled = false;
        cameraControls_3D_2.enabled = false;
        cameraControls_ortho.enabled = false;
    }
}
function onKeyUp( event ) {
    if ( event.keyCode == 17 ) //ctrl
        inverse_vox_pix = false;
    if ( event.keyCode == 16 ) { //shift
        move_inside_cam = false;
        noChange = false;
    }
}