import { User } from "@/models";
import { ApiError } from "@/utils";
import { RegisterDTO, LoginDTO } from "@/dto";
import { tokenService } from "@/services";

export const registerUser = async (data: RegisterDTO) => {
  const [emailTaken, usernameTaken] = await Promise.all([
    User.isEmailTaken(data.email),
    User.isUsernameTaken(data.username),
  ]);

  if (emailTaken) {
    throw new ApiError(409, "This email already exists");
  }

  if (usernameTaken) {
    throw new ApiError(409, "This username already exists");
  }

  return User.create({
    username: data.username,
    email: data.email,
    authentication: { password: data.password },
  });
};

export const loginUser = async (data: LoginDTO) => {
  const user = await User.findOne({ email: data.email }).select("+authentication.password");

  if (!user || !(await user.doPasswordsMatch(data.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  return user;
};

export const refreshAuth = async (refreshToken: string) => {
  const payload = tokenService.verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return user;
};
