import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWhatsappDto {

    @ApiProperty({ example: 'message' })
          @IsString()
          @IsNotEmpty()
          message: string;

   @ApiProperty({ example: 'phone' })
          @IsString()
          @IsNotEmpty()
          phone: string;
       
}
