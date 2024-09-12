import { Request, Response } from "express";
import { CustomError, RegisterDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../../domain/dtos/auth/login-dto";

export class AuthController {
  //* DI
  constructor(public readonly authService: AuthService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  public register = async (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);
    if (error) return res.status(404).json({ error });

    this.authService
      .registerUser(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
  public login = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);
    if (error) return res.status(404).json({ error });

    this.authService
      .loginUser(loginDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
