import { Router } from "express";
import { getAllProducts, getProductById } from "../services/productService";

const router = Router();

router.get("/", (req, res) => {
  res.json(getAllProducts());
});

router.get("/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export default router;
