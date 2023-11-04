import fs from "fs/promises"
import Product from "./Product.js"

class ProductManager {
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







// TESTS

try {
  await fs.rm("./products.json")
} catch (err) {
  if (err.code !== "ENOENT") throw new Error("", {cause: err})
}
await fs.writeFile("./products.json", "[]", "utf-8")

const pm = new ProductManager("./products.json")

for (let n = 0; n < 5; n++) {
  await pm.addProduct(
    `prod${n}`, "descripcion", 200 + n, "ea", `ask3${n}4`, 20 * n + 1
  )
}
console.log("productos son", await pm.getProducts())

// try {
  // // test de catch null
  // await pm.addProduct(
    // "prod", "descripcion", 200, "peaa", null, 20 
  // )
// } catch (err){
  // console.log(err)
// }

// buscar y recibir un producto existente
console.log("antes", await pm.getProductById(2))
await pm.updateProduct({id: 2, description: "descripcion mejorada"})
await pm.updateProduct({id: 1, description: "hola prross", stock: 10000})
console.log("despues", await pm.getProductById(2))
await pm.deleteProduct(1)
try {
  console.log("despues", await pm.getProductById(1))
} catch (err) {
  console.log(err)
}
