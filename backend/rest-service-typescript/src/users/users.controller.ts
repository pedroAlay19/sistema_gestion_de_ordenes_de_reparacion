import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users(Aproved)')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Post()
  @ApiOperation({ summary: 'Create a new user (client)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('technician')
  @ApiOperation({ summary: 'Create a new technician' })
  @ApiResponse({
    status: 201,
    description: 'Technician created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid technician data.',
  })
  createTechnician(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.usersService.createTechnician(createTechnicianDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users (clients)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully.',
  })
  findUsers() {
    return this.usersService.findUsers();
  }

  @Get('technician')
  @ApiOperation({ summary: 'Retrieve all technicians' })
  @ApiResponse({
    status: 200,
    description: 'List of all technicians retrieved successfully.',
  })
  findTechnicians() {
    return this.usersService.findTechnicians();
  }

  @Get(':id')
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user or technician by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user or technician (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (client) by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiBody({ type: UpdateUserDto, description: 'Fields to update user' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch('technician/:id')
  @ApiOperation({ summary: 'Update a technician by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the technician (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Technician updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Technician not found.',
  })
  @ApiBody({ type: UpdateTechnicianDto, description: 'Fields to update technician' })
  updateTechnician(
    @Param('id') id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.usersService.updateTechnician(id, updateTechnicianDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user or technician by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user or technician (UUID)',
    example: 'b8c1a2d3-4f5e-6789-0123-456789abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
