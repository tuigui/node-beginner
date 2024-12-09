import express from "express";
import { Product } from "../schemas/product.schema.js";

const productsRouter = express.Router();

productsRouter.post("/products", async (req, res) => {
  const { name, description, manager, password } = req.body;
  const product = new Product({ name, description, manager, password });
  let data = await product.save();

  data = { ...data.toJSON(), password: undefined };

  return res
    .status(201)
    .json({ status: 201, message: "상품 생성에 성공했습니다.", data });
});

productsRouter.get("/products", (req, res) => {});

productsRouter.get("/products/:id", (req, res) => {});

productsRouter.put("/products/:id", (req, res) => {});

productsRouter.delete("/products/:id", (req, res) => {});

export { productsRouter };
