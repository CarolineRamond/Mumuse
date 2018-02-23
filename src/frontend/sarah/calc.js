// //utils points 2D-3D
// function point3D_to_photo( point ) {
// 	var P = new THREE.Vector3().copy(point);
//     //point dans les coordonnées de la caméra
//     P = P.applyMatrix4(camera_3D.matrixWorldInverse);
//     //point sur la photo
//     P = new THREE.Vector3(-P.x/P.z, -P.y/P.z, -1);
//     return P;
// }
// function point3D_to_photo_update( point ) {
// 	var P = new THREE.Vector3().copy(point);
//     //point dans les coordonnées de la caméra
//     P = P.applyMatrix4(new THREE.Matrix4().getInverse(camera_3D.matrixWorld));
//     //Point sur la photo
//     P = new THREE.Vector3(-P.x/P.z, -P.y/P.z, -1);
//     return P;
// }

// //utils
// function rot_matrix_to_euler( R ) {
//     var x_rot = Math.atan2(R[5], R[8]);
//     var y_rot = Math.atan2(-R[2], Math.sqrt(R[5] * R[5] + R[8] * R[8]));
//     var z_rot = Math.atan2(R[1], R[0]);     
//     return [x_rot, y_rot, z_rot];
// }

// function rotate_to_second( i, j ) {
//     // Rotation autour de (CP1) pour aligner (P1P2) sur l'écran de la caméra
// 	var pixel1 = pix[i].position;
//     var voxel1 = vox[i].position;
// 	var pixel2 = pix[j].position;
//     var voxel2 = vox[j].position;
//     var fx = camera_3D.projectionMatrix.elements[0];
// 	var fy = camera_3D.projectionMatrix.elements[5];
//     var p = point3D_to_photo(voxel1);
//     var q = point3D_to_photo(voxel2);
//     var q1 = new THREE.Vector3(2/plane_w * 1/fx * pixel2.x, 2/plane_h * 1/fy * pixel2.y, -1);
//     var pq = new THREE.Vector2(q.x - p.x, q.y - p.y);
//     var pq1 = new THREE.Vector2(q1.x - p.x, q1.y - p.y);
//     var costh = pq.dot(pq1) / Math.sqrt(pq.dot(pq) * pq1.dot(pq1));
//     var th = 0
//     if ( costh < 1 && costh > -1 )
//         th = Math.acos(costh);
//     if ( pq.y*pq1.x-pq.x*pq1.y < 0 )
//         th *= -1;
//     var CPaxis = new THREE.Vector3().copy(p);
//     CPaxis = CPaxis.multiplyScalar(1/CPaxis.length());
//     camera_3D.rotateOnAxis(CPaxis, -th/2);
// }

