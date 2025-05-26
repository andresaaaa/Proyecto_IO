const origenCant = document.getElementById('OrigenCant');
const DestinoCant = document.getElementById('Destinocant');
const origen = document.getElementById('OrigenBox');
const destino = document.getElementById('DestinoBox')
const Rango1 = document.getElementById('rango1');
const Rango2 = document.getElementById('rango2');

const button1 = document.createElement("button");
const button2 = document.createElement("button");

let contendorTabla = document.getElementById('segundoDiv'); 
let Ncolumas = parseInt(origenCant.value);
let Nfilas = parseInt(DestinoCant.value);

function mostrarError(mensaje) {

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '9999';
    errorDiv.style.maxWidth = '400px';
    
    errorDiv.innerHTML = `
        <strong>Error:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(errorDiv);
    
  
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}


function validarCampoTexto(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        mostrarError(`El campo "${nombreCampo}" no puede estar vacío.`);
        return false;
    }
    return true;
}


function validarNumero(valor, nombreCampo) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) {
        mostrarError(`El campo "${nombreCampo}" debe contener un número válido.`);
        return false;
    }
    if (numero < 0) {
        mostrarError(`El campo "${nombreCampo}" debe ser un número positivo.`);
        return false;
    }
    return true;
}


function validarTablaCompleta() {
 
    const tabla = document.getElementById("table");
    if (!tabla) {
        mostrarError("Debe generar la tabla primero.");
        return false;
    }


    for (let i = 1; i <= Nfilas + 1; i++) {
        for (let j = 1; j <= Ncolumas + 1; j++) {

            if (i === Nfilas + 1 && j === Ncolumas + 1) {
                continue;
            }

            const celda = document.getElementById(`X${i}${j}`);
            if (celda) {
                const input = celda.querySelector("input");
                if (input && !input.disabled) {
                    const valor = input.value.trim();
                    
                    if (valor === '') {
                        mostrarError(`Debe llenar todos los campos de la tabla. Campo vacío en fila ${i}, columna ${j}.`);
                        input.focus();
                        return false;
                    }
                    
                    if (!validarNumero(valor, `Fila ${i}, Columna ${j}`)) {
                        input.focus();
                        return false;
                    }
                }
            }
        }
    }
    return true;
}


function validarRangos() {
    if (Ncolumas === 0) {
        mostrarError("Debe seleccionar al menos 1 origen.");
        return false;
    }
    if (Nfilas === 0) {
        mostrarError("Debe seleccionar al menos 1 destino.");
        return false;
    }
    return true;
}

function validarEquilibrio() {
    let totalOferta = 0;
    let totalDemanda = 0;

    // Sumar ofertas
    for (let i = 1; i <= Nfilas; i++) {
        const celda = document.getElementById(`X${i}${Ncolumas + 1}`);
        if (celda) {
            const input = celda.querySelector("input");
            if (input) {
                totalOferta += parseFloat(input.value) || 0;
            }
        }
    }

    // Sumar demandas
    for (let j = 1; j <= Ncolumas; j++) {
        const celda = document.getElementById(`X${Nfilas + 1}${j}`);
        if (celda) {
            const input = celda.querySelector("input");
            if (input) {
                totalDemanda += parseFloat(input.value) || 0;
            }
        }
    }

    if (Math.abs(totalOferta - totalDemanda) > 0.01) {
        mostrarError(`El problema no está equilibrado. Total Oferta: ${totalOferta}, Total Demanda: ${totalDemanda}. Deben ser iguales.`);
        return false;
    }

    return true;
}

origenCant.addEventListener("input", function(event){
    Ncolumas = parseInt(event.target.value);
    Rango1.innerText = Ncolumas;
})

DestinoCant.addEventListener("input", function(event){
    Nfilas = parseInt(event.target.value);
    Rango2.innerText = Nfilas;
})

function CreatesButtons(){ 
    //pues les puse id es obvio no? bueno para mi si 🤔
    button1.id ="boton1" 
    button2.id ="boton2"

    let button1existe = document.getElementById("boton1");
    if (button1existe){
        button1existe.remove();
    }

    button1.innerText = "Resolver";

    let button2existe = document.getElementById("boton2");
    if (button2existe){
        button2existe.remove();
    }

    button1.classList.add("btn-custom");
    button2.classList.add("btn-custom");

    button1.innerText = "Resolver";
    button2.innerText = "Esquina noroeste";

    document.getElementById("contendor1").appendChild(button1);
    document.getElementById("contendor1").appendChild(button2);
}

function CreateTable(){
    var origenText = origen.value;
    var destinoText = destino.value;

    let tablaExistente = document.getElementById("table");
    if (tablaExistente){
        tablaExistente.remove();
    }

    const tabla = document.createElement("table");
    tabla.id = "table";
    tabla.classList.add("mi-table");

    document.getElementById("contendor1").appendChild(tabla);

    const encabezados = [""];

    for (let i = 0; i < Ncolumas ; i++) {
        encabezados.push(`${origenText}-${i+1}`);
    }
    encabezados.push("Oferta")

    const filaencabezados = tabla.insertRow();
    encabezados.forEach(texto => {
        const celda = document.createElement("th");
        celda.textContent = texto;
        filaencabezados.appendChild(celda)
    })

    const filas = [""];

    for (let i = 0; i < Nfilas; i++) {
        filas.push(`${destinoText}-${i+1}`);
    }
    filas.push("Demanda");
    
    for (let i = 0; i < Nfilas+1; i++) {
        let fila = tabla.insertRow();
        let primeracelda = fila.insertCell();
        primeracelda.textContent = filas[i+1];

        for (let j = 1; j < encabezados.length; j++) {
            let celda1 = fila.insertCell();
            let input = document.createElement("input");
            input.style.width="80px";
            input.type ="text"; 
            
 
            input.addEventListener('input', function(e) {
                const valor = e.target.value;
                if (valor !== '' && isNaN(parseFloat(valor))) {
                    e.target.style.borderColor = 'red';
                    e.target.title = 'Debe ingresar un número válido';
                } else {
                    e.target.style.borderColor = '';
                    e.target.title = '';
                }
            });

            if (i == Nfilas && j == encabezados.length-1) {
                input.disabled = true;
                input.placeholder = "X"
                input.value = 0;
            }

            celda1.appendChild(input);
            celda1.id = `X${i+1}${j}`;
        };
    }
}

document.getElementById('btnGenerarTabla').addEventListener("click",function(){
    
    if (!validarRangos()) {
        return;
    }
    
    if (!validarCampoTexto(origen.value, "¿Qué transporta?")) {
        origen.focus();
        return;
    }
    
    if (!validarCampoTexto(destino.value, "¿A dónde se envía?")) {
        destino.focus();
        return;
    }

    CreateTable();
    CreatesButtons();  
})

function ObtenerValoresTabla(){
   
    let matriz = [];
    for (var i = 0; i < Nfilas+1; i++) {
        matriz[i] = [];
        for (var j = 0; j < Ncolumas+1; j++) {

            // if ( i == Ncolumas && j == Nfilas-1) {
            //     break;
            // }else{
                // console.log(matriz)
                // console.log(`x${i+1}${j+1}`);
                matriz[i][j] = (`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);
            // }
        }    
    }

    

    return matriz 
    
}

