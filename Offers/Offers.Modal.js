import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, default: "" },
    durationDays : Number,
    validFrom: { type: Date },
    validTo: { type: Date },
    isActive: { type: Boolean, default: true },

  },
  { timestamps: true }
);

// virtual to check time left (can compute on frontend too)
offerSchema.virtual("isExpired").get(function () {
  return new Date() > this.validTo;
});

export default mongoose.model("Offer", offerSchema);
