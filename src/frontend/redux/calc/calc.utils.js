import * as THREE from 'three';
import * as numeric from 'numeric';
import quartic from 'quartic';

//utils points 2D-3D
const point3D_to_photo = (point, camera) => {
    let P = new THREE.Vector3().copy(point);
    //point dans les coordonnées de la caméra
    P = P.applyMatrix4(camera.matrixWorldInverse);
    //point sur la photo
    P = new THREE.Vector3(-P.x / P.z, -P.y / P.z, -1);
    return P;
};

const point3D_to_photo_update = (point, camera) => {
    const P = new THREE.Vector3().copy(point);
    //point dans les coordonnées de la caméra
    P = P.applyMatrix4(new THREE.Matrix4().getInverse(camera.matrixWorld));
    //Point sur la photo
    P = new THREE.Vector3(-P.x / P.z, -P.y / P.z, -1);
    return P;
};

// //utils
const rot_matrix_to_euler = R => {
    const x_rot = Math.atan2(R[5], R[8]);
    const y_rot = Math.atan2(-R[2], Math.sqrt(R[5] * R[5] + R[8] * R[8]));
    const z_rot = Math.atan2(R[1], R[0]);
    return [x_rot, y_rot, z_rot];
};

//calcul de la caméra 1...n points
export const fixFirst = (binding, cameraParams) => {
    //copy camera params into tool camera
    const loader = new THREE.ObjectLoader();
    const camera = loader.parse(cameraParams);

    /*
    * -Calcul du vecteur entre le point de la photo et le projeté du point 3D correspondant
    * -Translation de la caméra proportionnellement à ce vecteur et à la profondeur du point 3D
    */
    const point2D = binding.point2D;
    const point3D = binding.point3D;
    const fx = camera.projectionMatrix.elements[0];
    const fy = camera.projectionMatrix.elements[5];
    //pixel dans les coordonnées de la caméra
    const p = new THREE.Vector3(1 / fx * point2D.x, 1 / fy * point2D.y, -1);
    //projection du point 3D sur l'écran de la caméra
    const P = point3D_to_photo(point3D, camera);
    //point 3D dans les coordonnées de la caméra
    let Q = new THREE.Vector3().copy(point3D);
    Q = Q.applyMatrix4(camera.matrixWorldInverse);
    const q = -Q.z;

    return {
        nbFixed: 1,
        solution: {
            translateX: q * (P.x - p.x) / 2,
            translateY: q * (P.y - p.y) / 2
        }
    };
};

const rotateToSecond = (binding1, binding2, camera) => {
    const pixel1 = binding1.point2D;
    const pixel2 = binding2.point2D;

    const point3D_1 = binding1.point3D;
    const point3D_2 = binding2.point3D;

    const voxel1 = new THREE.Vector3(point3D_1.x, point3D_1.y, point3D_1.z);
    const voxel2 = new THREE.Vector3(point3D_2.x, point3D_2.y, point3D_2.z);

    // Rotation autour de (CP1) pour aligner (P1P2) sur l'écran de la caméra
    const fx = camera.projectionMatrix.elements[0];
    const fy = camera.projectionMatrix.elements[5];

    const p = point3D_to_photo(voxel1, camera);
    const q = point3D_to_photo(voxel2, camera);
    const q1 = new THREE.Vector3(1 / fx * pixel2.x, 1 / fy * pixel2.y, -1);
    const pq = new THREE.Vector2(q.x - p.x, q.y - p.y);
    const pq1 = new THREE.Vector2(q1.x - p.x, q1.y - p.y);
    const costh = pq.dot(pq1) / Math.sqrt(pq.dot(pq) * pq1.dot(pq1));
    let th = 0;
    if (costh < 1 && costh > -1) {
        th = Math.acos(costh);
    }
    if (pq.y * pq1.x - pq.x * pq1.y < 0) {
        th *= -1;
    }
    let CPaxis = new THREE.Vector3().copy(p);
    CPaxis = CPaxis.multiplyScalar(1 / CPaxis.length());
    return { axis: CPaxis, rotation: -th / 2 };
};