function ObtenerPosiciones(){

    let matriz = [];
    for (var i = 0; i < Nfilas; i++) {
        matriz[i] = [];

        for (var j = 0; j < Ncolumas; j++) {

            matriz[i][j] = (`X${i+1}${j+1}`);
            // console.log(matriz)
            // console.log(`x${i+1}${j+1}`);
        }    
    }

    return matriz 
}

function Creategrafico() {

    var origenText = origen.value;
    var destinoText = destino.value;

    const ancho = 800;
    const alto = 600;
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "grafico";

    let validacion = document.getElementById("grafico");
    if (validacion) {
        validacion.remove();
    }

    svg.setAttribute("width", ancho);
    svg.setAttribute("height", alto);
    svg.setAttribute("style", "border:1px solid #ccc; background:#f9f9f9");

    const margenSuperior = 50;
    const margenLateral = 100;

   
    const espacioOrigenY = (Nfilas === 1) ? 100 : (alto - 2 * margenSuperior) / (Nfilas - 1);
    const espacioDestinoY = (Ncolumas === 1) ? 100 : (alto - 2 * margenSuperior) / (Ncolumas - 1);

    const origenes = [];
    const destinos = [];


    for (let i = 0; i < Nfilas; i++) {
        const x = margenLateral;
        const y = margenSuperior + i * espacioOrigenY;

        dibujarNodo(svg, x, y, `${origenText}${i + 1}`, "#e0f0ff", "#003366");
        origenes.push({ x, y });
    }


    for (let j = 0; j < Ncolumas; j++) {
        const x = ancho - margenLateral;
        const y = margenSuperior + j * espacioDestinoY;

        dibujarNodo(svg, x, y, `${destinoText}${j + 1}`, "#ffe0e0", "#660000");
        destinos.push({ x, y });
    }

    let coordenada1 = 52;
    let coordenada2 = 52;
    let valores = ObtenerValoresTabla();
    let posiciones = ObtenerPosiciones();


    for (let i = 0; i < Nfilas; i++) {
        for (let j = 0; j < Ncolumas; j++) {
            const origen = origenes[i];
            const destino = destinos[j];

  
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", origen.x);
            line.setAttribute("y1", origen.y);
            line.setAttribute("x2", destino.x);
            line.setAttribute("y2", destino.y);
            line.setAttribute("stroke", "#333");
            svg.appendChild(line);

        
            

        }
        // if (Nfilas ==2 && Ncolumas == 2){
        //     coordenada1 += 380;
        // }
        // else if(Nfilas == 3 && Ncolumas == 3){
        //     coordenada1 += 160;
        // }
        // else if (Ncolumas == 3 && Nfilas == 2){
        //     coordenada1 += 160;
        // }
        // else if (Ncolumas == 3 && Nfilas == 1){
        //     coordenada1 += 160;
        

        // if (Nfilas ==2 && Ncolumas == 2){
        //     coordenada2 += 380
        // }
        // else if(Nfilas == 3 && Ncolumas == 3){
        //     coordenada2 += 160
        // }
        // else if (Ncolumas >= Nfilas) {
        //     coordenada2 += 160;
        // } 
        // else if (Ncolumas == 2 ) {

        //     coordenada2 += 380;
        // } else if (Ncolumas == 3) {

        //     coordenada2 += 160;
        // } else if (Nfilas > Ncolumas) {
        //     coordenada2 += 360;
        // }
        
    }

    
    for (let i = 0; i < Nfilas; i++) {
        for (let j = 0; j < Ncolumas; j++) {

            const textC = document.createElementNS(svgNS, "text");
            textC.setAttribute("x", margenLateral + 40);
            textC.setAttribute("y", coordenada1);
            textC.setAttribute("font-size", "10");
            textC.setAttribute("fill", "#000");
            textC.textContent = (`X${i+1}${j+1}`);
            svg.appendChild(textC);

          

            coordenada1 += 70 / Ncolumas;
  
            
        }
        


        if (Nfilas == 2 ) {
            coordenada1 += 380;
        } else if (Nfilas == 3) {
            coordenada1 += 160;
        } 
        else if (Nfilas >= Ncolumas) {
            coordenada1 += 80;
        }
        
    }


    for (let i = 0; i < Ncolumas; i++) {
        for (let j = 0; j < Nfilas; j++) {

 
            const textX = document.createElementNS(svgNS, "text");
            textX.setAttribute("x", (ancho - margenLateral) - 40);
            textX.setAttribute("y", coordenada2);
            textX.setAttribute("font-size", "10");
            textX.setAttribute("fill", "#000");
            textX.textContent = valores[j][i];
            // console.log(posiciones[i][j])
            // console.log(i,j);
            // console.log(textX.textContent);
            svg.appendChild(textX);

            coordenada2 += 70/ Nfilas;
            
        }
        

        if (Ncolumas == 2 ) {
            coordenada2 += 380;
        } else if (Ncolumas == 3) {
            coordenada2 += 160;
        } 
        else if (Ncolumas >= Nfilas) {
            coordenada2 += 80;
        }
        
    }



    const contenedor = document.getElementById("grafo-transporte");
    contenedor.innerHTML = "";
    contenedor.appendChild(svg);
}

