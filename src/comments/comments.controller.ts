import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
}
