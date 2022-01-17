import { logger } from "./../middleware/logger";
import { isAuth } from "./../middleware/isAuth";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  UseMiddleware,
} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "src/entity/User";
import { RegisterInput } from "./register/Registerinput";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";

@Resolver(User)
export class RegisterResolver {
  // SOLUTION 1
  @Authorized()
  // SOLUTION 2
  @UseMiddleware(isAuth, logger)
  @Query(() => String, { nullable: true })
  async hello() {
    // fake async in this example
    return null;
  }

  /*
  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }*/

  @Mutation(() => String)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}
