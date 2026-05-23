import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { News } from './news/entities/news.entity';
import { Users } from './users/entities/user.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '147.45.98.194',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'ny_times',
      entities: [Users, News, Comment],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    NewsModule,
    CommentsModule,
    UploadModule,
  ],
})
export class AppModule {}
