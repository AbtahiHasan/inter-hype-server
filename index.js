require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("coffee is running")
})



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.oasvurr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const database = client.db("InterHype-shop")
    const products = database.collection("products")

    app.get("/products", async (req, res) => {
      const allProducts = products.find()
      const result = await allProducts.toArray()
      res.send(result)
    })
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id
      const product = await products.findOne({_id: new ObjectId(id)})
      res.send(product)
    })

    app.post("/add-product", async (req, res) => {
      const product = req.body 
      const result = await products.insertOne(product)
      res.send(result)
    })
    app.put("/update-product/:id", async (req, res) => {
      const id = req.params.id
      const product = req.body 
      console.log(product)
      const updatedProduct = await products.updateOne({_id: new ObjectId(id)}, {$set: {product}}, {upsert: true})
      res.send(updatedProduct)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  catch(error) {
    console.log(error)
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`this server running at ${port}`)
})
