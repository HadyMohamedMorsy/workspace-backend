import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadsService {
  handleFileUpload(file: Express.Multer.File) {
    return { name: `uploads/${file.filename}` };
  }
}
