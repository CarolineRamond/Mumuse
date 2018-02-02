import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import potree from '@iconem/iconem-potree';
import Camera from '../../Potree/Camera';
import MediaViewer from '../MediaViewer';
import FadeInComponent from '../AnimationComponents/FadeInComponent';
import styles from './potreeViewer.css';

import { selectors } from '../../../modules';
const {
    getSelectedMedias,
    getSelectFilterPending,
    getVisibleMedias,
    getSelectedPointCloud
} = selectors;
import { actions } from '../../../modules';
const { selectMediaById } = actions;

class PotreeViewer extends React.Component {
    constructor(props) {
        super(props);

        // potree params
        this.mediaCameras = [];
        this.currentCameraIndex = -1;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mediaCamera_intersected = null;
        this.potreeIsLoading = false;
        // This is used to store camera position, quaternion and potree direction when we use
        // this.potree.scene.camera.matrixAutoUpdate = false
        // (by-passing potree controls) and then modify the camera manually in three.js (so that we can set them back afterwards);
        // this.previous3dQuaternion = null;
        // this.previous3dDirection = null;

        // media selection functions
        this.selectMediaCamera = this.selectMediaCamera.bind(this);
        this.deselectMediaCamera = this.deselectMediaCamera.bind(this);
        this.launchFadeOutTransition = this.launchFadeOutTransition.bind(this);
        this.handleFadeTransitionComplete = this.handleFadeTransitionComplete.bind(this);
        this.resetMedia = this.resetMedia.bind(this);
        this.currentMediaCamera = null; // currently selected media camera
        this.navigating = false; // whether a camera transition is on going
        // this.lastSearch = this.props.location.search; // last search params

        // mouse events
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        //Tween functions
        // this.tweenLookAt = this.tweenLookAt.bind(this);
        // this.tweenRoll = this.tweenRoll.bind(this);
        this.computeMediaCameraTransformations = this.computeMediaCameraTransformations.bind(this);
        this.tweenFov = this.tweenFov.bind(this);
        this.tweenPosition = this.tweenPosition.bind(this);
        this.tweenQuaternion = this.tweenQuaternion.bind(this);

        this.state = {
            media: null,
            displayMedia: false
        };
    }

