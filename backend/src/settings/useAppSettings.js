const useAppSettings = () => {
  let settings = {};
  settings['idurar_app_email'] = process.env.RESEND_FROM || 'hi@wiedesign.at';
  settings['idurar_base_url'] = process.env.PUBLIC_APP_URL || 'http://localhost:3000';
  return settings;
};

module.exports = useAppSettings;
