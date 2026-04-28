const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const googleLogin = async (req, res, { userModel }) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Google ID Token is required.',
        });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        const UserModel = mongoose.model(userModel);
        const UserPasswordModel = mongoose.model(userModel + 'Password');

        const user = await UserModel.findOne({ email, removed: false });

        if (!user) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No account with this email has been registered.',
            });
        }

        if (!user.enabled) {
            return res.status(409).json({
                success: false,
                result: null,
                message: 'Your account is disabled, contact your account administrator',
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await UserPasswordModel.findOneAndUpdate(
            { user: user._id },
            {
                $push: { loggedSessions: token },
                $set: { authType: 'google' },
            },
            {
                new: true,
            }
        ).exec();

        res.status(200).json({
            success: true,
            result: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                role: user.role,
                email: user.email,
                photo: user.photo || picture,
                token: token,
            },
            message: 'Successfully login user via Google',
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Invalid Google token',
            error: error.message,
        });
    }
};

module.exports = googleLogin;
