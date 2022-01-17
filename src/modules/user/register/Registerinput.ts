import { OkMixin } from "./../../shared/OkMixin";
import { PasswordInput } from "./../../shared/PasswordInput";
import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExists";

@InputType()
export class RegisterInput extends OkMixin(PasswordInput) {
  @Field()
  @Length(1, 30, { message: "First name should be between 1 and 30 letter" })
  firstName: string;

  @Field()
  @Length(1, 30)
  lastName: string;

  @Field()
  @IsEmail()
  // customer decorater
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
