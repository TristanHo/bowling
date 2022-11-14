const borneVue=6;


function init(){
    var stats = initStats();
    let rendu = new THREE.WebGLRenderer({ antialias: true });
    rendu.shadowMap.enabled = true;
    let scene = new THREE.Scene();
    let result;
    let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
    rendu.shadowMap.enabled = true;
    rendu.setClearColor(new THREE.Color(0xFFFFFF));
    rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
    cameraLumiere(scene,camera);
    lumiere(scene);
    repere(scene);


    //********************************************************
    //  DEBUT MENU GUI
    //********************************************************
    var gui = new dat.GUI();

    let menuGUI = new function () {
        this.cameraxPos = 6;
        this.camerayPos = 0.1;
        this.camerazPos =-4;
        this.cameraZoom = -5.65;
        this.cameraxDir = 0;
        this.camerayDir = 0;
        this.camerazDir = 0;


        this.actualisation = function () {
            posCamera();
            reAffichage();
        };
    };
    ajoutCameraGui(gui,menuGUI,camera)
    gui.add(menuGUI, "actualisation");
    menuGUI.actualisation();

    //********************************************************
    //  FIN MENU GUI
    //********************************************************
    renduAnim();

    //********************************************************
    //   DEBUT PLAN SOL
    //********************************************************
    const largPlan = 19.156;
    const hautPlan = 1.05;
    const nbSegmentLarg = 10;
    const nbSegmentHaut = 10;
    const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
    const PlanSol = surfPhong(PlanSolGeometry,"#4a2d67",1,true,"#FFFFFF");
    PlanSol.receiveShadow = true;
    PlanSol.castShadow = true;
    scene.add(PlanSol);
    //********************************************************
    //   FIN PLAN SOL
    //********************************************************

    //********************************************************
    //   DEBUT SPHERE
    //********************************************************
    let sphereGeometry = new THREE.SphereGeometry(0.108, 130, 160);
    let sphere = surfPhong(sphereGeometry,"#FFFF00",1,true,"#FFFF00");
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(10, 0, 0.11);
    scene.add(sphere);

    //********************************************************
    //   FIN SPHERE
    //********************************************************

    //********************************************************
    //   DEBUT QUILLES
    //********************************************************


    function creation_quille(X,Y) { //Permet de créer une quille aux coordonnées (X,Y,0)
        let nbPts = 100;//nbe de pts de la courbe de Bezier
        let epaiB = 5;//epaisseur de la courbe de Bezier
        let nbPtCB = 50;//nombre de points sur la courbe de Bezier
        let nbePtRot = 150;// nbe de points sur les cercles
        let dimPt = 0.02;

        //1ère Lathe
        //Points de contrôle et courbe de Bézier
        let P0 = new THREE.Vector3(0.06, 0, 0);
        let P1 = new THREE.Vector3(0.03, 0.28, 0);
        let P2 = new THREE.Vector3(0.02, 0.28, 0);
        let P3 = new THREE.Vector3(0, 0.07, 0);
        // tracePt(scene, P0, "#FFFFFF", dimPt, true);
        // tracePt(scene, P1, "#000000", dimPt, true);
        // tracePt(scene, P2, "#008888", dimPt, true);
        // tracePt(scene, P3, "#FF0000", dimPt, true);
        let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3, nbPts, "#FF00FF", epaiB);
        //scene.add(cbeBez1);
        let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "#FFFFFF", 1, false);

        //2ème Lathe
        //Points de contrôle et courbe de Bézier
        let C0 = new THREE.Vector3(0.06, 0, 0);
        let C1 = new THREE.Vector3(0.015, 0.23, 0);
        let C2 = new THREE.Vector3(0.02, 0.23, 0);
        let C3 = new THREE.Vector3(0, 0.07, 0);
        // tracePt(scene, C0, "#FFFFFF", dimPt, true);
        // tracePt(scene, C1, "#000000", dimPt, true);
        // tracePt(scene, C2, "#008888", dimPt, true);
        // tracePt(scene, C3, "#FF0000", dimPt, true);
        let cbeBez2 = TraceBezierCubique(C0, C1, C2, C3, nbPts, "#FF00FF", epaiB);
        //scene.add(cbeBez2);
        let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#bd6c14", 1, false);

        //3ème Lathe
        //Points de contrôle et courbe de Bézier
        let D0 = new THREE.Vector3(0.023, 0, 0);
        let D1 = new THREE.Vector3(0.04, 0.1, 0);
        let D2 = new THREE.Vector3(0.04, 0.1, 0);
        let D3 = new THREE.Vector3(-0.01, 0.10, 0);
        // tracePt(scene, D0, "#FFFFFF", dimPt, true);
        // tracePt(scene, D1, "#000000", dimPt, true);
        // tracePt(scene, D2, "#008888", dimPt, true);
        // tracePt(scene, D3, "#FF0000", dimPt, true);
        let cbeBez3 = TraceBezierCubique(D0, D1, D2, D3, nbPts, "#00FFFF", epaiB);
        //scene.add(cbeBez3);
        let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FFFFFF", 1, false);

        //Placement et affichage des lathes sur la scène
        lathe1.position.set(X, Y, 0.2);
        lathe1.rotation.set(-Math.PI / 2, 0, 0);
        scene.add(lathe1);
        lathe2.position.set(X, Y, 0.2);
        lathe2.rotation.set(Math.PI / 2, 0, 0);
        scene.add(lathe2);
        lathe3.position.set(X, Y, 0.38);
        lathe3.rotation.set(Math.PI / 2, 0, 0);
        scene.add(lathe3);
    }

    let quilles_etat = [[true,-9.3,0.45], [true,-9.3,0.15], [true,-9.3,-0.15], [true,-9.3,-0.45], [true,-9,0.3], [true,-9,0], [true,-9,-0.3], [true,-8.6,0.15], [true,-8.6,-0.15], [true,-8.3,0]];

    function affichage_quillles(tab){
        for(let k=0;k<tab.length;k+=1){
            if(tab[k][0] == true) {
                creation_quille(tab[k][1], tab[k][2]);
            }
        }
    }

    affichage_quillles(quilles_etat);

    //********************************************************
    //   FIN QUILLES
    //********************************************************

    //********************************************************
    //   DEBUT GOUTIERE
    //********************************************************
    let rayon1 = 0.125;
    let rayon2 = 0.125;
    let hauteur = 19.156;
    let nbePtsCercle = 60;
    let nbePtsGenera = 2;
    let bolOuvert = true;
    let theta0 = 0.5*Math.PI;
    let thetaLg =  Math.PI;
    let CylConeGeom = new THREE.CylinderGeometry(rayon1, rayon2, hauteur, nbePtsCercle, nbePtsGenera, bolOuvert, theta0, thetaLg);
    let goutiereD = new surfPhong(CylConeGeom, "#FFFF00", 1, true, "#FFFF00");
    let goutiereG = new surfPhong(CylConeGeom, "#FFFF00", 1, true, "#FFFF00");
    goutiereD.receiveShadow= true;
    goutiereD.castShadow = true;
    goutiereG.receiveShadow= true;
    goutiereG.castShadow = true;
    goutiereD.position.set(0, 0.650 , 0);
    goutiereG.position.set(0, -0.650 , 0);
    goutiereD.rotateZ(0.5*Math.PI);
    goutiereG.rotateZ(0.5*Math.PI);
    scene.add(goutiereD);
    scene.add(goutiereG);


    //********************************************************
    //   FIN GOUTIERE

    //********************************************************
    function posCamera(){
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
    }

    document.getElementById("principal").appendChild(rendu.domElement);

    rendu.render(scene, camera);

    function reAffichage() {
        setTimeout(function () {
            posCamera();
        }, 200);
        rendu.render(scene, camera);
    }


    function renduAnim() {
        stats.update();
        requestAnimationFrame(renduAnim);
        rendu.render(scene, camera);
    }

} // fin fonction init()
