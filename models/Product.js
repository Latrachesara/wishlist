const mongoose = require("mongoose")
const { modelName } = require("./User")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    userId: {
      type: String,
      required: true,
    },
    wishlistId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("product", productSchema)