    componentDidMount() {
        this.initViewer();
        // const siteName = this.props.match.params.siteName;
        // this.props.dispatch(fetchSubsite(siteName));

        // if (this.props.location.pathname !== '/' + siteName) {
        //     // a camera should be selected according to route
        //     // => store camera name to launch camera navigation
        //     // once all cameras are displayed
        //     const mediaName = this.props.location.pathname.split('/')[2];
        //     this.initialMediaName = mediaName;
        // }

        window.addEventListener('resize', this.onResizeWindow.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        // Load pointcloud and add cameraMedia to potree
        if (
            !this.potreeIsLoading &&
            (this.potree.scene.pointclouds.length === 0 ||
                (nextProps.pointCloud.metaData &&
                    nextProps.pointCloud.metaData._id !== this.props.pointCloud.metaData._id))
        ) {
            // Empty point cloud if necessary
            if (
                nextProps.pointCloud.metaData &&
                nextProps.pointCloud.metaData._id !== this.props.pointCloud.metaData._id
            ) {
                this.potree.scene.pointclouds = [];
            }
            if (nextProps.pointCloud.metaData && nextProps.pointCloud.metaData._id) {
                this.potreeIsLoading = true;
                potree.loadPointCloud(
                    `potreeviewer/potreedataset/${nextProps.pointCloud.metaData._id}/cloud.js`,
                    nextProps.pointCloud.metaData.name,
                    e => {
                        this.potreeIsLoading = false;
                        this.potree.scene.addPointCloud(e.pointcloud);
                        this.potree.fitToScreen();
                    }
                );

                const pointCloudMedias = JSON.parse(nextProps.pointCloud.metaData.visus);
                this.addCamerasToPotree(pointCloudMedias);
                this.filterVisibleCamera(this.props.visibleMedias);
            }
        }

        // Select media on 3D viewer when a media is selected, else reset viewer view
        const currentMedia = this.props.selectedMedias[0];
        const nextMedia = nextProps.selectedMedias[0];
        if (
            this.props.pointCloud.metaData &&
            nextMedia &&
            (!currentMedia || currentMedia.properties._id !== nextMedia.properties._id)
        ) {
            // const mediaCamera = this.potree.scene.scene.children.find(
            //     mesh => mesh.userData.mediaId === nextMedia.properties._id
            // );
            // if (mediaCamera) {
            //     this.goToMediaCamera(mediaCamera);
            //     mediaCamera.loadMedia();
            // }
        } else if (!nextMedia) {
            this.potree.fitToScreen();
        }

        //Hide or show camera based on timeline filtering
        if (
            nextProps.visibleMedias &&
            nextProps.visibleMedias.length !== this.props.visibleMedias.length
        ) {
            this.filterVisibleCamera(nextProps.visibleMedias);
        }
    }

    // componentWillReceiveProps(nextProps) {
    // potree data were fetched : init potree viewer
    // if (nextProps.subsiteState.data && this.props.subsiteState.pending) {
    //     this.initViewer(nextProps.subsiteState.data);
    // }
    // check route change : if user clicked on browser navbuttons,
    // current path and current state should not match
    // if (nextProps.location.pathname !== this.props.location.pathname) {
    //     const mediaName = nextProps.location.pathname.split('/')[2];
    //     const mediaIndex = this.mediaCameras.findIndex(item => {
    //         return item.userData.name === mediaName;
    //     });
    //     if (mediaIndex !== this.currentCameraIndex) {
    //         // route does not correspond to current state
    //         // => user clicked browser navigation  buttons
    //         if (mediaIndex < 0) {
    //             this.deselectMediaCamera();
    //         } else {
    //             this.selectMediaCamera(mediaIndex);
    //         }
    //     }
    // }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        // avoid re-rendering on route change
        // => component should only rerender when a change occured in cameras state
        // (this.state.media or this.state.displayMedia)
        // or when a new site is required (this.props.match.params.siteName)
        const didDisplayMediaChange = nextState.displayMedia !== this.state.displayMedia;
        // const didSiteChange = nextProps.match.params.siteName !== this.props.match.params.siteName;
        const didMediaChange =
            (!nextState.media && this.state.media) ||
            (nextState.media && !this.state.media) ||
            (nextState.media && this.state.media && nextState.media.src !== this.state.media.src);
        let didMediaDimensionsChange = false;

        if (nextState.media && this.state.media) {
            didMediaDimensionsChange =
                nextState.media.width !== this.state.media.width ||
                nextState.media.height !== this.state.media.height ||
                nextState.media.left !== this.state.media.left ||
                nextState.media.top !== this.state.media.top;
        }
        // return didDisplayMediaChange || didMediaChange || didMediaDimensionsChange || didSiteChange;
        return didDisplayMediaChange || didMediaChange || didMediaDimensionsChange;
    }

    componentWillUnmount() {
        // this.props.dispatch(resetSubsiteState());
        //remove pointcloud from potree (for now potree is always running event when)
        this.potree.scene.pointclouds = [];
        this.potree.stopRendering();
    }

    initViewer(data) {
        window.viewer = this.potree = new potree.Viewer(this.potreeElement);
        this.potree.setEDLEnabled(false);
        this.potree.setPointSize(3);
        this.potree.setMaterial('RGB');
        this.potree.setFOV(60);
        // this.potree.setPointSizing("Fixed");
        this.potree.setQuality('Squares');
        this.potree.setPointBudget(10 * 1000 * 1000);
        this.potree.startRendering();
        this.potree.scene.scene.add(Camera.mediaPlane);

        /*potree.loadPointCloud(data.pointcloud, data.name, e => {
            this.potreeIsLoading = false;
            this.potree.scene.addPointCloud(e.pointcloud);
            this.potree.fitToScreen();
            this.addCamerasToPotree(data.visus);
        });*/
    }

