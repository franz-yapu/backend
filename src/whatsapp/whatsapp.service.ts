// whatsapp.service.ts - Versión simplificada
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
    private client: Client;
    public qrCode: string = '';
    public isReady: boolean = false;

    async onModuleInit() {
        await this.initializeClient();
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.destroy();
        }
    }

    private initializeClient(): Promise<void> {
        return new Promise((resolve) => {
            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: "whatsapp-bot"
                }),
                puppeteer: {
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            });

            this.client.on('qr', (qr) => {
                console.log('🔐 QR Code recibido, escanéalo con WhatsApp:');
                qrcode.generate(qr, { small: true });
                this.qrCode = qr;
            });

            this.client.on('ready', () => {
                console.log('✅ Cliente de WhatsApp está listo!');
                this.isReady = true;
                resolve();
            });

            this.client.on('authenticated', () => {
                console.log('✅ Autenticación exitosa');
            });

            this.client.on('auth_failure', (error) => {
                console.error('❌ Error de autenticación:', error);
            });

            this.client.on('disconnected', (reason) => {
                console.log('❌ Cliente desconectado:', reason);
                this.isReady = false;
            });

            this.client.initialize().catch(error => {
                console.error('Error inicializando cliente:', error);
            });
        });
    }

    async sendMessage(phoneNumber: string, message: string): Promise<{success: boolean, error?: string}> {
        try {
            if (!this.isReady) {
                return { success: false, error: 'Cliente de WhatsApp no está listo' };
            }

            const formattedNumber = this.formatPhoneNumber(phoneNumber);
            await this.client.sendMessage(formattedNumber, message);
            console.log('✅ Mensaje enviado correctamente a:', phoneNumber);
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error enviando mensaje:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    private formatPhoneNumber(phoneNumber: string): string {
         phoneNumber= '591 '+phoneNumber;
        let cleaned = phoneNumber.replace(/\D/g, '');
        
        if (!cleaned.startsWith('52') && cleaned.length === 10) {
            cleaned = '52' + cleaned;
        }
        
        if (!cleaned.endsWith('@c.us')) {
            cleaned += '@c.us';
        }
        
        return cleaned;
    }

    getStatus(): { isReady: boolean; hasQr: boolean; qrCode?: string } {
        return {
            isReady: this.isReady,
            hasQr: !!this.qrCode,
            qrCode: this.qrCode || undefined
        };
    }

    // Método alternativo que no requiere qrcode
    getQrCode(): string {
        return this.qrCode;
    }
}