// function translate_to_second( i, j ) {
//     // Translation sur CP1 jusqu'à ce que P2 coincinde avec son image
//     var pixel1 = pix[i].position;
//     var voxel1 = vox[i].position;
// 	var pixel2 = pix[j].position;
//     var voxel2 = vox[j].position;
//     var fx = camera_3D.projectionMatrix.elements[0];
// 	var fy = camera_3D.projectionMatrix.elements[5];
//     var CPaxis_w = new THREE.Vector3().subVectors(voxel1,camera_3D.position);
//     var CPaxis = new THREE.Vector3().copy(voxel1).applyMatrix4(camera_3D.matrixWorldInverse);
//     var D = CPaxis.length();
//     CPaxis = CPaxis.multiplyScalar(1/D);   
//     CPaxis_w = CPaxis_w.multiplyScalar(1/CPaxis_w.length());   
//     var p = point3D_to_photo(voxel1);
//     var q = point3D_to_photo(voxel2);
//     var q1 = new THREE.Vector3(2/plane_w / fx * pixel2.x, 2/plane_h / fy * pixel2.y, -1);
//     var pq = new THREE.Vector2(q.x - p.x, q.y - p.y);
//     var pq1 = new THREE.Vector2(q1.x - p.x, q1.y - p.y);
//     var costh = pq.dot(pq1) / Math.sqrt(pq.dot(pq) * pq1.dot(pq1));
//     var th = 0;
//     if ( costh < 1 && costh > -1 )
//         th = Math.acos(costh);
//     if ( pq.y*pq1.x-pq.x*pq1.y < 0 )
//         th *= -1;
//     var P1P2 = new THREE.Vector3().subVectors(voxel2, voxel1);
//     //alpha=angle p-C-q1
//     var cosalpha = p.dot(q1) / p.length() / q1.length();
//     //beta=angle C-P1-P2
//     var cosbeta = -P1P2.dot(CPaxis_w) / P1P2.length();
//     var alpha = Math.acos(cosalpha);
//     var beta = Math.acos(cosbeta);
//     //d=P1Q, avec Q le projeté de q1 sur (P1P2)
//     var d = D * Math.sin(alpha) / Math.cos(beta + alpha - Math.PI/2);
//     if ( Math.abs(P1P2.length() - d) < 0.01 && Math.abs(th) < 0.01 )
//         converge[1] = true;
//     else
//         converge[1] = false;
//     camera_3D.translateOnAxis(CPaxis, -D * (P1P2.length() / d - 1)/2);
// }

// function fix3DTo3D( P, Q ){
//     //Calcul de la matrice R et t permettant de transformer P en Q:
//     //article : http://nghiaho.com/?page_id=671
//     if ( P.length != Q.length )
//         return;
//     //centroides
//     var centroid1 = new THREE.Vector3();
//     var centroid2 = new THREE.Vector3();
//     for ( var i = 0; i < P.length; i++ ) {
//         centroid1.add(P[i]);
//         centroid2.add(Q[i]);
//     }
//     centroid1.multiplyScalar(1.0/P.length);
//     centroid2.multiplyScalar(1.0/P.length);
//     //covariance
//     var h11 = 0; var h12 = 0; var h13 = 0; var h21 = 0; var h22 = 0; var h23 = 0; var h31 = 0; var h32 = 0; var h33 = 0;
//     for ( var i = 0; i < P.length; i++ ) {
//         P[i] = new THREE.Vector3().subVectors(P[i], centroid1);
//         Q[i] = new THREE.Vector3().subVectors(Q[i], centroid2);
//     }
//     for ( var i = 0; i < P.length; i++ ) {
//         h11 += P[i].x*Q[i].x;
//         h12 += P[i].x*Q[i].y;
//         h13 += P[i].x*Q[i].z;
//         h21 += P[i].y*Q[i].x;
//         h22 += P[i].y*Q[i].y;
//         h23 += P[i].y*Q[i].z;
//         h31 += P[i].z*Q[i].x;
//         h32 += P[i].z*Q[i].y;
//         h33 += P[i].z*Q[i].z;
//     }
//     var H = [[h11, h12, h13], [h21, h22, h23], [h31, h32, h33]];
//     var SVD = numeric.svd(H);
//     var U = new THREE.Matrix3().set(SVD.U[0][0], SVD.U[0][1], SVD.U[0][2],
//                                     SVD.U[1][0], SVD.U[1][1], SVD.U[1][2],
//                                     SVD.U[2][0], SVD.U[2][1], SVD.U[2][2]);
//     var V = new THREE.Matrix3().set(SVD.V[0][0], SVD.V[0][1], SVD.V[0][2],
//                                     SVD.V[1][0], SVD.V[1][1], SVD.V[1][2],
//                                     SVD.V[2][0], SVD.V[2][1], SVD.V[2][2]);
//     var Vt = new THREE.Matrix3().set(SVD.V[0][0], SVD.V[1][0], SVD.V[2][0],
//                                      SVD.V[0][1], SVD.V[1][1], SVD.V[2][1],
//                                      SVD.V[0][2], SVD.V[1][2], SVD.V[2][2]);
//     //R = V*U.T avec H = U*S*V.T 
//     var R = new THREE.Matrix3().fromArray(U.applyToVector3Array(Vt.toArray())).transpose();
//     //determinant > 0
//     if (R.determinant() < 0) {
//         Vt = new THREE.Matrix3().set(Vt.elements[0], Vt.elements[3], Vt.elements[6],
//                                      Vt.elements[1], Vt.elements[4], Vt.elements[7],
//                                      -Vt.elements[2], -Vt.elements[5], -Vt.elements[8]);
//         R = new THREE.Matrix3().fromArray(U.applyToVector3Array(Vt.toArray())).transpose();
//     }
//     //angles d'euler
//     var Rt = new THREE.Matrix3().copy(R).transpose();
//     var e = rot_matrix_to_euler(Rt.elements);
//     //translation
//     var t = new THREE.Vector3().addVectors(centroid1, new THREE.Vector3().copy(centroid2).multiplyScalar(-1).applyMatrix3(Rt));
//     return { position: t, rotation: new THREE.Euler(e[0], e[1], e[2], 'ZYX') };
// }

