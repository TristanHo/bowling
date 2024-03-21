//********************************************************
//   DEBUT PLAN SOL
//********************************************************

function piste(scene) {

    const largPlan = 19.156;
    const hautPlan = 1.05;
    const nbSegmentLarg = 10;
    const nbSegmentHaut = 10;
    const PlanSolGeometry = new THREE.PlaneGeometry(largPlan, hautPlan, nbSegmentLarg, nbSegmentHaut);
    const PlanSol = surfPhong(PlanSolGeometry, "#915e28", "#FFFFFF", false);
    PlanSol.receiveShadow = true;
    PlanSol.castShadow = true;
    scene.add(PlanSol);

}

//********************************************************
//   FIN PLAN SOL
//********************************************************


//********************************************************
//   DEBUT SPHERE
//********************************************************

const rayon_boule = 0.108;
const nb = 1000; //nombre points courbe sur boule
const epaisseur = 1000;

function PtsCbeCercle(R, nb, epaisseur,coul){

    let points = new Array(nb+1);
    for(var k=0;k<=nb;k++){
        let t2=k/nb*2*Math.PI;
        t2=t2.toPrecision(PrecisionArrondi);
        let x0=R*Math.cos(t2);
        let y0=R*Math.sin(t2);
        points[k] = new THREE.Vector3(x0,y0,0);
    }
    let PtsCbe = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({color:coul,linewidth:epaisseur});
    let Cbe = new THREE.Line(PtsCbe,material);
    return Cbe;

}

function creation_boule (coul1 ,coul2 ,x ,y ,z) {

    //Sphere
    let sphereGeometry = new THREE.SphereGeometry(rayon_boule, 130, 160);
    let sphere = surfPhong(sphereGeometry, coul1,"#FFFFFF");
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(x, y, z);

    //Cercle sur boule
    let CbeBoule = PtsCbeCercle(rayon_boule,nb,epaisseur,coul2);
    CbeBoule.translateX(x);
    CbeBoule.translateY(y);
    CbeBoule.translateZ(z);
    CbeBoule.rotateX(Math.PI/2);
    return[sphere,CbeBoule];

}

//********************************************************
//   FIN SPHERE
//********************************************************


//********************************************************
//   DEBUT GOUTTIERES
//********************************************************

function gouttieres(scene) {

    let rayon1 = 0.125;
    let rayon2 = 0.125;
    let hauteur = 19.156;
    let nbePtsCercle = 60;
    let nbePtsGenera = 2;
    let bolOuvert = true;
    let theta0 = 0.5 * Math.PI;
    let thetaLg = Math.PI;
    let CylConeGeom = new THREE.CylinderGeometry(rayon1, rayon2, hauteur, nbePtsCercle, nbePtsGenera, bolOuvert, theta0, thetaLg);
    let goutiereD = new surfPhong(CylConeGeom, "#2e2f3b", "#e8e8e8", true);
    let goutiereG = goutiereD.clone();
    goutiereD.receiveShadow = true;
    goutiereD.castShadow = true;
    goutiereG.receiveShadow = true;
    goutiereG.castShadow = true;
    goutiereD.position.set(0, 0.650, 0);
    goutiereG.position.set(0, -0.650, 0);
    goutiereD.rotateZ(0.5 * Math.PI);
    goutiereG.rotateZ(0.5 * Math.PI);
    scene.add(goutiereD);
    scene.add(goutiereG);

}

//********************************************************
//   FIN GOUTTIERES
//********************************************************


//********************************************************
//   DEBUT QUILLES
//********************************************************

//QUILLE : 38,1 cm de haut, 11,43 cm à l'endroit le plus bombé, 5,7cm à la base.

function creation_quille(X,Y,scene) { //Permet de créer une quille aux coordonnées (X,Y,0)

    let nbPts = 100;//nbe de pts de la courbe de Bezier
    let epaiB = 5;//epaisseur de la courbe de Bezier
    let nbPtCB = 50;//nombre de points sur la courbe de Bezier
    let nbePtRot = 150;// nbe de points sur les cercles
    let dimPt = 0.02;

    //1ère Lathe
    //Points de contrôle
    let P0 = new THREE.Vector3(0, 0, 0);
    let P1 = new THREE.Vector3(0.07, -0.03, 0);
    let P2 = new THREE.Vector3(0.12, 0.1, 0);
    let P3 = new THREE.Vector3(0.1, 0.18, 0);

    let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "#FFFFFF", false);

    //2ème Lathe
    //Points de contrôle
    let pente1 = (P2.y-P3.y) / (P2.x-P3.x);
    let ord1 = (P2.y) - pente1*(P2.x);
    let C0 = P3;
    let C1 = new THREE.Vector3((0.23-ord1)/pente1, 0.23, 0);
    let C2 = new THREE.Vector3(0.05, 0.26, 0);
    let C3 = new THREE.Vector3(0.03,0.28, 0);

    let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#FF0000", false);

    //3ème Lathe
    //Points de contrôle
    pente1 = (C2.y-C3.y) / (C2.x-C3.x);
    ord1 = (C2.y) - pente1*(C2.x);
    let D0 = C3;
    let D1 = new THREE.Vector3((0.3-ord1)/pente1, 0.3, 0);
    let D2 = new THREE.Vector3(0.12, 0.36, 0);
    let D3 = new THREE.Vector3(0, 0.4, 0);

    let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FFFFFF", false);

    //Visualisation des courbes de Bézier (avec les points) des lathes

    //tracePt(scene, P0, "#4800ff", dimPt, true);
    // tracePt(scene, P1, "#008888", dimPt, true);
    // tracePt(scene, P2, "#008888", dimPt, true);
    //tracePt(scene, P3, "#FF0000", dimPt, true);
    // let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3, nbPts, "#008888", epaiB);
    // scene.add(cbeBez1);

    // tracePt(scene, C1, "#296fd2", dimPt, true);
    // tracePt(scene, C2, "#296fd2", dimPt, true);
    //tracePt(scene, C3, "#FF0000", dimPt, true);
    // let cbeBez2 = TraceBezierCubique(C0, C1, C2, C3, nbPts, "#296fd2", epaiB);
    // scene.add(cbeBez2);

    // tracePt(scene, D1, "#d99214", dimPt, true);
    // tracePt(scene, D2, "#d99214", dimPt, true);
    //tracePt(scene, D3, "#4800ff", dimPt, true);
    // let cbeBez3 = TraceBezierCubique(D0, D1, D2, D3, nbPts, "#d99214", epaiB);
    // scene.add(cbeBez3);

    // let repx1 = new THREE.Vector3(0.1,0,0);
    // tracePt(scene,repx1,"#000000",0.01,true);
    // let repy1 = new THREE.Vector3(0,0.1,0);
    // tracePt(scene,repy1,"#000000",0.01,true);

    //Placement des lathes sur la scène

    lathe1.castShadow = true;
    lathe2.castShadow = true;
    lathe3.castShadow = true;
    lathe1.receiveShadow = true;
    lathe2.receiveShadow = true;
    lathe3.receiveShadow = true;

    lathe1.position.set(X, Y, 0);
    lathe1.rotation.set(Math.PI / 2, 0, 0);
    lathe2.position.set(X, Y, 0);
    lathe2.rotation.set(Math.PI/2, 0, 0);
    lathe3.position.set(X, Y, 0);
    lathe3.rotation.set(Math.PI/2 , 0, 0);

    let grp = new THREE.Group();
    grp.add(lathe1);
    grp.add(lathe2);
    grp.add(lathe3);

    return grp;
}