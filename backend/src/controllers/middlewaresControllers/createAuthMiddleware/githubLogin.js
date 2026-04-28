const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const githubLogin = async (req, res, { userModel }) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'GitHub code is required.',
        });
    }

    try {
        // 1. Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Failed to obtain GitHub access token.',
            });
        }

        // 2. Get user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        const { email, name, avatar_url } = userResponse.data;

        // GitHub might not return email if it's private. Get emails separately.
        let userEmail = email;
        if (!userEmail) {
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            });
            const primaryEmail = emailResponse.data.find((e) => e.primary && e.verified);
            userEmail = primaryEmail ? primaryEmail.email : null;
        }

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Could not retrieve verified email from GitHub.',
            });
        }

        const UserModel = mongoose.model(userModel);
        const UserPasswordModel = mongoose.model(userModel + 'Password');

        const user = await UserModel.findOne({ email: userEmail, removed: false });

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
                $set: { authType: 'github' },
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
                photo: user.photo || avatar_url,
                token: token,
            },
            message: 'Successfully login user via GitHub',
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Invalid GitHub code or token exchange failed',
            error: error.message,
        });
    }
};

module.exports = githubLogin;
