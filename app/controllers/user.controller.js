const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  if (!req.body?.username) {
    return next(new ApiError(404, "Username cannot be empty"));
  }

  if (!req.body?.password) {
    return next(new ApiError(404, "Password cannot be empty"));
  }

  const username = req.body.username.toLowerCase();

  try {
    const userService = new UserService(MongoDB.client);

    const user = await userService.getUser(username);

    if (Object.keys(user).length) {
      return next(new ApiError(409, "Username already exists."));
    } else {
      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);

      // Create user
      const newUser = await userService.createUser({
        username: username,
        password: encryptedPassword,
      });

      return res.send({
        username: newUser.username,
      });
    }
  } catch (e) {
    console.log(e);
    return next(
      new ApiError(500, "An error occurred while creating the user.")
    );
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.username) {
    return next(new ApiError(404, "Username cannot be empty"));
  }

  if (!req.body?.password) {
    return next(new ApiError(404, "Password cannot be empty"));
  }

  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  try {
    const userService = new UserService(MongoDB.client);

    const user = await userService.getUser(username);
    if (!Object.keys(user).length) {
      return next(new ApiError(401, "User does not exist."));
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Password is incorrect."));
    }

    // Create token
    const id = user[0]._id.toString();
    const role = user[0].role;
    const token = jwt.sign({ id: id, role: role }, process.env.TOKEN_KEY, {
      expiresIn: "10h",
    });

    // Update user
    const updateUser = await userService.update(id, {
      token: token,
    });

    return res.send({
      token: updateUser.token,
    });
  } catch (e) {
    console.log(e);
    return next(new ApiError(500, "An error occurred while user login."));
  }
};