const translateToSecond = (binding1, binding2, camera) => {
    // Translation sur CP1 jusqu'à ce que P2 coincinde avec son image
    const pixel1 = binding1.point2D;
    const pixel2 = binding2.point2D;

    const point3D_1 = binding1.point3D;
    const point3D_2 = binding2.point3D;

    const voxel1 = new THREE.Vector3(point3D_1.x, point3D_1.y, point3D_1.z);
    const voxel2 = new THREE.Vector3(point3D_2.x, point3D_2.y, point3D_2.z);

    const fx = camera.projectionMatrix.elements[0];
    const fy = camera.projectionMatrix.elements[5];

    let CPaxis_w = new THREE.Vector3().subVectors(voxel1, camera.position);
    let CPaxis = new THREE.Vector3().copy(voxel1).applyMatrix4(camera.matrixWorldInverse);
    const D = CPaxis.length();
    CPaxis = CPaxis.multiplyScalar(1 / D);
    CPaxis_w = CPaxis_w.multiplyScalar(1 / CPaxis_w.length());

    const p = point3D_to_photo(voxel1, camera);
    const q = point3D_to_photo(voxel2, camera);
    const q1 = new THREE.Vector3(1 / fx * pixel2.x, 1 / fy * pixel2.y, -1);
    const pq = new THREE.Vector2(q.x - p.x, q.y - p.y);
    const pq1 = new THREE.Vector2(q1.x - p.x, q1.y - p.y);
    const costh = pq.dot(pq1) / Math.sqrt(pq.dot(pq) * pq1.dot(pq1));
    let th = 0;
    if (costh < 1 && costh > -1) {
        th = Math.acos(costh);
    }
    if (pq.y * pq1.x - pq.x * pq1.y < 0) {
        th *= -1;
    }
    const P1P2 = new THREE.Vector3().subVectors(voxel2, voxel1);
    //alpha=angle p-C-q1
    const cosalpha = p.dot(q1) / p.length() / q1.length();
    //beta=angle C-P1-P2
    const cosbeta = -P1P2.dot(CPaxis_w) / P1P2.length();
    const alpha = Math.acos(cosalpha);
    const beta = Math.acos(cosbeta);
    //d=P1Q, avec Q le projeté de q1 sur (P1P2)
    const d = D * Math.sin(alpha) / Math.cos(beta + alpha - Math.PI / 2);

    if (Math.abs(P1P2.length() - d) < 0.01 && Math.abs(th) < 0.01) {
        return { translation: -D * (P1P2.length() / d - 1) / 2, error: null };
    } else {
        return { translation: null, error: 'Could not fix second point' };
    }
};

export const fixSecond = (binding1, binding2, cameraParams) => {
    // fix first point params
    const step1 = fixFirst(binding1, cameraParams);

    //copy camera params into tool camera
    const loader = new THREE.ObjectLoader();
    const camera = loader.parse(cameraParams);

    //fix first point on tool camera
    camera.translateX(step1.solution.translateX);
    camera.translateY(step1.solution.translateY);
    camera.updateProjectionMatrix();

    //rotate camera around correct axis
    const { axis, rotation } = rotateToSecond(binding1, binding2, camera);
    camera.rotateOnAxis(axis, rotation);

    //compute translation along axis
    const { translation, error } = translateToSecond(binding1, binding2, camera);

    return {
        nbFixed: 2,
        solution: {
            translateX: step1.solution.translateX,
            translateY: step1.solution.translateY,
            axis: axis,
            rotateOnAxis: rotation,
            translateOnAxis: translation
        },
        error: error
    };
};

