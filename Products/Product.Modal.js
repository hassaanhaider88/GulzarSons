import mongoose from "mongoose";

var ProuductSchema = mongoose.Schema({
  ProductCode: String,
  ProductName: String,
  ProductImgUrl: Array,
  ProductDescript: String,
  Cetagroy: String,
  ProductPrice: Number,
  IsProductAvailable: Boolean,
});

var ProductsModal = mongoose.model('product',ProuductSchema)

export default ProductsModal;