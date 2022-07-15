const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment() //es como una memoria bolatil, se disuelve
let carrito = {} //creamos un objeto vacio

// luego de leer el DOM hacer esto... ===================>
document.addEventListener('DOMContentLoaded', () => {
    fetchData() //llamamos a nuestro fetchData
})

// delegar con Event Delegation al hacer click en una card, agregarlo al carrito==============================>
items.addEventListener('click', e => {
    addCarrito(e)
})

// accedemos a los datos del archivo json ===================>
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        pintarCard(data)

    } catch (error) {
        console.log(error)
    }
}

//pintar cards ===================>
const pintarCard = data => { 
    data.forEach(producto => { //recorrer
        templateCard.querySelector('h5').textContent = producto.title //poner el titulo de mi objeto dentro de la etiqueta h5
        templateCard.querySelector('p').textContent = producto.precio //poner los precios de cada objeto en la etiqueta p HTML
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl) //colocamos todas las imagenes de nuestros objetos en esta etiqueta con el setAttribute(name, value)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id //crea como una clase llamada data-id="id" con cada id de los productos

        const clone = templateCard.cloneNode(true) //clonamos todos los objetos ya guardados en sus respectivas etiquetas
        fragment.appendChild(clone) //lo que tengo guardado en clone subirlo a fragment
    });
    items.appendChild(fragment) //ocupamos items para mandar el fragment y evitar reflow
}

// funcion flecha para agregar productos al carrito =========================================>
const addCarrito = e => {
    //console.log(e.target) //target es pora ver lo que estoy seleccionando con un click en formato html
    //console.log(e.target.classList.contains('btn-dark')) //el elemento que le estamos pasando contiene la clase que le estamos pasando? true o false

    if (e.target.classList.contains('btn-dark')) { //si cuando le demos click a algun elemento o boton coincida con la clase que le pasamos hacer lo siguiente...
        setCarrito(e.target.parentElement) //me trae todo el contenido de card ya se su: (title, precio, id, y  boton) y empujamos todo a setCarrito
    }
    e.stopPropagation() //detener cualquier otro evento que se puede generar en nuestro items
}

//manipula nuestro carrito ========================>
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id, //la propiedad id solo contiene el id de la clase btn-dark del boton data-id
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1,
    }

    if (carrito.hasOwnProperty(producto.id)) { //si esto existe quiere decir que esto se esta duplicando entonces hay que aumentar la cantidad
        producto.cantidad = carrito[producto.id].cantidad+1
    }
    carrito[producto.id] = {...producto} //empujar copia de producto a nuestro carrito | (...):es como una copia de producto
    
    console.log(carrito)
}