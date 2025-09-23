import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./Product.Controller.js";
var router = express.Router()

router.get('/',getAllProducts)
router.post('/create',createProduct)
router.post('/sinlge-product',getSingleProduct)
router.post('/update-product',updateProduct)
router.post('/delete-product',deleteProduct)

export default router;