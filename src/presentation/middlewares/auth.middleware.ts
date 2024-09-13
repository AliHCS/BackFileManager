import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/index";
import { PrismaClient } from "@prisma/client";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  //DI

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");

    if (!authorization)
      return res.status(401).json({ error: "No token provider" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: number }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({
        where: { id: payload.id },
      });
      if (!user) return res.status(401).json({ error: "Invalid token - user" });

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
