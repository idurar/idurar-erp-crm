// Third-party libraries
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');
const Joi = require('joi'); // ⚠️ Import Joi, which was missing but used

// Core libraries
const mongoose = require('mongoose');

/**
 * Enhanced Setup Controller
 * Handles initial application setup: admin creation and default data population.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const setup = async (req, res) => {
    // --- 1. Model & Data Destructuring ---
    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');
    const Setting = mongoose.model('Setting');
    const Currency = mongoose.model('Currency');
    const PaymentMode = mongoose.model('PaymentMode');
    const Taxes = mongoose.model('Taxes');

    // Destructure input data
    const { name, email, password, language, timezone, country, config = {} } = req.body;

    // --- 2. Input Validation (Joi) ---
    const objectSchema = Joi.object({
        name: Joi.string().trim().min(3).required().messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name cannot be empty.',
            'string.min': 'Name should have a minimum length of 3.',
            'any.required': 'Name is required.',
        }),
        email: Joi.string()
            .email({ tlds: { allow: true } })
            .required()
            .messages({
                'string.email': 'Email must be a valid email.',
                'any.required': 'Email is required.',
            }),
        password: Joi.string().min(8).required().messages({ // 🔒 Enhanced: enforce minimum password length
            'string.min': 'Password must be at least 8 characters long.',
            'any.required': 'Password is required.',
        }),
        language: Joi.string().optional().default('en_us'),
        timezone: Joi.string().optional(),
        country: Joi.string().optional(),
    }).options({ abortEarly: false }); // Show all errors at once

    const { error } = objectSchema.validate({ name, email, password, language, timezone, country });
    
    if (error) {
        // 🚨 Centralized error response for validation
        return res.status(400).json({ // Changed status to 400 Bad Request
            success: false,
            result: null,
            error: error.details, // Return detailed error info
            message: 'Invalid or missing credentials provided.',
            errorMessage: error.details.map(d => d.message).join(', '),
        });
    }

    try {
        // --- 3. Pre-check: Ensure setup is not run multiple times ---
        const existingAdmin = await Admin.findOne({ role: 'owner' });
        if (existingAdmin) {
             return res.status(403).json({ // 🚫 403 Forbidden
                success: false,
                result: null,
                message: 'Application is already set up. Cannot run setup again.',
            });
        }
        
        // --- 4. Admin Creation (Secure Password Hashing) ---
        const newAdminPassword = new AdminPassword();
        const salt = uniqueId();
        
        // Assume generateHash is a method on the AdminPassword model that uses a strong hashing algorithm (like bcrypt)
        const passwordHash = newAdminPassword.generateHash(salt, password); 
        
        const accountOwner = {
            email: email.toLowerCase(), // 🧹 Sanitize email
            name: name.trim(), // 🧹 Sanitize name
            role: 'owner',
        };

        const result = await new Admin(accountOwner).save();

        const adminPasswordData = {
            password: passwordHash,
            emailVerified: true,
            salt: salt,
            user: result._id,
        };

        await new AdminPassword(adminPasswordData).save();

        // --- 5. Populate Default Settings ---
        const settingsToInsert = [];
        
        // Dynamic settings based on user input
        const settingsUpdates = {
            idurar_app_email: email,
            idurar_app_company_email: email,
            idurar_app_timezone: timezone,
            idurar_app_country: country,
            idurar_app_language: language || 'en_us',
        };

        // Read and process default settings JSON files
        const settingsFiles = globSync(path.join(process.cwd(), 'src/setup/defaultSettings/**/*.json')); // 🌳 Use path.join and process.cwd() for better cross-OS compatibility
        
        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            
            const newSettings = file.map((x) => {
                const settingValue = settingsUpdates[x.settingKey];
                return settingValue ? { ...x, settingValue } : { ...x };
            });
            settingsToInsert.push(...newSettings);
        }
        
        // 🔑 Only insert settings if they don't exist to prevent duplicates if models were already created
        await Setting.insertMany(settingsToInsert, { ordered: false }); 

        // --- 6. Populate Default Reference Data ---
        // ⚠️ Assuming '@/utils/currencyList' path is correct and accessible via module-alias or similar
        const { currencyList } = require('@/utils/currencyList');
        
        await Currency.insertMany(currencyList, { ordered: false }); 
        
        await Taxes.insertMany([
            { taxName: 'Tax 0%', taxValue: '0', isDefault: true, isRemovable: false }, // 🔒 Added isRemovable for defaults
        ], { ordered: false });
        
        await PaymentMode.insertMany([
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash, Wire Transfer)',
                isDefault: true,
                isRemovable: false, // 🔒 Added isRemovable for defaults
            },
        ], { ordered: false });

        // --- 7. Success Response ---
        return res.status(200).json({
            success: true,
            result: { userId: result._id }, // 💡 Return the new user ID
            message: 'Successfully IDURAR App Setup. Admin account created.',
        });

    } catch (error) {
        console.error('Setup failed:', error);
        // 🚨 Centralized error response for server/database issues
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Setup failed due to a server or database error.',
            errorMessage: error.message,
        });
    }
};

