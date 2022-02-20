import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationCount,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from "typeorm";
import { Like } from "./like.entity";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
@Tree("materialized-path")
export class Comment extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  postId: string;

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  parentCommentId: string;

  @Field(() => [Comment], { nullable: true })
  @TreeChildren()
  childrenComment: Comment[];

  @Field(() => Int)
  childrenCount: number;

  @Field(() => Comment, { nullable: true })
  @TreeParent()
  parentComment: Comment[];

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Field(() => Int)
  @RelationCount((comment: Comment) => comment.likes)
  likeCount: number;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.comment, { nullable: true })
  likes: Like[];

  @Field(() => Date)
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