const fix3DTo3D = (P, Q) => {
    //Calcul de la matrice R et t permettant de transformer P en Q:
    //article : http://nghiaho.com/?page_id=671
    if (P.length !== Q.length) return;
    //centroides
    const centroid1 = new THREE.Vector3();
    const centroid2 = new THREE.Vector3();
    for (let i = 0; i < P.length; i++) {
        centroid1.add(P[i]);
        centroid2.add(Q[i]);
    }
    centroid1.multiplyScalar(1.0 / P.length);
    centroid2.multiplyScalar(1.0 / P.length);
    //covariance
    let h11 = 0;
    let h12 = 0;
    let h13 = 0;
    let h21 = 0;
    let h22 = 0;
    let h23 = 0;
    let h31 = 0;
    let h32 = 0;
    let h33 = 0;
    for (let i = 0; i < P.length; i++) {
        P[i] = new THREE.Vector3().subVectors(P[i], centroid1);
        Q[i] = new THREE.Vector3().subVectors(Q[i], centroid2);
    }
    for (let i = 0; i < P.length; i++) {
        h11 += P[i].x * Q[i].x;
        h12 += P[i].x * Q[i].y;
        h13 += P[i].x * Q[i].z;
        h21 += P[i].y * Q[i].x;
        h22 += P[i].y * Q[i].y;
        h23 += P[i].y * Q[i].z;
        h31 += P[i].z * Q[i].x;
        h32 += P[i].z * Q[i].y;
        h33 += P[i].z * Q[i].z;
    }
    const H = [[h11, h12, h13], [h21, h22, h23], [h31, h32, h33]];
    const SVD = numeric.svd(H);
    const U = new THREE.Matrix3().set(
        SVD.U[0][0],
        SVD.U[0][1],
        SVD.U[0][2],
        SVD.U[1][0],
        SVD.U[1][1],
        SVD.U[1][2],
        SVD.U[2][0],
        SVD.U[2][1],
        SVD.U[2][2]
    );
    let Vt = new THREE.Matrix3().set(
        SVD.V[0][0],
        SVD.V[1][0],
        SVD.V[2][0],
        SVD.V[0][1],
        SVD.V[1][1],
        SVD.V[2][1],
        SVD.V[0][2],
        SVD.V[1][2],
        SVD.V[2][2]
    );
    //R = V*U.T avec H = U*S*V.T
    // const R = new THREE.Matrix3().fromArray(U.applyToVector3Array(Vt.toArray())).transpose();
    let R = U.clone()
        .multiply(Vt)
        .transpose();

    //determinant > 0
    if (R.determinant() < 0) {
        Vt = new THREE.Matrix3().set(
            Vt.elements[0],
            Vt.elements[3],
            Vt.elements[6],
            Vt.elements[1],
            Vt.elements[4],
            Vt.elements[7],
            -Vt.elements[2],
            -Vt.elements[5],
            -Vt.elements[8]
        );
        // R = new THREE.Matrix3().fromArray(U.applyToVector3Array(Vt.toArray())).transpose();
        R = U.clone()
            .multiply(Vt)
            .transpose();
    }
    //angles d'euler
    const Rt = new THREE.Matrix3().copy(R).transpose();
    const e = rot_matrix_to_euler(Rt.elements);
    //translation
    const t = new THREE.Vector3().addVectors(
        centroid1,
        new THREE.Vector3()
            .copy(centroid2)
            .multiplyScalar(-1)
            .applyMatrix3(Rt)
    );
    return { position: t, rotation: new THREE.Euler(e[0], e[1], e[2], 'ZYX') };
};

