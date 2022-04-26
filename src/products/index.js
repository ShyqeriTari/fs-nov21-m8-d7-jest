import express from "express"
import Product from "./model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
        try {
            const product = new Product(req.body)
            await product.save()
            res.status(201).send(product)
        } catch {
            res.status(400).send()
        }
    })

    productsRouter.get("/:id", async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id)
            if (!product) {
                return res.status(404).send()
            }
            res.send(product)
        } catch (error) {
            res.status(400).send()
        }
    })

    productsRouter.delete("/:id", async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
            if (product) {
                return res.status(204).send()
            } else {
                return res.status(404).send()
            }
        } catch (error) {
            res.status(400).send()
        }
    })

    productsRouter.put("/:id", async (req, res, next) => {
        try {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
          );
      
          if (!updatedProduct) {
            return res.status(404).send();
          }
          return res.status(200).send(updatedProduct);
        } catch (error) {
          res.status(400).send()
        }
      });

export default productsRouter