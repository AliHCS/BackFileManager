import { CustomError } from "../error/custom-error";

export class FilesEntity {
  constructor(
    public id: string,
    public userId: string,
    public filename: string,
    public uploadedAt: string,
    public updateAt: string,
    public mimetype: string,
    public size: string,
    public path: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, userId, filename, uploadedAt, updateAt, path, mimetype, size } =
      object;

    if (!id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!userId) throw CustomError.badRequest("Missing user");

    return new FilesEntity(
      id,
      userId,
      filename,
      uploadedAt,
      updateAt,
      mimetype,
      size,
      path
    );
  }
}
