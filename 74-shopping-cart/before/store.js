import items from "./items.json"

const storeItemTemplate = document.getElementById("store-item-template")
const store = document.querySelector("[data-store]")
const IMAGE_URL = "https://dummyimage.com/420x260"

export function setupStore() {
  items.forEach(item => {
    renderStoreItem(item)
  })
}

function renderStoreItem(item) {
  const storeItem = storeItemTemplate.content.cloneNode(true)

  const container = storeItem.querySelector("[data-store-item]")
  container.dataset.itemId = item.id

  const category = storeItem.querySelector("[data-category]")
  category.innerText = item.category

  const name = storeItem.querySelector("[data-name]")
  name.innerText = item.name

  const price = storeItem.querySelector("[data-price]")
  price.innerText = formatCurrency(item.priceCents / 100)

  const image = storeItem.querySelector("[data-image]")
  image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

  store.appendChild(storeItem)
}

function formatCurrency(priceCents) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents)
}
