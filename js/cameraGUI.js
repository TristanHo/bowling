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
    lumPt.position.set(0,0,0);
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
    let spotConique1 = new THREE.SpotLight(0xfffff);
    spotConique1.position.set(1, 50, 50);
    spotConique1.target.position.set(0,0,0);
    spotConique1.target.updateMatrixWorld();// actualisation de "target"
    spotConique1.castShadow = true;
    spotConique1.shadow.camera.left = -dCon;
    spotConique1.shadow.camera.right = dCon;
    spotConique1.shadow.camera.top = dCon;
    spotConique1.shadow.camera.bottom = -dCon;
    spotConique1.shadow.camera.near =0.2;
    spotConique1.shadow.camera.far =80;
    spotConique1.shadow.camera.fov = 120;
    spotConique1.shadow.radius = 3;
    spotConique1.intensity = 0.1;
    spotConique1.angle = Math.PI/12;
    spotConique1.shadow.mapSize = new THREE.Vector2(Math.pow(2,10), Math.pow(2,10));
    scene.add(spotConique1);


}