    filterVisibleCamera(visibleCameras) {
        this.potree.scene.scene.children.map(function(mesh) {
            const isCameraVisible = visibleCameras.some(function(f) {
                // We test if the mesh in scene.children is instance of Camera because we do not want to hide others objects than camera
                return !(mesh instanceof Camera) || f.properties._id === mesh.userData.mediaId;
            });
            if (isCameraVisible) mesh.visible = true;
            else mesh.visible = false;
        });
    }

    addCamerasToPotree(pointCloudMedias) {
        pointCloudMedias.map(media => {
            if (media.camera3d && media.camera3d.filename) {
                const camera = new Camera(media);
                this.potree.scene.scene.add(camera);
            }
        });
        // if (this.initialMediaName) {
        //     // according to route, a media should be selected on init
        //     // (cf componentDidMount)
        //     const initialCameraIndex = this.mediaCameras.findIndex(camera => {
        //         return camera.userData.name === this.initialMediaName;
        //     });
        //     this.selectMediaCamera(initialCameraIndex);
        // }
    }

    selectMediaCamera(newCamera) {
        if (this.currentMediaCamera === null) {
            this.potree.inputHandler.removeInputListener(this.potree.controls);
            this.potree.scene.camera.matrixAutoUpdate = false;
            // this.previous3dPosition = this.potree.scene.view.position.clone();
            // this.previous3dQuaternion = this.potree.scene.camera.getWorldQuaternion();
        }

        // a camera has been clicked : navigate to this camera if
        //  - it is not already selected (cf this.currentMediaCamera)
        //  - the view isnt already navigating to another camera (cf this.navigating)
        if (
            (!this.currentMediaCamera ||
                newCamera.userData.mediaId !== this.currentMediaCamera.userData.mediaId) &&
            !this.navigating
        ) {
            this.navigating = true;
            if (this.currentMediaCamera) {
                // a camera is already selected :
                // - launch fade out transition to make it disappear
                // - set shouldGoToMediaAfterTransition to move to the new camera
                // once the previous one has disappeared
                this.shouldGoToMediaAfterTransition = newCamera;
                this.launchFadeOutTransition();
            } else {
                // no camera is currently selected : move to the new camera immediately
                this.currentMediaCamera = newCamera;
                this.goToMediaCamera();
            }
        }
    }

    deselectMediaCamera() {
        if (!this.navigating) {
            this.navigating = true;
            this.shouldResetMediaAfterTransition = true;
            this.launchFadeOutTransition();
        }
    }

    launchFadeOutTransition() {
        this.setState({
            displayMedia: false
        });
    }

    handleFadeTransitionComplete() {
        if (this.shouldGoToMediaAfterTransition) {
            this.currentMediaCamera = this.shouldGoToMediaAfterTransition;
            this.setState(
                {
                    media: null
                },
                () => {
                    this.goToMediaCamera();
                    this.shouldGoToMediaAfterTransition = null;
                }
            );
        } else if (this.shouldResetMediaAfterTransition) {
            this.shouldResetMediaAfterTransition = false;
            this.resetMedia();
        }
    }

    resetMedia() {
        if (this.state.media !== null) {
            const z_viewer = new THREE.Vector3(
                -this.currentMediaCamera.matrix.elements[8],
                -this.currentMediaCamera.matrix.elements[9],
                -this.currentMediaCamera.matrix.elements[10]
            );
            this.potree.scene.view.direction = z_viewer;

            const mouse = {
                x: this.potree.renderer.domElement.clientWidth / 2,
                y: this.potree.renderer.domElement.clientHeight / 2
            };

            const interserctionMediaCameraPointCloud = this.potree.inputHandler.getMousePointCloudIntersection(
                mouse
            );

            if (interserctionMediaCameraPointCloud) {
                this.potree.scene.view.lookAt(interserctionMediaCameraPointCloud.location);
            } else {
                this.potree.scene.view.lookAt(
                    new THREE.Vector3().addVectors(this.currentMediaCamera.position, z_viewer)
                );
            }

            const tweenPromises = [];

            const mediaTransformations = this.computeMediaCameraTransformations(
                this.currentMediaCamera
            );
            tweenPromises.push(this.tweenQuaternion(mediaTransformations.mediaViewerQuaternion));
            tweenPromises.push(this.tweenFov(60));
            // tweenPromises.push(this.tweenPosition(this.previous3dPosition));
            // tweenPromises.push(this.tweenQuaternion(this.previous3dQuaternion));

            // this.lastSearch = this.props.location.search;
            this.currentMediaCamera = null;
            this.routeToMedia();
            this.setState({
                media: null,
                displayMedia: false
            });

            Promise.all(tweenPromises).then(() => {
                this.navigating = false;
                this.potree.inputHandler.addInputListener(this.potree.controls);
                this.potree.scene.camera.matrixAutoUpdate = !this.navigating;
            });
        }
    }

