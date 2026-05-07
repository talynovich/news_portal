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
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interfaces';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() news: CreateNewsDto) {
    return this.newsService.create(+req.user.sub, news);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    return this.newsService.findAll();
  }

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
}
