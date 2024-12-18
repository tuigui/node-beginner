import express from "express";
import { Product } from "../schemas/product.schema.js";
import { createProductValidator } from "../middlewares/validators/create-product.validator.middleware.js";
import { updateProductValidator } from "../middlewares/validators/update-product.validator.middleware.js";
import { deleteProductValidator } from "../middlewares/validators/delete-product.validator.middleware.js";

const productsRouter = express.Router();

productsRouter.post(
  "/products",
  createProductValidator,
  async (req, res, next) => {
    try {
      const { name, description, manager, password } = req.body;
      const existedProduct = await Product.findOne({ name });
      if (existedProduct) {
        return res
          .status(400)
          .json({ status: 400, message: "이미 등록된 상품입니다." });
      }
      const product = new Product({ name, description, manager, password });
      let data = await product.save();

      data = { ...data.toJSON(), password: undefined };

      return res
        .status(201)
        .json({ status: 201, message: "상품 생성에 성공했습니다.", data });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/products", async (req, res, next) => {
  try {
    const data = await Product.find().sort({ createdAt: "desc" }).exec();
    return res
      .status(200)
      .json({ status: 200, message: "상품 목록 조회에 성공했습니다.", data });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Product.findById(id).exec();
    if (!data) {
      return res
        .status(404)
        .json({ status: 404, message: "상품이 존재하지 않습니다." });
    }
    return res
      .status(200)
      .json({ status: 200, message: "상품 상세 조회에 성공했습니다.", data });
  } catch (error) {
    next(error);
  }
});

productsRouter.put(
  "/products/:id",
  updateProductValidator,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, status, manager, password } = req.body;
      const existedProduct = await Product.findById(id, { password: true });
      if (!existedProduct) {
        return res
          .status(404)
          .json({ status: 404, message: "상품이 존재하지 않습니다." });
      }
      const isPasswordMatched = password === existedProduct.password;
      if (!isPasswordMatched) {
        return res.status(401).json({
          status: 401,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
      const productInfo = {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(manager && { manager }),
      };
      const data = await Product.findByIdAndUpdate(id, productInfo, {
        new: true,
      });
      return res
        .status(200)
        .json({ status: 200, message: "상품 수정에 성공했습니다.", data });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete(
  "/products/:id",
  deleteProductValidator,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const existedProduct = await Product.findById(id, { password: true });
      if (!existedProduct) {
        return res
          .status(404)
          .json({ status: 404, message: "상품이 존재하지 않습니다." });
      }
      const isPasswordMatched = password === existedProduct.password;
      if (!isPasswordMatched) {
        return res.status(401).json({
          status: 401,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
      const data = await Product.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ status: 200, message: "상품 삭제에 성공했습니다.", data });
    } catch (error) {
      next(error);
    }
  }
);

export { productsRouter };