    routeToMedia(camera) {
        // const siteUrl = '/' + this.props.match.params.siteName;
        // let mediaUrl = siteUrl;
        // const search = this.lastSearch || '?full=false&infos=false';
        // if (camera && camera.userData && camera.userData.name) {
        //     mediaUrl += `/${camera.userData.name}${search}`;
        // }
        // if (mediaUrl !== this.props.location.pathname + this.props.location.search) {
        //     this.props.history.push(mediaUrl);
        // }
    }

    // navigate to a media camera
    // once navigation animation is finished, calls renderMediaPreviewer
    goToMediaCamera() {
        const tweenPromises = [];

        // Move to mediaCamera position
        tweenPromises.push(this.tweenPosition(this.currentMediaCamera.position));

        //Set camera roll according to the selected media
        // Roll is still missing, rotation around camera view axis to correctly have all info
        // potree reinitializes camera position in its render or animate loop probably
        // Useful issue from bugdanov, working on doxel viewer: https://github.com/potree/potree/issues/300
        // Set camera rotation the same as mediaCamera, disabling potree controls. Controls are set back in resetMedia method
        const mediaCameraTransormations = this.computeMediaCameraTransformations(
            this.currentMediaCamera
        );
        tweenPromises.push(this.tweenQuaternion(mediaCameraTransormations.mediaQuaternion));

        //Set fov so that
        tweenPromises.push(this.tweenFov(mediaCameraTransormations.mediaFov));

        // Set camera fov equal to the mediaCamera fov (+ margin, see computeMediaCameraTransformations)
        Promise.all(tweenPromises).then(() => {
            requestAnimationFrame(() => {
                this.renderMediaPreviewer(this.currentMediaCamera);
            });
        });
    }

