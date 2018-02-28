import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import styles from './interactive-model.css';

const pointGeometry = new THREE.Geometry();
const v1 = new THREE.Vector3(0.1, 0, 0);
const v2 = new THREE.Vector3(-0.1, 0, 0);
const v3 = new THREE.Vector3(0, 0.1, 0);
const v4 = new THREE.Vector3(0, -0.1, 0);
const v5 = new THREE.Vector3(0, 0, 0.1);
const v6 = new THREE.Vector3(0, 0, -0.1);
pointGeometry.vertices.push(v1);
pointGeometry.vertices.push(v2);
pointGeometry.vertices.push(v3);
pointGeometry.vertices.push(v4);
pointGeometry.vertices.push(v5);
pointGeometry.vertices.push(v6);

const getPointMaterial = color => {
    let hexColor;
    try {
        hexColor = parseInt(color.split('#')[1], 16);
    } catch (e) {
        hexColor = 0xff0000;
    }
    return new THREE.LineBasicMaterial({
        color: hexColor,
        linewidth: 3
    });
};

const pointMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 3
});
const selectedPointMaterial = new THREE.LineBasicMaterial({
    color: 0x00cc00,
    linewidth: 3
});

class InteractiveModel extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.redrawPoints = this.redrawPoints.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        this.props.setPointsChangedHandler(this.redrawPoints);
        setTimeout(this.initViewer.bind(this), 2000);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.addMode && !nextProps.addMode) {
            //addMode is off : hide addpoint helper & update cursor
            this.container3D.style.cursor = 'default';
            this.addPointHelper.visible = false;
        }
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
        let texture = new THREE.MeshBasicMaterial();
        if (this.props.textureUrl) {
            texture = new THREE.MeshPhongMaterial({
                map: textureLoader.load(this.props.textureUrl)
            });
        }

        const loader = new THREE.JSONLoader();
        loader.load(this.props.meshUrl, geometry => {
            this.modelContainer = new THREE.Object3D();
            const mesh = new THREE.Mesh(geometry, texture);
            this.modelContainer.add(mesh);
            this.scene.add(this.modelContainer);

            // addpoint helper
            this.helperContainer = new THREE.Object3D();
            this.addPointHelper = new THREE.LineSegments(pointGeometry, pointMaterial);
            this.addPointHelper.scale.set(rect.width / 10, rect.width / 10, rect.width / 10);
            this.addPointHelper.visible = false;
            this.helperContainer.add(this.addPointHelper);
            this.scene.add(this.helperContainer);

            // setup event handlers
            this.container3D.addEventListener('mousemove', this.onMouseMove, false);
            this.container3D.addEventListener('mousedown', this.onMouseDown, false);
            this.container3D.addEventListener('mouseup', this.onMouseUp, false);
        });

        // init variables
        this.mouse = {};
        this.pointsContainer = new THREE.Object3D();
        this.scene.add(this.pointsContainer);

        //draw points
        this.redrawPoints(this.props.points);

        // start rendering
        this.animate();
    }

    redrawPoints(points) {
        // remove previously drawn points
        for (let i = this.pointsContainer.children.length - 1; i >= 0; i--) {
            this.pointsContainer.remove(this.pointsContainer.children[i]);
        }
        // add new points
        points.map(point => {
            const material = point.selected ? selectedPointMaterial : getPointMaterial(point.color);
            const newPoint = new THREE.LineSegments(pointGeometry, material);
            newPoint.scale.set(2, 2, 2);
            newPoint.position.set(point.x, point.y, point.z);
            newPoint.metadata = {
                id: point.id,
                selected: point.selected
            };
            this.pointsContainer.add(newPoint);
        });
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

        if (this.props.addMode || this.draggedPoint) {
            // add/dragpoint mode is on : check if model is intersecting the picking ray
            this.didDrag = true;
            const modelIntersect = this.raycaster.intersectObjects(
                this.modelContainer.children,
                true
            );
            this.isModelIntersected = modelIntersect.length > 0;

            if (this.isModelIntersected) {
                this.addPointHelper.visible = true;
                this.addPointHelper.position.copy(modelIntersect[0].point);
                // model is intersected : change cursor accordingly
                if (this.props.addMode) {
                    this.container3D.style.cursor = 'crosshair';
                } else {
                    this.container3D.style.cursor = 'move';
                }
            } else {
                this.addPointHelper.visible = false;
                this.container3D.style.cursor = 'default';
            }
        } else {
            // else, bind/delete/update mode is on : find points intersecting the picking ray
            const pointsIntersect = this.raycaster.intersectObjects(
                this.pointsContainer.children,
                true
            );
            if (pointsIntersect.length > 0) {
                this.pointIntersected = pointsIntersect[0].object;
                this.pointIntersected.material = selectedPointMaterial;
                // a point is intersected : change cursor accordingly
                if (this.props.deleteMode) {
                    this.container3D.style.cursor = 'not-allowed';
                } else {
                    this.container3D.style.cursor = 'pointer';
                }
            } else {
                if (this.pointIntersected && !this.pointIntersected.metadata.selected) {
                    this.pointIntersected.material = pointMaterial;
                }
                this.pointIntersected = null;
                this.container3D.style.cursor = 'default';
            }
        }
    }

    onMouseDown() {
        if (this.props.addMode && this.isModelIntersected) {
            this.props.onAddPoint(this.addPointHelper.position);
            return;
        }
        if (this.props.bindingMode) {
            this.props.onSelectPoint(
                this.pointIntersected ? this.pointIntersected.metadata.id : null
            );
            return;
        }
        if (!this.props.addMode && !this.props.deleteMode && this.pointIntersected) {
            this.didDrag = false;
            // start dragging a point
            // 1. disable controls
            this.cameraControls.enabled = false;
            // 2. hide dragged point (to keep original position)
            this.draggedPoint = this.pointIntersected;
            this.draggedPoint.visible = false;
            // 3. show addPointHelper (this is the THREE object that is effectively dragged)
            this.addPointHelper.position.copy(this.draggedPoint.position);
            this.addPointHelper.material = selectedPointMaterial;
            this.addPointHelper.visible = true;
        }
    }

    onMouseUp() {
        if (this.draggedPoint) {
            // stop dragging point
            if (this.isModelIntersected && this.didDrag) {
                // a point was dragged : update it
                this.props.onUpdatePoint(
                    this.draggedPoint.metadata.id,
                    this.addPointHelper.position
                );
            } else {
                // the point could not be placed : show it back
                this.draggedPoint.visible = true;
            }
            // 1. hide back addPointHelper
            this.addPointHelper.visible = false;
            this.addPointHelper.material = pointMaterial;
            // 2. re-enable camera controls
            this.cameraControls.enabled = true;
            // 3. reset drag variables
            this.draggedPoint = null;
            this.didDrag = false;
        }
        if (this.pointIntersected && this.props.deleteMode) {
            // a point was clicked in delete mote : remote it
            this.props.onRemovePoint(this.pointIntersected.metadata.id);
        }
    }

    render() {
        return <div className={styles.interactiveModel} ref={el => (this.container3D = el)} />;
    }
}

InteractiveModel.propTypes = {
    addMode: PropTypes.bool,
    bindingMode: PropTypes.bool,
    deleteMode: PropTypes.bool,
    meshUrl: PropTypes.string.isRequired,
    onAddPoint: PropTypes.func.isRequired,
    onRemovePoint: PropTypes.func.isRequired,
    onSelectPoint: PropTypes.func.isRequired,
    onUpdatePoint: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired,
    textureUrl: PropTypes.string
};

export default InteractiveModel;
