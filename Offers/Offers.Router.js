import express from "express";
import Offer from "./Offers.Modal.js";

const router = express.Router();

// Get all offers
router.get("/", async (req, res) => {
  const offers = await Offer.find();
  res.json({
    success: true,
    data: offers,
  });
  res.json(offers);
});

// Add new offer
router.post("/", async (req, res) => {
  const { title, description, durationDays } = req.body;
  const offer = new Offer({ title, description, durationDays });
  await offer.save();
  res.json(offer);
});

// Delete offer
router.delete("/:id", async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
