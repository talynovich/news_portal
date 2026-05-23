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
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interfaces';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() news: CreateNewsDto) {
    return this.newsService.create(+req.user.sub, news);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.newsService.findAll(page, limit, search);
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
}
