import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import { actions, selectors } from '../../../redux';
const { get3DPoints } = selectors;
const { add3DPoint } = actions;

import styles from './view-3D.css';

class View3D extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        setTimeout(this.initViewer.bind(this), 2000);
    }

    handleResize() {
        const rect = this.container3D.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
    }

    initViewer() {
        //scenes
        this.scene = new THREE.Scene();

        // light
        const light = new THREE.AmbientLight(0xffffff);
        const directionalLight = new THREE.DirectionalLight(0xffffff); //activé si pas de texture
        directionalLight.position.set(10, 10, 10);
        directionalLight.visible = false;
        this.scene.add(light);
        this.scene.add(directionalLight);

        //camera
        const rect = this.container3D.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.01, 1000);
        this.camera.layers.enable(1);
        this.camera.position.set(0, 5, 10);

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(rect.width, rect.height);
        this.container3D.appendChild(this.renderer.domElement);

        // camera controls
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.cameraControls.enableKeys = false;

        //raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 3;

        // load mesh
        const textureLoader = new THREE.TextureLoader();
        const texture = new THREE.MeshPhongMaterial({
            map: textureLoader.load('/public/textures/Amrit_002_u1_v1_8k.jpg')
        });
        const loader = new THREE.JSONLoader();
        loader.load('/public/mesh/amrit.json', geometry => {
            this.modelContainer = new THREE.Object3D();
            const mesh = new THREE.Mesh(geometry, texture);
            this.modelContainer.add(mesh);
            this.scene.add(this.modelContainer);

            // addpoint helper
            this.helperContainer = new THREE.Object3D();
            const emptyGeometry = new THREE.Geometry();
            const v1 = new THREE.Vector3(0.1, 0, 0);
            const v2 = new THREE.Vector3(-0.1, 0, 0);
            const v3 = new THREE.Vector3(0, 0.1, 0);
            const v4 = new THREE.Vector3(0, -0.1, 0);
            const v5 = new THREE.Vector3(0, 0, 0.1);
            const v6 = new THREE.Vector3(0, 0, -0.1);
            emptyGeometry.vertices.push(v1);
            emptyGeometry.vertices.push(v2);
            emptyGeometry.vertices.push(v3);
            emptyGeometry.vertices.push(v4);
            emptyGeometry.vertices.push(v5);
            emptyGeometry.vertices.push(v6);
            const materialRed = new THREE.LineBasicMaterial({
                color: 0xcc0000,
                transparent: true,
                opacity: 0.5,
                linewidth: 3
            });
            this.addPointHelper = new THREE.LineSegments(emptyGeometry, materialRed);
            this.addPointHelper.scale.set(rect.width / 10, rect.width / 10, rect.width / 10);
            this.addPointHelper.visible = false;
            this.helperContainer.add(this.addPointHelper);
            this.scene.add(this.helperContainer);

            // setup event handlers
            // element_3D.addEventListener('mousewheel', onMouseWheel, false);
            // element_3D.addEventListener('MozMousePixelScroll', onMouseWheel, false);
            this.container3D.addEventListener('mousemove', this.onMouseMove, false);
            this.container3D.addEventListener('mousedown', this.onMouseDown, false);
            //    document.addEventListener('mouseup', onMouseUp, false);
            // window.addEventListener('keydown', onKeyDown, false);
            // window.addEventListener('keyup', onKeyUp, false);
        });

        // init variables
        this.mouse = {};

        // start rendering
        this.animate();
    }

    animate() {
        const rect = this.container3D.getBoundingClientRect();
        this.renderer.setViewport(0, 0, rect.width, rect.height);
        this.renderer.setScissor(0, 0, rect.width, rect.height);
        this.renderer.setScissorTest(true);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    onMouseMove(e) {
        // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
        const rect = this.container3D.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

        // Pick camera
        // Raycaster for picking selected camera mesh, see github source
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // find objects intersecting the picking ray
        const modelIntersect = this.raycaster.intersectObjects(this.modelContainer.children);
        this.isModelIntersected = modelIntersect.length > 0;

        if (this.isModelIntersected && this.props.addMode) {
            this.addPointHelper.visible = true;
            this.addPointHelper.position.copy(modelIntersect[0].point);
        } else {
            this.addPointHelper.visible = false;
        }
    }

    onMouseDown(e) {
        if (this.isModelIntersected && this.props.addMode) {
            console.log(this.addPointHelper.position);
            this.props.dispatch(add3DPoint(this.addPointHelper.position));
        }
    }

    render() {
        return <div className={styles.view3D} ref={el => (this.container3D = el)} />;
    }
}

View3D.propTypes = {
    addMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired
};

const ConnectedView3D = connect(store => {
    return {
        points: get3DPoints(store)
    };
})(View3D);

export default ConnectedView3D;
