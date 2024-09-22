import { PrismaClient } from "@prisma/client";
import {
  CustomError,
  FilesEntity,
  UpdateFileDto,
  UploadFileDto,
} from "../../domain"; // Asumiendo que CustomError está en domain
import fs from "fs";
import { clientS3 } from "../../config/s3-aws";

export class FileService {
  // Dependency Injection
  constructor() {}
  prisma = new PrismaClient();

  public async uploadFile(uploadDto: UploadFileDto) {
    try {
      const savedFile = await this.prisma.file.create({
        data: {
          userId: uploadDto!.userId, // Asegúrate de que este campo exista en tu esquema de Prisma
          filename: uploadDto!.filename,
          path: uploadDto!.path,
          mimetype: uploadDto!.mimetype,
          size: uploadDto!.size,
          uploadedAt: uploadDto!.uploadedAt,
          updatedAt: uploadDto!.updatedAt || uploadDto!.uploadedAt,
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
    try {
      const allFiles = await this.prisma.file.findMany({
        where: { userId },
      });
      /* const { mimetype, size, id, ...files } = FilesEntity.fromObject(allFiles); */
      const files = allFiles.map((dbFile) => FilesEntity.fromObject(dbFile));
      return files;
    } catch (error) {
      throw CustomError.internalServer(`Error al buscar archivos: ${error}`);
    }
  }

  /**
   * async deleteFile
   */
  public async deleteFile(idFile: string) {
    try {
      const file = await this.prisma.file.delete({
        where: { id: idFile },
      });
      // Eliminar el archivo físico utilizando la ruta completa almacenada en 'path'
      const filePath = file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Elimina el archivo usando la ruta completa
      }
      const { filename, id, userId } = FilesEntity.fromObject(file);
      return { filename, id, userId };
    } catch (error) {
      throw CustomError.internalServer(
        `Error al eliminar el archivo: ${error}`
      );
    }
  }

  /**
   * async updateFile
   */
  public async updateFile(updateDto: UpdateFileDto, uploadedFilePath: string) {
    try {
      // Validar el DTO y extraer los valores a actualizar
      const fileToUpdate = updateDto.values;

      // Obtener el archivo actual de la base de datos
      const existingFile = await this.prisma.file.findUnique({
        where: { id: fileToUpdate.id },
      });
      if (!existingFile) {
        // Eliminar el archivo recién subido ya que no se encontró en la base de datos
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath); // Eliminar el archivo subido
        }
        throw CustomError.notFound("Archivo no encontrado");
      }

      // Eliminar el archivo anterior del sistema de archivos
      const oldFilePath = existingFile.path;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Eliminar el archivo anterior
      }

      // Actualizar el archivo en la base de datos
      const updatedFile = await this.prisma.file.update({
        where: { id: fileToUpdate.id },
        data: {
          filename: fileToUpdate.filename,
          path: fileToUpdate.path,
          mimetype: fileToUpdate.mimetype,
          size: fileToUpdate.size,
          updatedAt: fileToUpdate.updatedAt || new Date(), // Actualizar fecha si es necesario
        },
      });
      return updatedFile;
    } catch (error) {
      throw error;
    }
  }
}
