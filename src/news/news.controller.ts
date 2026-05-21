import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interfaces';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() news: CreateNewsDto) {
    return this.newsService.create(+req.user.sub, news);
  }

  @Get('search')
  async search(@Query('search') searchQuery: string) {
    return await this.newsService.search(searchQuery);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.newsService.findAll(page, limit);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(+id, +req.user.sub, updateNewsDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.newsService.remove(+id, +req.user.sub);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.newsService.upload(file);
  }
}