export const fixThird = (binding1, binding2, binding3, cameraParams) => {
    //copy camera params into tool camera
    const loader = new THREE.ObjectLoader();
    const camera = loader.parse(cameraParams);

    /*
    * Résolution de P3P
    * artcile : http://iplimage.com/blog/p3p-perspective-point-overview/
    */
    const fx = camera.projectionMatrix.elements[0];
    const fy = camera.projectionMatrix.elements[5];

    //3 points dans les coordonnées globales
    const pixel1 = binding1.point2D;
    const pixel2 = binding2.point2D;
    const pixel3 = binding3.point2D;

    const point3D_1 = binding1.point3D;
    const point3D_2 = binding2.point3D;
    const point3D_3 = binding3.point3D;

    const A = new THREE.Vector3(point3D_1.x, point3D_1.y, point3D_1.z);
    const B = new THREE.Vector3(point3D_2.x, point3D_2.y, point3D_2.z);
    const C = new THREE.Vector3(point3D_3.x, point3D_3.y, point3D_3.z);

    //3 vecteurs normalisés dans les coordonnées de la caméra
    let u_ = new THREE.Vector3(1 / fx * pixel1.x, 1 / fy * pixel1.y, -1);
    let v_ = new THREE.Vector3(1 / fx * pixel2.x, 1 / fy * pixel2.y, -1);
    let w_ = new THREE.Vector3(1 / fx * pixel3.x, 1 / fy * pixel3.y, -1);
    u_ = u_.multiplyScalar(1 / u_.length());
    v_ = v_.multiplyScalar(1 / v_.length());
    w_ = w_.multiplyScalar(1 / w_.length());
    //angles entre ces 3 vecteurs
    const cosalpha = v_.dot(w_);
    const cosbeta = u_.dot(w_);
    const cosgamma = u_.dot(v_);
    //précalcul des coefficients de l'equation
    const p = 2 * cosalpha;
    const q = 2 * cosbeta;
    const r = 2 * cosgamma;
    const VecAB = new THREE.Vector3().subVectors(B, A);
    const VecAC = new THREE.Vector3().subVectors(C, A);
    const VecBC = new THREE.Vector3().subVectors(C, B);
    const AB = VecAB.length();
    const AC = VecAC.length();
    const BC = VecBC.length();
    const a = BC * BC / (AB * AB);
    const b = AC * AC / (AB * AB);
    const a2 = a * a;
    const b2 = b * b;
    const p2 = p * p;
    const q2 = q * q;
    const r2 = r * r;
    const pr = p * r;
    const ab = a * b;
    const pqr = q * pr;
    const a_2 = 2 * a;
    const a_4 = 4 * a;
    const r3 = r2 * r;
    const pr2 = p * r2;
    const r3q = r3 * q;
    //coefficients de c4*x⁴+...+c0=0
    const c0 = 1 + 2 * (b - a - ab) + b2 - b * p2 + a2;
    const c1 = pr * (ab - b2 + b) + q * ((p2 - 2) * b + 2 * (ab - a2) + a_4 - 2);
    const c2 =
        q2 + b2 * (r2 + p2 - 2) - b * (p2 + pqr) - ab * (r2 + pqr) + (a2 - a_2) * (2 + q2) + 2;
    const c3 = q * (-2 * (ab + a2 + 1 - b) + r2 * ab + a_4) + pr * (b - b2 + ab);
    const c4 = -2 * b + b2 + a2 + 1 + ab * (2 - r2) - a_2;
    const coefficients = [c4, c3, c2, c1, c0];
    //racines du polynome
    const roots = quartic(coefficients);
    //tableau des solutions correspondante
    const rotations = [];
    const positions = [];
    //analyse des solutions reelles
    for (let i = 0; i < roots.length; i++) {
        const x = roots[i].re;
        if (x <= 0 || roots[i].im !== 0) continue;
        //equation b0*y-b1 = 0
        const x2 = x * x;
        const b0 =
            b *
            ((p * p - p * q * r + r * r) * a + (p * p - r * r) * b - p * p + p * q * r - r * r) *
            ((p * p - p * q * r + r * r) * a + (p * p - r * r) * b - p * p + p * q * r - r * r);
        const b1 =
            ((1 - a - b) * x2 + (q * a - q) * x + 1 - a + b) *
            ((r3 * (a2 + ab * (2 - r2) - a_2 + b2 - 2 * b + 1) * x +
                (r3q * (2 * (b - a2) + a_4 + ab * (r2 - 2) - 2) +
                    pr2 * (1 + a2 + 2 * (ab - a - b) + r2 * (b - b2) + b2))) *
                x2 +
                (r3 * (q2 * (1 - 2 * a + a2) + r2 * (b2 - ab) - a_4 + 2 * (a2 - b2) + 2) +
                    r * p2 * (b2 + 2 * (ab - b - a) + 1 + a2) +
                    pr2 * q * (a_4 + 2 * (b - ab - a2) - 2 - r2 * b)) *
                    x +
                2 * r3q * (a_2 - b - a2 + ab - 1) +
                pr2 * (q2 - a_4 + 2 * (a2 - b2) + r2 * b + q2 * (a2 - a_2) + 2) +
                p2 * (p * (2 * (ab - a - b) + a2 + b2 + 1) + 2 * q * r * (b + a_2 - a2 - ab - 1)));
        //solutions correspondant à une distance > 0 ?
        if (b1 < 0) continue;
        const y = b1 / b0;
        if (y < 0) continue;
        const k = x * x + y * y - x * y * r;
        if (k < 0) continue;
        //calcul des distances camera-points
        const PC = AB / Math.sqrt(k);
        const PB = y * PC;
        const PA = x * PC;
        //A,B,C dans les coordonnées caméra
        const A2 = new THREE.Vector3().add(u_).multiplyScalar(PA);
        const B2 = new THREE.Vector3().add(v_).multiplyScalar(PB);
        const C2 = new THREE.Vector3().add(w_).multiplyScalar(PC);
        const matTransform = fix3DTo3D([A, B, C], [A2, B2, C2]);
        const t = matTransform.position;
        const rot = matTransform.rotation;
        if (t.x === t.x && t.y === t.y && t.z === t.z) {
            positions.push(t);
            rotations.push(
                new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromEuler(rot), 'XYZ')
            );
        }
    }
    return { positions: positions, rotations: rotations };
};

