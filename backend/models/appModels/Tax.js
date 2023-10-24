const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");
mongoose.Promise = global.Promise;

const TaxSchema = new mongoose.Schema({
    taxName: {
        type: String,
        required: true,
    },
    taxValue: {
        type: Number,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Tax', TaxSchema);
