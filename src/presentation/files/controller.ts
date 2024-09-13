import { Request, Response } from "express";
import { CustomError, UploadFileDto } from "../../domain";
import { LoginDto } from "../../domain/dtos/auth/login-dto";
import { FileService } from "../services/files.service";
import { UpdateFileDto } from "../../domain/dtos/files/update-dto";

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

    // Guardar el archivo usando el servicio
    this.filesService
      .uploadFile(filesDto!)
      .then((file) => res.json(file))
      .catch((error) => this.handleError(error, res));
  };

  /**
   * getAll
   */
  public getAll = async (req: Request, res: Response) => {
    const user = req.body.user;
    const userId = +user.id;
    await this.filesService
      .getAllById(userId)
      .then((file) => res.json(file))
      .catch((error) => this.handleError(error, res));
  };

  /**
   * updateFile
   */
  public updateFile = async (req: Request, res: Response) => {
    const idFile = req.params.id;
    const file = req.file;
    if (!file || !idFile) {
      return res
        .status(400)
        .json({ error: "El archivo y idFile son requeridos" });
    }

    // Crear un objeto combinando req.body y req.file para pasarlo al DTO
    const props = {
      id: idFile,
      file: {
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
    const [error, updateFilesDto] = UpdateFileDto.create(props);
    if (error) return res.status(400).json({ error });

    this.filesService
      .updateFile(updateFilesDto!)
      .then((file) => res.json({ message: "Archivo actualizado", file }));
  };

  /**
   * delteFile
   */
  public delteFile = async (req: Request, res: Response) => {
    const idFile = req.params.id;

    this.filesService
      .deleteFile(idFile)
      .then((file) => res.json({ message: "Archivo eliminado", file }))
      .catch((error) => this.handleError(error, res));
  };
}
