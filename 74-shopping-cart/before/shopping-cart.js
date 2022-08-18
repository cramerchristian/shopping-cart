import items from "./items.json"

const overallContainer = document.querySelector("[data-overall-cart-container]")
const shoppingCartContainer = document.querySelector(
  "[data-shopping-cart-container]"
)
const shoppingCartInfo = document.querySelector("[data-cart-info]")
const shoppingCartButton = document.querySelector("[data-cart-button]")
const cartContainer = document.querySelector("[data-overall-container]")
const cartTotal = document.querySelector("[data-cart-total]")
const itemTemplate = document.getElementById("shopping-cart-item-template")
const IMAGE_URL = "https://dummyimage.com/210x130"
const SESSION_STORAGE_KEY = "SHOPPING_CART-cart"
let shoppingCart = []

export function setupShoppingCart() {
  shoppingCartContainer.addEventListener("click", e => {
    if (!e.target.matches("[data-remove-from-cart-button]")) return
    removeItemfromCart(e.target)
  })

  shoppingCartButton.addEventListener("click", () => {
    cartContainer.classList.toggle("invisible")
  })

  shoppingCart = loadCart()
  renderShoppingCart()
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  const cart = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(cart) || []
}

export function addItemtoCart(itemButton) {
  //   overallContainer.classList.remove("invisible")
  const container = itemButton.closest("[data-store-item]")
  const itemId = parseInt(container.dataset.itemId)

  const cartItem = shoppingCart.find(item => item.id === itemId)

  if (cartItem) {
    cartItem.quantity++
  } else {
    shoppingCart.push({ id: itemId, quantity: 1 })
  }

  renderShoppingCart()
  saveCart()
}

function removeItemfromCart(itemButton) {
  const container = itemButton.closest("[data-cart-item]")
  const itemId = parseInt(container.dataset.itemId)

  shoppingCart = shoppingCart.filter(item => item.id !== itemId)

  renderShoppingCart()
  saveCart()
}

function renderShoppingCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}

function hideCart() {
  cartContainer.classList.add("invisible")
  overallContainer.classList.add("invisible")
}

function showCart() {
  overallContainer.classList.remove("invisible")
}

function renderCartItems() {
  shoppingCartInfo.innerText = shoppingCart.length

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find(i => entry.id === i.id)
    return (sum = sum + item.priceCents * entry.quantity)
  }, 0)
  cartTotal.innerText = formatCurrency(totalCents / 100)

  shoppingCartContainer.innerHTML = ""
  shoppingCart.forEach(item => {
    const storeItem = items.find(stItem => stItem.id === item.id)

    const cartItem = itemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector("[data-cart-item]")
    container.dataset.itemId = storeItem.id

    const name = cartItem.querySelector("[data-name]")
    name.innerText = storeItem.name

    if (item.quantity > 1) {
      const quantity = cartItem.querySelector("[data-quantity]")
      quantity.innerText = `x${item.quantity}`
    }

    const price = cartItem.querySelector("[data-price]")
    price.innerText = formatCurrency(
      (storeItem.priceCents * item.quantity) / 100
    )

    const image = cartItem.querySelector("[data-image]")
    image.src = `${IMAGE_URL}/${storeItem.imageColor}/${storeItem.imageColor}`

    shoppingCartContainer.appendChild(cartItem)
  })
}

function formatCurrency(priceCents) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents)
}
