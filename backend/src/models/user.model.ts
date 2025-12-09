import mongoose, { Schema, Types, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "A username is required"],
      unique: true,
      trim: true,
      minlength: [2, "A minimum of 2 characters is required"],
      maxlength: [30, "A maximum of 30 characters is required"],
    },
    email: {
      type: String,
      required: [true, "An email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    authentication: {
      password: {
        type: String,
        required: [true, "A password is required"],
        minlength: [8, "Password should contain at least 8 characters"],
        select: false,
      },
    },
    profile: {
      avatarUrl: String,
    },
  },
  {
    timestamps: true,
    methods: {
      async doPasswordMatch(candidatePassword: string): Promise<boolean> {
        if (!this.authentication?.password) return false;
        return bcrypt.compare(candidatePassword, this.authentication.password);
      },
    },
    statics: {
      async isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean> {
        const user = await this.findOne({
          email,
          _id: { $ne: excludeUserId },
        });
        return !!user;
      },
      async isUsernameTaken(username: string, excludeUserId?: Types.ObjectId): Promise<boolean> {
        const user = await this.findOne({
          username,
          _id: { $ne: excludeUserId },
        });
        return !!user;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("authentication.password") || !this.authentication?.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.authentication.password = await bcrypt.hash(this.authentication.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.authentication;
  return user;
};

export type User = InferSchemaType<typeof userSchema>;

export const User = mongoose.model("User", userSchema);

export type UserDocument = InstanceType<typeof User>;
