// primitive avec Phong
function surfPhong(geom,coulD,transpa,bolTrans,coulSpe){
    let Material = new THREE.MeshPhongMaterial({
        color: coulD,
        opacity: transpa,
        transparent: bolTrans,
        //     wireframe: false,
        specular:coulSpe,
        flatShading: true,
        side: THREE.DoubleSide,
    });
    let maillage = new THREE.Mesh(geom,Material);
    return maillage;
}//fin fonction surfPhong

function latheBez3(nbePtCbe,nbePtRot,P0,P1,P2,P3,coul,opacite,bolTranspa){
    //let geometry = new THREE.Geometry();
    let p0= new THREE.Vector2(P0.x,P0.y);
    let p1= new THREE.Vector2(P1.x,P1.y);
    let p2= new THREE.Vector2(P2.x,P2.y);
    let p3= new THREE.Vector2(P3.x,P3.y);
    let Cbe3 = new THREE.CubicBezierCurve(p0,p1,p2,p3);
    let points = Cbe3.getPoints(nbePtCbe);
    let latheGeometry = new THREE.LatheGeometry(points,nbePtRot,0,2*Math.PI);
    let lathe = surfPhong(latheGeometry,coul,opacite,bolTranspa,"#223322");
    return lathe;
}// fin latheBez3
function tracePt(MaScene, P, CoulHexa,dimPt,bol){
    let sphereGeometry = new THREE.SphereGeometry(dimPt,12,24);
    let  sphereMaterial = new THREE.MeshBasicMaterial({color: CoulHexa });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(P.x,P.y,P.z);
    if (bol) MaScene.add(sphere);
    return sphere;
} // fin function tracePt
function TraceBezierCubique(P0, P1, P2, P3,nbPts,coul,epaiCbe){
    let cbeBez = new THREE.CubicBezierCurve3(P0, P1, P2, P3);
    let Points = cbeBez.getPoints(nbPts);
    let cbeGeometry = new THREE.BufferGeometry().setFromPoints(Points);
    let material = new THREE.LineBasicMaterial(
        { color : coul ,
            linewidth: epaiCbe
        } );
    let BezierCubique = new THREE.Line( cbeGeometry, material );
    return (BezierCubique);
}  // fin fonction THREE.CubicBezierCurve