    computeMediaCameraTransformations(mediaCamera) {
        const z_world = this.potree.scene.camera.up;
        const x_media = new THREE.Vector3(
            -mediaCamera.matrix.elements[0],
            -mediaCamera.matrix.elements[1],
            -mediaCamera.matrix.elements[2]
        );
        x_media.normalize();
        const y_media = new THREE.Vector3(
            -mediaCamera.matrix.elements[4],
            -mediaCamera.matrix.elements[5],
            -mediaCamera.matrix.elements[6]
        );
        y_media.normalize();
        const z_viewer = new THREE.Vector3(
            -mediaCamera.matrix.elements[8],
            -mediaCamera.matrix.elements[9],
            -mediaCamera.matrix.elements[10]
        );
        const alpha = -(Math.acos(z_viewer.dot(z_world)) - Math.PI / 2);
        const x_world = new THREE.Vector3();
        const y_world = new THREE.Vector3();
        x_world.crossVectors(z_viewer, z_world);
        x_world.normalize();
        y_world.crossVectors(z_world, x_world);
        const x_viewer = new THREE.Vector3();
        const y_viewer = new THREE.Vector3();
        y_viewer
            .addScaledVector(y_world, -Math.sin(alpha))
            .addScaledVector(z_world, Math.cos(alpha));
        x_viewer.crossVectors(y_viewer, z_viewer);

        ////////////////////////////////////////////////////////////////////////
        // Compute mediaMatrice, mediaQuaternion
        x_media.multiplyScalar(-1);
        y_media.multiplyScalar(-1);
        z_viewer.multiplyScalar(-1);
        const x_media_z = x_media.dot(z_world);
        const y_media_z = y_media.dot(z_world);
        let v = new THREE.Vector3();
        if (Math.abs(x_media_z) > Math.abs(y_media_z)) {
            v = x_media.clone();
            if (x_media_z < 0) {
                v.multiplyScalar(-1);
            }
        } else {
            v = y_media.clone();
            if (y_media_z < 0) {
                v.multiplyScalar(-1);
            }
        }
        const u = new THREE.Vector3();
        u.crossVectors(v, z_viewer);
        const mMedia = new THREE.Matrix4();
        mMedia.makeBasis(u, v, z_viewer);
        const mMediaQuaternion = new THREE.Quaternion().setFromRotationMatrix(mMedia);
        const roll = Math.acos(y_viewer.dot(y_media));

        ////////////////////////////////////////////////////////////////////////
        // Compute mediaViewerMatrice, mediaViewerQuaternion, it may be done same way as
        //mediaMatrice, mediaQuaternion (using u, v, see above) in order to handle best rotation possible
        x_viewer.multiplyScalar(-1);
        const mViewer = new THREE.Matrix4();
        mViewer.makeBasis(x_viewer, y_viewer, z_viewer);
        const mViewerQuaternion = new THREE.Quaternion().setFromRotationMatrix(mViewer);

        ////////////////////////////////////////////////////////////////////////
        //Compute media fov
        const localToViewer = new THREE.Matrix4();
        // Get transformation matrix from local camera coordinates to viewer coordinates - by passing by world coordinates using
        // localToViewer = viewerMatrixT * obj_cam.matrix = localToWorld * worldToViewer
        const viewerMatrixT = mMedia.clone();
        viewerMatrixT.transpose();
        // localToViewer = viewerMatrixT * obj.matrix = localToWorld * worldToViewer

        localToViewer.multiplyMatrices(viewerMatrixT, mediaCamera.matrix);
        // Set viewer dimensions arbitrarily using aspect ratio, and compute a scale factor to fit bounding box of dimensions mediaWidth, boxHeight
        const viewerHeight = 1,
            viewerWidth = this.potree.scene.camera.aspect;
        const mediaWidth =
                Math.abs(localToViewer.elements[0]) + Math.abs(localToViewer.elements[4]),
            boxHeight = Math.abs(localToViewer.elements[1]) + Math.abs(localToViewer.elements[5]);
        // Compute scale factor, deduce, real viewer height that adapt to fit bounding box of camera + a 10% margin, and compute vertical fov from it
        const scaleFactor = Math.max(mediaWidth / viewerWidth, boxHeight / viewerHeight),
            newHeight = viewerHeight * scaleFactor,
            viewerMargin = 1.2;
        let mediaFov = 2 * Math.atan(newHeight * viewerMargin / 2 * mediaCamera.cam_scale.z);
        mediaFov = mediaFov * 180 / Math.PI;

        return {
            mediaMatrice: mMedia,
            mediaQuaternion: mMediaQuaternion,
            mediaViewerMatrice: mViewer,
            mediaViewerQuaternion: mViewerQuaternion,
            mediaFov: mediaFov,
            mediaRoll: roll
        };
    }

    // tweenLookAt(toLookAt, options = { duration: 1000 }) {

    //     const fromLookAt = this.potree.scene.view.position.clone();
    //     const dir = this.potree.scene.view.direction.clone();

    //     return new Promise(resolve => {
    //         new TWEEN.Tween(fromLookAt)
    //             .to({ x: toLookAt.x, y: toLookAt.y, z: toLookAt.z }, options.duration)
    //             .onUpdate(obj => {
    //                 this.potree.scene.view.lookAt(obj);
    //                 this.potree.scene.camera.lookAt(obj);
    //                 this.potree.scene.camera.updateMatrix();
    //             })
    //             .start()
    //             .onComplete(() => {

