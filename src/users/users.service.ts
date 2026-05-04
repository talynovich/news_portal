import { BadRequestException, Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
