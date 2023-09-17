const updateManySetting = async (Model, req, res) => {
  try {
    // req/body = [{settingKey:"",settingValue}]
    let settingsHasError = false;
    const updateDataArray = [];
    for (const setting of req.body) {
      if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
        settingsHasError = true;
        break;
      }
      updateDataArray.push({
        updateOne: {
          filter: { settingKey: setting.settingKey },
          update: { settingValue: setting.settingValue },
        },
      });
    }

    if (updateDataArray.length === 0) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'No settings provided ',
      });
    }
    if (settingsHasError) {
      return res.status(202).json({
        success: false,
        result: null,
        message: 'Settings provided has Error',
      });
    }
    const result = await Model.bulkWrite(updateDataArray).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document by this id: ' + req.params.id,
      });
    }
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};

module.exports = updateManySetting;
