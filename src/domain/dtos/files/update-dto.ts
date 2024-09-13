export class UpdateFileDto {
  private constructor(
    public readonly id: string, // ID del usuario al que pertenece el archivo
    public readonly file: File, // Nombre del archivo
    public readonly filename: string, // Nombre del archivo
    public readonly path: string, // Ruta donde se almacena el archivo
    public readonly mimetype: string, // Tipo de archivo (ej. image/png, application/pdf)
    public readonly size: number, // Tamaño del archivo en bytes
    public readonly updatedAt?: Date // Fecha y hora de la última actualización (opcional)
  ) {}
  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.id) returnObj.id = this.id;
    if (this.file) returnObj.file = this.file;
    if (this.filename) returnObj.filename = this.filename;
    if (this.path) returnObj.path = this.path;
    if (this.mimetype) returnObj.mimetype = this.mimetype;
    if (this.size) returnObj.size = this.size;
    if (this.updatedAt) returnObj.updatedAt = this.updatedAt;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateFileDto?] {
    const { file, id } = props;

    // Validaciones
    // Convertir userId a número si es un string
    if (!id) return ["El id es requerido"];
    if (
      !file ||
      !file.originalname ||
      !file.path ||
      !file.mimetype ||
      !file.size
    ) {
      return ["El archivo es requerido y debe contener información válida"];
    }

    const filename = file.originalname;
    const path = file.path;
    const mimetype = file.mimetype;
    const size = file.size;
    const updatedAt = new Date(); // Fecha actual como `uploadedAt`

    return [
      undefined,
      new UpdateFileDto(id, file, filename, path, mimetype, size, updatedAt),
    ];
  }
}
