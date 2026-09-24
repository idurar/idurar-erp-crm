import { sign } from 'jsonwebtoken';
import { hashSync } from 'bcryptjs';
import { object, string } from 'joi';
import { model } from 'mongoose';

import { generate } from 'shortid';

const resetPassword = async (req, res, { userModel }) => {
  const UserPassword = model(userModel + 'Password');
  const User = model(userModel);
  const { password, userId, resetToken } = req.body;

  const databasePassword = await UserPassword.findOne({ user: userId, removed: false });
  const user = await User.findOne({ _id: userId, removed: false }).exec();

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  if (!databasePassword || !user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const isMatch = resetToken === databasePassword.resetToken;
  if (!isMatch || databasePassword.resetToken === undefined || databasePassword.resetToken === null)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid reset token',
    });

  // validate
  const objectSchema = object({
    password: string().required(),
    userId: string().required(),
    resetToken: string().required(),
  });

  const { error, value } = objectSchema.validate({ password, userId, resetToken });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid reset password object',
      errorMessage: error.message,
    });
  }

  const salt = generate();
  const hashedPassword = hashSync(salt + password);
  const emailToken = generate();

  const token = sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  await UserPassword.findOneAndUpdate(
    { user: userId },
    {
      $push: { loggedSessions: token },
      password: hashedPassword,
      salt: salt,
      emailToken: emailToken,
      resetToken: generate(),
      emailVerified: true,
    },
    {
      new: true,
    }
  ).exec();

  if (
    resetToken === databasePassword.resetToken &&
    databasePassword.resetToken !== undefined &&
    databasePassword.resetToken !== null
  )
    //  .cookie(`token_${user.cloud}`, token, {
    //       maxAge: 24 * 60 * 60 * 1000,
    //       sameSite: 'None',
    //       httpOnly: true,
    //       secure: true,
    //       domain: req.hostname,
    //       path: '/',
    //       Partitioned: true,
    //     })
    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        photo: user.photo,
        token: token,
        maxAge: req.body.remember ? 365 : null,
      },
      message: 'Successfully resetPassword user',
    });
};

export default resetPassword;
