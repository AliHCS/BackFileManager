import { PrismaClient } from "@prisma/client";
import { CustomError, UploadFileDto } from "../../domain"; // Asumiendo que CustomError está en domain

export class FileService {
  // Dependency Injection
  constructor() {}

  public async uploadFile(uploadDto: UploadFileDto) {
    const prisma = new PrismaClient();
    // Valida el DTO
    const [error, validatedFileDto] = UploadFileDto.create(uploadDto);
    if (error) throw CustomError.badRequest(error);

    try {
      const savedFile = await prisma.file.create({
        data: {
          userId: validatedFileDto!.userId, // Asegúrate de que este campo exista en tu esquema de Prisma
          filename: validatedFileDto!.filename,
          path: validatedFileDto!.path,
          mimetype: validatedFileDto!.mimetype,
          size: validatedFileDto!.size,
          uploadedAt: validatedFileDto!.uploadedAt,
          updatedAt:
            validatedFileDto!.updatedAt || validatedFileDto!.uploadedAt,
        },
      });
      return savedFile;
    } catch (error) {
      throw CustomError.internalServer(`Error al subir el archivo: ${error}`);
    }
  }

  /**
   * async getAll
   */
  public async getAllById(userId: number) {
    const prisma = new PrismaClient();
    const allFiles = await prisma.file.findMany({
      where: { userId },
    });
    return allFiles;
  }
}
