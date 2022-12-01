const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { eAdmin } = require("./middlewares/auth");
const User = require("./models/User");

const app = express();

app.use(express.json());

// routes
app.get("/users", eAdmin, async (req, res) => {

  await User.findAll({
    attributes: ["id", "name", "email", "password"],
    order: [["id", "DESC"]]
  })
    .then((users) => {
      return res.json({
        error: false,
        users
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: No users found!"
      });
    });
});

app.get("/user/:id", eAdmin, async (req, res) => {
  const { id } = req.params;

  // await User.findAll({ where: { id: id } })
  await User.findByPk(id)
    .then((user) => {
      return res.json({
        error: false,
        user: user
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: No users found!"
      });
    });
});

app.post("/user", eAdmin, async (req, res) => {
  var data = req.body;
  data.password = await bcrypt.hash(data.password, 8);

  await User.create(data)
    .then(() => {
      return res.json({
        error: false,
        message: "Successfully registered user!"
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: User not registered successfully!"
      });
    });
});

app.put("/user", eAdmin, async (req, res) => {
  const { id } = req.body;

  await User.update(req.body, { where: { id } })
    .then(() => {
      return res.json({
        error: false,
        message: "User successfully edited!"
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: User not edited successfully!"
      });
    });
});

app.put("/user-password", eAdmin, async (req, res) => {
  const { id, password } = req.body;

  var passwordCrypt = await bcrypt.hash(password, 8);

  await User.update({ password: passwordCrypt }, { where: { id } })
    .then(() => {
      return res.json({
        error: false,
        message: "Password successfully edited!"
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: Password not edited successfully!"
      });
    });
});

app.delete("/user/:id", eAdmin, async (req, res) => {
  const { id } = req.params;

  await User.destroy({ where: { id } })
    .then(() => {
      return res.json({
        error: false,
        message: "User successfully deleted!"
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: User not deleted successfully!"
      });
    });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({
    attributes: ["id", "name", "email", "password"],
    where: { email: req.body.email }
  });

  if (user === null) {
    return res.status(400).json({
      error: true,
      message: "ERROR: No user found!"
    });
  };

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      error: true,
      message: "ERROR: Invalid password!"
    });
  };

  var token = jwt.sign({ id: user.id }, process.env.SECRET, {
    //expiresIn: 600 // 10min expira
    expiresIn: "7d" // 7 dias
  });

  return res.json({
    error: false,
    message: "Successful login made!",
    token
  });
});


app.listen(8080, () => {
  console.log("Server started on port 8080: http://localhost:8080");
});