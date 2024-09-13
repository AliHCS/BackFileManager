import { Router } from "express";
import { FilesController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileService } from "../services/files.service";
import { multerAdapter } from "../../config/index";

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
    router.delete("/files/delete/:id", filesController.delteFile);
    router.put(
      "/files/update/:id",
      [multerAdapter.upload.single("file")],
      filesController.updateFile
    );
    /*  router.post("/auth/login", authController.login); */

    return router;
  }
}
