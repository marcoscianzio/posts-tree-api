"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_entity_1 = require("../../entity/comment.entity");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let CommentQuery = class CommentQuery {
    childrenCount(comment) {
        return comment.childrenComment.length;
    }
    liked(comment, { req }) {
        if (comment.likes.some((e) => e.userId === req.session.userId)) {
            return true;
        }
        else {
            return false;
        }
    }
    async comments() {
        const manager = (0, typeorm_1.getManager)();
        const trees = await manager
            .getTreeRepository(comment_entity_1.Comment)
            .findTrees({ relations: ["user", "likes", "post", "likes.user"] });
        return trees;
    }
    async postComments(postId) {
        const parentComment = await comment_entity_1.Comment.find({
            where: {
                postId,
                parentCommentId: (0, typeorm_1.IsNull)(),
            },
        });
        if (!parentComment) {
            return undefined;
        }
        const repository = (0, typeorm_1.getTreeRepository)(comment_entity_1.Comment);
        return Promise.all(parentComment.map((childComment) => repository.findDescendantsTree(childComment, {
            relations: ["user", "likes", "post", "likes.user"],
        })));
    }
    async commentThread(postId, commentId) {
        const comment = await comment_entity_1.Comment.findOne({
            where: {
                postId,
                id: commentId,
                parentCommentId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
        });
        if (!comment) {
            return undefined;
        }
        const repository = (0, typeorm_1.getTreeRepository)(comment_entity_1.Comment);
        return repository.findAncestors(comment, {
            relations: ["user", "likes", "post", "likes.user"],
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_entity_1.Comment]),
    __metadata("design:returntype", void 0)
], CommentQuery.prototype, "childrenCount", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_entity_1.Comment, Object]),
    __metadata("design:returntype", void 0)
], CommentQuery.prototype, "liked", null);
__decorate([
    (0, type_graphql_1.Query)(() => [comment_entity_1.Comment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentQuery.prototype, "comments", null);
__decorate([
    (0, type_graphql_1.Query)(() => [comment_entity_1.Comment], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentQuery.prototype, "postComments", null);
__decorate([
    (0, type_graphql_1.Query)(() => [comment_entity_1.Comment], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Arg)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommentQuery.prototype, "commentThread", null);
CommentQuery = __decorate([
    (0, type_graphql_1.Resolver)(comment_entity_1.Comment)
], CommentQuery);
//# sourceMappingURL=comment.query.js.map