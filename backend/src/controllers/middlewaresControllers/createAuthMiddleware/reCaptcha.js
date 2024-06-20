const axios = require('axios')
const reCaptcha = async({response}) =>{
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${response}`;

   try{ const reCaptchaResponse = await axios.post(url,{});
    if(reCaptchaResponse.success == false)
        return res.status(409).json({
            success: false,
            result: null,
            message: 'Captcha was wrong.Retry',
          }); }
    catch(error){
        console.error('Error verifying reCAPTCHA:', error);
        return {
            success: false,
            result: null,
            message: 'Error verifying reCAPTCHA',
        };
    }
}
module.exports = reCaptcha;