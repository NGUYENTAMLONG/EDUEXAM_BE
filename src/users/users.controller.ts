import { Controller, Get, Query, Param, ParseIntPipe, Post, Body, Put, Delete, ParseBoolPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /**
   * Soft delete by default. 
   * Query params:
   *  - hard=true  -> permanently delete
   *  - deleted_by=123 -> optional id of deleter
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('hard') hard?: string,
    @Query('deleted_by') deleted_by?: string,
  ) {
    const hardDelete = hard === 'true';
    const deletedBy = deleted_by ? parseInt(deleted_by, 10) : undefined;
    return this.usersService.remove(id, deletedBy, hardDelete);
  }
}
