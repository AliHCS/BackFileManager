import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { envs } from "./envs";
import fs from "fs";
export const clientS3 = new S3Client({
  region: envs.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: envs.AWS_PUBLIC_KEY, // Access Key
    secretAccessKey: envs.AWS_SECRET_KEY, // Secret Key
  },
});

// Función para subir archivos a S3
export const uploadFileToS3 = async (
  localFilePath: string,
  fileKey: string,
  mimetype: string
) => {
  try {
    const fileBuffer = fs.readFileSync(localFilePath); // Leer el archivo desde el sistema de archivos

    const uploadParams = {
      Bucket: envs.AWS_BUCKET_NAME, // Bucket donde se subirá el archivo
      Key: fileKey, // Nombre del archivo en S3 (Key)
      Body: fileBuffer, // Contenido del archivo
      ContentType: mimetype, // Tipo MIME del archivo
    };

    // Subir el archivo a S3
    await clientS3.send(new PutObjectCommand(uploadParams));

    // Generar la URL del archivo subido
    const fileUrl = `https://${envs.AWS_BUCKET_NAME}.s3.${envs.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;

    return fileUrl; // Devolver la URL del archivo subido
  } catch (error) {
    console.error(`Error al subir el archivo a S3: ${error}`);
    throw error;
  }
};