// export const fixfourth = (binding1, binding2, binding3, binding4, camera) => {
//     let prevdf1 = 0;
//     let prevdf2 = 0; //distances focales obtenues aux deux précédantes itérations (4points)
//     /*
//     * Placement de la caméra en fonction des 3 premiers points
//     * Sélection de la solution la meilleure par rapport au 4eme point
//     * Ajustement de la distance focale suivant l'erreur du 4ème point
//     * Si l'erreur augmente, ajustement de la distance focale dans l'autre sens
//     */
//     const fx = camera.projectionMatrix.elements[0];
//     const fy = camera.projectionMatrix.elements[5];

//     const pixel4 = binding4.point2D;
//     const point3D_4 = binding4.point3D;
//     const voxel4 = new THREE.Vector3(point3D_4.x, point3D_4.y, point3D_4.z);

//     //sols:positions et rotations posible pour P1,P2,P3
//     const sols = fixThird(binding1, binding2, binding3);
//     const min = Math.SQRT2 * fx;
//     const i_min = 0;
//     const q_min = new THREE.Vector3();
//     const u_ = new THREE.Vector3(1 / fx * pixel4.x, 1 / fy * pixel4.y, -1);
//     if (sols.positions.length < 1) {
//         // converge[3] = true;
//         console.log('pas de solution');
//         return;
//     }
//     //selection du meilleur point de vue sur vox[k]
//     for (let i_ = 0; i_ < sols.positions.length; ++i_) {
//         camera.position.set(sols.positions[i_].x, sols.positions[i_].y, sols.positions[i_].z);
//         camera.rotation.set(
//             sols.rotations[i_].x,
//             sols.rotations[i_].y,
//             sols.rotations[i_].z,
//             sols.rotations[i_].order
//         );
//         camera.updateMatrix();
//         camera.updateMatrixWorld();
//         const q = point3D_to_photo_update(voxel4);
//         const d = new THREE.Vector3().subVectors(q, u_).length();
//         if (d < min) {
//             i_min = i_;
//             q_min.copy(q);
//             min = d;
//             if (d < 0.0075) {
//                 // converge[3] = true;
//                 return;
//             }
//         }
//     }
//     camera.position.set(sols.positions[i_min].x, sols.positions[i_min].y, sols.positions[i_min].z);
//     camera.rotation.set(
//         sols.rotations[i_min].x,
//         sols.rotations[i_min].y,
//         sols.rotations[i_min].z,
//         sols.rotations[i_min].order
//     );
//     //distance tp4-centre optique
//     const duO = u_.length();
//     //distance q-centre optique
//     const dqO = q_min.length();
//     //ajuster la distance focale : proportionnellement à l'erreur
//     const cP4Axis = new THREE.Vector3().copy(voxel4).applyMatrix4(camera.matrixWorldInverse);
//     const cP4 = cP4Axis.length();
//     //var maxdf = Math.min(20*cP4*min,0.7);
//     //var df = (dqO-duO)*maxdf/Math.abs(dqO-duO);
//     const df = Math.max(Math.min((dqO - duO) * cP4 / min, 0.7), -0.7);
//     // if (Math.abs(df) < 0.15) {
//     //     converge[3] = true;
//     // }
//     //focale trop grande ou trop petite
//     if (camera.getFocalLength() + df < 8 || camera.getFocalLength() + df > 65) {
//         // converge[3] = true;
//         return;
//     }
//     // effectController.focal += df;
//     // gui.__folders['Camera'].__controllers[0].updateDisplay();
//     camera.setFocalLength(camera.getFocalLength() + df);
//     const sols2 = fixThird(binding1, binding2, binding3);
//     const j_ = Math.min(i_min, sols2.positions.length - 1);
//     if (j_ === -1) {
//         // converge[3] = true;
//         console.log('pas de solution');
//         return;
//     }
//     camera.position.set(sols2.positions[j_].x, sols2.positions[j_].y, sols2.positions[j_].z);
//     camera.rotation.set(
//         sols2.rotations[j_].x,
//         sols2.rotations[j_].y,
//         sols2.rotations[j_].z,
//         sols2.rotations[j_].order
//     );
//     //verification si changement de la focale dans le bon sens
//     camera.updateMatrix();
//     camera.updateMatrixWorld();
//     const q2 = point3D_to_photo_update(voxel4);
//     const fx2 = camera.projectionMatrix.elements[0];
//     const fy2 = camera.projectionMatrix.elements[5];
//     const v_ = new THREE.Vector3(1 / fx2 * pixel4.x, 1 / fy2 * pixel4.y, -1);
//     const min2 = new THREE.Vector3().subVectors(q2, v_).length();
//     if (min < min2) {
//         //changement de distance focale dans le mauvais sens
//         df = -1.5 * df;
//         // effectController.focal += df;
//         // gui.__folders['Camera'].__controllers[0].updateDisplay();
//         camera.setFocalLength(camera.getFocalLength() + df);
//         const sols3 = fixThird(binding1, binding2, binding3, camera);
//         const k_ = Math.min(i_min, sols3.positions.length - 1);
//         if (k_ === -1) {
//             camera.setFocalLength(camera.getFocalLength() - df / 3);
//             camera.position.set(
//                 sols.positions[i_min].x,
//                 sols.positions[i_min].y,
//                 sols.positions[i_min].z
//             );
//             camera.rotation.set(
//                 sols.rotations[i_min].x,
//                 sols.rotations[i_min].y,
//                 sols.rotations[i_min].z,
//                 sols.rotations[i_min].order
//             );
//             console.log('pas de solution');
//             // converge[3] = true;
//             return;
//         }
//         camera.position.set(sols3.positions[k_].x, sols3.positions[k_].y, sols3.positions[k_].z);
//         camera.rotation.set(
//             sols3.rotations[k_].x,
//             sols3.rotations[k_].y,
//             sols3.rotations[k_].z,
//             sols3.rotations[k_].order
//         );
//         camera.updateMatrix();
//         camera.updateMatrixWorld();
//     }
//     if (
//         Math.abs(df + prevdf1 + prevdf2) < 0.01 ||
//         Math.abs(df + prevdf1) < 0.01 ||
//         (df * prevdf2 > 0 && df * prevdf1 < 0) ||
//         (df * prevdf1 > 0 && df * prevdf2 < 0)
//     ) {
//         if (Math.abs(prevdf1) !== 0 || Math.abs(prevdf2) !== 0) {
//             //condition d'arrêt : plus de grandes variations ou changements de signe
//             // converge[3] = true;
//         }
//     }
//     prevdf2 = prevdf1 + 0;
//     prevdf1 = df;
// };

