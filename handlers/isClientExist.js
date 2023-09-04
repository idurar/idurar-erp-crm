const isClientExist = async (Model, req) => {
    // check for existing employee
    const { company, managerSurname, managerName, email, phone } = req.body
    let isExist;
    if (company || managerSurname || managerName || email || phone) {
        isExist = await Model.findOne({ email, phone })
        // console.log({ isExist });
    }
    return isExist
}

module.exports = isClientExist