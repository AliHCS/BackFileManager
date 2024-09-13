import { PrismaClient } from "@prisma/client";
import { CustomError, RegisterDto, UserEntity } from "../../domain";
import { LoginDto } from "../../domain/dtos/auth/login-dto";
import { JwtAdapter, bcrypAdapter } from "../../config/index";

export class AuthService {
  //DI
  constructor() {}

  public async registerUser(registerDto: RegisterDto) {
    const prisma = new PrismaClient();
    const { email } = registerDto;
    const existUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existUser) throw CustomError.badRequest("Email already exist");
    try {
      const user = { ...registerDto };
      user.password = bcrypAdapter.hash(registerDto.password);
      const newUser = await prisma.user.create({
        data: {
          ...user,
        },
      });
      const { password, id, ...userEntity } = UserEntity.fromObject(newUser);
      return userEntity;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  public async loginUser(loginDto: LoginDto) {
    const prisma = new PrismaClient();
    const existUser = await prisma.user.findFirst({
      where: { email: loginDto.email },
    });
    if (!existUser) throw CustomError.badRequest("Email not exist");
    const isMatching = bcrypAdapter.compare(
      loginDto.password,
      existUser.password
    );
    if (!isMatching) throw CustomError.badRequest("Password is not valid");
    const { password, ...userEntity } = UserEntity.fromObject(existUser);
    const token = await JwtAdapter.generateToken({
      id: existUser.id,
      email: existUser.email,
    });
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    return {
      user: userEntity,
      token: token,
    };
  }
}
