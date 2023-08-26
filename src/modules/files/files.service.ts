import { Injectable } from "@nestjs/common";
import { path } from "app-root-path";
import { format } from "date-fns";
import { ensureDir, writeFile } from "fs-extra";
import { join } from "path";
import * as sharp from "sharp";
import { FileElementResponse } from "./dto/file.element.response";
import { MFile } from "./mfile.class";

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), "yyyy-MM-dd");
    const uploadFolder = join(path, "uploads", dateFolder);

    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        name: file.originalname,
        url: `${dateFolder}/${file.originalname}`,
      });
    }

    return res;
  }

  convertToWebp(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp().toBuffer();
  }
}
