const adminAuth = (req, res, next) => {
  const token = "xyz"; //req.token
  console.log("Admin Auth Middleware got called");
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("Unauthorised User");
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  console.log("User Middleware got called");
  if (token === "abc") {
    next();
  } else {
    res.status("401").send("Unauthorised user!!");
  }
};

module.exports = {
  userAuth,
  adminAuth,
};
