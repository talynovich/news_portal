import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private UsersRepository: Repository<Users>,
  ) {}

  async register(registerDto: CreateUserDto) {
    const exist = await this.UsersRepository.findOneBy({
      email: registerDto.email,
    });
    if (exist) throw new BadRequestException('User already exists');
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const user = this.UsersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await this.UsersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }
  findUserForAuth(email: string) {
    return this.UsersRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id', 'username'],
    });
  }

  async findAll() {
    return await this.UsersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number, userId: number) {
    const currentUser = await this.UsersRepository.findOne({
      where: { id: userId },
    });

    if (currentUser?.role !== 'admin') {
      throw new ForbiddenException('Only administrators can delete users.');
    }

    const userToDelete = await this.UsersRepository.findOne({ where: { id } });

    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (userToDelete.role === 'admin') {
      throw new ForbiddenException('Cannot delete user with admin role');
    }

    await this.UsersRepository.delete(id);

    return { message: `User ${id} successfully deleted` };
  }
}
