const User = require("../users/model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../errors");
const { createJWT, createTokenUser } = require("../../utils");

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomAPI.BadRequestError("Please provide email and password");
    }

    const result = await User.findOne({
      email: email,
    });

    if (!result) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const token = createJWT({ payload: createTokenUser(result) });
    if (result.role === "servicer") {
      return res.status(StatusCodes.OK).json({
        message: "Login Success",
        data: token,
      });
    } else {
      throw new CustomAPI.UnauthorizedError("Invalid Roles");
    }
  } catch (error) {
    next(error);
  }
};
const signinAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomAPI.BadRequestError("Please provide email and password");
    }

    const result = await User.findOne({
      email: email,
    });

    if (!result) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }
    if (result.role !== "admin") {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new CustomAPI.UnauthorizedError("Invalid Credentials");
    }

    const token = createJWT({ payload: createTokenUser(result) });

    return res.status(StatusCodes.OK).json({
      message: "Login Success",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const resCreate = await User.create({
      email,
      name,
      password,
      role: "servicer",
    });

    const result = {
      email: resCreate.email,
      name: resCreate.name,
      role: "servicer",
    };

    return res.status(StatusCodes.OK).json({
      message: "success create account, please check your email",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const signupAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const resCreate = await User.create({
      email,
      name,
      password,
      role: "admin",
    });

    const result = {
      email: resCreate.email,
      name: resCreate.name,
      role: "admin",
    };

    return res.status(StatusCodes.OK).json({
      message: "success create admin account",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const resetPasswordServicerByAdmin = async (req, res, next) => {
  try {
    const {id} = req.params
    const {password} = req.body

    const user = await User.findOne({_id : id})
    if(!user){
      throw CustomAPI.NotFoundError("User not found")
    }

    user.password = password
    await user.save()
    return res.status(StatusCodes.OK).json({
      message: "Reset Password Success",
      data: user,
    });

  } catch (error) {
    next(error)
  }
}

const resetPasswordServicer = async (req, res, next) => {
  try {
    
    const {userId: id} = req.user
    const {password} = req.body

    const user = await User.findOne({_id : id})
    if(!user){
      throw CustomAPI.NotFoundError("User not found")
    }

    user.password = password
    await user.save()
    return res.status(StatusCodes.OK).json({
      message: "Reset Password Success",
      data: user,
    });

  } catch (error) {
    next(error)
  }
}

module.exports = {
  signin,
  signup,
  signinAdmin,
  signupAdmin,
  resetPasswordServicerByAdmin,
  resetPasswordServicer
};