    //                 resolve();
    //             });
    //     });
    // }

    tweenPosition(toPosition, options = { duration: 1000 }) {
        return new Promise(resolve => {
            new TWEEN.Tween(this.potree.scene.view.position.clone())
                .to(
                    {
                        x: toPosition.x,
                        y: toPosition.y,
                        z: toPosition.z
                    },
                    options.duration
                )
                .onUpdate(val => {
                    this.potree.scene.view.position.x = this.potree.scene.camera.position.x = val.x;
                    this.potree.scene.view.position.y = this.potree.scene.camera.position.y = val.y;
                    this.potree.scene.view.position.z = this.potree.scene.camera.position.z = val.z;
                    this.potree.scene.camera.updateMatrix();
                })
                .onComplete(() => {
                    resolve();
                })
                .start();
        });
    }

    tweenQuaternion(toQuaternion, options = { duration: 1000 }) {
        const qm = new THREE.Quaternion();
        const o = { t: 0 };

        const currentQuaternion = this.potree.scene.camera.getWorldQuaternion();

        return new Promise(resolve => {
            new TWEEN.Tween(o)
                .to({ t: 1 }, options.duration)
                .onUpdate(() => {
                    THREE.Quaternion.slerp(currentQuaternion, toQuaternion, qm, o.t);
                    this.potree.scene.camera.quaternion.set(qm.x, qm.y, qm.z, qm.w);
                    this.potree.scene.camera.updateMatrix();
                })
                .onComplete(() => {
                    resolve();
                })
                .start();
        });
    }

    // tweenRoll(alpha, reversed = false, timing = 1000) {
    //     let tmpAlreadyRolled = 0;
    //     return new Promise(resolve => {
    //         new TWEEN.Tween({ roll: 0 })
    //             // .delay(1000)
    //             .to({ roll: alpha }, timing)
    //             .onStart(() => {})
    //             .onUpdate(val => {
    //                 const m = new THREE.Matrix4();
    //                 if (!reversed) m.makeRotationZ(-val.roll);
    //                 else {
    //                     val.roll = -val.roll;
    //                     m.makeRotationZ(-(val.roll - tmpAlreadyRolled));
    //                 }
    //                 tmpAlreadyRolled = val.roll;
    //                 this.potree.scene.camera.matrix.multiply(m);
    //             })
    //             .onComplete(() => {
    //                 resolve();
    //             })
    //             .start();
    //     });
    // }

    tweenFov(toFovDeg, options = { duration: 1000 }) {
        return new Promise(resolve => {
            new TWEEN.Tween({ fov: this.potree.getFOV() })
                .to({ fov: toFovDeg }, options.duration)
                .onUpdate(el => {
                    this.potree.setFOV(el.fov);
                })
                .start()
                .onComplete(() => {
                    resolve();
                });
        });
    }

