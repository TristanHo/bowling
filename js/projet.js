const borneVue=6;
const largPlan = 19.156; //largeur de la piste
let coul_equip1 = "#00e2ff"; //couleur de l'équipe 1
let coul_equip2 = "#831946"; //couleur de l'équipe 2

let pointDep = new THREE.Vector3(10,0,0.11); //Point de départ de la boule

//Initialisation des variables pour dessiner les trajectoires lors du choix
let cbbez1;
let cbbez2;
let segmentrac;
let tabpoint_bez;

//initialisation des points de courbes de Bézier du lancer
let sphereGeometry = new THREE.SphereGeometry(0.1,12,24);
let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00 });
//préparation pour afficher les points pour la courbe de Bézier
let p1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
let p2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
let pcentre = new THREE.Mesh(sphereGeometry, sphereMaterial);
//z à 0.11 milieu de la boule
let pointArr= new THREE.Vector3(-10,0,0.11);
let pb1= new THREE.Vector3(5,0.25,0.11);
let pb2= new THREE.Vector3(10,0,0.11);
let pbc= new THREE.Vector3(0,0,0.11);
//initialisation gestion mene...

//Variables pour la partie
let tir = 2; //Nombre de tirs restant à l'équipe courante
let mene = 0; //Mène actuelle (sur les 4)
let score_tir = 0; //Score du tir
let score_eq_courante = 0; //Score de l'équipe actuelle dans la mène actuelle
let indice_dep = 0; //Indice du point actuelle dans le tableau de la trajectoire de la boule
let fin_partie = false;



