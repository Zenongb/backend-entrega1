import fs from "fs/promises"
import Product from "./Product.js"

export default class ProductManager {
  constructor(path) {
    this.path = path
  }

  async getProducts() {
    const products = await this.#readProds()
    return products.map(p => p.toPOJO())
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.#readProds()
    // check si ya existe un producto con el mismo code
    if (-1 < products.findIndex(i => i.code === code)) { // esta linea puede ser cara
      throw new Error(`ya existe un producto con el codigo ${code}`)
    }
    products.push(
      new Product({title, description, price, thumbnail, code, stock})
    )
    await this.#writeProds(products)
  }

  async getProductById(id) {
    const products = await this.#readProds()
    const prod = products.find(p => p.id === id)
    if (!prod) throw new Error(`No se encontro producto con id ${id}`)
    return prod.toPOJO()
  }

  async updateProduct(update) {
    const products = await this.#readProds()
    const prodIndex = products.findIndex(p => p.id === update.id)
    if (prodIndex < 0) throw new Error(`No se encontro producto con id ${update.id}`)
    delete update.id
    // actualizar el producto creando uno nuevo convinando los datos del request
    // y el producto guardado
    try {
      products[prodIndex] = new Product({
        ...products[prodIndex].toPOJO(),
        ...update
      })
    } catch (err) {
      throw new Error("Error al actualizar Producto", {cause: err})
    }
    await this.#writeProds(products)   
  }

  async deleteProduct(id) {
    let products = await this.#readProds()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) throw new Error("No existe un producto con ese id")
    else if (index === products.lenght - 1) products.pop()
    else if (index === 0) products.shift()
    else {
      const parteUno = products.slice(0, index)
      const parteDos = products.slice(index + 1)
      products = parteUno.concat(parteDos)
    }
    await this.#writeProds(products)
  }

  // reader & writer para la var products que utiliza el paquete fs
  async #writeProds(newProds) {
    try {
      const pojoProds = newProds.map(p => p.toPOJO())
      await fs.writeFile(this.path, JSON.stringify(pojoProds, null, 2), "utf-8")
    } catch (err) {
      throw new Error(`Error escribiendo en ${this.path}`, {cause: err})
    }
  }

  async #readProds() {
    try {
      const pojoProds = JSON.parse(await fs.readFile(this.path, "utf-8").then(p => p))
      return pojoProds.map(p => new Product({
        title: p.title,
        description: p.description,
        price: p.price,
        thumbnail: p.thumbnail,
        code: p.code,
        stock: p.stock,
        id : p.id
      }))
    } catch (err) {
      throw new Error(`Error al leer ${this.path}`, {cause: err})
    }
  }
}







