function getYTCode(ProductYTVideoUrl) {
  if (ProductYTVideoUrl) {
    try {
      const url = new URL(ProductYTVideoUrl);
      const urlParams = new URLSearchParams(url.search);
      let ProductYTVideoCode = urlParams.get("v"); // standard YouTube

      // if it's a Shorts URL or embed/other format
      if (!ProductYTVideoCode) {
        // For shorts: https://www.youtube.com/shorts/<id>
        // For share link: https://youtu.be/<id>
        const pathParts = url.pathname.split("/");
        ProductYTVideoCode = pathParts.pop() || pathParts.pop(); // handle trailing slash
      }
      return ProductYTVideoCode;
    } catch (err) {
      console.error("Invalid YouTube URL:", err);
      return ProductYTVideoUrl;
    }
  }
}
export default getYTCode;