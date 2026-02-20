import mongoose from "mongoose";

var ProuductSchema = mongoose.Schema({
  ProductCode: {
    type: String,
    unique: true
  },
  ProductName: String,
  ProductImgUrl: Array,
  ProductDescript: String,
  Cetagroy: String,
  ProductYTVideoCode: String,
  ProductOriginalPrice: Number,
  ProductOfferPrice: Number,
  IsProductAvailable: Boolean,
});

var ProductsModal = mongoose.model('product', ProuductSchema)

export default ProductsModal;