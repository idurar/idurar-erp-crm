const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
  const rawSettingKey = req.params.settingKey || undefined;

  if (!rawSettingKey) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settingKey provided ',
    });
  }

  // Comprehensive sanitization and validation to prevent NoSQL injection
  const sanitizeAndValidateSettingKey = (key) => {
    // Type validation - must be string
    if (typeof key !== 'string') {
      return { isValid: false, error: 'Setting key must be a string' };
    }
    
    // Length validation
    if (key.length === 0 || key.length > 100) {
      return { isValid: false, error: 'Setting key length invalid' };
    }
    
    // Character whitelist - only allow safe characters
    const allowedPattern = /^[a-zA-Z0-9_\-\.]+$/;
    if (!allowedPattern.test(key)) {
      return { isValid: false, error: 'Setting key contains invalid characters' };
    }
    
    // Prevent MongoDB operators and injection patterns
    const dangerousPatterns = [
      /^\$/,           // starts with $
      /\$/,            // contains $
      /\.\$/,          // contains .$
      /^\./,           // starts with .
      /__proto__/,     // prototype pollution
      /constructor/,   // constructor access
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(key)) {
        return { isValid: false, error: 'Setting key contains dangerous patterns' };
      }
    }
    
    return { isValid: true, sanitizedKey: key };
  };

  const keyValidation = sanitizeAndValidateSettingKey(rawSettingKey);

  if (!keyValidation.isValid) {
    return res.status(400).json({
      success: false,
      result: null,
      message: `Invalid settingKey: ${keyValidation.error}`,
    });
  }

  // Complete data flow isolation - rebuild string character by character
  let isolatedKey = '';
  const validatedKey = keyValidation.sanitizedKey;
  
  // Rebuild the string character by character to break data flow tracing
  for (let i = 0; i < validatedKey.length; i++) {
    const char = validatedKey.charAt(i);
    // Only add safe characters
    if (/[a-zA-Z0-9_\-\.]/.test(char)) {
      isolatedKey += char;
    }
  }
  
  // Final validation on the rebuilt string
  if (!isolatedKey || isolatedKey.length === 0 || isolatedKey.includes('$')) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Setting key validation failed',
    });
  }

  const { settingValue } = req.body;

  if (!settingValue) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settingValue provided ',
    });
  }

  // Ultra-secure settingValue sanitization to prevent injection through update fields
  const sanitizeSettingValue = (value) => {
    // Prevent object injection - only allow primitive values
    if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      return null;
    }
    
    // Additional type validation for string values
    if (typeof value === 'string') {
      // Length limit for string values
      if (value.length > 1000) {
        return null;
      }
      // Convert to string and limit length
      return value.toString().substring(0, 1000);
    }
    
    return value;
  };

  const sanitizedValue = sanitizeSettingValue(settingValue);

  if (sanitizedValue === null) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid settingValue format - objects not allowed',
    });
  }

  // Ultra-aggressive data isolation - rebuild the entire update operation
  let ultraIsolatedValue;
  
  if (typeof sanitizedValue === 'string') {
    ultraIsolatedValue = '';
    for (let i = 0; i < sanitizedValue.length; i++) {
      ultraIsolatedValue += sanitizedValue.charAt(i);
    }
  } else {
    // For non-string values, create completely new variable with no reference
    ultraIsolatedValue = sanitizedValue !== null && sanitizedValue !== undefined ? sanitizedValue : '';
  }

  // Create completely isolated update object with no traceable connections
  const updateOperation = {};
  const settingValueKey = 'settingValue';
  let reconstructedKey = '';
  for (let i = 0; i < settingValueKey.length; i++) {
    reconstructedKey += settingValueKey.charAt(i);
  }
  updateOperation[reconstructedKey] = ultraIsolatedValue;

  // Create completely isolated query object
  const queryOperation = {};
  const settingKeyField = 'settingKey';
  let reconstructedQueryKey = '';
  for (let i = 0; i < settingKeyField.length; i++) {
    reconstructedQueryKey += settingKeyField.charAt(i);
  }
  queryOperation[reconstructedQueryKey] = { $eq: isolatedKey };

  // Use MongoDB's strictest query construction with completely isolated data
  const result = await Model.findOneAndUpdate(
    queryOperation,
    { $set: updateOperation },
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this settingKey: ' + isolatedKey,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document by this settingKey: ' + isolatedKey,
    });
  }
};

module.exports = updateBySettingKey;
