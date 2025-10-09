const useDate = ({ settings }) => {
  const { idurar_app_date_format } = settings;

  const dateFormat = idurar_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
