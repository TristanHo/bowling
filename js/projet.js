const borneVue=6;
let coul_equip1 = "#FF0000";
let coul_equip2 = "#0000FF";
let position_dep = [10,0,0.11]; //Point de départ de la boule
const ptDep = new THREE.Vector3(10,0,0.11);


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
    let segmentrac ;

    //********************************************************
    //  DEBUT MENU GUI
    //********************************************************
    var gui = new dat.GUI();

    let menuGUI = new function () {
        this.cameraxPos = -6;
        this.camerayPos = 0;
        this.camerazPos =-0.9;
        this.cameraZoom = -3.3;
        this.cameraxDir = -0.11;
        this.camerayDir = -0.11;
        this.camerazDir = 0;
        this.choixLancer="";
        this.viser = 0 ;
        this.lancer= function lancer() {
            // lancer si type de lancer choisi

            if (menuGUI.choixLancer == "rect" || menuGUI.choixLancer == "bez") {
                document.getElementById("res").innerHTML += 1;
                let pointDep = new THREE.Vector3(10, 0, 0.11);//Point de départ de la boule
                let pointArr = new THREE.Vector3(-9.58, menuGUI.viser, 0);
                if (menuGUI.choixLancer == "rect")
                    pts_position_boule = traj_droite(pointDep, pointArr);
                else {//cas de trajectoir de bezier
                    //pts_position_boule = traj_droite(ptDep,ptArrivee);
                }
                //faire lancer en donnant le bon tableau
                k = 0
                lancerpos(pts_position_boule);


            }
        }

        this.actualisation = function () {
            posCamera();
            reAffichage();
        };
    };
    ajoutCameraGui(gui,menuGUI,camera)

    let guiJeu =gui.addFolder("Jeu");
    //choix entre lancer rectiligne et lancer avec la courbe de bezier
    guiJeu.add(menuGUI,"choixLancer",["rect","bez"]).onChange(function(){

    });

    guiJeu.add(menuGUI,"viser",-2,2).onChange(function(){
        let pointDep = new THREE.Vector3(10, 0, 0.11);//Point de départ de la boule
        let pointArr = new THREE.Vector3(-9.58,  menuGUI.viser,0);
        if (menuGUI.choixLancer=="rect"){
            if (segmentrac)
                scene.remove(segmentrac);
            segmentrac = segment(scene,pointDep,pointArr,0xFF0000,4);
            scene.add(segmentrac);
        }
        else
        if(menuGUI.choixLancer=="bez"){

        }


    });
    guiJeu.add(menuGUI,"lancer");
    menuGUI.lancer();

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


    function creation_quille(X,Y,bool) { //Permet de créer une quille aux coordonnées (X,Y,0)
        let nbPts = 100;//nbe de pts de la courbe de Bezier
        let epaiB = 5;//epaisseur de la courbe de Bezier
        let nbPtCB = 50;//nombre de points sur la courbe de Bezier
        let nbePtRot = 150;// nbe de points sur les cercles
        let dimPt = 0.02;
        //QUILLE : 38,1 cm de haut, 11,43 cm à l'endroit le plus bombé, 5,7cm à la base.
        //1ère Lathe

        //Points de contrôle et courbe de Bézier
        //20 cm de hauteur, 11 cm de largeur partie milieu haute, 5 cm à la base
        let P0 = new THREE.Vector3(0.1, 0, 0);
        let P1 = new THREE.Vector3(0.06, 0.25, 0);
        let P2 = new THREE.Vector3(0.05, 0.25, 0);
        let P3 = new THREE.Vector3(0, 0.24, 0);
        // tracePt(scene, P0, "#FFFFFF", dimPt, true);
        // tracePt(scene, P1, "#000000", dimPt, true);
        // tracePt(scene, P2, "#008888", dimPt, true);
        // tracePt(scene, P3, "#FF0000", dimPt, true);
        let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3, nbPts, "#FF00FF", epaiB);
        scene.add(cbeBez1);
        let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "#FFFFFF", 1, false);

        //2ème Lathe
        //Points de contrôle et courbe de Bézier
        let pente1 = (P2.y-P3.y) / (P2.x-P3.x);
        let ord1 = (P2.y) - pente1*(P2.x);
        let C0 = P3;
        let C1 = new THREE.Vector3(-0.1, (pente1*(-0.1)+ord1), 0);
        let C2 = new THREE.Vector3(-0.04, -0.35, 0);
        let C3 = new THREE.Vector3(-0.1,0, 0);
        // tracePt(scene, C1, "#000000", dimPt, true);
        // tracePt(scene, C2, "#008888", dimPt, true);
        // tracePt(scene, C3, "#FF0000", dimPt, true);
        let cbeBez2 = TraceBezierCubique(C0, C1, C2, C3, nbPts, "#FF00FF", epaiB);
        scene.add(cbeBez2);
        let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#bd6c14", 1, false);

        //3ème Lathe
        //Points de contrôle et courbe de Bézier
        pente1 = (C2.y-C3.y) / (C2.x-C3.x);
        ord1 = (C2.y) - pente1*(C2.x);
        let D0 = C3;
        let D1 = new THREE.Vector3((-0.2 - ord1)/pente1, -0.2, 0);
        let D2 = new THREE.Vector3(0.24, 0.25, 0);
        let D3 = new THREE.Vector3(0, 0.25, 0);
        // tracePt(scene, D1, "#000000", dimPt, true);
        // tracePt(scene, D2, "#008888", dimPt, true);
        // tracePt(scene, D3, "#FF0000", dimPt, true);
        let cbeBez3 = TraceBezierCubique(D0, D1, D2, D3, nbPts, "#00FFFF", epaiB);
        scene.add(cbeBez3);
        let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FFFFFF", 1, false);

        //Placement des lathes sur la scène
        lathe1.castShadow = true;
        lathe2.castShadow = true;
        lathe3.castShadow = true;
        lathe1.receiveShadow = true;
        lathe2.receiveShadow = true;
        lathe3.receiveShadow = true;

        lathe1.position.set(X, Y, 0.25);
        lathe1.rotation.set(-Math.PI / 2, 0, 0);
        lathe2.position.set(X, Y, 0.25);
        lathe2.rotation.set(-Math.PI/2, 0, 0);
        lathe3.position.set(X, Y, 0.25);
        lathe3.rotation.set(Math.PI/2 , 0, 0);
        let grp = new THREE.Group();
        grp.add(lathe1);
        grp.add(lathe2);
        grp.add(lathe3);
        function parallepipede(x,y){
            let arete = 0.01; //taille côté parallepipede
            let largSegments = 1;
            let hautSegments = 1;
            let profSegments = 1;
            let geo = new THREE.BoxGeometry(arete,arete,arete,largSegments,hautSegments,profSegments);
            let para = surfPhong(geo, "#000000", 1, true, "#000000");
            para.castShadow = false;
            para.position.set(x,y,0.1);
            return para;
        }
        let quille_chute = parallepipede(X,Y);
        if(bool)
            return grp;
        else{
            return quille_chute;
        }
    }
    let quilles_etat = [[true,-9.3,0.45],
        [true,-9.3,0.15],
        [true,-9.3,-0.15],
        [true,-9.3,-0.45],
        [true,-9,0.3],
        [true,-9,0],
        [true,-9,-0.3],
        [true,-8.6,0.15],
        [true,-8.6,-0.15],
        [true,-8.3,0]];

    let quille1 = creation_quille(-9.3,0.45,quilles_etat[0][0]);
    let quille2 = creation_quille(-9.3,0.15,quilles_etat[1][0]);
    let quille3 = creation_quille(-9.3,-0.15,quilles_etat[2][0]);
    let quille4 = creation_quille(-9.3,-0.45,quilles_etat[3][0]);
    let quille5 = creation_quille(-9,0.3,quilles_etat[4][0]);
    let quille6 = creation_quille(-9,0,quilles_etat[5][0]);
    let quille7 = creation_quille(-9,-0.3,quilles_etat[6][0]);
    let quille8 = creation_quille(-8.6,0.15,quilles_etat[7][0]);
    let quille9 = creation_quille(-8.6,-0.15,quilles_etat[8][0]);
    let quille10 = creation_quille(-8.3,0,quilles_etat[9][0]);

    let tab_quilles = [quille1,quille2,quille3,quille4,quille5,quille6,quille7,quille8,quille9,quille10];

    function affichage_quilles(){
        for (let k=0;k<tab_quilles.length;k++){
            if(tab_quilles[k]){
                scene.remove(tab_quilles[k]);
            }
            if(quilles_etat[k][0] == true){
                tab_quilles[k] = creation_quille(quilles_etat[k][1],quilles_etat[k][2],true);
            }
            else{
                tab_quilles[k] = creation_quille(quilles_etat[k][1],quilles_etat[k][2],false);
            }
            scene.add(tab_quilles[k]);
        }
    }

    affichage_quilles();

    function verif_quilles(x,y){
        let R_quilles = 0.1;
        let R_lim = R_quilles + rayon_boule;
        let cpt = 0;
        for(let i = 0;i < quilles_etat.length;i++){
            if(quilles_etat[i][0] == true){
                let xq = quilles_etat[i][1];
                let yq = quilles_etat[i][2];
                let Lx = xq - x;
                let Ly = yq - y;
                let d = Math.sqrt(Lx*Lx + Ly*Ly);
                if(d <= R_lim){
                    quilles_etat[i][0] = false;
                    cpt += 1;
                }
            }
        }
        return cpt;
    }

    //********************************************************
    //   FIN QUILLES
    //********************************************************


    //********************************************************
    //   DEBUT TRAJECTOIRE
    //********************************************************

    // //Trajectoire rectiligne
    //     // function droite(A,B){
    //     //     let a = ((B.y-A.y) / (B.x-A.x));
    //     //     let b = (A.y) - a*(A.x);
    //     //     return [a,b];
    //     // }
    //     // let ptA = new THREE.Vector3(10,0,0.11);
    //     // let ptB = new THREE.Vector3(-8.6,-0.15,0.11);
    //     // let [pente,ord] = droite(ptA,ptB);

    let ptB = new THREE.Vector3(-8.6,-1,0.11);

    let pts_position_boule = [];

    //Trajectoire rectiligne (renvoie le tableau de points pour la boule)
    function traj_droite(A,B){
        let a = ((B.y-A.y) / (B.x-A.x));
        let b = (A.y) - a*(A.x);
        let nbPtstab = 50;
        let pas = (largPlan+1)/nbPtstab; //longueur piste (+1 pour que la boule aille un peu au-delà) divisé par nbPts souhaité pour tableau de trajectoire
        let trajectoire = [[position_dep[0],position_dep[1],position_dep[2]]];
        let lim_gout_pos = 0.650-0.125;
        let lim_gout_neg = -lim_gout_pos;
        let zpos = 0.11;
        for(let i = 1; i <= nbPtstab; i++){
            let xpos = trajectoire[trajectoire.length - 1][0] - pas;
            let ypos = xpos * a + b;
            let zpos = 0.11;
            if(ypos > lim_gout_pos){
                if(ypos>=0.650){
                    ypos = 0.650;
                    zpos = 0;
                }
            }
            if(ypos < lim_gout_neg){
                if(ypos<=-0.650){
                    ypos = -0.650;
                    zpos = 0;
                }
            }
            trajectoire.push([xpos,ypos,zpos]);
        }
        return trajectoire;
    }

    function choix_traj(choix,ptArrivee){
        if(choix.toString() == "rectiligne"){
            pts_position_boule = traj_droite(ptDep,ptArrivee);
        }
        if(choix == "Bezier"){
            //pts_position_boule = pts2CbeBez(ptDep,cbe1pc1,cbe1pc2,joint,cbe2pc1,cbe2pc2);
        }
    }
    //********************************************************
    //   FIN TRAJECTOIRE
    //********************************************************
    //********************************************************
    //   DEBUT Lancer
    //********************************************************
    function lancerpos(pts_position_boule){
        setTimeout(function () {
            //document.getElementById("res").innerHTML += pts_position_boule;
            //document.getElementById("res").innerHTML += 2;
            let score = 0;
            posCamera();
            if(boule) scene.remove(boule);
            if(Cbe) scene.remove(Cbe);
            let coordx = pts_position_boule[k][0];
            let coordy = pts_position_boule[k][1];
            let coordz = 0.11;
            [boule, Cbe] = creation_boule(coul_equip1, coul_equip2, coordx, coordy, coordz);
            score = verif_quilles(coordx,coordy);
            if(score != 0){
                affichage_quilles();
            }
            scene.add(boule);
            scene.add(Cbe);
            if(k<pts_position_boule.length /*& jeu*/) {
                //if (boule) scene.remove(boule);
                //if (Cbe) scene.remove(Cbe);
                k+=1;
                lancerpos(pts_position_boule);
            }
        }, 25);
        rendu.render(scene, camera);
    }
    //********************************************************
    //   FIN PLAN Lancer
    //********************************************************

    //********************************************************
    //   DEBUT JOUER PARTIE
    //********************************************************
    let jeu = false;
    let tir = 0; //4 tirs max dans la partie
    let score_eq = 0;
    let choix_test = "rectiligne";
    //mettre en place sur bouton gui "lancer" la fonction jouer
    function jouer(choix,ptArrivee,boule,quilles_etat){
        if(tir < 4) {
            choix_traj(choix, ptArrivee);
            jeu = true;
            let score = 0; //compter les chutes de quille
            // while (jeu) {
            //     reAffichage();
            //     //verif_quilles(boule,quilles_etat); qui pourait renvoyer le score
            // }
            //ajustement des scores
            if(score == 10) {
                tir = 2; //si strike
                score_eq = 30;
            }
            else{
                if(score == 5){
                    score_eq = 15;
                    tir++;
                }
                else{
                    score_eq = score;
                    tir++;
                }
            }
            //actualisation_scores(id de l'équipe actuelle);
            /*
            if(tir%2 == 0)
                reset(); //remise en place de la piste initiale
                switch_team(); //changer les couleurs, l'id d'écriture du score, etc
             */
        }
    }

    //********************************************************
    //   FIN JOUER PARTIE
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

    //document.getElementById("res").innerHTML += (traj_droite(ptDep,ptB)).toString();

    let k = 0;
    pts_position_boule = traj_droite(ptDep,ptB);
    //jouer(choix_test,0,ptB,boule,quilles_etat);
    function reAffichage() {
        setTimeout(function () {
            posCamera();
            /*if (boule) scene.remove(boule);
            if (Cbe) scene.remove(Cbe);
            let coordx = pts_position_boule[k][0];
            let coordy = pts_position_boule[k][1];
            let coordz = pts_position_boule[k][2];
            [boule, Cbe] = creation_boule(coul_equip1, coul_equip2, coordx, coordy, coordz);
            scene.add(boule);
            scene.add(Cbe);
            if(k<pts_position_boule.length & jeu) {
                //if (boule) scene.remove(boule);
                //if (Cbe) scene.remove(Cbe);
                k++;
                reAffichage();
            }*/
        }, 200);//pour final, mettre 10 de TIMEOUT
        rendu.render(scene, camera);
    }


    function renduAnim() {
        stats.update();
        requestAnimationFrame(renduAnim);
        rendu.render(scene, camera);
    }

} // fin fonction init()