function dibujarNodo(svg, x, y, etiqueta, fillColor, strokeColor) {
    const svgNS = "http://www.w3.org/2000/svg";

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 20);
    circle.setAttribute("fill", fillColor);
    circle.setAttribute("stroke", strokeColor);
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "12");
    text.setAttribute("fill", strokeColor);
    text.textContent = etiqueta;
    svg.appendChild(text);
}

function FuncionObjetivo(){

    let Solucion = [];
    let valores = ObtenerValoresTabla();
    let ValorFo = 0 ;
    let texto = "MIN Z: "

    for (var i = 0; i < Nfilas; i++) {
        for (var j = 0; j < Ncolumas; j++) {

            Solucion.push(`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}x${i+1}${j+1}`);
            // console.log(`${valores[i * Nfilas + j]}x${i+1}${j+1}`);

            ValorFo += ((i+1)+(j+1));
            // console.log(ValorFo)

            if(!(((i+1)+(j+1)) == (Ncolumas+Nfilas))){
                texto += (`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}x${i+1}${j+1}+`);
            }else{
                texto += (`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}x${i+1}${j+1}`);
            } 
        }
    }


    // texto+= `${texto}=${}`

    document.getElementById("FoText").innerText = texto
    // console.log(texto)

}

function RO(){

    let Solucion = [];
    let Valor = 0 ;
    let texto = "RO:\n"

    for (var i = 0; i < Nfilas; i++) {
        for (var j = 0; j < Ncolumas; j++) {

            Solucion.push(`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);
            // console.log(`x${i+1}${j+1}`);
            // console.log(`${document.getElementById(`X${i+1}${3}`).querySelector("input").value}`)
            Valor = (`${document.getElementById(`X${i+1}${Ncolumas+1}`).querySelector("input").value}`)
            texto += (`x${i+1}${j+1}`);
        } 

        texto += `<=${Valor}\n`;
    }

    document.getElementById("RoText").innerText = texto
    // console.log(texto)
}

function RD(){  

    let Solucion = [];
    let Valor = 0 ;
    let texto = "RD:\n"

    for (var i = 0; i < Ncolumas; i++) {
        for (var j = 0; j < Nfilas; j++) {

            Solucion.push(`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);
            // console.log(`x${j+1}${i+1}`);
            // console.log(`${document.getElementById(`X${i+1}${3}`).querySelector("input").value}`)

            Valor = (`${document.getElementById(`X${Nfilas+1}${i+1}`).querySelector("input").value}`)
            texto +=(`x${j+1}${i+1}`);
        } 

        texto += `<=${Valor}\n`;
    }

    document.getElementById("RdText").innerText = texto
    // console.log(texto)
}

