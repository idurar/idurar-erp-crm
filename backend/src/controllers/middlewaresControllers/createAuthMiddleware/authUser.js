const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, { user, databasePassword, password, UserPasswordModel }) => {
  try {
    console.log('authUser received data:', {
      userId: user?._id,
      hasDatabasePassword: !!databasePassword,
      passwordLength: password?.length
    });

    if (!databasePassword) {
      console.error('databasePassword is null or undefined');
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Password record not found.',
      });
    }

    if (!databasePassword.salt || !databasePassword.password) {
      console.error('Invalid database password structure:', {
        hasSalt: !!databasePassword.salt,
        hasPassword: !!databasePassword.password
      });
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Invalid password record structure.',
      });
    }

    const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
    );

    await UserPasswordModel.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      {
        new: true,
      }
    ).exec();

    // .cookie(`token_${user.cloud}`, token, {
    //     maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
    //     sameSite: 'None',
    //     httpOnly: true,
    //     secure: true,
    //     domain: req.hostname,
    //     path: '/',
    //     Partitioned: true,
    //   })
    res.status(200).json({
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
      message: 'Successfully login user',
    });
  } catch (error) {
    console.error('Error in authUser:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while processing the request.',
    });
  }
};

module.exports = authUser;
