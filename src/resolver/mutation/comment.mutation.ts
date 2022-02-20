import { Comment } from "../../entity/comment.entity";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../../types";
import { Post } from "../../entity/post.entity";
import { CommentInput } from "../../input/comment.input";
import { getConnection } from "typeorm";

@Resolver(Comment)
class CommentMutation {
  @Mutation(() => Comment, { nullable: true })
  async createComment(
    @Arg("values") { postId, parentCommentId, content }: CommentInput,
    @Ctx() { req }: Context
  ): Promise<Comment | undefined> {
    const post = await Post.findOne(postId);

    if (!post) {
      return undefined;
    }

    const comment = new Comment();
    comment.postId = postId;
    comment.userId = req.session.userId!;
    comment.parentCommentId = parentCommentId!;
    comment.content = content;

    if (parentCommentId) {
      const parentComment = await Comment.findOne(parentCommentId);

      if (!parentComment) {
        return undefined;
      }

      //@ts-ignore
      comment.parentComment = parentComment;
    }

    return getConnection().manager.save(comment);
  }
}
