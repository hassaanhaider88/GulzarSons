import ProductsModal from "./Product.Modal.js";

export const getAllProducts = async (req, res) => {
  try {
    var AllProducts = await ProductsModal.aggregate([
      {
        $addFields: {
          isPriceNull: { $cond: [{ $ifNull: ["$ProductPrice", false] }, 0, 1] },
        },
      },
      { $sort: { isPriceNull: 1, ProductPrice: 1 } },
    ]);

    res.send({
      data: AllProducts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    //   console.log(req.body);
    var {
      ProductCode,
      ProductName,
      ProductImgUrl,
      ProductDescript,
      Cetagroy,
      ProductPrice,
      IsProductAvailable,
    } = req.body;
    // console.log(ProductImgUrl)

    var product = await ProductsModal.create({
      ProductCode,
      ProductName,
      ProductImgUrl,
      ProductDescript,
      Cetagroy,
      ProductPrice,
      IsProductAvailable,
    });
    //   ProductsModal.save();
    res.send({
      data: product,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    var { ProductCode } = req.body;
    var product = await ProductsModal.findOne({ ProductCode });
    res.send({
      data: product,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    var {
      ProductCode,
      ProductName,
      ProductImgUrl,
      ProductDescript,
      Cetagroy,
      ProductPrice,
      IsProductAvailable,
    } = req.body;

    const updatedProduct = await ProductsModal.findOneAndUpdate(
      { ProductCode: ProductCode }, // filter
      {
        ProductName,
        ProductImgUrl,
        ProductDescript,
        Cetagroy,
        ProductPrice,
        IsProductAvailable,
      },
      {
        new: true, // return updated document
        runValidators: true, // run schema validators
      }
    );

    res.send({
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    var { ProductCode } = req.body;
    var product = await ProductsModal.findOneAndDelete({ ProductCode });
    res.send({
      data: product,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      data: error,
      success: false,
    });
  }
};
