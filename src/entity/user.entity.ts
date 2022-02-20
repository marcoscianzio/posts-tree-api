import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationCount,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { Post } from "./post.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, unique: true })
  githubId: number;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Field(() => Int)
  @RelationCount((user: User) => user.comments)
  commentCount: number;

  @Field(() => Int)
  @RelationCount((user: User) => user.posts)
  postCount: number;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user, {
    nullable: true,
  })
  posts: Post[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: Comment[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.user)
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
