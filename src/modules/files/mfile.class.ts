export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: MFile | Express.Multer.File) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
}
