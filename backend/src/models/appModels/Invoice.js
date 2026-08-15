const mongoose = require('mongoose');

// --- Define Sub-schemas for Embeded Documents ---

const fileSchema = new mongoose.Schema({
    id: String,
    name: String,
    path: String, // Path or URL to the file
    description: String,
    isPublic: {
        type: Boolean,
        default: false,
    },
}, { _id: false }); // Disable _id for simple array items

const customFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true, // 🔒 Enhanced: Custom fields must have a name
    },
    fieldType: {
        type: String,
        enum: ['string', 'number', 'boolean', 'date', 'richtext'], // 💡 Enhanced: Restrict field types
        trim: true,
        lowercase: true,
        default: 'string',
    },
    fieldValue: mongoose.Schema.Types.Mixed, // Allows flexible data type
}, { _id: false });

// --- Main Product Schema ---

const schema = new mongoose.Schema({
    // --- System/Audit Fields ---
    removed: {
        type: Boolean,
        default: false,
        index: true, // 📈 Enhanced: Index for soft-delete filtering
    },
    enabled: {
        type: Boolean,
        default: true,
        index: true, // 📈 Enhanced: Index for status filtering
    },
    isPublic: {
        type: Boolean,
        default: true,
        index: true,
    },

    // --- Core Identifiers ---
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true, // 🧹 Enhanced: Trim whitespace
        text: true, // 📈 Enhanced: For full-text search capability
    },
    number: {
        type: String, // 💡 Enhanced: Product/SKU numbers are often strings (e.g., 'P-001', 'A1B2')
        unique: true, // 🔒 Enhanced: Product number should likely be unique
        trim: true,
        sparse: true, // 💡 Enhanced: Allow nulls/undefined but enforce uniqueness on existing values
    },
    
    // --- Relationships ---
    productCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductCategory',
        required: true,
        autopopulate: true,
    },
    suppliers: [{ 
        type: mongoose.Schema.ObjectId, 
        ref: 'Supplier',
        index: true, // 📈 Enhanced: Index suppliers for fast lookups
    }],

    // --- Media & Description ---
    description: String,
    title: String, // Redundant with 'name'/'description' but kept if needed
    tags: [String],
    headerImage: String, // Path/URL
    photo: String,       // Path/URL
    images: [fileSchema], // Reuses sub-schema
    files: [fileSchema],  // Reuses sub-schema

    // --- Pricing & Finance ---
    currency: {
        type: String,
        uppercase: true,
        required: true,
        trim: true,
        minlength: 3, // 🔒 Enhanced: Enforce 3-letter currency code (e.g., USD, EUR)
    },
    priceBeforeTax: {
        type: Number,
        min: 0, // 🔒 Enhanced: Price cannot be negative
    },
    taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100, // 🔒 Enhanced: Tax rate should be a percentage
    },
    price: {
        type: Number,
        required: true,
        min: 0, // 🔒 Enhanced: Price cannot be negative
        // 💡 Recommendation: Consider using a Decimal type for financial data in a real ERP.
    },
    
    // --- Customization ---
    customField: [customFieldSchema],

}, {
    timestamps: { createdAt: 'created', updatedAt: 'updated' }, // 💡 Enhanced: Use Mongoose timestamps
    collection: 'products', // 💡 Enhanced: Explicitly name collection
});

// --- Schema Middleware/Plugins ---

// 💡 Enhanced: Pre-save hook to calculate priceBeforeTax if missing, or ensure consistency
schema.pre('save', function(next) {
    if (this.isModified('price') || this.isModified('taxRate')) {
        // If priceBeforeTax is not set, calculate it from price and taxRate
        if (this.priceBeforeTax === undefined || this.priceBeforeTax === null) {
            this.priceBeforeTax = this.price / (1 + this.taxRate / 100);
        }
        // Ensure precision (optional, but good practice for finance)
        this.priceBeforeTax = parseFloat(this.priceBeforeTax.toFixed(2));
    }
    next();
});

// --- Schema Indexes ---

// The original unique index on 'name' is preserved, but defined outside the schema object
schema.index({ name: 1 }, { unique: true });

// 📈 Enhanced: Compound index for filtering products by category and status
schema.index({ productCategory: 1, enabled: 1, removed: 1 });

// 📈 Enhanced: Full-text search index on name (requires 'text: true' on name field)
schema.index({ name: 'text', description: 'text' });


// --- Plugins ---
schema.plugin(require('mongoose-autopopulate'));

// --- Export Model ---
module.exports = mongoose.model('Product', schema);
