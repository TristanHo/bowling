function cameraLumiere(scene,camera){   // creation de la camera
    camera.up = new THREE.Vector3( 0, 0, 1 );
    var xPos=6;
    var yPos=6;
    var zPos=5;
    var xDir=0;
    var yDir=0;
    var zDir=0;
    camera.position.set(xPos, yPos, zPos);
    camera.lookAt(xDir, yDir, zDir);
}


function ajoutCameraGui(gui,menuGUI,camera){
    let guiCamera = gui.addFolder("Camera");

    // abscisse de la position de la camera dans le menu
    guiCamera.add(menuGUI,"cameraxPos",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        //document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
    });
    // ordonnee de la position de la camera dans le menu
    guiCamera.add(menuGUI,"camerayPos",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
    });
    // cote de la position de la camera dans le menu
    guiCamera.add(menuGUI,"camerazPos",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        // document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir));
    });

    // zoom de la camera dans le menu
    guiCamera.add(menuGUI,"cameraZoom",-10,10).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
    });
    // fin de la position de camera
    // direction de la camera
    // abscisse de la direction de la camera dans le menu
    guiCamera.add(menuGUI,"cameraxDir",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
    });
    // ordonnee de la direction de la camera dans le menu
    guiCamera.add(menuGUI,"camerayDir",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
    });
    // cote de la direction de la camera dans le menu
    guiCamera.add(menuGUI,"camerazDir",-borneVue,borneVue).onChange(function () {
        camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom), menuGUI.camerayPos*testZero(menuGUI.cameraZoom), menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
        camera.lookAt(testZero(menuGUI.cameraxDir), testZero(menuGUI.camerayDir), testZero(menuGUI.camerazDir))
    });
}


function lumiere(scene){
    let lumPt = new THREE.PointLight(0xff55ff);
    lumPt.position.set(3,3,-3);
    lumPt.intensity = 1;
    lumPt.shadow.camera.far=2000;
    lumPt.shadow.camera.near=0;
    let lumPt1 = new THREE.PointLight(0xffffff);
    lumPt1.castShadow = true;
    lumPt1.shadow.camera.far=2000;
    lumPt1.shadow.camera.near=0;
    lumPt1.position.set(5,5,15);
    lumPt1.intensity = 1;
    scene.add(lumPt1);

    let dCon=0.1;
    let spotConique1 = new THREE.SpotLight(0x44FF44);
    spotConique1.position.set(1, 1, 3);
    spotConique1.target.position.set(1,1,0);
    spotConique1.target.updateMatrixWorld();// actualisation de "target"
    spotConique1.castShadow = true;
    spotConique1.shadow.camera.left = -dCon;
    spotConique1.shadow.camera.right = dCon;
    spotConique1.shadow.camera.top = dCon;
    spotConique1.shadow.camera.bottom = -dCon;
    spotConique1.shadow.camera.near =0.2;
    spotConique1.shadow.camera.far =80;
    spotConique1.shadow.camera.fov = 120;
    spotConique1.shadow.radius = 1;
    spotConique1.intensity = 0.5;
    spotConique1.angle = Math.PI/12;
    spotConique1.shadow.mapSize = new THREE.Vector2(Math.pow(2,10), Math.pow(2,10));
    scene.add(spotConique1);

    let dCon1=0.1;
    let spotConique2 = new THREE.SpotLight(0x4444FF);
    spotConique2.position.set(4, 1, 1);
    spotConique2.target.position.set(0,1,1);
    spotConique2.target.updateMatrixWorld();// actualisation de "target"
    spotConique2.castShadow = true;
    spotConique2.shadow.camera.left = -dCon1;
    spotConique2.shadow.camera.right = dCon1;
    spotConique2.shadow.camera.top = dCon1;
    spotConique2.shadow.camera.bottom = -dCon1;
    spotConique2.shadow.camera.far=80;
    spotConique2.shadow.camera.near=0.2;
    spotConique2.shadow.radius = 10;
    spotConique2.intensity = 0.5;
    spotConique2.angle = Math.PI/12;
    spotConique2.shadow.mapSize = new THREE.Vector2(Math.pow(2,10), Math.pow(2,10));

    scene.add(spotConique2);

    const dCyl=0.2;
    let LumiereDirectionnelle = new THREE.DirectionalLight(0x8888FF);
    LumiereDirectionnelle.position.set(1, 10, 1);
    LumiereDirectionnelle.target.position.set(1,0,1);

    LumiereDirectionnelle.target.updateMatrixWorld();
    LumiereDirectionnelle.castShadow = true;
    LumiereDirectionnelle.shadow.camera.near = 0.2;
    LumiereDirectionnelle.shadow.camera.far = 200;
    LumiereDirectionnelle.shadow.camera.left = -dCyl;
    LumiereDirectionnelle.shadow.camera.right = dCyl;
    LumiereDirectionnelle.shadow.camera.top = dCyl;
    LumiereDirectionnelle.shadow.camera.bottom = -dCyl;

    LumiereDirectionnelle.intensity = 0.5;
    LumiereDirectionnelle.shadow.mapSize.width = Math.pow(2,10);
    LumiereDirectionnelle.shadow.mapSize.height = Math.pow(2,10);

    scene.add(LumiereDirectionnelle);

}