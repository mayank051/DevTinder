const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req;
  console.log(req);
  if (!firstName || !lastName) {
    throw new Error("Please Enter your firstName lastName");
  }
  if (!validator.isEmail(emailId))
    throw new Error("Please Enter valid email Id");
  if (!validator.isStrongPassword(password))
    throw new Error("Please Enter a strong password");
};

module.exports = { validateSignupData };
