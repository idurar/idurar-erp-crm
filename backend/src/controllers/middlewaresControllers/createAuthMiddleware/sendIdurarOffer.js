import { afterRegistrationSuccess } from '#emailTemplate/emailVerfication';
import { Resend } from 'resend';

const sendIdurarOffer = async ({ email, name }) => {
  const resend = new Resend(process.env.RESEND_API);

  const { data } = await resend.emails.send({
    from: 'hello@idurarapp.com',
    to: email,
    subject: `Customize IDURAR ERP CRM or build your own SaaS`,
    html: afterRegistrationSuccess({ name }),
  });

  return data;
};

export default sendIdurarOffer;
