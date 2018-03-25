import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
// import PointerLockControls from 'threejs-controls/PointerLockControls';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import styles from './interactive-model.css';

class InteractiveModel extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        setTimeout(() => {
            this.initViewer();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) {
        // change mesh url
        if (nextProps.meshUrl !== this.props.meshUrl) {
            this.reloadMesh(nextProps.meshUrl);
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
    }

    initViewer() {
        const rect = this.container3D.getBoundingClientRect();

        //scenes
        this.scene = new THREE.Scene();

        // light
        const light = new THREE.AmbientLight(0xffffff);
        this.directionalLight = new THREE.DirectionalLight(0xffffff);
        this.directionalLight.position.set(10, 10, 10);
        this.directionalLight.visible = true;
        this.scene.add(light);
        this.scene.add(this.directionalLight);

        //renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(rect.width, rect.height);
        this.container3D.appendChild(this.renderer.domElement);

        //camera
        this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.01, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.layers.enable(1);

        // camera controls
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.cameraControls.enableKeys = false;

        //raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.linePrecision = 3;

        // load mesh
        const loader = new THREE.ObjectLoader();
        loader.load(this.props.meshUrl, object => {
            this.scene.add(object);
            object.children.map(child => {
                child.rotation.z += Math.PI;
            });

            // setup event handlers
            this.container3D.addEventListener('mousemove', this.onMouseMove, false);
            this.container3D.addEventListener('mousedown', this.onMouseDown, false);
            this.container3D.addEventListener('mouseup', this.onMouseUp, false);

            this.setState({
                loading: false
            });
        });

        // init variables
        this.mouse = {};

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

    animate() {
        const rect = this.container3D.getBoundingClientRect();
        this.renderer.setViewport(0, 0, rect.width, rect.height);
        this.renderer.setScissor(0, 0, rect.width, rect.height);
        this.renderer.setScissorTest(true);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    onMouseDown() {
        // nothing yet
    }

    onMouseMove() {
        // raycasting
        // this.didDrag = true;
        // const rect = this.container3D.getBoundingClientRect();
        // this.mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
        // this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // if (this.props.addMode || this.draggedPoint) {
        // this.checkModelIntersection();
        // } else {
        // else, bind/delete/update mode is on : find points intersecting the picking ray
        // this.checkPointIntersection();
        // }
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

    onMouseUp() {
        // nothing yet
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
    meshUrl: PropTypes.string.isRequired,
    setResizeHandler: PropTypes.func.isRequired
};

export default InteractiveModel;
