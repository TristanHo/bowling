function vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone){
    var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
    vecAB.normalize();
    MaScene.add( new THREE.ArrowHelper( vecAB, A, B.distanceTo(A), CoulHexa, longCone, RayonCone ));
}

function repere(MaScene){
    var PointO3 = new THREE.Vector3( 0,0,0 );
    var vecI = new THREE.Vector3( 1, 0, 0 );
    var vecJ = new THREE.Vector3( 0, 1, 0 );
    var vecK = new THREE.Vector3( 0, 0, 1 );
    vecteur(MaScene,PointO3,vecI, 0xFF0000, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecJ, 0x00FF00, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecK, 0x0000FF, 0.25, 0.125 );
}

const PrecisionArrondi=50;
// test si un nombre est nul
const epsilon = 0.00000001;
function testZero(x){
    var val=parseFloat(Number(x).toPrecision(PrecisionArrondi));
    if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi))<epsilon) val=0;
    return val;
}

function segment(MaScene,A,B,CoulHexa,epai){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(A,B);

    let segAB = new THREE.Line(geometry, new THREE.LineDashedMaterial
    ({ // pas besoin de retour chariot dans le fichier js
        color: CoulHexa,
        linewidth: epai,
    })); // fin variable segAB
    return ( segAB );
}