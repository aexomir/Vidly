const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 10,
  },
  isGold: { type: Boolean, required: false, default: false },
  phone: {
    type: Number,
    match: /.*090.*/,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
