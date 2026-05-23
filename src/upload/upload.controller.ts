import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly UploadService: UploadService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.UploadService.upload(file);
  }
}
