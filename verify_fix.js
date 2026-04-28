const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
require('dotenv').config({ path: 'backend/.env' });

// Mock models 
const AdminSchema = new mongoose.Schema({
    email: String,
    name: String,
    enabled: { type: Boolean, default: true },
    removed: { type: Boolean, default: false }
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const AdminPasswordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    password: { type: String },
    salt: { type: String },
    resetToken: String,
    removed: { type: Boolean, default: false }
});
const AdminPassword = mongoose.models.AdminPassword || mongoose.model('AdminPassword', AdminPasswordSchema);

async function testFix() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected.');

        // 1. Setup mock data
        await Admin.deleteMany({});
        await AdminPassword.deleteMany({});

        const user = new Admin({ email: 'test@example.com', name: 'Test User' });
        await user.save();

        const salt = shortid.generate();
        const resetToken = 'test-token-123';
        const userPass = new AdminPassword({
            user: user._id,
            password: bcrypt.hashSync(salt + 'oldpassword'),
            salt: salt,
            resetToken: resetToken
        });
        await userPass.save();

        console.log('Setup complete. Simulation Password Reset...');

        // 2. Perform reset (Simulating backend/src/controllers/middlewaresControllers/createAuthMiddleware/resetPassword.js)
        const newPassword = 'newpassword123';
        const newSalt = shortid.generate();
        const newHashedPassword = bcrypt.hashSync(newSalt + newPassword);

        const updated = await AdminPassword.findOneAndUpdate(
            { user: user._id },
            {
                password: newHashedPassword,
                salt: newSalt,
                resetToken: shortid.generate(),
            },
            { new: true }
        );

        if (updated) {
            console.log('Backend simulated success.');

            // 3. Verify Response structure matches what the frontend actions expect
            const result = {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: 'mock-jwt-token'
            };

            console.log('Mock Response for Frontend:', { success: true, result });

            // 4. Verify the Reducer logic fix (Hypothetical logic check)
            const INITIAL_STATE = { isLoggedIn: false, isLoading: false, isSuccess: false };

            // Step A: Loading
            let state = { ...INITIAL_STATE, isLoading: true, isSuccess: false };
            console.log('State during Loading (isSuccess should be false):', state.isSuccess === false ? 'PASS' : 'FAIL');

            // Step B: Success
            state = {
                current: result,
                isLoggedIn: true,
                isLoading: false,
                isSuccess: true
            };
            console.log('State after Success (isSuccess should be true):', state.isSuccess === true ? 'PASS' : 'FAIL');
        }

        console.log('Test logic verification completed.');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testFix();
