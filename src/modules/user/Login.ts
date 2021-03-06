import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "src/entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    if (!user.confirmed) return null;

    // create a cookie
    // @ts-ignore
    ctx.req.session!.userId = user.id;

    return user;
  }
}
