import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import ProgressBar from 'react-toolbox/lib/progress_bar';

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
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
        this.redrawPoints = this.redrawPoints.bind(this);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        this.props.setPointsChangedHandler(this.redrawPoints);
        requestAnimationFrame(this.initViewer.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        // change mesh url
        if (nextProps.meshUrl !== this.props.meshUrl) {
            this.reloadMesh(nextProps.meshUrl);
        }

        // change texture url
        if (nextProps.textureUrl !== this.props.textureUrl) {
            this.reloadTexture(nextProps.textureUrl);
        }

        // switch off addMode : hide addpoint helper & update cursor
        if (this.props.addMode && !nextProps.addMode) {
            this.container3D.style.cursor = 'default';
            this.helper.visible = false;
        }
        // toggle model texture
        if (nextProps.shouldShowTexture !== this.props.shouldShowTexture) {
            if (nextProps.shouldShowTexture && this.textureMaterial) {
                this.mesh.material = this.textureMaterial;
                this.directionalLight.visible = false;
            } else {
                this.mesh.material = this.flatMaterial;
                this.directionalLight.visible = true;
            }
        }
        // update default point color
        if (nextProps.defaultPointColor !== this.props.defaultPointColor) {
            const hexColor = strToHexColor(nextProps.defaultPointColor);
            this.helper.material.color.setHex(hexColor);
            this.pointsContainer.children.map(point => {
                if (!point.metadata.color) {
                    point.children[0].material.color.setHex(hexColor);
                    point.children[3].material.color.setHex(hexColor);
                }
            });
        }
        // update point size/weight
        if (
            nextProps.pointWeight !== this.props.pointWeight ||
            nextProps.pointSize !== this.props.pointSize
        ) {
            this.redrawPoints(nextProps.points);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // component should re-render only when mesh has finished loading
        return nextState.loading !== this.state.loading;
    }

    handleResize() {
        const rect = this.container3D.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);

        if (this.updateCameraTimeout) {
            clearTimeout(this.updateCameraTimeout);
        }
        this.updateCameraTimeout = setTimeout(this.updateCamera, 100);
    }

    initViewer() {
        const rect = this.container3D.getBoundingClientRect();

        //scenes
        this.scene = new THREE.Scene();

        // light
        const light = new THREE.AmbientLight(0xffffff);
        this.directionalLight = new THREE.DirectionalLight(0xffffff); //activé si pas de texture
        this.directionalLight.position.set(10, 10, 10);
        this.directionalLight.visible = false;
        this.scene.add(light);
        this.scene.add(this.directionalLight);

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(rect.width, rect.height);
        this.container3D.appendChild(this.renderer.domElement);

        //camera
        if (this.props.camera) {
            const loader = new THREE.ObjectLoader();
            this.camera = loader.parse(this.props.camera);
            requestAnimationFrame(this.handleResize);
        } else {
            this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.01, 1000);
            this.camera.position.set(0, 5, 10);
            this.camera.layers.enable(1);
        }

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
            const noTexture = !this.props.shouldShowTexture || !this.textureMaterial;
            const material = noTexture ? this.flatMaterial : this.textureMaterial;

            this.directionalLight.visible = noTexture;
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

            //draw points
            this.redrawPoints(this.props.points);

            // setup event handlers
            this.container3D.addEventListener('mousemove', this.onMouseMove, false);
            this.container3D.addEventListener('mousedown', this.onMouseDown, false);
            this.container3D.addEventListener('mouseup', this.onMouseUp, false);
            if (this.props.onChangeCamera) {
                this.renderer.domElement.addEventListener('wheel', this.onMouseWheel, false);
            }

            this.setState({
                loading: false
            });
        });

        // init variables
        this.mouse = {};
        this.pointsContainer = new THREE.Object3D();
        this.scene.add(this.pointsContainer);

        // start rendering
        this.animate();
    }

    reloadMesh(meshUrl) {
        this.setState(
            {
                loading: true
            },
            () => {
                const loader = new THREE.JSONLoader();
                loader.load(meshUrl, geometry => {
                    this.mesh.geometry = geometry;
                    this.setState({
                        loading: false
                    });
                });
            }
        );
    }

    reloadTexture(textureUrl) {
        const textureLoader = new THREE.TextureLoader();
        this.textureMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load(textureUrl)
        });
        if (this.props.shouldShowTexture) {
            this.mesh.material = this.textureMaterial;
        }
    }

    redrawPoints(points) {
        // remove previously drawn points
        for (let i = this.pointsContainer.children.length - 1; i >= 0; i--) {
            this.pointsContainer.remove(this.pointsContainer.children[i]);
        }
        // add new points
        points.map(point => {
            const color = point.color || this.props.defaultPointColor;
            const cylinderMaterial = new THREE.MeshBasicMaterial({ color: color });
            const cylinderGeometry = new THREE.CylinderGeometry(
                this.props.pointWeight / 400,
                this.props.pointWeight / 400,
                this.props.pointSize / 100,
                8
            );
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: point.selected ? 0.4 : 0
            });
            const sphereGeometry = new THREE.SphereGeometry(this.props.pointSize / 100 / 2, 8, 8);
            const cylinder1 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            const cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            const cylinder3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            cylinder2.rotateX(Math.PI / 2);
            cylinder3.rotateZ(Math.PI / 2);

            const newPoint = new THREE.Object3D();
            newPoint.add(cylinder1);
            newPoint.add(cylinder2);
            newPoint.add(cylinder3);
            newPoint.add(sphere);

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

    onMouseDown() {
        if (this.props.addMode && this.isModelIntersected) {
            this.props.onAddPoint(this.helper.position);
            return;
        }
        this.didDrag = false;
        if (!this.props.addMode && !this.props.deleteMode && this.pointIntersected) {
            // start dragging a point
            // 1. disable controls
            this.cameraControls.enabled = false;
            // 2. hide dragged point (to keep original position)
            this.draggedPoint = this.pointIntersected;
            this.draggedPoint.visible = false;
            // 3. show addPointHelper (this is the THREE object that is effectively dragged)
            this.helper.position.copy(this.draggedPoint.position);
            this.helper.visible = true;
        }
    }

    onMouseMove(e) {
        this.didDrag = true;
        const rect = this.container3D.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.props.addMode || this.draggedPoint) {
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
            this.pointIntersected.children[3].material.opacity = 0.4;
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
            previousPointIntersected.children[3].material.opacity = 0;
        }
    }

    onMouseUp() {
        if (this.cameraControls.enabled && this.didDrag && this.props.onChangeCamera) {
            this.updateCamera();
        }
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
        // select point on click
        if (!this.props.addMode && !this.props.deleteMode && !this.didDrag) {
            this.props.onSelectPoint(this.pointIntersected ? this.pointIntersected.metadata : null);
        }
    }

    onMouseWheel() {
        if (this.updateCameraTimeout) {
            clearTimeout(this.updateCameraTimeout);
        }
        this.updateCameraTimeout = setTimeout(this.updateCamera, 100);
    }

    updateCamera() {
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();
        requestAnimationFrame(() => {
            this.props.onChangeCamera(this.camera);
        });
    }

    render() {
        return (
            <div className={styles.interactiveModelContainer}>
                {this.state.loading && (
                    <div className={styles.interactiveModelLoader}>
                        <ProgressBar type="circular" mode="indeterminate" />
                    </div>
                )}
                <div className={styles.interactiveModel} ref={el => (this.container3D = el)} />;
            </div>
        );
    }
}

InteractiveModel.propTypes = {
    addMode: PropTypes.bool,
    camera: PropTypes.object,
    defaultPointColor: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    meshUrl: PropTypes.string.isRequired,
    onAddPoint: PropTypes.func.isRequired,
    onChangeCamera: PropTypes.func,
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
