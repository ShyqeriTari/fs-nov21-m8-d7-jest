import app from '../app.js'
import supertest from "supertest"
import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config()

const client = supertest(app)


describe("Testing the environment", () => {

    beforeAll(async () => {
        console.log("beforeAll")
        await mongoose.connect(process.env.MONGO_URL_TEST)
    })


    test("a very simple check", () => {
        expect(true).toBe(true);
    })

    test("that the test endpoint is returning a success message", async () => {
        const response = await client.get("/test")

        console.table(response.body)
        expect(response.body.message).toBe("Hello, World!")
    })

    const validProduct = {
        name: "Test Product",
        price: 100
    }

    let productId

    it("should test than when creating a product we are receiving a product id and a 201 status", async () => {
        const response = await client.post("/products").send(validProduct)

        expect(response.status).toBe(201)

        console.table(response.body)
        expect(response.body._id).toBeDefined()

        productId = response.body._id
    })

    const invalidProduct = {
        price: "100"
    }

    it("should test that when creating a product with invalid data we receive 400", async () => {

        const response = await client.post("/products").send(invalidProduct)

        expect(response.status).toBe(400)
    })


    it("should test that when retrieve a product with ID we are receiving a product", async () => {
        const response = await client.get("/products/" + productId)

        expect(response.status).toBe(200)
        expect(response.body.name).toBe(validProduct.name)
    })

    const invalidProductId =  "999999999999999999999999"

    it("should test that when trying to retrieve a product with wrong ID we receive a 404", async () => {
        const response = await client.get("/products/" + invalidProductId)

        expect(response.status).toBe(404)
    })

    const deleteId =  "626811a90f10274e2aeacca4"
    
    

    it("should test that when delete a product with ID we are deleting a product", async () => {
        const response = await client.delete("/products/" + deleteId)

        expect(response.status).toBe(204)
    })

    it("should test that when trying to delete a product with wrong ID we receive a 404", async () => {
        const response = await client.delete("/products/" + invalidProductId)

        expect(response.status).toBe(404)
    })

    const validNewProduct = {
        name: "changed9"
    }

    const modifyId = "6268116536c8e767aae3dbf8"

    it("should test that when modifying a product with valid data the product get modified", async () => {

        const response = await client.put("/products/" + modifyId).send(validNewProduct)

        expect(response.status).toBe(200)
        expect(response.body.name).toBe(validNewProduct.name)
        expect(typeof response.body.name).toBe("string")
    })

    it("should test that when trying to modify a product with wrong ID we receive a 404", async () => {
        const response = await client.put("/products/" + invalidProductId)     
        expect(response.status).toBe(404)
    })




    afterAll(async () => {
        console.log("afterAll")
        // await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })

})