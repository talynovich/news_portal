import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { Role } from '../../enums/role.enum';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  username: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => News, (news) => news.author)
  news: News[];

  @OneToMany(() => Comment, (comments) => comments.author)
  comments: Comment[];
}