function CreateTablenoroeste(){

    var origenText = origen.value;
    var destinoText = destino.value;

    let tablaExistente = document.getElementById("tablenoroeste");
    if (tablaExistente){
        tablaExistente.remove();
    }

   
    const tabla = document.createElement("table");
    tabla.id = "tablenoroeste";
    tabla.classList.add("mi-tablenoroeste");
    //contendorTabla.appendChild(tabla);
    document.getElementById("noroeste").appendChild(tabla);




    const encabezados = [""];

    for (let i = 0; i < Ncolumas ; i++) {
         
        encabezados.push(`${origenText}-${i+1}`);
        
    }
    encabezados.push("Oferta")

 
    const filaencabezados = tabla.insertRow();
    encabezados.forEach(texto => {
        const celda = document.createElement("th");
        celda.textContent = texto;
        filaencabezados.appendChild(celda)
    })
    
    

    const filas = [""];

    for (let i = 0; i < Nfilas; i++) {
         
        filas.push(`${destinoText}-${i+1}`);
       
    }
    filas.push("Demanda");

    //se inserta texto de la primera columna
    // fila.forEach(texto => {
    //     let fila1 = tabla.insertRow();
    //     let primeracelda = fila1.insertCell();
    //     primeracelda.textContent = texto;
    // })
    
    for (let i = 0; i < Nfilas+1; i++) {
        let fila = tabla.insertRow();
        let primeracelda = fila.insertCell();
        primeracelda.textContent = filas[i+1];
        // console.log(filas)

        for (let j = 1; j < encabezados.length; j++) {
            let celda1 = fila.insertCell();
            let input = document.createElement("input");
            input.style.width="80px";
            input.style.height = "60px"
            input.type ="text"; 
            celda1.appendChild(input);
            celda1.id = `x${i}${j-1}`;
            // console.log(`x${i}${j-1}`);
        };

    }

    let Datos = Esquinanoroeste();

    for (let i = 0; i < Nfilas+1; i++) {

        for (let j = 0; j < Ncolumas+1; j++) {
            let celda = document.getElementById(`x${i}${j}`);
            
            // console.log(celda)
            // console.log(`x${i}${j}`)
            // console.log(Datos[i][j])
            if (celda) {
                let input = celda.querySelector("input");
                if (input) {
                    input.value = Datos[i][j];
                }
            }
        }

    }


    // document.getElementById(`X${Nfilas}${encabezados.length}`).querySelector("input").disabled = true;
    
}