// export const fixthird_ortho = (binding1, binding2, binding3, camera) => {
//     const p1 = binding1.point2D;
//     const p2 = binding2.point2D;
//     const p3 = binding3.point2D;

//     const point3D_1 = binding1.point3D;
//     const point3D_2 = binding2.point3D;
//     const point3D_3 = binding3.point3D;

//     const P1 = new THREE.Vector3(point3D_1.x, point3D_1.y, point3D_1.z);
//     const P2 = new THREE.Vector3(point3D_2.x, point3D_2.y, point3D_2.z);
//     const P3 = new THREE.Vector3(point3D_3.x, point3D_3.y, point3D_3.z);

//     const D1 = P1.y - P2.y;
//     const D2 = P1.y - P3.y;
//     const d1 = p1.y - p2.y;
//     const d2 = p1.y - p3.y;
//     if (Math.abs(D1) > Math.abs(D2)) {
//         const D3 = D1;
//         D1 = D2;
//         D2 = D3;
//         const d3 = d1;
//         d1 = d2;
//         d2 = d3;
//     }
//     /* cas 1 vue de coté (y conservé)
//      * R|t = a 0 b t1
//      *       0 1 0 t2
//      *      -b 0 a 0
//      * Il faut donc résoudre le systeme (1) aX+bZ+t1 = x (3 equations /3 inconnues)
//      * et (2) Y+t2 = y
//      */
//     if (Math.abs(D1 / D2 - d1 / d2) < 0.05) {
//         const zoom = Math.abs(d2 / D2);
//         //Résolution de (1) sous la forme M1X1 = Y1
//         const M1 = new THREE.Matrix3().set(P1.x, P1.z, 1, P2.x, P2.z, 1, P3.x, P3.z, 1);
//         const Y1 = new THREE.Vector3(p1.x, p2.x, p3.x);
//         const X1 = Y1.applyMatrix3(new THREE.Matrix3().getInverse(M1));
//         X1.multiplyScalar(1 / new THREE.Vector2(X1.x, X1.y).length());
//         const t1 = X1.z;
//         //Résolution de (2)
//         const t2 = ((p1.y + p2.y + p3.y) / zoom - (P1.y + P2.y + P3.y)) / 3;
//         //Matrice de rotation de la caméra : tR
//         const Rt = new THREE.Matrix3().set(X1.x, 0, -X1.y, 0, 1, 0, X1.y, 0, X1.x);
//         //Position de la caméra : tR*(tx,ty,0)
//         const t = new THREE.Vector3(-t1, -t2, 0).applyMatrix3(Rt);
//         const e = rot_matrix_to_euler(Rt.elements);
//         camera.zoom = zoom;
//         // effectController.zoom = zoom;
//         // gui.__folders['Camera'].__controllers[1].updateDisplay();
//         camera.rotation.set(e[0], e[1], e[2], 'ZYX');
//         camera.position.set(t.x, t.y, t.z);
//         camera.updateProjectionMatrix();
//         camera.translateZ(20);
//     } else {
//         /* cas 2 vue de dessus (y ignoré)
//      * R|t = a 0 b t1
//      *       b 0-a t2
//      *       0 1 0 0
//      * Il faut donc résoudre le systeme (1) aX+bZ+t1 = x (3 equations /3 inconnues)
//      * et (2) aX-bZ+t2 = y
//      */
//         const M = new THREE.Matrix3().set(P1.x, P1.z, 1, P2.x, P2.z, 1, P3.x, P3.z, 1);
//         const MI = new THREE.Matrix3().getInverse(M);
//         const Y1 = new THREE.Vector3(p1.x, p2.x, p3.x);
//         const Y2 = new THREE.Vector3(p1.y, p2.y, p3.y);
//         const X1 = Y1.applyMatrix3(MI);
//         const X2 = Y2.applyMatrix3(MI);
//         const zoom =
//             1 /
//             new THREE.Vector2()
//                 .subVectors(new THREE.Vector2(P1.x, P1.z), new THREE.Vector2(P2.x, P2.z))
//                 .length();
//         X1.multiplyScalar(1 / new THREE.Vector2(X1.x, X1.y).length());
//         X2.multiplyScalar(1 / new THREE.Vector2(X2.x, X2.y).length());
//         const t1 = X1.z;
//         const t2 = X2.z;
//         //Matrice de rotation de la caméra : tR
//         const Rt = new THREE.Matrix3().set(X1.x, X1.y, 0, 0, 0, 1, X1.y, -X1.x, 0);
//         //zoom = p1p2/M|t*P1P2
//         zoom *= new THREE.Vector3().subVectors(p1, p2).length();
//         //Position de la caméra : tR*(tx,ty,0)
//         const t = new THREE.Vector3(-t1, -t2, 0).applyMatrix3(Rt);
//         const e = rot_matrix_to_euler(Rt.elements);
//         camera.zoom = zoom;
//         // effectController.zoom = zoom;
//         // gui.__folders['Camera'].__controllers[1].updateDisplay();
//         camera.rotation.set(e[0], e[1], e[2], 'ZYX');
//         camera.position.set(t.x, t.y, t.z);
//         camera.updateProjectionMatrix();
//         camera.translateZ(20);
//     }
//     // converge[2] = true;
// };

