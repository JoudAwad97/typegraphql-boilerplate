import { MyContext } from "./../../types/MyContext";
import { Ctx, Mutation } from "type-graphql";
import { Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation()
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    // @ts-ignore
    return new Promise((res, rej) =>
      ctx.req.session!.destroy((err) => {
        if (err) {
          console.log(err);
          return rej(false);
        }

        ctx.res.clearCookie("qid");

        return res(true);
      })
    );
  }
}
