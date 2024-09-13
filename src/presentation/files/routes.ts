import { Router } from "express";
import { FilesController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileService } from "../services/files.service";
import { multerAdapter } from "../../config/multer-adapter";

export class FilesRoutes {
  static get routes(): Router {
    const router = Router();
    const filesService = new FileService();

    const filesController = new FilesController(filesService);

    //Middleware
    router.use(AuthMiddleware.validateJWT);

    // Definir las rutas
    router.post(
      "/files/upload",
      [multerAdapter.upload.single("file")],
      filesController.upload
    );
    router.get("/files/getAll", filesController.getAll);
    /*  router.post("/auth/login", authController.login); */

    return router;
  }
}