// //calcul de la caméra 1...n points
// function fixfirst( i ) {
//     /*
//     * -Calcul du vecteur entre le point de la photo et le projeté du point 3D correspondant
//     * -Translation de la caméra proportionnellement à ce vecteur et à la profondeur du point 3D
//     */
//     camera_3D.updateProjectionMatrix();
//     camera_3D.updateMatrix();
//     camera_3D.updateMatrixWorld();
// 	var pixel = pix[i].position;
//     var voxel = vox[i].position;
// 	var fx = camera_3D.projectionMatrix.elements[0];
// 	var fy = camera_3D.projectionMatrix.elements[5];
//     //pixel dans les coordonnées de la caméra
//     var p = new THREE.Vector3(2/plane_w * 1/fx * pixel.x, 2/plane_h * 1/fy * pixel.y, -1);
//     //projection du point 3D sur l'écran de la caméra
//     var P = point3D_to_photo(voxel);
//     //point 3D dans les coordonnées de la caméra
//     var Q = new THREE.Vector3().copy(voxel);
//     Q = Q.applyMatrix4(camera_3D.matrixWorldInverse);
//     var q = -Q.z;
//     if ( new THREE.Vector3().subVectors(P,p).length() < 0.005 )
//         converge[0] = true;
//     else
//         converge[0] = false;
//     camera_3D.translateX(q * (P.x - p.x)/2);
//     camera_3D.translateY(q * (P.y - p.y)/2);
//     camera_3D.updateProjectionMatrix();
// }
// function fixsecond( i, j ) {
//     if ( !converge[0] )
//         fixfirst(i);
//     else {
//         rotate_to_second(i, j);
//         translate_to_second(i, j);
//     }
// }
// function fixthird( i, j, k ) {
//     /*
//     * Résolution de P3P
//     * artcile : http://iplimage.com/blog/p3p-perspective-point-overview/
//     */
// 	var fx = camera_3D.projectionMatrix.elements[0];
// 	var fy = camera_3D.projectionMatrix.elements[5];
//     //3 points dans les coordonnées globales
//     var A = vox[i].position;
//     var B = vox[j].position;
//     var C = vox[k].position;
// 	var pixel1 = pix[i].position;
// 	var pixel2 = pix[j].position;
// 	var pixel3 = pix[k].position;
//     //3 vecteurs normalisés dans les coordonnées de la caméra
//     var u_ = new THREE.Vector3(2/plane_w * 1/fx * pixel1.x, 2/plane_h * 1/fy * pixel1.y, -1);
//     var v_ = new THREE.Vector3(2/plane_w * 1/fx * pixel2.x, 2/plane_h * 1/fy * pixel2.y, -1);
//     var w_ = new THREE.Vector3(2/plane_w * 1/fx * pixel3.x, 2/plane_h * 1/fy * pixel3.y, -1);
//     u_ = u_.multiplyScalar(1/u_.length());
//     v_ = v_.multiplyScalar(1/v_.length());
//     w_ = w_.multiplyScalar(1/w_.length());
//     //angles entre ces 3 vecteurs
//     var cosalpha = v_.dot(w_); var cosbeta = u_.dot(w_); var cosgamma = u_.dot(v_);
//     //précalcul des coefficients de l'equation
//     var p = 2*cosalpha; var q = 2*cosbeta; var r = 2*cosgamma;
//     var VecAB = new THREE.Vector3().subVectors(B, A);
//     var VecAC = new THREE.Vector3().subVectors(C, A);
//     var VecBC = new THREE.Vector3().subVectors(C, B);
//     var AB = VecAB.length(); var AC = VecAC.length(); var BC = VecBC.length(); 
//     var a = BC * BC / (AB * AB);
//     var b = AC * AC / (AB * AB); 
//     var a2 = a * a; var b2 = b * b; var p2 = p * p; var q2 = q * q; var r2 = r * r;
//     var pr = p * r; var ab = a * b;
//     var pqr = q * pr;
//     var a_2 = 2*a; var a_4 = 4*a;
//     var r3 = r2 * r; var pr2 = p * r2;
//     var r3q = r3 * q;
//     //coefficients de c4*x⁴+...+c0=0
//     var c0 = 1+2*(b-a-ab)+b2-b*p2+a2;
//     var c1 = pr*(ab-b2+b)+q*((p2-2)*b+2*(ab-a2)+a_4-2);
//     var c2 = q2+b2*(r2+p2-2)-b*(p2+pqr)-ab*(r2+pqr)+(a2-a_2)*(2+q2)+2;
//     var c3 = q*(-2*(ab+a2+1-b)+r2*ab+a_4)+pr*(b-b2+ab);
//     var c4 = -2*b+b2+a2+1+ab*(2-r2)-a_2;
//     var coefficients = [c4, c3, c2, c1, c0];
//     //racines du polynome
//     var roots = quartic(coefficients);
//     //tableau des solutions correspondante
//     var rotations = [];
//     var positions = [];
//     //analyse des solutions reelles
//     for ( var i = 0; i < roots.length; i++ ) {
//         var x = roots[i].re;
//         if ( x <= 0 || roots[i].im != 0 )
//             continue;
//         //equation b0*y-b1 = 0 
//         var x2 = x*x;
//         var b0 = b*((p*p-p*q*r+r*r)*a+(p*p-r*r)*b-p*p+p*q*r-r*r)*((p*p-p*q*r+r*r)*a+(p*p-r*r)*b-p*p+p*q*r-r*r);
//         var b1 = ((1-a-b)*x2+(q*a-q)*x+1-a+b)*(((r3*(a2+ab*(2-r2)-a_2+b2-2*b+1))*x+(r3q*(2*(b-a2)+a_4+ab*(r2-2)-2)+pr2*(1+a2+2*(ab-a-b)+r2*(b-b2)+b2)))*x2+(r3*(q2*(1-2*a+a2)+r2*(b2-ab)-a_4+2*(a2-b2)+2)+r*p2*(b2+2*(ab-b-a)+1+a2)+pr2*q*(a_4+2*(b-ab-a2)-2-r2*b))*x+2*r3q*(a_2-b-a2+ab-1)+pr2*(q2-a_4+2*(a2-b2)+r2*b+q2*(a2-a_2)+2)+p2*(p*(2*(ab-a-b)+a2+b2+1)+2*q*r*(b+a_2-a2-ab-1)));
//         //solutions correspondant à une distance > 0 ?
//         if (b1 < 0)
//             continue;
//         var y = b1/b0;
//         if (y < 0)
//             continue;
//         var k = x*x+y*y-x*y*r;
//         if (k < 0)
//             continue;
//         //calcul des distances camera-points
//         var PC = AB / Math.sqrt(k);
//         var PB = y * PC;
//         var PA = x * PC;
//         //A,B,C dans les coordonnées caméra
//         var A2 = new THREE.Vector3().add(u_).multiplyScalar(PA);
//         var B2 = new THREE.Vector3().add(v_).multiplyScalar(PB);
//         var C2 = new THREE.Vector3().add(w_).multiplyScalar(PC);
//         var matTransform = fix3DTo3D([A, B, C], [A2, B2, C2]);
//         var t = matTransform.position; var rot = matTransform.rotation;
//         if (t.x == t.x && t.y == t.y && t.z == t.z) {
//             positions.push(t);
//             rotations.push(new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromEuler(rot), 'XYZ'));
//         }
//     }
//     return {positions: positions, rotations: rotations};
// }
// function fixfourth( i, j, k, l ) {
    
