const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const getOne = require('../corsControllers/custom').getOne;

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Admin.find({ removed: false })
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' })
      .populate();
    // Counting the total documents
    const countPromise = Admin.count({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      for (let admin of result) {
        admin.password = undefined;
        admin.customMenu = undefined;
        admin.permissions = undefined;
      }
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch {
    return res.status(500).json({ success: false, result: [], message: 'Oops there is an Error' });
  }
};
exports.profile = async (req, res) => {
  try {
    //  Query the database for a list of all results
    if (!req.admin) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "couldn't found  admin Profile ",
      });
    }
    let result = {
      _id: req.admin._id,
      enabled: req.admin.enabled,
      email: req.admin.email,
      name: req.admin.name,
      surname: req.admin.surname,
      photo: req.admin.photo,

      role: req.admin.role,

      employee: req.admin.employee,
    };

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found Profile',
    });
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

exports.photo = async (req, res) => {
  try {
    // Find document by id
    const updates = {
      photo: req.body.photo,
    };

    const tmpResult = await Admin.findOneAndUpdate(
      { _id: req.admin._id, removed: false },
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
        employee: tmpResult.employee,
      };

      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id: ' + req.params.id,
      });
    }
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};
exports.read = async (req, res) => {
  try {
    // Find document by id
    const tmpResult = await Admin.findOne({
      _id: req.params.id,
      removed: false,
    });
    // If no results found, return document not found
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      let result = {
        _id: tmpResult._id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
        employee: tmpResult.employee,
      };

      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id: ' + req.params.id,
      });
    }
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        result: null,
        message: "Email or password fields they don't have been entered.",
      });

    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'An account with this email already exists.',
      });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'The password needs to be at least 8 characters long.',
      });

    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash(password);
    req.body.password = passwordHash;

    const result = await new Admin(req.body).save();
    if (!result) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "document couldn't save correctly",
      });
    }
    return res.status(200).send({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
        employee: result.employee,
      },
      message: 'Admin document save correctly',
    });
  } catch {
    return res.status(500).json({ success: false, message: 'there is error' });
  }
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (req, res) => {
  try {
    let { email } = req.body;

    if (email) {
      const existingAdmin = await Admin.findOne({ email: email });

      if (existingAdmin._id != req.params.id)
        return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    let updates = {
      role: req.body.role,
      email: req.body.email,
      employee: req.body.employee,
      name: req.body.name,
      surname: req.body.surname,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
        employee: result.employee,
      },
      message: 'we update this document by this id: ' + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let { password } = req.body;

    if (!password) return res.status(400).json({ msg: 'Not all fields have been entered.' });

    if (password.length < 8)
      return res.status(400).json({
        msg: 'The password needs to be at least 8 characters long.',
      });

    // if (password !== passwordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Enter the same password twice for verification." });
    var newAdmin = new Admin();
    const passwordHash = newAdmin.generateHash(password);
    let updates = {
      password: passwordHash,
    };

    // Find document by id and updates with the required fields
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
        employee: result.employee,
      },
      message: 'we update the password by this id: ' + req.params.id,
    });
  } catch {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await Admin.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    // If no results found, return document not found
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
        message: 'Successfully Deleted the document by id: ' + req.params.id,
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

exports.status = async (req, res) => {
  try {
    if (req.query.enabled === true || req.query.enabled === false) {
      let updates = {
        enabled: req.query.enabled,
      };
      // Find the document by id and delete it
      const result = await Admin.findOneAndUpdate(
        { _id: req.params.id, removed: false },
        { $set: updates },
        {
          new: true, // return the new result instead of the old one
        }
      ).exec();
      // If no results found, return document not found
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
          message: 'Successfully update status of this document by id: ' + req.params.id,
        });
      }
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "couldn't change admin status by this request",
        })
        .end();
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};
exports.search = async (req, res) => {
  // console.log(req.query.fields)

  // console.log(fields)
  try {
    if (req.query.q === undefined || req.query.q === '' || req.query.q === ' ') {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'No document found by this request',
        })
        .end();
    }

    const fieldsArray = req.query.fields
      ? req.query.fields.split(',')
      : ['name', 'surname', 'email'];

    const fields = { $or: [] };

    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }
    let result = await Admin.find(fields).where('removed', false).sort({ name: 'asc' }).limit(10);

    if (result.length >= 1) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: 'No document found by this request',
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Oops there is an Error',
    });
  }
};

exports.filter = async (req, res) => {
  try {
    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'filter not provided correctly',
      });
    }
    const result = await Admin.find({ removed: false })
      .where(req.query.filter)
      .equals(req.query.equal);
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents where equal to : ' + req.params.equal,
    });
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};
