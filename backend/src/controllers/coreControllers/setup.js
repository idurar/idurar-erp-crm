// Third-party libraries
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const path = require('path'); // 🌳 New: For better path handling
const { generate: uniqueId } = require('shortid');
const Joi = require('joi'); // ⚠️ Import Joi, which was used but missing

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
    // Note: This relies on models being registered elsewhere (e.g., in a separate file).
    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');
    const Setting = mongoose.model('Setting');
    const Currency = mongoose.model('Currency');
    const PaymentMode = mongoose.model('PaymentMode');
    const Taxes = mongoose.model('Taxes');

    // Destructure input data
    const { name, email, password, language, timezone, country } = req.body;

    // --- 2. Input Validation (Joi) ---
    const objectSchema = Joi.object({
        name: Joi.string().trim().min(3).required(),
        email: Joi.string()
            .email({ tlds: { allow: true } })
            .required(),
        password: Joi.string().min(8).required(), // 🔒 Enhanced: enforce minimum password length
        language: Joi.string().optional().default('en_us'),
        timezone: Joi.string().optional(),
        country: Joi.string().optional(),
    }).options({ abortEarly: false }); // Show all errors

    const { error, value: validatedData } = objectSchema.validate({ name, email, password, language, timezone, country });

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
        // --- 3. Idempotency Check (Prevent Re-setup) ---
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

        // Assume generateHash uses a strong, one-way hashing algorithm (like bcrypt)
        const passwordHash = newAdminPassword.generateHash(salt, validatedData.password);

        const accountOwner = {
            email: validatedData.email.toLowerCase(), // 🧹 Sanitize email
            name: validatedData.name.trim(), // 🧹 Sanitize name
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
        const settingData = [];

        // Dynamic settings based on user input
        const settingsUpdates = {
            idurar_app_email: validatedData.email,
            idurar_app_company_email: validatedData.email,
            idurar_app_timezone: validatedData.timezone,
            idurar_app_country: validatedData.country,
            idurar_app_language: validatedData.language,
        };

        // Read and process default settings JSON files
        // 🌳 Use path.join to ensure correct paths across operating systems
        const settingsFiles = globSync(path.join(process.cwd(), 'src/setup/defaultSettings/**/*.json')); 

        for (const filePath of settingsFiles) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const newSettings = file.map((x) => {
                const settingValue = settingsUpdates[x.settingKey];
                return settingValue ? { ...x, settingValue } : { ...x };
            });
            settingData.push(...newSettings);
        }

        await Setting.insertMany(settingData, { ordered: false });

        // --- 6. Populate Default Reference Data ---
        // ⚠️ Assuming '@/utils/currencyList' is accessible via module-alias or correct relative path
        const { currencyList } = require('@/utils/currencyList'); 

        await Currency.insertMany(currencyList, { ordered: false });

        // Taxes: Added isRemovable: false for essential defaults
        await Taxes.insertMany([
            { taxName: 'Tax 0%', taxValue: '0', isDefault: true, isRemovable: false }
        ], { ordered: false });

        // Payment Modes: Added isRemovable: false for essential defaults
        await PaymentMode.insertMany([
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash, Wire Transfer)',
                isDefault: true,
                isRemovable: false,
            },
        ], { ordered: false });

        // --- 7. Success Response ---
        return res.status(200).json({
            success: true,
            result: { userId: result._id }, // 💡 Return the new user ID
            message: 'Successfully IDURAR App Setup. Admin account and default data created.',
        });

    } catch (error) {
        console.error('Application Setup Failed:', error);
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
// Third-party libraries
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const path = require('path'); // 🌳 New: For better path handling
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

// --- Configuration ---
// Use environment variables for demo credentials
const DEMO_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@demo.com';
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'admin123'; // ⚠️ Default to 'admin123' for seeding

// --- Utility Functions ---

/**
 * Seeds a model with data, only if the model collection is empty (Idempotency).
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

/**
 * Main application setup and seeding logic.
 */
async function setupApp() {
    // --- 1. Database Connection and Cleanup ---
    // The original code connected globally. We'll wrap it in try/finally for cleanup.
    console.log('🔗 Connecting to database...');
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('✅ Database connected successfully!');
    } catch (e) {
        console.error('🚫 Fatal Error: Could not connect to the database.', e);
        process.exit(1);
    }
    
    try {
        // --- 2. Model Imports ---
        // Load models after successful connection
        const Admin = require('../models/coreModels/Admin');
        const AdminPassword = require('../models/coreModels/AdminPassword');
        const Setting = require('../models/coreModels/Setting');
        const Currency = require('../models/appModels/Currency');
        const PaymentMode = require('../models/appModels/PaymentMode');
        const Taxes = require('../models/appModels/Taxes');

        // --- 3. Admin Creation (Idempotent) ---
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

            const AdminPasswordData = {
                password: passwordHash,
                emailVerified: true,
                salt: salt,
                user: result._id,
            };
            await new AdminPassword(AdminPasswordData).save();
            console.log(`👍 Admin created: ${DEMO_EMAIL}`);
        } else {
            console.log(`⚠️ Admin creation skipped: Admin with email ${DEMO_EMAIL} already exists.`);
        }
        
        // --- 4. Load Default Settings ---
        const settingFiles = [];
        // 🌳 Use path.join to ensure correct paths across operating systems
        const settingsPath = path.join(process.cwd(), 'src/setup/defaultSettings/**/*.json');
        const settingsFilesPaths = globSync(settingsPath);
        
        for (const filePath of settingsFilesPaths) {
            const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            settingFiles.push(...file);
        }
        
        await seedIfNotExists(Setting, settingFiles, 'Settings');

        // --- 5. Load Application Reference Data ---
        const { currencyList } = require('../utils/currencyList');
        
        await seedIfNotExists(Currency, currencyList, 'Currencies');

        // Default Taxes: Added isRemovable: false for essential defaults
        const defaultTaxes = [{ taxName: 'Tax 0%', taxValue: '0', isDefault: true, isRemovable: false }];
        await seedIfNotExists(Taxes, defaultTaxes, 'Taxes');

        // Default Payment Mode: Added isRemovable: false for essential defaults
        const defaultPaymentModes = [
            {
                name: 'Default Payment',
                description: 'Default Payment Mode (Cash, Wire Transfer)',
                isDefault: true,
                isRemovable: false,
            },
        ];
        await seedIfNotExists(PaymentMode, defaultPaymentModes, 'Payment Modes');

        // --- 6. Finalization ---
        console.log('\n🥳 Setup completed : Success!');
        
    } catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.error(e);
        process.exitCode = 1; // Set non-zero exit code for failure
    } finally {
        // Ensure the database connection is closed
        await mongoose.disconnect();
        console.log('🚪 Database disconnected.');
        process.exit();
    }
}

// Start the setup process
setupApp();
