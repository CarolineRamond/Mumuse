import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import styles from './interactive-model.css';

const helperGeometry = new THREE.Geometry();
const v1 = new THREE.Vector3(0.1, 0, 0);
const v2 = new THREE.Vector3(-0.1, 0, 0);
const v3 = new THREE.Vector3(0, 0.1, 0);
const v4 = new THREE.Vector3(0, -0.1, 0);
const v5 = new THREE.Vector3(0, 0, 0.1);
const v6 = new THREE.Vector3(0, 0, -0.1);
helperGeometry.vertices.push(v1);
helperGeometry.vertices.push(v2);
helperGeometry.vertices.push(v3);
helperGeometry.vertices.push(v4);
helperGeometry.vertices.push(v5);
helperGeometry.vertices.push(v6);

const helperMaterial = new THREE.LineBasicMaterial({
    linewidth: 3
});

const strToHexColor = str => {
    return parseInt(str.split('#')[1], 16);
};

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
            this.helper.visible = false;
        }
        if (nextProps.shouldShowTexture !== this.props.shouldShowTexture) {
            if (nextProps.shouldShowTexture && this.textureMaterial) {
                this.mesh.material = this.textureMaterial;
                this.directionalLight.visible = false;
            } else {
                this.mesh.material = this.flatMaterial;
                this.directionalLight.visible = true;
            }
        }
        if (nextProps.defaultPointColor !== this.props.defaultPointColor) {
            const hexColor = strToHexColor(nextProps.defaultPointColor);
            this.helper.material.color.setHex(hexColor);
            this.pointsContainer.children.map(point => {
                if (!point.metadata.color) {
                    point.children[0].material.color.setHex(hexColor);
                    if (point.metadata.bind) {
                        point.children[3].material.color.setHex(hexColor);
                    }
                }
            });
        }
        if (
            nextProps.pointWeight !== this.props.pointWeight ||
            nextProps.pointSize !== this.props.pointSize
        ) {
            this.redrawPoints(nextProps.points);
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
        this.directionalLight = new THREE.DirectionalLight(0xffffff); //activé si pas de texture
        this.directionalLight.position.set(10, 10, 10);
        this.directionalLight.visible = false;
        this.scene.add(light);
        this.scene.add(this.directionalLight);

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

        // load texture (if any)
        const textureLoader = new THREE.TextureLoader();
        this.flatMaterial = new THREE.MeshPhongMaterial({
            color: 0x777777,
            flatShading: true,
            vertexColors: THREE.VertexColors,
            shininess: 0
        }); //texture grise
        if (this.props.textureUrl) {
            this.textureMaterial = new THREE.MeshPhongMaterial({
                map: textureLoader.load(this.props.textureUrl)
            });
        }

        // load mesh
        const loader = new THREE.JSONLoader();
        loader.load(this.props.meshUrl, geometry => {
            this.modelContainer = new THREE.Object3D();
            const material =
                this.props.shouldShowTexture && this.textureMaterial
                    ? this.textureMaterial
                    : this.flatMaterial;
            this.mesh = new THREE.Mesh(geometry, material);
            this.modelContainer.add(this.mesh);
            this.scene.add(this.modelContainer);

            // helper
            this.helper = new THREE.Object3D();
            this.helperContainer = new THREE.Object3D();
            this.helper = new THREE.LineSegments(helperGeometry, helperMaterial);
            this.helper.scale.set(rect.width / 10, rect.width / 10, rect.width / 10);
            const hexColor = strToHexColor(this.props.defaultPointColor);
            this.helper.material.color.setHex(hexColor);
            this.helper.visible = false;
            this.helperContainer.add(this.helper);
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
            const color = point.color || this.props.defaultPointColor;
            const material = new THREE.MeshBasicMaterial({ color: color });
            const geometry = new THREE.CylinderGeometry(
                this.props.pointWeight / 400,
                this.props.pointWeight / 400,
                this.props.pointSize / 100,
                8
            );
            const cylinder1 = new THREE.Mesh(geometry, material);
            const cylinder2 = new THREE.Mesh(geometry, material);
            const cylinder3 = new THREE.Mesh(geometry, material);
            cylinder2.rotateX(Math.PI / 2);
            cylinder3.rotateZ(Math.PI / 2);
            const newPoint = new THREE.Object3D();
            newPoint.add(cylinder1);
            newPoint.add(cylinder2);
            newPoint.add(cylinder3);

            if (point.bind) {
                const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4
                });
                const sphereGeometry = new THREE.SphereGeometry(
                    this.props.pointSize / 100 / 2,
                    8,
                    8
                );
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                newPoint.add(sphere);
            }

            newPoint.position.set(point.x, point.y, point.z);
            newPoint.metadata = point;
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

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.props.addMode || this.draggedPoint) {
            this.didDrag = true;
            this.checkModelIntersection();
        } else {
            // else, bind/delete/update mode is on : find points intersecting the picking ray
            this.checkPointIntersection();
        }
    }

    checkModelIntersection() {
        const modelIntersect = this.raycaster.intersectObjects(this.modelContainer.children, true);
        this.isModelIntersected = modelIntersect.length > 0;

        if (this.isModelIntersected) {
            // model is intersected : display helper at mouse position
            this.helper.visible = true;
            this.helper.position.copy(modelIntersect[0].point);
        } else {
            // model is not intersected : hide helper
            this.helper.visible = false;
        }
    }

    checkPointIntersection() {
        const pointsIntersect = this.raycaster.intersectObjects(
            this.pointsContainer.children,
            true
        );
        const previousPointIntersected = this.pointIntersected;
        if (pointsIntersect.length > 0) {
            // a point is intersected : highlight it
            this.pointIntersected = pointsIntersect[0].object.parent;
            this.pointIntersected.children[0].material.color.setHex(0x00ff00);
            if (this.pointIntersected.metadata.bind) {
                this.pointIntersected.children[3].material.color.setHex(0x00ff00);
            }
            this.container3D.style.cursor = 'pointer';
        } else {
            // no point is intersected
            this.pointIntersected = null;
            this.container3D.style.cursor = 'default';
        }
        // un-highlight previously intersected point (if different from new one)
        if (
            previousPointIntersected &&
            !previousPointIntersected.metadata.selected &&
            (!this.pointIntersected ||
                previousPointIntersected.metadata.id !== this.pointIntersected.metadata.id)
        ) {
            const color = previousPointIntersected.metadata.color || this.props.defaultPointColor;
            const hexColor = strToHexColor(color);
            previousPointIntersected.children[0].material.color.setHex(hexColor);
            if (previousPointIntersected.metadata.bind) {
                previousPointIntersected.children[3].material.color.setHex(hexColor);
            }
        }
    }

    onMouseDown() {
        if (this.props.addMode && this.isModelIntersected) {
            this.props.onAddPoint(this.helper.position);
            return;
        }
        if (this.props.bindMode) {
            this.props.onSelectPoint(this.pointIntersected.metadata);
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
            this.helper.position.copy(this.draggedPoint.position);
            this.helper.material.color.setHex(0x00ff00);
            this.helper.visible = true;
        }
    }

    onMouseUp() {
        if (this.draggedPoint) {
            // stop dragging point
            if (this.isModelIntersected && this.didDrag) {
                // a point was dragged : update it
                this.props.onUpdatePoint(this.draggedPoint.metadata.id, this.helper.position);
            } else {
                // the point could not be placed : show it back
                this.draggedPoint.visible = true;
            }
            // 1. hide back addPointHelper
            this.helper.visible = false;
            const hexColor = strToHexColor(this.props.defaultPointColor);
            this.helper.material.color.setHex(hexColor);
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
    bindMode: PropTypes.bool,
    defaultPointColor: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    meshUrl: PropTypes.string.isRequired,
    onAddPoint: PropTypes.func.isRequired,
    onRemovePoint: PropTypes.func.isRequired,
    onSelectPoint: PropTypes.func.isRequired,
    onUpdatePoint: PropTypes.func.isRequired,
    pointSize: PropTypes.number,
    pointWeight: PropTypes.number,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired,
    shouldShowTexture: PropTypes.bool,
    textureUrl: PropTypes.string
};

export default InteractiveModel;