//     * Placement de la caméra en fonction des 3 premiers points
//     * Sélection de la solution la meilleure par rapport au 4eme point
//     * Ajustement de la distance focale suivant l'erreur du 4ème point
//     * Si l'erreur augmente, ajustement de la distance focale dans l'autre sens
    
// 	var fx = camera_3D.projectionMatrix.elements[0];
// 	var fy = camera_3D.projectionMatrix.elements[5];
//     var pixel4 = pix[l].position;
//     var voxel4 = vox[l].position;
//     //sols:positions et rotations posible pour P1,P2,P3
//     var sols = fixthird(i, j, k);
//     var min = Math.SQRT2 * fx;
//     var i_min = 0;
//     var q_min = new THREE.Vector3();
//     var u_ = new THREE.Vector3(2/plane_w * 1/fx * pixel4.x, 2/plane_h * 1/fy * pixel4.y, -1);
//     if ( sols.positions.length < 1 ) {
//         converge[3] = true;
//         console.log("pas de solution");
//         return;
//     }
//     //selection du meilleur point de vue sur vox[k]
//     for ( var i_= 0; i_ < sols.positions.length; ++i_ ) {
//         camera_3D.position.set(sols.positions[i_].x, 
//                                sols.positions[i_].y,
//                                sols.positions[i_].z);
//         camera_3D.rotation.set(sols.rotations[i_].x,
//                                sols.rotations[i_].y,
//                                sols.rotations[i_].z,
//                                sols.rotations[i_].order);
//         camera_3D.updateMatrix();
//         camera_3D.updateMatrixWorld();
//         var q = point3D_to_photo_update(voxel4);
//         var d = new THREE.Vector3().subVectors(q, u_).length();
//         if ( d < min ) {
//             i_min = i_;
//             q_min.copy(q);
//             min = d;
//             if ( d < 0.0075 ) {
//                 converge[3] = true;
//                 return;
//             }
//         }
//     }
//     camera_3D.position.set(sols.positions[i_min].x,
//                            sols.positions[i_min].y,
//                            sols.positions[i_min].z);
//     camera_3D.rotation.set(sols.rotations[i_min].x,
//                            sols.rotations[i_min].y,
//                            sols.rotations[i_min].z,
//                            sols.rotations[i_min].order);
//     //distance tp4-centre optique
//     var duO = u_.length();
//     //distance q-centre optique
//     var dqO = q_min.length();
//     //ajuster la distance focale : proportionnellement à l'erreur
//     var cP4Axis = new THREE.Vector3().copy(voxel4).applyMatrix4(camera_3D.matrixWorldInverse);
//     var cP4 = cP4Axis.length();
//     //var maxdf = Math.min(20*cP4*min,0.7);
//     //var df = (dqO-duO)*maxdf/Math.abs(dqO-duO);
//     var df = Math.max(Math.min((dqO - duO) * cP4 / min, 0.7), -0.7);
//     if ( Math.abs(df) < 0.15 )
//         converge[3] = true;
//     //focale trop grande ou trop petite
//     if ( camera_3D.getFocalLength() + df < 8 || camera_3D.getFocalLength() + df > 65 ) {
//         converge[3] = true;
//         return;
//     }
//     effectController.focal += df;
//     gui.__folders["Camera"].__controllers[0].updateDisplay();
//     camera_3D.setFocalLength(camera_3D.getFocalLength() + df);
//     var sols2 = fixthird(i, j, k);
//     var j_ = Math.min(i_min, sols2.positions.length - 1);
//     if ( j_ == -1 ) {
//         converge[3] = true;
//         console.log("pas de solution");
//         return;
//     }
//     camera_3D.position.set(sols2.positions[j_].x,
//                            sols2.positions[j_].y,
//                            sols2.positions[j_].z);
//     camera_3D.rotation.set(sols2.rotations[j_].x,
//                            sols2.rotations[j_].y,
//                            sols2.rotations[j_].z,
//                            sols2.rotations[j_].order);
//     //verification si changement de la focale dans le bon sens
//     camera_3D.updateMatrix();
//     camera_3D.updateMatrixWorld();
//     var q2 = point3D_to_photo_update(voxel4);
// 	var fx2 = camera_3D.projectionMatrix.elements[0];
// 	var fy2 = camera_3D.projectionMatrix.elements[5];
//     var v_ = new THREE.Vector3(2/plane_w * 1/fx2 * pixel4.x, 2/plane_h * 1/fy2 * pixel4.y, -1);
//     var min2 = new THREE.Vector3().subVectors(q2, v_).length();
//     if ( min < min2 ) { //changement de distance focale dans le mauvais sens
//         df = -1.5 * df;
//         effectController.focal += df;
//         gui.__folders["Camera"].__controllers[0].updateDisplay();
//         camera_3D.setFocalLength(camera_3D.getFocalLength() + df);
//         var sols3 = fixthird(i, j, k);
//         var k_ = Math.min(i_min, sols3.positions.length - 1);
//         if (k_ == -1){
//             camera_3D.setFocalLength(camera_3D.getFocalLength() - df/3);
//             camera_3D.position.set(sols.positions[i_min].x,
//                                    sols.positions[i_min].y,
//                                    sols.positions[i_min].z);
//             camera_3D.rotation.set(sols.rotations[i_min].x,
//                                    sols.rotations[i_min].y,
//                                    sols.rotations[i_min].z,
//                                    sols.rotations[i_min].order);
//             console.log("pas de solution");
//             converge[3] = true;
//             return;
//         }
//         camera_3D.position.set(sols3.positions[k_].x,
//                                sols3.positions[k_].y,
//                                sols3.positions[k_].z);
//         camera_3D.rotation.set(sols3.rotations[k_].x,
//                                sols3.rotations[k_].y,
//                                sols3.rotations[k_].z,
//                                sols3.rotations[k_].order);
//         camera_3D.updateMatrix();
//         camera_3D.updateMatrixWorld();
//     }
//     if ( Math.abs(df + prevdf1 + prevdf2) < 0.01 || 
//          Math.abs(df + prevdf1) < 0.01 || 
//          (df*prevdf2 > 0 && df * prevdf1 < 0) ||
//          (df*prevdf1 > 0 && df * prevdf2 < 0) ) //condition d'arrêt : plus de grandes variations ou changements de signe
//         //converge[3] = true;
//     if ( Math.abs(prevdf1) != 0 || Math.abs(prevdf2) != 0 )
//         converge[3] = true;
//     prevdf2 = prevdf1 + 0;
//     prevdf1 = df;
// }
// function fixnth( fixed ) {
//     //Requête http POST avec les arguments du programme en C++ 
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', "http://localhost:9000/", true);
//     var args = (effectController.ortho?"-o ": "") + "-- " + fixed_points;
// 	for ( var i = 0; i < fixed_points; ++i ) {
//         args += " " + vox[fixed[i]].position.x;
//         args += " " + vox[fixed[i]].position.y;
//         args += " " + vox[fixed[i]].position.z;
//         args += " " + 1/plane_w * pix[fixed[i]].position.x;
//         args += " " + 1/plane_h * pix[fixed[i]].position.y;
//     }
//     xhr.send(args);
//     xhr.onreadystatechange = processRequest;
//     converge[4] = true;
//     function processRequest(e) {
//         if ( xhr.readyState == 4 && xhr.status == 200 ) {
//             var cam = xhr.responseText.split(/\s+/); //sortie standard du programme
//             if ( effectController.ortho ) { //caméra ortho
//                 camera_ortho.position.set(parseFloat(cam[0]), parseFloat(cam[1]), parseFloat(cam[2]));
//                 camera_ortho.rotation.set(parseFloat(cam[3]), parseFloat(cam[4]), parseFloat(cam[5]), "ZYX");
//                 camera_ortho.zoom = pix[fixed[0]].position.length() / parseFloat(cam[6]);
//                 camera_ortho.updateProjectionMatrix();
//                 effectController.zoom = camera_ortho.zoom;
//                 gui.__folders["Camera"].__controllers[1].updateDisplay();                
//                 camera_ortho.translateZ(20);
//                 err = parseFloat(cam[7]);
//             } else if ( parseFloat(cam[6]) > 3 && parseFloat(cam[6]) < 500 ) { // caméra perspective, 3 < focale < 500
//                 camera_3D.position.set(parseFloat(cam[0]), parseFloat(cam[1]), parseFloat(cam[2]));
//                 camera_3D.rotation.set(-parseFloat(cam[3]), parseFloat(cam[4]) - Math.PI, parseFloat(cam[5]), "ZYX");
//                 if ( plane_w > plane_h ) {
//                     camera_3D.setFocalLength(parseFloat(cam[6]));
//                     effectController.focal = parseFloat(cam[6]);
//                 } else {
//                     camera_3D.setFocalLength(parseFloat(cam[7]));
//                     effectController.focal = parseFloat(cam[7]);
//                 }
//                 gui.__folders["Camera"].__controllers[0].updateDisplay();
//                 cx = parseFloat(cam[8]); 
//                 cy = parseFloat(cam[9]);
//                 camera_3D.setViewOffset(w, h, w * cx, h * cy, w, h);
//                 camera_3D.updateProjectionMatrix();
//                 err = parseFloat(cam[10]);
//             } else console.log("add another point (inacurate results)");
//         }
//         render_cam();
//     }
// }
// function fixthird_ortho( i, j, k ) {
//     var P1 = vox[i].position;
//     var P2 = vox[j].position;
//     var P3 = vox[k].position;
// 	var p1 = pix[i].position;
// 	var p2 = pix[j].position;
// 	var p3 = pix[k].position;
//     var D1 = P1.y - P2.y; var D2 = P1.y - P3.y;
//     var d1 = p1.y - p2.y; var d2 = p1.y - p3.y;
//     if ( Math.abs(D1) > Math.abs(D2) ) {
//         var D3 = D1; D1 = D2; D2 = D3;
//         var d3 = d1; d1 = d2; d2 = d3;
//     }
//     /* cas 1 vue de coté (y conservé)
//      * R|t = a 0 b t1
//      *       0 1 0 t2
//      *      -b 0 a 0
//      * Il faut donc résoudre le systeme (1) aX+bZ+t1 = x (3 equations /3 inconnues)
//      * et (2) Y+t2 = y   
//      */
//     if ( Math.abs(D1 / D2 - d1 / d2) < 0.05 ) {
//         var zoom = Math.abs(d2 / D2);
//         //Résolution de (1) sous la forme M1X1 = Y1
//         var M1 = new THREE.Matrix3().set(P1.x, P1.z, 1,
//                                          P2.x, P2.z, 1,
//                                          P3.x, P3.z, 1);
//         var Y1 = new THREE.Vector3(p1.x, p2.x, p3.x);
//         var X1 = Y1.applyMatrix3(new THREE.Matrix3().getInverse(M1));
//         X1.multiplyScalar(1/new THREE.Vector2(X1.x, X1.y).length());
//         var t1 = X1.z;
//         //Résolution de (2)
//         var t2 = ((p1.y + p2.y + p3.y)/zoom - (P1.y + P2.y + P3.y))/3;
//         //Matrice de rotation de la caméra : tR
//         var Rt = new THREE.Matrix3().set(X1.x, 0, -X1.y,
//                                          0, 1, 0,
//                                          X1.y, 0, X1.x);
//         //Position de la caméra : tR*(tx,ty,0)
//         var t = new THREE.Vector3(-t1, -t2, 0).applyMatrix3(Rt);
//         var e = rot_matrix_to_euler(Rt.elements);
//         camera_ortho.zoom = zoom;
//         effectController.zoom = zoom;
//         gui.__folders["Camera"].__controllers[1].updateDisplay();
//         camera_ortho.rotation.set(e[0], e[1], e[2], "ZYX");
//         camera_ortho.position.set(t.x, t.y, t.z);
//         camera_ortho.updateProjectionMatrix();
//         camera_ortho.translateZ(20);
//     }
//     /* cas 2 vue de dessus (y ignoré)
//      * R|t = a 0 b t1
//      *       b 0-a t2
//      *       0 1 0 0
//      * Il faut donc résoudre le systeme (1) aX+bZ+t1 = x (3 equations /3 inconnues)
//      * et (2) aX-bZ+t2 = y   
//      */
//     else {
//         var M = new THREE.Matrix3().set(P1.x, P1.z, 1,
//                                         P2.x, P2.z, 1,
//                                         P3.x, P3.z, 1);
//         var MI = new THREE.Matrix3().getInverse(M);
//         var Y1 = new THREE.Vector3(p1.x, p2.x, p3.x);
//         var Y2 = new THREE.Vector3(p1.y, p2.y, p3.y);
//         var X1 = Y1.applyMatrix3(MI);
//         var X2 = Y2.applyMatrix3(MI);
//         var zoom = 1/new THREE.Vector2().subVectors(new THREE.Vector2(P1.x, P1.z),new THREE.Vector2(P2.x, P2.z)).length();
//         X1.multiplyScalar(1/new THREE.Vector2(X1.x, X1.y).length());
//         X2.multiplyScalar(1/new THREE.Vector2(X2.x, X2.y).length());
//         var t1 = X1.z;
//         var t2 = X2.z;
//         //Matrice de rotation de la caméra : tR
//         var Rt = new THREE.Matrix3().set(X1.x, X1.y, 0,
//                                          0, 0, 1,
//                                          X1.y, -X1.x, 0);
//         //zoom = p1p2/M|t*P1P2
//         zoom *= new THREE.Vector3().subVectors(p1, p2).length();
//         //Position de la caméra : tR*(tx,ty,0)
//         var t = new THREE.Vector3(-t1, -t2, 0).applyMatrix3(Rt);
//         var e = rot_matrix_to_euler(Rt.elements);
//         camera_ortho.zoom = zoom;
//         effectController.zoom = zoom;
//         gui.__folders["Camera"].__controllers[1].updateDisplay();
//         camera_ortho.rotation.set(e[0], e[1], e[2], "ZYX");
//         camera_ortho.position.set(t.x, t.y, t.z);
//         camera_ortho.updateProjectionMatrix();
//         camera_ortho.translateZ(20);
//     }
//     converge[2] = true;
// }