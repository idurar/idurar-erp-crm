import { emailVerfication, passwordVerfication } from '#emailTemplate/emailVerfication.js';

import { Resend } from 'resend';

const sendMail = async ({ email, name, link, idurar_app_email, type = 'emailVerfication' }) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default sendMail;
