import { MyContext } from "./../../types/MyContext";
import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "src/entity/User";

@Resolver(User)
export class RegisterResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    // @ts-ignore
    if (ctx.req.session!.userId) return undefined;
    // @ts-ignore
    return User.findOne(ctx.req.session!.userId);
  }
}
