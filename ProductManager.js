
class ProductManager {
  constructor(path) {
    this.path = path
  }
  getProducts() {
    return this.products.map(p => p.toPOJO())
  }
  addProduct(title, description, price, thumbnail, code, stock) {
    // check si ya existe un producto con el mismo code
    if (-1 < this.products.findIndex(i => i.code === code)) { // esta linea puede ser cara
      throw new Error(`ya existe un producto con el codigo ${code}`)
    }
    this.products.push(
      new Product(title, description, price, thumbnail, code, stock)
    )
  }
  getProductById(id) {
    const prod = this.products.find(p => p.id === id)
    if (!prod) throw new Error(`No se encontro producto con id ${id}`)
    return prod.toPOJO()
  }

  // getter y setter para la var products que utiliza el paquete fs
}


class Product {
  // Clase contenedora de la informacion de los productos.

  // Variable estatica privada para llevar la cuenta de las ids generadas
  static #idCount = 0
  // Variables privadas atadas a la entidad
  #id // var que no se puede modificar
  #code // var que no se puede modificar
  #price  // var que no puede ser menor a 0

  constructor(title, description, price, thumbnail, code, stock) {
    this.#id = Product.#idCount++ // declaro id y dsp incremento
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


// Funcion de utilidad general
const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) throw new Error("El valor es nulo")
  return attrib
}



// TESTS

const pm = new ProductManager()

for (let n = 0; n < 5; n++) {
  pm.addProduct(
    `prod${n}`, "descripcion", 200 + n, "", `ask3${n}4`, 20 * n
  )
}
console.log(pm.getProducts())

try {
  // test de catch null
  pm.addProduct(
    "prod", "descripcion", 200, "", null, 20 
  )
} catch (err){
  console.log(err)
}

// buscar y recibir un producto existente
console.log(pm.getProductById(2))

try {
  // test de buscar por id que no existe
  console.log(pm.getProductById(7))
} catch (err){
  console.log(err)
}
try {
  // test de aniadir producto con codigo repetido
  pm.addProduct(
    "prod", "descripcion", 200, "", "ask314", 20 
  )
} catch (err){
  console.log(err)
}
