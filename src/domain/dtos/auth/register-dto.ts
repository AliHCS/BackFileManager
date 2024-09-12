import { validateEmail } from "../../../validations/auth";
export class RegisterDto {
  private constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.email) returnObj.email = this.email;
    if (this.password) returnObj.password = this.password;
    if (this.name) returnObj.name = this.name;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, RegisterDto?] {
    const { email, password, name } = props;
    if (!email) return ["El Email debe ser necesario"];
    if (!name) return ["El name debe ser necesario"];
    if (!password) return ["El password debe ser necesario"];
    if (password.length < 6) return ["Password too short"];
    if (!validateEmail(email)) return ["El formato es invalido"];

    return [undefined, new RegisterDto(email, password, name)];
  }
}
