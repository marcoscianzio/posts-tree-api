import { Comment } from "../../entity/comment.entity";
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { getManager, getTreeRepository, IsNull, Not } from "typeorm";
import { Context } from "../../types";

@Resolver(Comment)
class CommentQuery {
  @FieldResolver()
  childrenCount(@Root() comment: Comment) {
    return comment.childrenComment.length;
  }

  @FieldResolver()
  liked(@Root() comment: Comment, @Ctx() { req }: Context) {
    if (comment.likes.some((e) => e.userId === req.session.userId!)) {
      return true;
    } else {
      return false;
    }
  }

  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    const manager = getManager();
    const trees = await manager
      .getTreeRepository(Comment)
      .findTrees({ relations: ["user", "likes", "post", "likes.user"] });

    return trees;
  }

  @Query(() => [Comment], { nullable: true })
  async postComments(
    @Arg("postId") postId: string
  ): Promise<Comment[] | undefined> {
    const parentComment = await Comment.find({
      where: {
        postId,
        parentCommentId: IsNull(),
      },
    });

    if (!parentComment) {
      return undefined;
    }

    const repository = getTreeRepository(Comment);

    return Promise.all(
      parentComment.map((childComment) =>
        repository.findDescendantsTree(childComment, {
          relations: ["user", "likes", "post", "likes.user"],
        })
      )
    );
  }

  @Query(() => [Comment], { nullable: true })
  async commentThread(
    @Arg("postId") postId: string,
    @Arg("commentId") commentId: string
  ): Promise<Comment[] | undefined> {
    const comment = await Comment.findOne({
      where: {
        postId,
        id: commentId,
        parentCommentId: Not(IsNull()),
      },
    });

    if (!comment) {
      return undefined;
    }

    const repository = getTreeRepository(Comment);

    return repository.findAncestors(comment, {
      relations: ["user", "likes", "post", "likes.user"],
    });
  }
}
