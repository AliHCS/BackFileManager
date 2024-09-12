import { Request, Response } from "express";
import { CustomError, UploadFileDto } from "../../domain";
import { LoginDto } from "../../domain/dtos/auth/login-dto";
import { FileService } from "../services/files.service";

export class FilesController {
  //* DI
  constructor(public readonly filesService: FileService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  public upload = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const file = req.file;

    if (!file || !userId) {
      return res
        .status(400)
        .json({ error: "El archivo y userId son requeridos" });
    }

    // Crear un objeto combinando req.body y req.file para pasarlo al DTO
    const props = {
      userId: userId,
      file: {
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
      updatedAt: req.body.updatedAt, // Si hay algún campo adicional en el body
    };

    const [error, filesDto] = UploadFileDto.create(props);
    if (error) return res.status(400).json({ error });

    try {
      // Guardar el archivo usando el servicio
      const savedFile = await this.filesService.uploadFile(filesDto!);
      res.status(200).json(savedFile);
    } catch (err) {
      this.handleError(err, res);
    }
  };
}
