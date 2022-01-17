import { redis } from "./../../redis";
import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "src/entity/User";

@Resolver(User)
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(token);
    if (!userId) return false;

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    await redis.del(token);

    return true;
  }
}
