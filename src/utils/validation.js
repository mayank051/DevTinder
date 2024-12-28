const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req;
  if (!firstName || !lastName) {
    throw new Error("Please Enter your firstName lastName");
  }
  if (!validator.isEmail(emailId))
    throw new Error("Please Enter valid email Id");
  if (!validator.isStrongPassword(password))
    throw new Error("Please Enter a strong password");
};

const validateProfileEditData = (req) => {
  const validFields = [
    "firstName",
    "lastName",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isValidEditRequest = Object.keys(req).every((field) =>
    validFields.includes(field)
  );
  return isValidEditRequest;
};

module.exports = { validateSignupData, validateProfileEditData };
