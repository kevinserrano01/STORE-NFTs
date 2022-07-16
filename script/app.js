// initialize
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment() //es como una memoria bolatil, se disuelve
let carrito = {} //creamos un objeto vacio



// una vez que se cargue nuestro sitio web y se carguen los productos ... ===================>
document.addEventListener('DOMContentLoaded', () => { 
    fetchData() //llamamos a nuestro fetchData
    if (localStorage.getItem('carrito')) { //si existe algo en el localStorage con la key(carrito) lo pintamos en el carrito
        carrito = JSON.parse(localStorage.getItem('carrito')) 
        pintarCarrito()
    }
})


// delegar con Event Delegation al hacer click en una card, agregarlo al carrito==============================>
cards.addEventListener('click', e => {
    addCarrito(e)
})


items.addEventListener('click', e => {
    btnAccion(e)
})


// accedemos a los datos del archivo json ===================>
const fetchData = async () => {
        const res = await fetch('api.json');
        const data = await res.json()
        pintarCard(data)
}



//pintar cards ===================>
const pintarCard = data => { 
    data.forEach(producto => { //recorrer
        templateCard.querySelector('h5').textContent = producto.title //poner el titulo de mi objeto dentro de la etiqueta h5
        templateCard.querySelector('p').textContent = producto.precio //poner los precios de cada objeto en la etiqueta p HTML
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl) //colocamos todas las imagenes de nuestros objetos en esta etiqueta con el setAttribute(name, value)
        templateCard.querySelector('.btn-success').dataset.id = producto.id //crea como una clase llamada data-id="id" con cada id de los productos

        const clone = templateCard.cloneNode(true) //clonamos todos los objetos ya guardados en sus respectivas etiquetas
        fragment.appendChild(clone) //lo que tengo guardado en clone subirlo a fragment
    });
    cards.appendChild(fragment) //ocupamos cards para mandar el fragment y evitar reflow
}



// funcion flecha para agregar productos al carrito =========================================>
const addCarrito = e => {
    //console.log(e.target) //target es pora ver lo que estoy seleccionando con un click en formato html
    //console.log(e.target.classList.contains('btn-dark')) //el elemento que le estamos pasando contiene la clase que le estamos pasando? true o false

    if (e.target.classList.contains('btn-success')) { //si cuando le demos click a algun elemento o boton coincida con la clase que le pasamos hacer lo siguiente...
        setCarrito(e.target.parentElement) //me trae todo el contenido de card ya se su: (title, precio, id, y  boton) y empujamos todo a setCarrito
    }
    e.stopPropagation() //detener cualquier otro evento que se puede generar en nuestras cards
}



//manipula nuestro carrito ========================>
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-success').dataset.id, //la propiedad id solo contiene el id de la clase btn-dark del boton data-id
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1,
    }

    if (carrito.hasOwnProperty(producto.id)) { //si esto existe quiere decir que esto se esta duplicando entonces hay que aumentar la cantidad
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto} //empujar copia de producto a nuestro carrito | (...):es como una copia de producto
    pintarCarrito()
}



const pintarCarrito = () => {
    items.innerHTML = '' //limpiar el html para que no se repitan los productos en el carrito

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title //acedemos al primer <td>
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad //acedemos al primer <td>
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad //cuando aumente la cantidad le multiplicamos el precio

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id //boton aumentar cantidad
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id //boton remover cantidad

        const clone = templateCarrito.cloneNode(true) //clonamos todo lo que contiene el templateCarrito en clone
        fragment.appendChild(clone) //subimos el clone a el fragment
    })
    items.appendChild(fragment)

    pintarFooter()

    // vamos a guardar en el almecenamiento Local (localStorage) con la key 'carrito  todo lo que venga de carrito 
    localStorage.setItem('carrito', JSON.stringify(carrito)) //stringify es para pasar nuestra coleccion de objetos a un string plano y vicebersa 
}



const pintarFooter = () => {
    footer.innerHTML = '' //limpiamos el footer

    if (Object.keys(carrito).length === 0) { //si no existen elementos en el carrito, deberiamos pintar en pantalla que el carrito esta vacio
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
            `
            return //hacemos que se salga de toda esa funcion
    }
                        //con el Object.values podemos utilizar todas las funcionalidades de (carrito: coleccion de objetos)
    const nCantidad = Object.values(carrito).reduce((acum, {cantidad}) => acum + cantidad, 0) //accedemos a la cantidad de productos y le sumamos un acum por producto
    const nPrecio = Object.values(carrito).reduce((acum, {cantidad, precio}) => acum + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad //pintamos la cantidad en la etiqueta td del templateFooter
    templateFooter.querySelector('span').textContent = nPrecio //pintamos el precio total en la etiqueta span del templateFooter

    const clone = templateFooter.cloneNode(true) //una vez que tenemos nuestro template tenemos que clonarlo
    fragment.appendChild(clone) //guardamos todo lo que contiene el templateFooter
    footer.appendChild(fragment) //le pasamos el fragemnt que contiene todo ya del templateFopoter al footer

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}



const btnAccion = e => {
    // console.log(e.target) //para detectar que parte estamso haciendo click del html

    //accion de aumentar la cantidad con este boton
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id] //o que venga de nuestro carrito 
        producto.cantidad++ //accdemos a suc antidad del producto y sumamos la cantidad de ese objeto + 1
        carrito[e.target.dataset.id] = {...producto} //esto va  a ser una copia de producto
        pintarCarrito()
    }

    //accion de descontar la cantidad con este boton
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id] //o que venga de nuestro carrito 
        producto.cantidad-- //accdemos a suc antidad del producto y sumamos la cantidad de ese objeto + 1

        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id] //delete de los objetos. Solo va a eliminar el objeto que tiene ese ID
        }

        pintarCarrito()
    }

    e.stopPropagation() //detener cualquier otro evento que se puede generar en nuestros ifs
}

// end