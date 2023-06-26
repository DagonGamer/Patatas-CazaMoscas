const acceleracion = -75, frecuencia = 50, maximaVelocidad = 125,
    body = document.querySelector("body");
let Patatas = [
    {
        x: 10,
        y: 10,
        direccion: 2.456,
        velocidad: 54,
        buscaMosca: -1,
        target: document.querySelectorAll("img.Patata")[0]
    },
    {
        x: 45,
        y: 76,
        direccion: 6.456,
        velocidad: 75,
        buscaMosca: -1,
        target: document.querySelectorAll("img.Patata")[1]
    },
    {
        x: 76,
        y: 145,
        direccion: 4.456,
        velocidad: 33,
        buscaMosca: -1,
        target: document.querySelectorAll("img.Patata")[2]
    },
];

let Moscas = [], buscando = 0;

let Actualizar = (obj) => {

    obj.target.style = `
        top: calc( ${obj.y}px - 7.5vw );
        left: calc( ${obj.x}px - 7.5vw );
        transform: rotate(${obj.direccion}rad);
    `;

}

let MasCercana = (obj, arr) => {

    return arr.map((el, idx) => [

        el == "Empty" ? 99999999999999999 :
        (Patatas.some(pt => pt.buscaMosca == idx) ? 10000000000 :
        Math.sqrt( Math.pow(obj.x - el.x, 2) + Math.pow(obj.y - el.y, 2) )),

        el]).sort((a, b) => a[0] - b[0])[0][1]

}

let Tick = () => {

    for ( const mosca of Moscas.filter(el => el != "Empty") ) {
        mosca.x += mosca.velocidad * Math.cos(mosca.direccion) * frecuencia / 1000;
        mosca.y += mosca.velocidad * Math.sin(mosca.direccion) * frecuencia / 1000;
        mosca.velocidad = Math.min( Math.max(0, mosca.velocidad + acceleracion * frecuencia / 1000), maximaVelocidad );

        Actualizar(mosca);
    }
    
    for ( const patata of Patatas ) {

        buscando = Patatas.filter(el => el.buscaMosca != -1).length;
        
        if ( patata.buscaMosca == -1 && buscando < Moscas.filter(el => el != "Empty").length ) {
            patata.buscaMosca = Moscas.indexOf(MasCercana(patata, Moscas));
        } else if (patata.buscaMosca == -1) {

            patata.x += patata.velocidad * Math.cos(patata.direccion) * frecuencia / 1000;
            patata.y += patata.velocidad * Math.sin(patata.direccion) * frecuencia / 1000;
            patata.velocidad = Math.min( Math.max(0, patata.velocidad + acceleracion * frecuencia / 1000), maximaVelocidad );

        } else {

            let mosca = Moscas[patata.buscaMosca];
            let distancia = Math.sqrt( Math.pow(mosca.x - patata.x, 2) + Math.pow(mosca.y - patata.y, 2) );
            patata.direccion = Math.atan( (mosca.y - patata.y) / (mosca.x - patata.x) );
            if ( (mosca.x - patata.x) < 0 ) patata.direccion += Math.PI;
            patata.velocidad = maximaVelocidad;

            if ( distancia > maximaVelocidad * frecuencia / 1000 ) {
                patata.x += patata.velocidad * Math.cos(patata.direccion) * frecuencia / 1000;
                patata.y += patata.velocidad * Math.sin(patata.direccion) * frecuencia / 1000;
            } else {
                patata.x = mosca.x;
                patata.y = mosca.y;
                
                Patatas.forEach(el => el.buscaMosca == patata.buscaMosca && patata != el ? el.buscaMosca = -1 : 0)
                patata.buscaMosca = -1;
                
                if ( mosca != "Empty" ) {
                    mosca.target.remove();
                    Moscas.splice(Moscas.indexOf(mosca), 1, "Empty");
                }
            }

        }

        Actualizar(patata);

    }

}

body.onclick = (e) => {

    let target = document.createElement("img");
    target.src = "Mosca.png";
    target.className = "Mosca";
    body.appendChild(target);

    let mosca = {
        x: e.clientX,
        y: e.clientY,
        direccion: Math.PI * ( Math.random() * Date.now() / 985 % 1 ),
        velocidad: 50 * ( Math.random() * Date.now() / 758 % 1 ),
        target
    }

    Moscas.push(mosca);

    Actualizar(mosca);

}

setInterval(Tick, frecuencia)