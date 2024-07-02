const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
// const genl_routes = require("./router/general.js").general;
const genl_routes = require("./router/general_async.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // use the session authorization feature to authenticate a user
  // based on jsonwebtoken (jwt)
  const token = req.session.token;
  if (token) {
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).send("No token provided");
  }
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
