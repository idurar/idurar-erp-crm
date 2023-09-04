const isClientExist = async (Model, req) => {
    // check for existing employee
    const { email, phone } = req.body
    let isExist;
    if (email || phone) {
        isExist = await Model.findOne({ email, phone })
        // console.log({ isExist });
    }
    return isExist
}

module.exports = isClientExist