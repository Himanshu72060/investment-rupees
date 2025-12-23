const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    gst: Number,
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Transaction", transactionSchema);