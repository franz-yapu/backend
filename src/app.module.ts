import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { DmsModule } from './dms/dms.module';
import { MarcaModule } from './marca/marca.module';
import { CrudGeneratorModule } from './crud-generator/crud-generator.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { DashboardModule } from './dashboard/dashboard.module';




@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ProductModule, CategoryModule, DmsModule, MarcaModule, CrudGeneratorModule, WhatsAppModule, DashboardModule,], // Asegúrate que estén todos
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}