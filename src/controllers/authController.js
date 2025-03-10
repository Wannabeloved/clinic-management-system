import User from "../models/User.js";

export const login = async (email, password) => {
  console.log("login controller");
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log("user", user);
  // const isValid = await user.comparePassword(password);
  const isValid = (await password) == user.password;
  if (!user || !isValid) {
    throw new Error("Неверный email или пароль");
  }

  return user;
};

export const renderLoginPage = userId => {
  if (userId) {
    return { redirect: "/applications" };
  }
  return { render: "login", data: { error: null } };
};
