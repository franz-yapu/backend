import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
     phone?: string;
     address?:string;
    roleName?: string;
  }) {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new ConflictException('El username ya está registrado');
    }

    // Obtener el rol (USER por defecto si no se especifica)
    const role = await this.prisma.role.findUnique({
      where: { name: data.roleName || 'TUTOR' },
    });

    if (!role) {
      throw new Error('Rol especificado no existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data?.phone,
        address: data?.address,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });
  }


  // Actualizar otros métodos para usar string en lugar de number
  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });
  }

  async findById(id: string) { // Ahora recibe string
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async updateUser(id: string, data: { 
     firstName?: string; 
    lastName?: string; 
    roleId?: string }) {
      const updateData: any = {};
  
      if (data.firstName) updateData.firstName = data.firstName;
      if (data.lastName) updateData.lastName = data.lastName;
      if (data.roleId) updateData.roleId = data.roleId;
    
      return this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { role: true },
      });
  }

  async deleteUser(id: string) { // Ahora recibe string
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async getRoles() {
    return this.prisma.role.findMany();
  }
}