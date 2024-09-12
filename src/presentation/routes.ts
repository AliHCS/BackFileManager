import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { FilesRoutes } from "./files/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );
    //auth
    router.use("/api/v1", AuthRoutes.routes);
    router.use("/api/v1", FilesRoutes.routes);

    return router;
  }
}
