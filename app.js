const express = require("express");
var cors = require("cors");
const yup = require("yup");
const { Op } = require("sequelize");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { eAdmin } = require("./middlewares/auth");
const User = require("./models/User");

const app = express();

app.use(express.json());

// permitindo acesso de API externas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
  app.use(cors());
  next();
});

// routes
app.get("/users/:page", eAdmin, async (req, res) => {
  const { page = 1 } = req.params;
  const limit = 40;
  var lastPage = 1;

  // quantos registros existem no banco de dados
  const countUser = await User.count();
  if (countUser === null) {
    return res.status(400).json({
      error: true,
      message: "ERROR: No users found!"
    });
  } else {
    lastPage = Math.ceil(countUser / limit);
  }

  await User.findAll({
    attributes: ["id", "name", "email"],
    order: [["id", "DESC"]],
    offset: Number((page * limit) - limit),
    limit: limit
  })
    .then((users) => {
      return res.json({
        error: false,
        users,
        countUser,
        lastPage
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

  const schema = yup.object().shape({
    password: yup.string("ERROR: Need to fill in the password field!")
      .required("ERROR: Need to fill in the password field!")
      .min(6, "ERROR: Password must be at least 6 characters long!"),
    email: yup.string("ERROR: Need to fill in the email field!")
      .email("ERROR: Need to fill in the email field!")
      .required("ERROR: Need to fill in the email field!"),
    name: yup.string("ERROR: Need to fill in the name field!")
      .required("ERROR: Need to fill in the name field!")
  });

  try {
    await schema.validate(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: true,
      message: err.errors
    });
  };

  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (user) {
    return res.status(400).json({
      error: true,
      message: "ERROR: This email is already registered!"
    });
  }

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

  const schema = yup.object().shape({
    // password: yup.string("ERROR: Need to fill in the password field!")
    //   .required("ERROR: Need to fill in the password field!")
    //   .min(6, "ERROR: Password must be at least 6 characters long!"),
    email: yup.string("ERROR: Need to fill in the e-mail field!")
      .email("ERROR: Need to fill in the e-mail field!")
      .required("ERROR: Need to fill in the e-mail field!"),
    name: yup.string("ERROR: Need to fill in the name field!")
      .required("ERROR: Need to fill in the name field!")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.errors
    });
  };

  const user = await User.findOne({
    where: {
      email: req.body.email,
      id: {
        [Op.ne]: id
      }
    }
  });
  if (user) {
    return res.status(400).json({
      error: true,
      message: "ERROR: This email is already registered!"
    });
  }

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

  const schema = yup.object().shape({
    password: yup.string("ERROR: Need to fill in the password field!")
      .required("ERROR: Need to fill in the password field!")
      .min(6, "ERROR: Password must be at least 6 characters long!")
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.errors
    });
  };

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

  // await sleep(3000); // atrasando por 3kms

  // function sleep(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms);
  //   });
  // };

  const user = await User.findOne({
    attributes: ["id", "name", "email", "password"],
    where: { email: req.body.email }
  });

  if (user === null) {
    return res.status(400).json({
      error: true,
      message: "ERROR: Incorrect username or password!"
    });
  };

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      error: true,
      message: "ERROR: Incorrect username or password!"
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

app.get("/validate-token", eAdmin, async (req, res) => {
  await User.findByPk(req.userId, { attributes: ["id", "name", "email"] })
    .then((user) => {
      return res.json({
        error: false,
        user
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: Its necessary to login access the page!"
      });
    });
});

app.get("/view-profile", eAdmin, async (req, res) => {
  const id = req.userId;

  await User.findByPk(id)
    .then((user) => {
      return res.json({
        error: false,
        user
      });
    }).catch(() => {
      return res.status(400).json({
        error: true,
        message: "ERROR: No users found!"
      });
    });
});

app.listen(8080, () => {
  console.log("Server started on port 8080: http://localhost:8080");
});