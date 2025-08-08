const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../../../models/coreModels/Admin.js");
const AdminPassword = require("../../../models/coreModels/AdminPassword.js");

async function registerAdmin(req, res) {
    try {
        const { email, name, surname, photo, password } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not provided while registration"
            });
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name not provided while registration"
            });
        }

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const newAdmin = new Admin({
            email,
            name,
            surname,
            photo
        });

        const user = await newAdmin.save();

        const salt = user._id.toString();
        const hashedPassword = await bcrypt.hash(salt + password, 10);

        const newAdminPassword = new AdminPassword({
            user: user._id,
            password: hashedPassword,
            salt: salt
        });

        try {
            await newAdminPassword.save();
        } catch (err) {
            await Admin.findByIdAndDelete(user._id); // rollback
            return res.status(500).json({
                success: false,
                message: "Failed to save password.",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully.",
            result: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while registering new user",
            error: error.message
        });
    }
}

module.exports = registerAdmin;