let subNumerosnoroeste = [];
function Esquinanoroeste(){

    let matriz = ObtenerValoresTabla();

    // for (var i = 0; i < Nfilas+1; i++) {
         
    //     matriz[i] = [];

    //     for (var j = 0; j < Ncolumas+1; j++) {

            
    //         // Solucion.push(`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);
    //         console.log(`x${i+1}${j+1}`);
    //         // console.log(`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);

    //         // Valor = (`${document.getElementById(`X${Nfilas+1}${i+1}`).querySelector("input").value}`)
    //         // texto +=(`x${j+1}${i+1}`);

    //         matriz[i][j] = (`${document.getElementById(`X${i+1}${j+1}`).querySelector("input").value}`);
            

    //     } 


        
    // }
    // console.log(matriz)
    

    console.log(matriz);

    let Demanda ;
    let Oferta ;
    let aumentar = 0;
    let aumentar2 = 0;
    let moverOferta = 0;
    let moverOferta2= 0;


    

    // console.log(Demanda,Oferta)

    subNumerosnoroeste = [];
    for (let i = 0; i < Nfilas; i++) {
        subNumerosnoroeste[i] = [];
    }


    for (var i = 0; i < Ncolumas; i++) {

        for (var j = 0; j < Nfilas; j++) {
            // console.log(Ncolumas-1,aumentar)
            console.log(aumentar,aumentar2)
            // console.log(i,j)
            Demanda = Number(matriz[Nfilas][aumentar]);   
            Oferta = Number(matriz[aumentar2][Ncolumas]); 


            
            // matriz[aumentar2+1][aumentar+1] = `X`
            console.log(Demanda)
            console.log(Oferta)

            if (Demanda > Oferta) {

                console.log("condicion1")
                console.log(`X${aumentar2+1}${aumentar+1}`);
                // console.log(Ncolumas-1,Nfilas+1)
                console.log(`${matriz[Nfilas][aumentar]}${"demanda"},${matriz[aumentar2][Ncolumas]}${"oferta"},1`)

                matriz[Nfilas][aumentar] = (Demanda-Oferta)
                matriz[aumentar2][Ncolumas] -= Oferta;

                console.log(`${matriz[Nfilas][aumentar]}${"demanda"},${matriz[aumentar2][Ncolumas]}${"oferta"},1.1`)
                console.log(Demanda,Oferta)
                console.log(`${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Oferta}`);
                matriz[aumentar2][aumentar] = `${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Oferta}`
                subNumerosnoroeste[aumentar2] = (Oferta);
                aumentar2++
                

            }
                // matriz[aumentar2+1][aumentar+1] = `X`
            
            if(Oferta > Demanda){

                console.log("condicion2")
                console.log(`X${aumentar2}${aumentar}`);
                // console.log(Ncolumas-1,Nfilas+1)
                console.log(`${matriz[Nfilas][aumentar]}${"demanda"},${matriz[aumentar2][Ncolumas]}${"oferta"},2`)
                // console.log(Demanda,Oferta)
                // console.log(aumentar2,Nfilas+1)
                // console.log(Ncolumas-1 , aumentar)

                matriz[aumentar2][Ncolumas] = (Oferta-Demanda)
                matriz[Nfilas][aumentar] -= Demanda;

                console.log(`${matriz[Nfilas][aumentar]}${"demanda"},${matriz[aumentar2][Ncolumas]}${"oferta"},2.1`)
                // console.log(Demanda,Oferta)
                console.log(`${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Demanda}`);
                matriz[aumentar2][aumentar] = `${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Demanda}`
                subNumerosnoroeste[aumentar2] = (Demanda);
                aumentar++
                

            }
            // matriz[aumentar2+1][aumentar+1] = `X`

            // console.log(Nfilas-1,Ncolumas)
            // console.log(Nfilas,Ncolumas-1)

            // let finalOferta =  matriz[Nfilas-1][Ncolumas];
            // let finalDemanda = matriz[Nfilas][Ncolumas-1];

            if (Oferta == Demanda) {
                // console.log(matriz[Nfilas-1][Ncolumas])
                if (!(Oferta == 0 && Demanda == 0)) {

                    console.log(`${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Demanda}`)
                    matriz[aumentar2][aumentar] = `${document.getElementById(`X${aumentar2+1}${aumentar+1}`).querySelector("input").value}/${Demanda}`
                    subNumerosnoroeste[aumentar2] = (Demanda);
                    matriz[Nfilas][aumentar] = (Demanda - Oferta)
                    matriz[aumentar2][Ncolumas] = (Demanda - Oferta)
                }
                // console.log(matriz[Nfilas][Ncolumas-1]
                
                // console.log(matriz[Nfilas-1][Ncolumas])
                // console.log(matriz[Nfilas][Ncolumas-1])

            } 
            
                
        }
        
        
        
    }

        const validacionRobusta = /^\d+\/\d+$/;

       for (var i = 0; i < Nfilas; i++) {
        
        for (var j = 0; j <Ncolumas; j++) {

            console.log(`Analizando [${i}][${j}]:`, matriz[i][j]);

            const valor = String(matriz[i][j]);
                if (!validacionRobusta.test(valor)) {
                matriz[i][j] = "X";
                
                }
        }
    }

    

   
console.log(matriz);
console.log(subNumerosnoroeste)
return matriz;

}


