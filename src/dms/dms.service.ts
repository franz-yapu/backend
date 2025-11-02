// src/dms/dms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { dms } from '@prisma/client'; 

@Injectable()
export class DmsService {
  constructor(private prisma: PrismaService) {}

async saveFile(
  file: Express.Multer.File,
  type: string,
  user?:string
): Promise<dms> {
  return this.prisma.dms.create({
    data: {
      fileName: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      user:user,
      type,
    },
  });
}

  async findAll(): Promise<dms[]> {
    return this.prisma.dms.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<dms> {
  const file = await this.prisma.dms.findUnique({ where: { id } });
  if (!file) {
    throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
  }
  return file;
}
}