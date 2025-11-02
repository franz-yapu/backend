// whatsapp.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateWhatsappDto } from './dto/create-whatsapp.dto';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    @Post('send')
    async sendMessage( @Body() CreatewhatsappDto: CreateWhatsappDto) {
         if (!CreatewhatsappDto.phone || !CreatewhatsappDto.message) {
            return { success: false, error: 'Phone and message are required' };
        }
           
        return await this.whatsappService.sendMessage(CreatewhatsappDto.phone, CreatewhatsappDto.message);
    }

    @Get('status')
    getStatus() {
        return this.whatsappService.getStatus();
    }

    @Get('qr')
    getQrCode() {
        const status = this.whatsappService.getStatus();
        return { 
            success: status.hasQr, 
            qrCode: status.qrCode,
            message: status.hasQr ? 
                'Escanee el QR code con WhatsApp' : 
                'QR code no disponible aún'
        };
    }
}