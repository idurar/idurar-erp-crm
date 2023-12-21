const { emailVerfication, passwordVerfication } = require('@/emailTemplate/emailVerfication');

const { Resend } = require('resend');

const sendMail = async ({ email, name, link, idurar_app_email, type = 'emailVerfication' }) => {
  const resend = new Resend(process.env.RESEND_API);

  const { data } = await resend.emails.send({
    from: idurar_app_email,
    to: email,
    subject: 'Verify your email | idurar',
    html:
      type === 'emailVerfication'
        ? emailVerfication({ name, link })
        : passwordVerfication({ name, link }),
  });

  return data;
};

module.exports = sendMail;
