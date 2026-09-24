import { object, string } from 'joi';

import { model } from 'mongoose';

import authUser from './authUser';

const login = async (req, res, { userModel }) => {
  const UserPasswordModel = model(userModel + 'Password');
  const UserModel = model(userModel);
  const { email, password } = req.body;

  // validate
  const objectSchema = object({
    email: string()
      .email({ tlds: { allow: true } })
      .required(),
    password: string().required(),
  });

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  const user = await UserModel.findOne({ email: email, removed: false });

  // console.log(user);
  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.',
    });

  const databasePassword = await UserPasswordModel.findOne({ user: user._id, removed: false });

  if (!user.enabled)
    return res.status(409).json({
      success: false,
      result: null,
      message: 'Your account is disabled, contact your account adminstrator',
    });

  //  authUser if your has correct password
  authUser(req, res, {
    user,
    databasePassword,
    password,
    UserPasswordModel,
  });
};

export default login;