// export const fixnth = fixed => {
//     //Requête http POST avec les arguments du programme en C++
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://localhost:9000/', true);
//     var args = (effectController.ortho ? '-o ' : '') + '-- ' + fixed_points;
//     for (var i = 0; i < fixed_points; ++i) {
//         args += ' ' + vox[fixed[i]].position.x;
//         args += ' ' + vox[fixed[i]].position.y;
//         args += ' ' + vox[fixed[i]].position.z;
//         args += ' ' + 1 / plane_w * pix[fixed[i]].position.x;
//         args += ' ' + 1 / plane_h * pix[fixed[i]].position.y;
//     }
//     xhr.send(args);
//     xhr.onreadystatechange = processRequest;
//     converge[4] = true;
//     function processRequest(e) {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             var cam = xhr.responseText.split(/\s+/); //sortie standard du programme
//             if (effectController.ortho) {
//                 //caméra ortho
//                 camera_ortho.position.set(
//                     parseFloat(cam[0]),
//                     parseFloat(cam[1]),
//                     parseFloat(cam[2])
//                 );
//                 camera_ortho.rotation.set(
//                     parseFloat(cam[3]),
//                     parseFloat(cam[4]),
//                     parseFloat(cam[5]),
//                     'ZYX'
//                 );
//                 camera_ortho.zoom = pix[fixed[0]].position.length() / parseFloat(cam[6]);
//                 camera_ortho.updateProjectionMatrix();
//                 effectController.zoom = camera_ortho.zoom;
//                 gui.__folders['Camera'].__controllers[1].updateDisplay();
//                 camera_ortho.translateZ(20);
//                 err = parseFloat(cam[7]);
//             } else if (parseFloat(cam[6]) > 3 && parseFloat(cam[6]) < 500) {
//                 // caméra perspective, 3 < focale < 500
//                 camera_3D.position.set(parseFloat(cam[0]), parseFloat(cam[1]), parseFloat(cam[2]));
//                 camera_3D.rotation.set(
//                     -parseFloat(cam[3]),
//                     parseFloat(cam[4]) - Math.PI,
//                     parseFloat(cam[5]),
//                     'ZYX'
//                 );
//                 if (plane_w > plane_h) {
//                     camera_3D.setFocalLength(parseFloat(cam[6]));
//                     effectController.focal = parseFloat(cam[6]);
//                 } else {
//                     camera_3D.setFocalLength(parseFloat(cam[7]));
//                     effectController.focal = parseFloat(cam[7]);
//                 }
//                 gui.__folders['Camera'].__controllers[0].updateDisplay();
//                 cx = parseFloat(cam[8]);
//                 cy = parseFloat(cam[9]);
//                 camera_3D.setViewOffset(w, h, w * cx, h * cy, w, h);
//                 camera_3D.updateProjectionMatrix();
//                 err = parseFloat(cam[10]);
//             } else console.log('add another point (inacurate results)');
//         }
//         render_cam();
//     }
// };