function Graficonoroeste(){

    var origenText = origen.value;
    var destinoText = destino.value;

    let matriz = Esquinanoroeste();
    let posicionesLinea = [];

    for (let i = 0; i < Nfilas; i++) {
        posicionesLinea[i] = [];
       for (let j = 0; j < Ncolumas; j++) {
            
            if (!(matriz[i][j] == "X")) {
                posicionesLinea[i][j] = (`${i}${j}`)
            }
       }
        
    }

   
    const numerosSeparados = matriz.flat()
    .filter(item => typeof item === 'string' && item.includes('/')) 
    .map(item => item.split('/').map(Number)); 

    console.log(numerosSeparados);


 

    const ancho = 800;
    const alto = 600;
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "graficoNoroeste";

    let validacion = document.getElementById("graficoNoroeste");
    if (validacion) {
        validacion.remove();
    }

    svg.setAttribute("width", ancho);
    svg.setAttribute("height", alto);
    svg.setAttribute("style", "border:1px solid #ccc; background:#f9f9f9");

    const margenSuperior = 50;
    const margenLateral = 100;

   
    const espacioOrigenY = (Nfilas === 1) ? 100 : (alto - 2 * margenSuperior) / (Nfilas - 1);
    const espacioDestinoY = (Ncolumas === 1) ? 100 : (alto - 2 * margenSuperior) / (Ncolumas - 1);

    const origenes = [];
    const destinos = [];

    let posicionOferta=[];
    let posicionDemanda= [];


    for (let i = 0; i < Nfilas; i++) {
        posicionOferta[i]=[];
    }
    
    for (let i = 0; i < Nfilas; i++) {
        const x = margenLateral;
        const y = margenSuperior + i * espacioOrigenY;
        posicionOferta[i]=[x,y]
        console.log(posicionOferta)
        console.log(`posicion circulo ${i} Oferta `)

        dibujarNodo(svg, x, y, `${origenText}${i + 1}`, "#e0f0ff", "#003366");
        origenes.push({ x, y });
    }

    for (let j = 0; j < Ncolumas; j++) {
        posicionDemanda[j] = [];
    }
    for (let j = 0; j < Ncolumas; j++) {
        const x = ancho - margenLateral;
        const y = margenSuperior + j * espacioDestinoY;
        posicionDemanda[j]=[x,y]
        console.log(posicionDemanda)
        console.log(`posicion circulo ${j} Demanda `)

        dibujarNodo(svg, x, y, `${destinoText}${j + 1}`, "#ffe0e0", "#660000");
        destinos.push({ x, y });
    }

    let coordenada1 = 52;
    let coordenada2 = 52;
    let valores = ObtenerValoresTabla();
    let posiciones = ObtenerPosiciones();

    // Dibujar conexiones y etiquetas Cij y Xij separadas
    // for (let i = 0; i < Nfilas; i++) {
    //     for (let j = 0; j < Ncolumas; j++) {
    //         const origen = origenes[i];
    //         const destino = destinos[j];

    //         // Línea
    //         const line = document.createElementNS(svgNS, "line");
    //         line.setAttribute("x1", origen.x);
    //         line.setAttribute("y1", origen.y);
    //         line.setAttribute("x2", destino.x);
    //         line.setAttribute("y2", destino.y);
    //         line.setAttribute("stroke", "#333");
    //         svg.appendChild(line);
    //     }
        
    // }

    
    for (let i = 0; i < Nfilas; i++) {
        for (let j = 0; j < Ncolumas; j++) {

            
            
        }
        
        
    }


    // for (let i = 0; i < Ncolumas; i++) {
    //     for (let j = 0; j < Nfilas; j++) {

    //         // Etiqueta Xij
    //         const textX = document.createElementNS(svgNS, "text");
    //         textX.setAttribute("x", (ancho - margenLateral) - 40);
    //         textX.setAttribute("y", coordenada2);
    //         textX.setAttribute("font-size", "10");
    //         textX.setAttribute("fill", "#000");
    //         textX.textContent = valores[j][i];
    //         // console.log(posiciones[i][j])
    //         // console.log(i,j);
    //         // console.log(textX.textContent);
    //         svg.appendChild(textX);            
    //     }
           
    // }


    let pdx ;
    let pdy ;
    let pox ;
    let poy ;
    let contador = 0;
    for (let i = 0; i < Nfilas; i++) {
       for (let j = 0; j < Ncolumas; j++) {

            if (!(posicionesLinea[i][j] === undefined || posicionesLinea[i][j] === null) ) {
                
                console.log(`${i},${j}`)

                console.log(contador)

                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", posicionDemanda[j][0]);
                line.setAttribute("y1", posicionDemanda[j][1]);
                line.setAttribute("x2", posicionOferta[i][0]);
                line.setAttribute("y2", posicionOferta[i][1]);
                line.setAttribute("stroke", "#333");
                svg.appendChild(line);


                const textC = document.createElementNS(svgNS, "text");
                textC.setAttribute("x", posicionOferta[i][0] + 0.2*(posicionDemanda[j][0]-posicionOferta[i][0]));
                textC.setAttribute("y",  posicionOferta[i][1] + 0.2*(posicionDemanda[j][1]-posicionOferta[i][1]) );
                textC.setAttribute("font-size", "10");
                textC.setAttribute("fill", "#000");
                textC.textContent = (numerosSeparados[contador][1]);
                console.log(`X${i+1}${j+1}`)
                svg.appendChild(textC);
                
                const textX = document.createElementNS(svgNS, "text");
                textX.setAttribute("x", posicionDemanda[j][0] + 0.2*(posicionOferta[i][0]-posicionDemanda[j][0]));
                textX.setAttribute("y", posicionDemanda[j][1] + 0.2*(posicionOferta[i][1]-posicionDemanda[j][1]));
                textX.setAttribute("font-size", "10");
                textX.setAttribute("fill", "#000");
                textX.textContent = (numerosSeparados[contador][0]);
                // console.log(posiciones[i][j])
                // console.log(i,j);
                // console.log(textX.textContent);
                svg.appendChild(textX);
                contador++
                
            }
        
       }
        
    }

    console.log(posicionesLinea)



    const contenedor = document.getElementById("grafo-transporteNoroeste");
    contenedor.innerHTML = "";
    contenedor.appendChild(svg);
    
}

