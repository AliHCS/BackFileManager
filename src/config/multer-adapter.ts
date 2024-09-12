import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Configuración del almacenamiento de archivos
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Definir la carpeta de destino para los archivos subidos
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Crear un nombre de archivo único usando la fecha y un número aleatorio
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Obtener la extensión del archivo
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`; // Combinar el nombre del campo y el sufijo único
    cb(null, filename); // Asignar el nombre de archivo
  },
});

// Función de filtro para validar el tipo de archivo
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const fileTypes = /jpeg|jpg|png|pdf/; // Tipos de archivos permitidos
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Verifica la extensión del archivo
  const mimetype = fileTypes.test(file.mimetype); // Verifica el tipo MIME del archivo

  if (extname && mimetype) {
    cb(null, true); // Si es válido, permite la carga
  } else {
    cb(new Error("Solo se permiten archivos de tipo: jpeg, jpg, png, pdf")); // Si no, rechaza la carga
  }
};

// Configuración de Multer usando el almacenamiento y el filtro de archivo
export const multerAdapter = {
  upload: multer({
    storage: storage, // Usar el almacenamiento personalizado
    limits: {
      fileSize: 5 * 1024 * 1024, // Limitar el tamaño del archivo a 5MB
    },
    fileFilter: fileFilter, // Usar el filtro de archivos
  }),
};
