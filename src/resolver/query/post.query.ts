import { Post } from "../../entity/post.entity";
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Context } from "../../types";

@Resolver(Post)
class PostQuery {
  @FieldResolver()
  liked(@Root() post: Post, @Ctx() { req }: Context) {
    if (post.likes.some((e) => e.userId === req.session.userId!)) {
      return true;
    } else {
      return false;
    }
  }

  @FieldResolver()
  isArrayOfImages(@Root() post: Post) {
    if (post.images.length > 1) {
      return true;
    } else {
      return false;
    }
  }

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find({
      relations: [
        "images",
        "user",
        "comments",
        "comments.user",
        "likes",
        "comments.likes",
      ],
      order: {
        createdAt: "DESC",
      },
    });
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: string): Promise<Post | undefined> {
    const post = await Post.findOne(id, {
      relations: [
        "images",
        "user",
        "comments",
        "comments.user",
        "likes",
        "comments.likes",
        "likes.user",
      ],
    });

    if (!post) {
      return undefined;
    }

    return post;
  }
}