function ObtenerValoresTablaNoroeste(){
    let matriz = [];
    for (var i = 0; i < Nfilas+1; i++) {
        matriz[i] = [];
        for (var j = 0; j < Ncolumas+1; j++) {
            let celda = document.getElementById(`x${i}${j}`);
            if (celda) {
                let input = celda.querySelector("input");
                if (input) {
                    matriz[i][j] = input.value;
                } else {
                    matriz[i][j] = '';
                }
            } else {
                matriz[i][j] = '';
            }
        }    
    }
    return matriz;
}

function FuncionObjetivoNoroeste() {
    let texto = "MIN Z: ";
    let matrizNoroeste = ObtenerValoresTablaNoroeste(); 
    let datosTablaOriginal = ObtenerValoresTabla(); 
    
    let elementos = [];
    let valorTotal = 0;

    for (let i = 0; i < Nfilas; i++) {
        for (let j = 0; j < Ncolumas; j++) {
            let valor = matrizNoroeste[i][j]; 
            
            if (typeof valor === 'string' && valor.includes('/')) {
                
                let partes = valor.split('/');
                let costo = parseFloat(partes[0]);
                let cantidad = parseFloat(partes[1]);
                console.log(cantidad)
                elementos.push(`${costo}x${cantidad}`);
                valorTotal += costo * cantidad;
            }
        }
    }

    if (elementos.length > 0) {
        texto += elementos.join(" + ");
        texto += ` = ${valorTotal}`;
    } else {
        texto += "0";
    }
    
    document.getElementById("FON").innerText = texto;
}

