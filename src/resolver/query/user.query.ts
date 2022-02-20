import { User } from "../../entity/user.entity";
import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../../types";

@Resolver()
class UserQuery {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    } else {
      return await User.findOne(req.session.userId, {
        relations: ["posts", "comments", "posts.images", "posts.comments"],
      });
    }
  }
}
