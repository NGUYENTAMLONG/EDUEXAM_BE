import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // fields to return (không trả password)
  private userSelect = {
    id: true,
    ids: true,
    username: true,
    email: true,
    role: true,
    phone: true,
    avatar: true,
    age: true,
    gender: true,
    metadata: true,
    account_type: true,
    created_at: true,
    updated_at: true,
    delete_at: true,
    deleted_by: true,
    updated_by: true,
  };

  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    // Build where clause: loại bỏ soft-deleted (delete_at != null)
    const where: any = { delete_at: null };

    if (query.search) {
      where.OR = [
        { username: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    // Defensive: nếu field không hợp lệ, fallback về created_at
    const sortField = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    // @ts-ignore
    orderBy[sortField] = sortOrder;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.users.count({ where }),
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: this.userSelect,
      }),
    ]);

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!user || user.delete_at) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    // stringify metadata if object because your Prisma schema stores metadata as String
    const metadata = dto.metadata ? JSON.stringify(dto.metadata) : null;
    const hashed = await bcrypt.hash(dto.password, 10);

    try {
      const created = await this.prisma.users.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashed,
          role: dto.role ?? 'Student',
          phone: dto.phone,
          avatar: dto.avatar,
          age: dto.age,
          gender: dto.gender,
          account_type: dto.account_type,
          metadata,
        },
        select: this.userSelect,
      });
      return created;
    } catch (e: any) {
      // Prisma unique constraint error code P2002
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        // can check e.meta.target to see which field
        throw new ConflictException('Unique constraint failed: probably email already exists');
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    // check exists and not deleted
    const exists = await this.prisma.users.findUnique({ where: { id } });
    if (!exists || exists.delete_at) throw new NotFoundException('User not found');

    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.metadata && typeof dto.metadata === 'object') {
      data.metadata = JSON.stringify(dto.metadata);
    }

    try {
      const updated = await this.prisma.users.update({
        where: { id },
        data,
        select: this.userSelect,
      });
      return updated;
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Unique constraint failed (conflict on update)');
      }
      throw e;
    }
  }

  /**
   * Soft-delete by default. To hard delete, pass hard = true.
   * deletedBy is optional (user id who deleted)
   */
  async remove(id: number, deletedBy?: number, hard = false) {
    const exists = await this.prisma.users.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');

    if (hard) {
      // WARNING: permanent removal
      await this.prisma.users.delete({ where: { id } });
      return { success: true };
    } else {
      const updated = await this.prisma.users.update({
        where: { id },
        data: { delete_at: new Date(), deleted_by: deletedBy ?? null },
        select: this.userSelect,
      });
      return updated;
    }
  }
}
