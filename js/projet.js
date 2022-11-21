const borneVue=6;
let coul_equip1 = "#FF0000";
let coul_equip2 = "#0000FF";
let trajectoire;
let position_dep = [10,0,0.11]; //Point de départ de la boule


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
        this.cameraxPos = -6;
        this.camerayPos = 0.1;
        this.camerazPos =-5;
        this.cameraZoom = -6;
        this.cameraxDir = -1.9;
        this.camerayDir = -1.6;
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
    function creation_boule ( coul1 , coul2, x,y,z ) {
        //Sphere
        let sphereGeometry = new THREE.SphereGeometry(rayon_boule, 130, 160);
        let sphere = surfPhong(sphereGeometry, coul1, 1, true, coul1);
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
    let [boule,Cbe] = creation_boule(coul_equip1, coul_equip2,10,0,0.11);
    scene.add(boule);
    scene.add(Cbe);

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
        let C0 = new THREE.Vector3(P3.x, P3.y, P3.z);
        let C1 = new THREE.Vector3(0.02, 0.28, 0);
        let C2 = new THREE.Vector3(0.04, 0.23, 0);
        let C3 = new THREE.Vector3(0.06, 0, 0);
        // tracePt(scene, C0, "#FFFFFF", dimPt, true);
        // tracePt(scene, C1, "#000000", dimPt, true);
        // tracePt(scene, C2, "#008888", dimPt, true);
        // tracePt(scene, C3, "#FF0000", dimPt, true);
        let cbeBez2 = TraceBezierCubique(C0, C1, C2, C3, nbPts, "#FF00FF", epaiB);
        //scene.add(cbeBez2);
        let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#bd6c14", 1, false);

        //3ème Lathe
        //Points de contrôle et courbe de Bézier
        let D0 = new THREE.Vector3(P3.x, P3.y, P3.z);
        let D1 = new THREE.Vector3(0.06, 0.08, 0);
        let D2 = new THREE.Vector3(0.04, 0, 0);
        let D3 = new THREE.Vector3(0.035, 0.0, 0);
        // tracePt(scene, D0, "#FFFFFF", dimPt, true);
        // tracePt(scene, D1, "#000000", dimPt, true);
        // tracePt(scene, D2, "#008888", dimPt, true);
        // tracePt(scene, D3, "#FF0000", dimPt, true);
        let cbeBez3 = TraceBezierCubique(D0, D1, D2, D3, nbPts, "#00FFFF", epaiB);
        //scene.add(cbeBez3);
        let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FFFFFF", 1, false);

        //Placement et affichage des lathes sur la scène
        lathe1.castShadow = true;
        lathe2.castShadow = true;
        lathe3.castShadow = true;
        lathe1.receiveShadow = true;
        lathe2.receiveShadow = true;
        lathe3.receiveShadow = true;

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

    function parallepipede(x,y){
        let arete = 0.08;
        let largSegments = 1;
        let hautSegments = 1;
        let profSegments = 1;
        let geo = new THREE.BoxGeometry(arete,arete,arete,largSegments,hautSegments,profSegments);
        let para = surfPhong(geo, "#000000", 1, true, "#000000");
        para.castShadow = false;
        para.position.set(x,y,0.1);
        scene.add(para);
    }
    let quilles_etat = [[true,-9.3,0.45], [true,-9.3,0.15], [true,-9.3,-0.15], [true,-9.3,-0.45], [true,-9,0.3], [true,-9,0], [true,-9,-0.3], [true,-8.6,0.15], [false,-8.6,-0.15], [true,-8.3,0]];

    function affichage_quillles(tab){
        for(let k=0;k<tab.length;k+=1){
            if(tab[k][0] == true) {
                creation_quille(tab[k][1], tab[k][2]);
            }
            else{
                parallepipede(tab[k][1], tab[k][2]);
            }

        }
    }

    affichage_quillles(quilles_etat);

    //********************************************************
    //   FIN QUILLES
    //********************************************************


    //********************************************************
    //   DEBUT TRAJECTOIRE
    //********************************************************

    //Trajectoire rectiligne
    function droite(A,B){
        let a = ((B.y-A.y) / (B.x-A.x));
        let b = (A.y) - a*(A.x);
        return [a,b];
    }
    let ptA = new THREE.Vector3(10,0,0.11);
    let ptB = new THREE.Vector3(-8.6,-0.15,0.11);
    let [pente,ord] = droite(ptA,ptB);
    //********************************************************
    //   FIN TRAJECTOIRE
    //********************************************************


    //********************************************************
    //   DEBUT GOUTTIERE
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
    //   FIN GOUTTIERE
    //********************************************************
    function posCamera(){
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
    }

    document.getElementById("principal").appendChild(rendu.domElement);

    rendu.render(scene, camera);

    document.getElementById("res").innerHTML += "1";

    let tps = 0;
    let position = position_dep;
    function reAffichage() {
        setTimeout(function () {
            //if(boule) scene.remove(boule);
            posCamera();
            if(boule) scene.remove(boule);
            position[0]-= 0.1;
            position[1] = position[0]*pente + ord;
            boule = creation_boule(coul_equip1,coul_equip2,position[0],position[1],position[2])[0];
            scene.add(boule);
            //document.getElementById("res").innerHTML += position[1];
            if(tps<1){
                reAffichage();
                if(boule) scene.remove(boule);
                position[0]-=0.1;
                boule = creation_boule(coul_equip1,coul_equip2,position[0],position[1],position[2])[0];
                scene.add(boule);
                tps++;
            }

        }, 200);
        rendu.render(scene, camera);
    }


    function renduAnim() {
        stats.update();
        requestAnimationFrame(renduAnim);
        rendu.render(scene, camera);
    }

} // fin fonction init()
