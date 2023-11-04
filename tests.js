import fs from "fs/promises"
import ProductManager from "./ProductManager.js"

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
  console.log("esperado error de que no se encontro el producto")
  console.log(err)
}
