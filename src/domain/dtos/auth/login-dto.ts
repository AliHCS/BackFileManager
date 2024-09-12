import { validateEmail } from "../../../validations/auth";
export class LoginDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.email) returnObj.email = this.email;
    if (this.password) returnObj.password = this.password;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, LoginDto?] {
    const { email, password } = props;
    if (!email) return ["El Email debe ser necesario"];
    if (!password) return ["El password debe ser necesario"];
    if (password.length < 6) return ["Password too short"];
    if (!validateEmail(email)) return ["El formato es invalido"];

    return [undefined, new LoginDto(email, password)];
  }
}
