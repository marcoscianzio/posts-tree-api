import { User } from "../../entity/user.entity";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserInput } from "../../input/user.input";
import { Context } from "../../types";
import { UserResponse } from "../../responses/user.response";
import bcrypt from "bcrypt";

@Resolver()
class UserMutation {
  @Mutation(() => UserResponse)
  async register(
    @Arg("values") { email, password }: UserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return {
        errors: [
          {
            message: "user already exists",
            field: "email",
          },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("values") { email, password }: UserInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        errors: [
          {
            message: "user doesn't exist",
            field: "email",
          },
        ],
      };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return {
        errors: [
          {
            message: "Invalid password",
            field: "password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
