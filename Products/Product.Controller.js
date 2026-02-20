import ProductsModal from "./Product.Modal.js";
import getYTCode from "../Services/getYTCode.js";

export const getAllProducts = async (req, res) => {
  try {
    var AllProducts = await ProductsModal.aggregate([
      {
        $addFields: {
          isPriceNull: { $cond: [{ $ifNull: ["$ProductOriginalPrice", false] }, 0, 1] },
        },
      },
      { $sort: { isPriceNull: 1, ProductOriginalPrice: 1 } },
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
      ProductYTVideoUrl,
      Cetagroy,
      ProductOriginalPrice,
      ProductOfferPrice,
      IsProductAvailable,
    } = req.body;

    var YTCode = getYTCode(ProductYTVideoUrl);

    var product = await ProductsModal.create({
      ProductCode,
      ProductName,
      ProductImgUrl,
      ProductDescript,
      ProductYTVideoCode: YTCode,
      Cetagroy,
      ProductOriginalPrice,
      ProductOfferPrice,
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

    if (!product) {
      return res.send({
        success: false,
        message: "Product not found",
      });
    }


    var relatedProducts = await ProductsModal.find({
      Cetagroy: product.Cetagroy,
      ProductCode: { $ne: ProductCode },
    })
      .limit(3)
      .lean();


    res.send({
      success: true,
      data: product,
      relatedProducts: relatedProducts,
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
      ProductYTVideoUrl,
      Cetagroy,
      ProductOriginalPrice,
      ProductOfferPrice,
      IsProductAvailable,
    } = req.body;

    var YTCode = getYTCode(ProductYTVideoUrl);
    const updatedProduct = await ProductsModal.findOneAndUpdate(
      { ProductCode: ProductCode }, // filter
      {
        ProductName,
        ProductImgUrl,
        ProductDescript,
        ProductYTVideoCode: YTCode,
        Cetagroy,
        ProductOriginalPrice,
        ProductOfferPrice,
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


export const rssRoutes = async (req, res) => {
  try {
    const products = await ProductsModal.find({
      IsProductAvailable: true,
      ProductImgUrl: { $exists: true, $ne: [] }
    }).lean();

    let itemsXml = "";

    products.forEach(product => {
      const mediaXml = (product.ProductImgUrl || [])
        .map(url => `
      <media:content
        url="${url}"
        medium="image"
      />`)
        .join("");

      itemsXml += `
    <item>
      <title><![CDATA[${product.ProductName}]]></title>
      <link>https://gulzarsonsfurniture.com/SinleProductView.html?PCode=${product.ProductCode}</link>
      <description><![CDATA[${product.ProductDescript || ""}]]></description>
      ${mediaXml}
    </item>`;
    });


    const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>Gulzar Sons Furniture</title>
        <link>https://gulzarsonsfurniture.com</link>
        <description>Luxury Furniture Designs</description>
        ${itemsXml}
      </channel>
    </rss>`;

    res.set("Content-Type", "application/xml");
    res.send(rss);

  } catch (error) {
    res.status(500).send("Failed to generate RSS feed");
  }
}