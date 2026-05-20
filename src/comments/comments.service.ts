import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { News } from '../news/entities/news.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    newsId: number,
  ) {
    const news = await this.newsRepository.findOne({
      where: { id: newsId },
    });
    if (!news) {
      throw new NotFoundException('News not found');
    }

    const comment = this.commentRepository.create({
      text: createCommentDto.text,
      author: { id: userId },
      news: {
        id: newsId,
      },
    });
    return await this.commentRepository.save(comment);
  }

  async findAll() {
    return await this.commentRepository.find({
      relations: ['author', 'news'],
    });
  }

  syb;
}
