import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private s3 = new S3Client({
    region: 'us-east-1',

    endpoint: 'http://147.45.98.194:9000/',

    credentials: {
      accessKeyId: '8d132d0edb55d39f351c7d81debb7c95',
      secretAccessKey: '4f002537ecf16b413495507c59fffa02',
    },
  });

  async upload(file: Express.Multer.File) {
    const key = Date.now() + '-' + file.originalname;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'newsportal',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: ` http://147.45.98.194:9000/newsportal/${key}`,
    };
  }
}