function RON() {
    let matrizNoroeste = ObtenerValoresTablaNoroeste(); 
    let datosTablaOriginal = ObtenerValoresTabla();
    let texto = "RO:\n";

    for (let i = 0; i < Nfilas; i++) {
        let variables = [];
        
        for (let j = 0; j < Ncolumas; j++) {
            let valor = matrizNoroeste[i][j]; 
            
            if (typeof valor === 'string' && valor.includes('/')) {
              
                let partes = valor.split('/');
                let cantidad = parseFloat(partes[1]);
                variables.push(`${cantidad}`);
            }
        }

        if (variables.length > 0) {
        
            let oferta = datosTablaOriginal[i][Ncolumas];
            texto += `${variables.join(" + ")} <= ${oferta}\n`;
        }
    }

    document.getElementById("RON").innerText = texto;
}

function RDN() {
    let matrizNoroeste = ObtenerValoresTablaNoroeste();
    let datosTablaOriginal = ObtenerValoresTabla();
    let texto = "RD:\n";

    
    for (let j = 0; j < Ncolumas; j++) {
        let variables = [];
        
        for (let i = 0; i < Nfilas; i++) {
            let valor = matrizNoroeste[i][j]; 
            
            if (typeof valor === 'string' && valor.includes('/')) {
                
                let partes = valor.split('/');
                let cantidad = parseFloat(partes[1]);
                variables.push(`${cantidad}`);
            }
        }

        if (variables.length > 0) {
    
            let demanda = datosTablaOriginal[Nfilas][j];
            texto += `${variables.join(" + ")} <= ${demanda}\n`;
        }
    }

    document.getElementById("RDN").innerText = texto;
}


button1.addEventListener("click",function(){

    if (!validarTablaCompleta()) return;
    if (!validarEquilibrio()) return;

    console.log("hola1");
    Creategrafico(Ncolumas, Nfilas);
    FuncionObjetivo();
    RO();
    RD();
    
});


button2.addEventListener("click",function(){
    if (!validarTablaCompleta()) return;
    if (!validarEquilibrio()) return;

    console.log("hola2");
    Esquinanoroeste();
    console.log(subNumerosnoroeste)
    CreateTablenoroeste();
    Graficonoroeste();
    FuncionObjetivoNoroeste();
    RDN();
    RON();
    

});

//text.textContent = `x${i+1}${j+1}·${valor[i][j]}`;