function init(){

    var stats = initStats();
    let rendu = new THREE.WebGLRenderer({ antialias: true });
    rendu.shadowMap.enabled = true;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
    rendu.shadowMap.enabled = true;
    rendu.setClearColor(new THREE.Color(0xFFFFFF));
    rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
    cameraLumiere(scene,camera);
    lumiere(scene);


    //********************************************************
    //  DEBUT MENU GUI
    //********************************************************
    var gui = new dat.GUI();

    let menuGUI = new function () {
        this.cameraxPos = -6;
        this.camerayPos = 0.01;
        this.camerazPos =-1;
        this.cameraZoom = -3.3;
        this.cameraxDir = 0;
        this.camerayDir = 0;
        this.camerazDir = 0;
        this.choixLancer="rect";
        this.viser = 0 ;
        this.pointArrive=0;//test

        this.lancer= function lancer(){
            // lancer si type de lancer choisi

            if (menuGUI.choixLancer=="rect" || menuGUI.choixLancer=="bez" ){
                pts_position_boule=[];
                if (menuGUI.choixLancer=="rect") {
                    pts_position_boule = traj_droite(pointDep, pointArr);
                    if (segmentrac) scene.remove(segmentrac);
                }
                else{
                    if(menuGUI.choixLancer=="bez") {
                        pts_position_boule = verif_bezier(tabpoint_bez);
                        if(cbbez1) scene.remove(cbbez1);
                        if(cbbez2) scene.remove(cbbez2);
                        if(p1) scene.remove(p1);
                        if(p2) scene.remove(p2);
                        if(pcentre) scene.remove(pcentre);
                    }
                }
                //faire lancer en donnant le bon tableau
                lancerpos(pts_position_boule,false);


            }

        };

        this.strike = function strike(){ //bouton strike pour montrer que le comptage des scores fonctionne bien

            if (menuGUI.choixLancer=="rect" || menuGUI.choixLancer=="bez" ){
                pts_position_boule=[];
                if (menuGUI.choixLancer=="rect") {
                    pts_position_boule = traj_droite(pointDep, pointArr);
                    if (segmentrac) scene.remove(segmentrac);
                }
                else{
                    if(menuGUI.choixLancer=="bez") {
                        pts_position_boule = verif_bezier(tabpoint_bez);
                        if (cbbez1) scene.remove(cbbez1);
                        if (cbbez2) scene.remove(cbbez2);
                        if (p1) scene.remove(p1);
                        if (p2) scene.remove(p2);
                        if (pcentre) scene.remove(pcentre);
                    }
                }

                lancerpos(pts_position_boule,true);

            }
        };

        //Coordonnées des points pour le lancer non-rectiligne
        this.pointDepart=0;
        //Point de contrôle de la 1ère courbe de Bézier
        this.point1x=5;
        this.point1y=-0.25;
        //Jointure entre les deux courbes
        this.pcentrex=0;
        this.pcentrey=0;
        //Distance du second point de contrôle par rapport à la jointure
        this.distpoint2=1;

        this.actualisation= function () {
            posCamera();
            reAffichage();
        };
    };

    ajoutCameraGui(gui,menuGUI,camera)
    let guiJeu =gui.addFolder("Jeu");
    let guiBezier =gui.addFolder("Bezier");

    //choix entre lancer rectiligne et lancer avec la courbe de bezier

    guiJeu.add(menuGUI,"choixLancer",["rect","bez"]).onChange(function(){

        if(menuGUI.choixLancer=="rect"){
            if (p1)
                scene.remove(p1);
            if (p2)
                scene.remove(p2);
            if (pcentre)
                scene.remove(pcentre);
            if(cbbez1)
                scene.remove(cbbez1);
            if(cbbez2)
                scene.remove(cbbez2);
            guiBezier.close();
        }

        if(menuGUI.choixLancer=="bez"){
            if(segmentrac)
                scene.remove(segmentrac);
            guiBezier.open();
            p1.position.set(pb1.x,pb1.y,0.11)

            pb2.x=pbc.x+1*(pbc.x-pb1.x);
            pb2.y=pbc.y+1*(pbc.y-pb1.y);
            p2.position.set(pb2.x,pb2.y,0.11);
            scene.add(p1);
            scene.add(pcentre);
            scene.add(p2);
            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }

    });

    guiJeu.add(menuGUI,"viser",-2,2).onChange(function(){

        pointArr = new THREE.Vector3(-9.58,  menuGUI.viser,0.11);
        if (menuGUI.choixLancer=="rect"){
            if (segmentrac)
                scene.remove(segmentrac);

            segmentrac = segment(scene,pointDep,pointArr,0xFF0000,4);
            scene.add(segmentrac);
        }
        else
        if(menuGUI.choixLancer=="bez"){
            //tracer la courbe de bezier pour voir le parcours de la boule
            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);

        }


    });
    guiJeu.add(menuGUI,"pointDepart",-0.6,0.6).onChange(function(){
        //afficher la boule au point de depart
        pointDep.y=menuGUI.pointDepart;
        if (menuGUI.choixLancer=="bez") {
            Changement_bezier(scene, pointDep, pbc, pointArr, pb1, pb2);
            boule.position.set(pointDep.x, pointDep.y, 0.11);
            Cbe.position.set(pointDep.x, pointDep.y, 0.11);
        }
        else    //signifie que c'est un lancer rectiligne
        {       //on affiche la droite pour viser
            if (segmentrac)
                scene.remove(segmentrac);
            segmentrac = segment(scene,pointDep,pointArr,0xFF0000,4);
            scene.add(segmentrac);
            //mettre la boule et la cbe au bonne endroit
            boule.position.set(pointDep.x,pointDep.y,0.11);
            Cbe.position.set(pointDep.x,pointDep.y,0.11);
        }


    });
    guiJeu.add(menuGUI,"lancer");
    guiJeu.add(menuGUI,"strike");

    guiBezier.add(menuGUI,"point1x",-9,9).onChange(function(){
        if(menuGUI.choixLancer=="bez"){
            // scene.remove(p1);
            pb1.x=menuGUI.point1x
            p1.position.set(pb1.x,pb1.y,0.11)
            if(pb1.x<pbc.x){
                menuGUI.pcentrex=pb1.x;
                pbc.x=pb1.x;
                pcentre.position.set(pbc.x,pbc.y,0.11)

            }

            pb2.x=pbc.x+menuGUI.distpoint2*(pbc.x-pb1.x);
            if(pb2.x<-9.58){

                pb2.x=-9.58;
                let a =((pbc.y-pb1.y)/(pbc.x-pb1.x))
                pb2.y=(a*(-9.58)+(pb1.y-(a*pb1.x)));
            }

            p2.position.set(pb2.x,pb2.y,0.11);

            scene.add(p1);

            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }
    });
    guiBezier.add(menuGUI,"point1y",-2,2).onChange(function(){

        if(menuGUI.choixLancer=="bez"){
            pb1.y=menuGUI.point1y;
            p1.position.set(pb1.x,pb1.y,0.11)
            pb2.x=pbc.x+menuGUI.distpoint2*(pbc.x-pb1.x);
            if(pb2.x<-9.58)
                pb2.x=-9.58;
            pb2.y=pbc.y+menuGUI.distpoint2*(pbc.y-pb1.y);
            p2.position.set(pb2.x,pb2.y,0.11);

            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }
    });


    guiBezier.add(menuGUI,"pcentrex",-9,9).onChange(function(){

        if(menuGUI.choixLancer=="bez"){
            pbc.x=menuGUI.pcentrex
            pcentre.position.set(pbc.x,pbc.y,0.11)
            if(pbc.x>pb1.x){
                pb1.x=pbc.x;
                p1.position.set(pb1.x,pb1.y,0.11) ;

            }
            pb2.x=pbc.x+menuGUI.distpoint2*(pbc.x-pb1.x);

            pb2.y=pbc.y+menuGUI.distpoint2*(pbc.y-pb1.y);
            if(pb2.x<-9.58){

                pb2.x=-9.58;
                let a =((pbc.y-pb1.y)/(pbc.x-pb1.x))
                pb2.y=(a*(-9.58)+(pb1.y-(a*pb1.x)));
            }
            p2.position.set(pb2.x,pb2.y,0.11);

            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }

    });
    guiBezier.add(menuGUI,"pcentrey",-2,2).onChange(function(){

        if(menuGUI.choixLancer=="bez"){
            pbc.y=menuGUI.pcentrey
            pcentre.position.set(pbc.x,pbc.y,0.11)
            pb2.x=pbc.x+menuGUI.distpoint2*(pbc.x-pb1.x);
            if(pb2.x<-9.58)
                pb2.x=-9.58;

            pb2.y=pbc.y+menuGUI.distpoint2*(pbc.y-pb1.y);

            p2.position.set(pb2.x,pb2.y,0.11);

            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }
    });

    guiBezier.add(menuGUI,"distpoint2",0,9).onChange(function(){
        if(menuGUI.choixLancer=="bez"){
            pb2.x=pbc.x+menuGUI.distpoint2*(pbc.x-pb1.x);


            pb2.y=pbc.y+menuGUI.distpoint2*(pbc.y-pb1.y);
            if(pb2.x<-9.58){
                pb2.x=-9.58;
                let a =((pbc.y-pb1.y)/(pbc.x-pb1.x))
                pb2.y=(a*(-9.58)+(pb1.y-(a*pb1.x)));
            }
            p2.position.set(pb2.x,pb2.y,0.11);

            Changement_bezier(scene,pointDep,pbc,pointArr,pb1,pb2);
        }
    });


    gui.add(menuGUI, "actualisation");
    menuGUI.actualisation();

    //********************************************************
    //  FIN MENU GUI
    //********************************************************

    renduAnim();

    //********************************************************
    //  MISE EN PLACE SCENE
    //********************************************************

    //repere(scene);

    piste(scene);
    gouttieres(scene);
    let [boule, Cbe] = creation_boule(coul_equip1, coul_equip2, pointDep.x, pointDep.y, pointDep.z);
    scene.add(boule);
    scene.add(Cbe);

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

    let quille1 = creation_quille(-9.3,0.45,scene);
    let quille2 = creation_quille(-9.3,0.15,scene);
    let quille3 = creation_quille(-9.3,-0.15,scene);
    let quille4 = creation_quille(-9.3,-0.45,scene);
    let quille5 = creation_quille(-9,0.3,scene);
    let quille6 = creation_quille(-9,0,scene);
    let quille7 = creation_quille(-9,-0.3,scene);
    let quille8 = creation_quille(-8.6,0.15,scene);
    let quille9 = creation_quille(-8.6,-0.15,scene);
    let quille10 = creation_quille(-8.3,0,scene);


    let tab_quilles = [quille1,quille2,quille3,quille4,quille5,quille6,quille7,quille8,quille9,quille10];

    function affichage_quilles(){ //Fonction pour afficher les quilles suivant leur état

        for (let i=0;i<tab_quilles.length;i++){

            if(quilles_etat[i][0] == true){
                scene.add(tab_quilles[i]);
            }
            else{
                scene.remove(tab_quilles[i]);
            }
        }
    }

    affichage_quilles();

    //********************************************************
    //   DEBUT Lancer
    //********************************************************

    function lancerpos(pts_position_boule,strike){

        let timer = setTimeout(function () {

            let chute = 0;
            posCamera();
            let coordx = pts_position_boule[indice_dep][0];
            let coordy = pts_position_boule[indice_dep][1];
            let coordz = pts_position_boule[indice_dep][2];
            boule.position.set(coordx,coordy,coordz);
            Cbe.position.set(coordx,coordy,coordz);
            chute = verif_quilles(coordx,coordy,strike);

            if(chute != 0){
                affichage_quilles();
            }
            if(indice_dep<pts_position_boule.length) {
                indice_dep+=1;
                lancerpos(pts_position_boule,strike);
            }

        }, 25);
        console.log(indice_dep , pts_position_boule.length);
        rendu.render(scene, camera);

        if(indice_dep == pts_position_boule.length){
            clearTimeout(timer);
            score();
            reset_tir();
            indice_dep = 0;
            if (menuGUI.choixLancer=="rect"){
                scene.add(segmentrac);
            }
            if (menuGUI.choixLancer=="bez"){
                scene.add(pcentre);
                scene.add(p1);
                scene.add(p2);
                scene.add(cbbez1);
                scene.add(cbbez2);
            }
            if(fin_partie){
                if (segmentrac) scene.remove(segmentrac);
                if(cbbez1) scene.remove(cbbez1);
                if(cbbez2) scene.remove(cbbez2);
                if(p1) scene.remove(p1);
                if(p2) scene.remove(p2);
                if(pcentre) scene.remove(pcentre);
            }
        }
    }

    //********************************************************
    //   FIN Lancer
    //********************************************************


    //********************************************************
    //   DEBUT FONCTIONS PARTIE
    //********************************************************
    function reset_tir(){

        if(tir == 0){ //changement de l'équipe qui joue
            mene += 1;
            fin_partie = fin();
            let temp = coul_equip1;
            coul_equip1 = coul_equip2;
            coul_equip2 = temp;
            tir = 2;
            score_eq_courante = 0;

            for(let i=0;i<quilles_etat.length;i++){
                quilles_etat[i][0] = true;
            }

            affichage_quilles();
        }

        pts_position_boule = [];
        if(boule) scene.remove(boule);
        if(Cbe) scene.remove(Cbe);

        if(!fin_partie){
            [boule,Cbe] = creation_boule(coul_equip1, coul_equip2, pointDep.x, pointDep.y, pointDep.z);
            scene.add(boule);
            scene.add(Cbe);
        }

    }

    function score(){ //mise à jour des scores

        score_eq_courante += score_tir;

        if(tir == 2 && score_eq_courante == 10){
            score_eq_courante = 30;
            tir = 0;
        }
        else if(tir == 1 && score_eq_courante == 10){
            score_eq_courante = 15;
            tir -= 1;
        }
        else {
            tir -= 1;
        }

        if(mene == 0){
            document.getElementById("reseq1_1").innerHTML = score_eq_courante.toString();
        }
        if(mene == 2){
            document.getElementById("reseq1_2").innerHTML = score_eq_courante.toString();
        }
        if(mene == 1){
            document.getElementById("reseq2_1").innerHTML = score_eq_courante.toString();
        }
        if(mene == 3){
            document.getElementById("reseq2_2").innerHTML = score_eq_courante.toString();
        }
        document.getElementById("tot1").innerHTML = parseInt(document.getElementById("reseq1_1").innerHTML)  + parseInt(document.getElementById("reseq1_2").innerHTML);
        document.getElementById("tot2").innerHTML = parseInt(document.getElementById("reseq2_1").innerHTML)  + parseInt(document.getElementById("reseq2_2").innerHTML);
        score_tir = 0;
    }

    function fin(){ //fin de partie

        let bool = false;

        if(mene == 4){

            bool = true;
            let score_eq1 = parseInt(document.getElementById("tot1").innerHTML);
            let score_eq2 = parseInt(document.getElementById("tot2").innerHTML);

            if( score_eq1 > score_eq2) {
                document.getElementById("res").innerHTML = " L'équipe 1 a gagné " + score_eq1.toString() +" à " + score_eq2.toString() + " !";
            }
            else if(score_eq1 <score_eq2) {
                document.getElementById("res").innerHTML = " L'équipe 2 a gagné " + score_eq2.toString() +" à " + score_eq1.toString() + " !";
            }
            else {
                document.getElementById("res").innerHTML = " Les 2 équipes sont ex-aeqo !";
            }
        }

        return bool;
    }

    //********************************************************
    //   FIN FONCTIONS PARTIE
    //********************************************************

    //********************************************************
    //   DEBUT FONCTIONS CHUTES QUILLES
    //********************************************************

    function verif_quilles(x,y,strike){

        let cpt = 0;

        if(strike){
            if (y <= 0.650 - 0.025 && y >= -0.650 + 0.025) {

                for (let i = 0; i < quilles_etat.length; i++) {
                    if (quilles_etat[i][0] == true) {
                        if (quilles_etat[i][1] >= x) {
                            quilles_etat[i][0] = false;
                            score_tir += 1;
                            cpt += 1;

                        }
                    }
                }
            }
        }

        else{

            let R_quilles = 0.1;
            let R_lim = R_quilles + rayon_boule;


            for(let i = 0;i < quilles_etat.length;i++) {

                if (y <= 0.650 - 0.025 && y >= -0.650 + 0.025) {

                    if (quilles_etat[i][0] == true) {

                        let xq = quilles_etat[i][1];
                        let yq = quilles_etat[i][2];
                        let Lx = xq - x;
                        let Ly = yq - y;
                        let d = Math.sqrt(Lx * Lx + Ly * Ly); //distance entre la quille et la boule
                        if (d <= R_lim) {
                            quilles_etat[i][0] = false;
                            score_tir += 1;
                            chute_quille(x, y, xq, yq);
                            cpt += 1;

                        }
                    }
                }
            }
        }
        return cpt;
    }

    function chute_quille(xb,yb,xq,yq){ //coordonnées boule (ou quille) et quille touchée

        let hauteur_quilles = 0.38;
        //Calcul équation de la droite entre point de la boule (ou quille) et point de la quille qui tombe
        let pente = (yq-yb)/(xq-xb); //pente
        let ord = yb - pente*xb; //ordonnée à l'origine
        //On regarde si d'autres quilles peuvent chuter par rapport à la chute de la quille actuelle, touchée par la boule (ou une quille précédente)
        for(let i = 0; i < quilles_etat.length;i++){

            if (quilles_etat[i][0] == true && (quilles_etat[i][1] != xb && quilles_etat[i][2] != yb)) {
                let x2 = quilles_etat[i][1]; //coordonnées x de l'autre quille
                let y2 = quilles_etat[i][2]; //coordonnées y de l'autre quille
                let Lx = x2 - xq;
                let Ly = y2- yq;
                let d = Math.sqrt(Lx * Lx + Ly * Ly); //distance entre les deux quilles
                if(d <= hauteur_quilles && ((x2*pente + ord) <= y2+0.38) && ((x2*pente + ord) >= y2-0.38) && ((y2-ord)/pente >= x2-0.38) && ((y2-ord)/pente <= x2+0.38)){

                    quilles_etat[i][0] = false;
                    affichage_quilles();
                    chute_quille(x2,(pente*x2+ord),x2,y2);
                    score_tir += 1;

                }
            }
        }
    }

    //********************************************************
    //   FIN FONCTIONS CHUTES QUILLES
    //********************************************************


    //********************************************************
    //   DEBUT FONCTIONS TRAJECTOIRES
    //********************************************************

    let pts_position_boule = []; //tableau contenant les points de la trajectoire de la boule

    //Trajectoire rectiligne (renvoie le tableau des coordonnées des points pour la trajectoire rectiligne)
    function traj_droite(A,B){
        let a = ((B.y-A.y) / (B.x-A.x));
        let b = (A.y) - a*(A.x);
        let nbPtstab = 100;
        let pas = (largPlan+1)/nbPtstab; //longueur piste (+1 pour que la boule aille un peu au-delà) divisé par nbPts souhaité pour tableau de trajectoire
        let trajectoire = [[pointDep.x,pointDep.y,pointDep.z]];
        let lim_gout_pos = 0.650-0.125;
        let lim_gout_neg = -lim_gout_pos;
        let zpos = 0.11;
        for(let i = 1; i <= nbPtstab; i++){
            let xpos = trajectoire[trajectoire.length - 1][0] - pas;
            let ypos = xpos * a + b;
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

    //**
    //   DEBUT Trace bezier
    //**
    function Creation_bezier(pointdep1,pointcent1,pointarri1){
        //points avec z=0
        let courbeBezier= new THREE.QuadraticBezierCurve3(pointdep1,pointcent1,pointarri1);
        let pointsbezier = courbeBezier.getPoints(50);
        let geometry = new THREE.BufferGeometry().setFromPoints( pointsbezier )
        let material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        let curveObject = new THREE.Line( geometry, material );

        return[pointsbezier,curveObject ];
    }

    function Changement_bezier(Mascene,pointdebut,pointcentre,pointarriver,point1,point2){
        //appel creation bezier pour faire les 2 morceaux du segment
        tabpoint_bez=[];
        if(cbbez1)
            Mascene.remove(cbbez1);
        if(cbbez2)
            Mascene.remove(cbbez2);

        let pointsm1 = Creation_bezier(pointdebut,point1,pointcentre);
        let pointsm2= Creation_bezier(pointcentre,point2,pointarriver);

        cbbez1=pointsm1[1];
        cbbez2=pointsm2[1];
        Mascene.add(cbbez1);
        Mascene.add(cbbez2);

        tabpoint_bez=tabpoint_bez.concat(pointsm1[0]);
        tabpoint_bez=tabpoint_bez.concat(pointsm2[0]);
    }
    function verif_bezier(tabbezier){

        let lim_gout_pos = 0.650-0.125;
        let lim_gout_neg = -lim_gout_pos;
        let goutieregauche=false;
        let goutieredroite=false;
        let tabtrajectoire=[[pointDep.x, pointDep.y, pointDep.z,]];

        for (let i=0; i<tabbezier.length ;i+=1){// i inférieur a 50 car courbe de bezier récuperée avec 50 points

            let corx=tabbezier[i].x;
            let cory=tabbezier[i].y;
            let corz=tabbezier[i].z;

            if(goutieregauche||goutieredroite){
                //rester dans la bonne gouttière
                if(goutieregauche){
                    cory=-0.650;
                    corz=0;
                }
                else{
                    cory=0.650;
                    corz=0;
                }
            }
            else
            if(cory>lim_gout_pos){
                //la boule doit aller dans la gouttière
                cory=0.650;
                corz=0;
                goutieredroite=true;

            }
            else
            if(cory<lim_gout_neg){
                //la boule doit aller dans la gouttière
                cory=-0.650;
                corz=0;
                goutieregauche=true;
            }

            tabtrajectoire.push([corx,cory ,corz]);

        }
        return tabtrajectoire
    }

    //**
    //  FIN Trace bezier
    //**

    //********************************************************
    //   FIN FONCTIONS TRAJECTOIRES
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

}
