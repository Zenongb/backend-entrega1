import { notNull } from "./lib.js"

export default class Product {
  // Clase contenedora de la informacion de los productos.

  // Variable estatica privada para llevar la cuenta de las ids generadas
  static #idCount = 0
  // Variables privadas atadas a la entidad
  #id // var que no se puede modificar
  #code // var que no se puede modificar
  #price  // var que no puede ser menor a 0

  constructor({title, description, price, thumbnail, code, stock, id=undefined}) {
    // check de nullishness
    let kill = false
    switch (true) {
      case !title:
      case !description:
      case !price:
      case !code:
      case !stock:
        kill = true
    }
    if (kill) throw new Error("Faltan parametros para crear Producto")
    // check de id para cuando se "crean" productos leidos
    id = Number(id)
    if (!isNaN(id)) {
      this.#id = id
      Product.#idCount = ++id 
    } else {
      this.#id = Product.#idCount++ // declaro id y dsp incremento
    }
    this.title = notNull(title)
    this.description = description
    this.price = notNull(price)
    this.thumbnail = thumbnail
    this.#code = notNull(code)
    this.stock = notNull(stock)
  }

  set price(newPrice) {
    newPrice = Number(newPrice)
    // check si es num 
    if (isNaN(newPrice)) throw new Error("El nuevo precio no es un numero")
    if (newPrice < 0) throw new Error("El precio es menor a 0")
    this.#price = newPrice
  }

  get price() {
    return this.#price
  }

  get id() {
    return this.#id
  }

  get code() {
    return this.#code
  }

  toPOJO() {
    // metodo para formatear los datos de la instancia en un objeto
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      thumbnail: this.thumbnail,
      code: this.code,
      stock: this.stock
    }
  }
}
