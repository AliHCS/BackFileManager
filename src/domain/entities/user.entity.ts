import { CustomError } from "../error/custom-error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, name, email, password } = object;

    if (!id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing email");
    if (!password) throw CustomError.badRequest("Missing password");

    return new UserEntity(id, name, email, password);
  }
}
