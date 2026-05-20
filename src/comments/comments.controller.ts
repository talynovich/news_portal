import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interfaces';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post('/news/:id')
  create(
    @Req() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') id: string,
  ) {
    return this.commentsService.create(createCommentDto, +req.user.sub, +id);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
}
