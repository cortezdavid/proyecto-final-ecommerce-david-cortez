const queryString = window.location.search

const urlParams = new URLSearchParams(queryString)
const idProduct = urlParams.get("id")

const carrito = JSON.parse(localStorage.getItem("carrito")) || []


const getProducts = () => {
  return fetch('../data/productos.JSON')
    .then(response => response.json())
    .catch(error => console.log(error))
}

getProducts().then(products => {
  const element = products.find(product => product.id == idProduct)
  const container = document.querySelector('.container')
  const productHTML = `
  <h2 class="nameDetail">${element.nombre}</h2>
  <article class="productDetail" data-id=${element.id}>
    <img src="${element.imagen}" alt="${element.nombre}">
    <div class="productInformation">
    <p>${element.detalles}</p>
      <h3>$${(element.precio).toFixed(3)}</h3>
      <div class="productActions">
        <div class="btnsQuantity">
          <button class="btnCount btnSubtract" id="btnSubtract">-</button>
          <span id="quantity" class="quantity">1</span>
          <button class="btnCount btnAdd" id="btnAdd">+</button>
        </div>
        <button class="BtnAddToCart" id="btnAddToCart">Agregar al carrito</button>
      </div>
      <div class="back">
        <a href="./products.html"><button>Volver</button></a>
      </div>
    </div>
  </article>
  <div class="containerReviews">
    <h4>Calificaciones:</h4>
    <div class="reviews">
      ${element.calificaciones.map(calificacion =>
    `<div class="review">
          <i class="fa-solid fa-circle-user"></i>
          <div>
            <strong>${calificacion.nombre}</strong>
            <p>${calificacion.calificacion}</p>
            <span>${calificacion.estrellas}</span>
          </div>
        </div>
        `).join("")}
    </div>
  </div>`
  container.innerHTML += productHTML
})

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
})

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("BtnAddToCart")) {
    getProducts().then(products => {
      const productQuantity = parseInt(document.getElementById("quantity").textContent, 10);
      const element = products.find(product => product.id == idProduct)
      const { nombre, precio, imagen } = element
      const productPosition = carrito.findIndex(product => product.id == idProduct)
      if (productPosition !== -1) {
        carrito[productPosition].quantity += productQuantity;
      } else {
        const product = {
          id: idProduct,
          name: nombre,
          price: precio,
          img: imagen,
          quantity: productQuantity,
        };
        carrito.push(product);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito))
    })
    Toast.fire({
      icon: "success",
      title: "Producto agregado al carrito"
    })
  }
})

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnAdd")) {
    const quantitySpan = e.target.previousElementSibling
    quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
  }
  if (e.target.classList.contains("btnSubtract")) {
    const quantitySpan = e.target.nextElementSibling
    if (parseInt(quantitySpan.textContent) > 1) {
      quantitySpan.textContent = parseInt(quantitySpan.textContent) - 1;
    }
  }
});