    // render media previewer : computes image dimensions and rotation
    // (projected in window's space) and dispatches these data to the store
    renderMediaPreviewer(mediaCamera) {
        // compute the 2D coordinates of the image's corners
        //
        // -------------------------------------> x-axis
        // |  [2] ------------ [3]
        // |     |            |
        // |     |            |
        // |     |            |
        // |     |            |
        // |  [1] ------------ [4]
        // |
        // \/ y-axis
        //
        const rect = this.potree.renderer.domElement.getBoundingClientRect();
        mediaCamera.updateMatrixWorld();
        const vertices2D = mediaCamera.geometry.vertices.map(vertice => {
            const vector = vertice.clone();
            vector.applyMatrix4(mediaCamera.matrixWorld);
            vector.project(this.potree.scene.camera);
            return new THREE.Vector2(
                (vector.x + 1) / 2 * (rect.right - rect.left) + rect.left,
                (1 - vector.y) / 2 * (rect.bottom - rect.top) + rect.top
            );
        });
        // alpha : angle between x-axis and segment [4]-[1]
        const alphaRad = Math.atan2(
            -(vertices2D[4].y - vertices2D[1].y), // y-axis is oriented towards bottom => (-)
            vertices2D[4].x - vertices2D[1].x
        );
        const alphaDeg = alphaRad * 180 / Math.PI;

        const imgWidth = vertices2D[4]
            .clone()
            .sub(vertices2D[1])
            .length();
        const imgHeight = vertices2D[2]
            .clone()
            .sub(vertices2D[1])
            .length();

        // The following defines the quarter of the trigonometric circle where alpha belongs.
        // This is to ensure the Slider component is correctly positioned and oriented
        // (ie on the left of the window).
        // quarters :
        //
        // 135°   (1)  45°
        //      \    /
        //       \  /
        //  (2)   \/    (0)
        //        /\
        //       /  \
        //      /    \
        // -135°  (3)  -45°
        //
        let quarter;
        if (-45 <= alphaDeg && alphaDeg < 45) {
            quarter = 0;
        }
        if (45 <= alphaDeg && alphaDeg < 135) {
            quarter = 1;
        }
        if ((135 <= alphaDeg && alphaDeg <= 180) || (-180 <= alphaDeg && alphaDeg < -135)) {
            quarter = 2;
        }
        if (-135 <= alphaDeg && alphaDeg < -45) {
            quarter = 3;
        }

        const imgCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const imgLeft = imgCenter.x - imgWidth / 2;
        const imgTop = imgCenter.y - imgHeight / 2;
        this.routeToMedia(mediaCamera);
        this.navigating = false;
        this.setState({
            displayMedia: true,
            media: {
                src: mediaCamera.userData.url,
                top: imgTop,
                left: imgLeft,
                width: imgWidth,
                height: imgHeight,
                alpha: alphaDeg,
                quarter: quarter
            }
        });
    }

    onResizeWindow() {
        if (this.currentMediaCamera) {
            // if a media is selected, recompute its position and rotation on windows resize
            requestAnimationFrame(() => {
                this.renderMediaPreviewer(this.currentMediaCamera);
            });
        }
    }

    handleMouseMove(event) {
        if (this.isDragging && this.state.media !== null && !this.navigating) {
            this.deselectMediaCamera();
        }
        // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
        const rect = this.potree.renderer.domElement.getBoundingClientRect();
        this.mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

        // Pick camera
        // Raycaster for picking selected camera mesh, see github source
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.potree.scene.camera);

        // find objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.potree.scene.scene.children);

        if (intersects.length > 0 && intersects[0].object.userData.mediaId) {
            if (
                !this.mediaCamera_intersected ||
                this.mediaCamera_intersected.uuid !== intersects[0].object.uuid
            ) {
                if (this.mediaCamera_intersected) this.mediaCamera_intersected.toggleSelection();
                this.mediaCamera_intersected = intersects[0].object;
                this.mediaCamera_intersected.toggleSelection();
                // this.mediaCamera_intersected.loadMedia();
            }
        } else if (this.mediaCamera_intersected) {
            this.mediaCamera_intersected.toggleSelection();
            this.mediaCamera_intersected = null;
        }

        // mousemove with middle click
        // if (event.buttons === 4) {
        //     // Set pitch yaw using middle button
        //     if (this.mediaCamera_intersected) {
        //         // this.potree.setFOV(this.mediaCamera_intersected.viewerFOV / 2);

        //         // Compute pitch and yaw from mouse position on screen
        //         const yaw = 0.25 * this.mouse.x * Math.PI,
        //             pitch = -0.5 * this.mouse.y * Math.PI / 2;
        //         // roll = 0;
        //         // Define rotation matrix from euler angles to apply to view direction
        //         const rotLookAt = new THREE.Matrix4(),
        //             rotPitchX = new THREE.Matrix4(), // rotate around local X, to get lookAt in Y direction of camera
        //             rotYawY = new THREE.Matrix4(), // rotate around local Y, to get lookAt in X direction of camera
        //             camToWorld = new THREE.Matrix4();
        //         // yaw (Y) first, pitch (X) second // rotation.order = "YXZ"; // three.js r.65
        //         rotPitchX.makeRotationX(pitch);
        //         rotYawY.makeRotationY(yaw);
        //         rotLookAt.multiplyMatrices(rotPitchX, rotYawY);
        //         this.hovered_cam_matrix = this.mediaCamera_intersected.matrix.clone();
        //         camToWorld.copy(this.viewer_cam_matrix);
        //         rotLookAt.multiplyMatrices(camToWorld, rotLookAt);