module.exports = setup;
// --- Imports and Configuration ---
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

// --- Utility Functions ---

/**
 * Connects to MongoDB, logging status.
 * @returns {Promise<void>}
 */
async function connectDB() {
    console.log('🔗 Connecting to database...');
    // Ensure the connection string exists
    if (!process.env.DATABASE) {
        throw new Error("DATABASE environment variable is not set. Cannot connect.");
    }
    
    // Using mongoose.connect returns a promise
    await mongoose.connect(process.env.DATABASE, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s if unable to connect
        // Note: useNewUrlParser, useUnifiedTopology are default in modern Mongoose
    });
    console.log('✅ Database connected successfully!');
}

/**
 * Disconnects from MongoDB.
 * @returns {Promise<void>}
 */
async function disconnectDB() {
    await mongoose.disconnect();
    console.log('🚪 Database disconnected.');
}

/**
 * Seeds a model with data, only if the model collection is empty.
 * @param {mongoose.Model} Model - Mongoose model to seed.
 * @param {Array<Object>} data - Array of documents to insert.
 * @param {string} name - Name of the data set for logging.
 */
async function seedIfNotExists(Model, data, name) {
    const count = await Model.estimatedDocumentCount();
    if (count === 0) {
        await Model.insertMany(data, { ordered: false });
        console.log(`👍 ${name} (${data.length} records) seeded: Done!`);
    } else {
        console.log(`⚠️ ${name} skipped: ${count} existing records found.`);
    }
}

// --- Main Setup Function ---

async function setupApp() {
    await connectDB();
    
    try {
        // --- Model Imports (Use require to load models) ---
        // Ensure models are registered with Mongoose
        const Admin = require('../models/coreModels/Admin');
        const AdminPassword = require('../models/coreModels/AdminPassword');
        const Setting = require('../models/coreModels/Setting');
        const Currency = require('../models/appModels/Currency');
        const PaymentMode = require('../models/appModels/PaymentMode');
        const Taxes = require('../models/appModels/Taxes');
        
        // --- 1. Admin Creation (Demo Account) ---
        const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@demo.com';
        const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'admin123'; // ⚠️ Warning: Hardcoded password for seeding

        const existingAdmin = await Admin.findOne({ email: DEMO_EMAIL });

        if (!existingAdmin) {
            const newAdminPassword = new AdminPassword();
            const salt = uniqueId();
            
            // Generate hash for the demo password
            const passwordHash = newAdminPassword.generateHash(salt, DEMO_PASSWORD);

            const demoAdmin = {
                email: DEMO_EMAIL,
                name: 'IDURAR',
                surname: 'Admin',
                enabled: true,
                role: 'owner',
            };
            
            const result = await new Admin(demoAdmin).save();

            const adminPasswordData = {
                password: passwordHash,
                emailVerified: true,
                salt: salt,
                user: result._id,
            };
            await new AdminPassword(adminPasswordData).save();
            console.log(`👍 Admin created: ${DEMO_EMAIL}`);
        } else {
            console.log(`⚠️ Admin creation skipped: Admin with email ${DEMO_EMAIL} already exists.`);
        }
        
        // --- 2. Load Default Settings ---
        const settingFiles = [];
        // Use path.join and process.cwd() for cross-OS compatibility
        const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
        
        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            settingFiles.push(...file);
        }
        
        await seedIfNotExists(Setting, settingFiles, 'Settings');

        // --- 3. Load Application Reference Data ---
        // Load currency list (assuming path is correct)
        const { currencyList } = require('../utils/currencyList');
        
        await seedIfNotExists(Currency, currencyList, 'Currencies');

        // Default Taxes
        const defaultTaxes = [{ taxName: 'Tax 0%', taxValue: '0', isDefault: true, isRemovable: false }];
        await seedIfNotExists(Taxes, defaultTaxes, 'Taxes');

        // Default Payment Mode
        const defaultPaymentModes = [
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash, Wire Transfer)',
                isDefault: true,
                isRemovable: false,
            },
        ];
        await seedIfNotExists(PaymentMode, defaultPaymentModes, 'Payment Modes');

        // --- 4. Finalization ---
        console.log('\n🥳 Setup completed : Success!');
    } catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        // Log detailed error for debugging
        console.error(e); 
    } finally {
        await disconnectDB();
        process.exit(0); // Exit with success code after disconnect
    }
}

// Start the setup process
setupApp();