        //         // Compute rotated view direction
        //         const rotatedViewDir = new THREE.Vector3(
        //             rotLookAt.elements[8],
        //             rotLookAt.elements[9],
        //             rotLookAt.elements[10]
        //         );
        //         const rotatedCamLookat = new THREE.Vector3(
        //             this.hovered_cam_matrix.elements[12],
        //             this.hovered_cam_matrix.elements[13],
        //             this.hovered_cam_matrix.elements[14]
        //         );
        //         rotatedCamLookat.sub(rotatedViewDir);
        //         this.potree.scene.view.lookAt(rotatedCamLookat);

        //         // Hint using transformDirection
        //         // rotLookAt.makeRotationFromEuler(new THREE.Euler( pitch, yaw, roll, 'YXZ' )); // or try pitch, roll, yaw, 'ZXY' // ZYX
        //         //let rayOrigin = new THREE.Vector3(),
        //         //  rayDirection = new THREE.Vector3();
        //         //rayOrigin.setFromMatrixPosition( camera.matrixWorld );
        //         //rayDirection.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();
        //     }
        // }
    }

    handleMouseDown() {
        this.isDragging = true;
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleClick() {
        if (this.mediaCamera_intersected) {
            this.selectMediaCamera(this.mediaCamera_intersected);
        }
    }

    handleMouseWheel(e) {
        if (this.state.displayMedia && !this.navigating) {
            e.preventDefault();
            e.stopPropagation();
            this.deselectMediaCamera();
        }
    }

    render() {
        const fadeTransitionDuration = {
            enter: 400,
            exit: 400
        };

        return (
            <div className={styles.potreeContainer}>
                <div
                    id="potree"
                    className={styles.potree}
                    onClick={this.handleClick}
                    onMouseMove={this.handleMouseMove}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onWheel={this.handleMouseWheel}
                    ref={el => (this.potreeElement = el)}
                >
                    <FadeInComponent
                        display={this.state.displayMedia}
                        className={styles.mediaViewerContainer}
                        transitionDuration={fadeTransitionDuration}
                        onTransitionComplete={this.handleFadeTransitionComplete}
                    >
                        <MediaViewer media={this.state.media} exit={this.deselectMediaCamera} />
                    </FadeInComponent>
                </div>
            </div>
        );
    }
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
// * pointCloud : currently selected pointcloud (if any), provided by connect
// * selectedMedias: currently selected medias, provided by connect
// * visibleMedias: currently visible medias, provided by connect
PotreeViewer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    pointCloud: PropTypes.object,
    selectedMedias: PropTypes.arrayOf(PropTypes.object),
    visibleMedias: PropTypes.arrayOf(PropTypes.object)
};

const ConnectedPotreeViewer = connect(store => {
    return {
        pointCloud: getSelectedPointCloud(store),
        selectedMedias: getSelectedMedias(store),
        visibleMedias: getVisibleMedias(store),
        selectFilterPending: getSelectFilterPending(store)
    };
})(PotreeViewer);

export default ConnectedPotreeViewer;

// PotreeViewer.propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     history: PropTypes.object.isRequired,
//     location: PropTypes.object.isRequired,
//     match: PropTypes.object.isRequired,
//     subsiteState: PropTypes.shape({
//         display: PropTypes.bool,
//         pending: PropTypes.bool,
//         data: PropTypes.object,
//         error: PropTypes.string,
//         mediaIndex: PropTypes.number
//     })
// };

// const ConnectedPotreeViewer = connect(store => {
//     return {
//         subsiteState: store.subsite
//     };
// })(PotreeViewer);

// export default withRouter(ConnectedPotreeViewer);
