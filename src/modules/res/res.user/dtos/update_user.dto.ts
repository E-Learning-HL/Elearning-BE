import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdatePartnerDto } from '../../res.partner/dtos/update_partner.dto';

export class UpdateUserDto {
  @ApiPropertyOptional()
  password?: string;
  @ApiPropertyOptional()
  signature?: string;
  @ApiPropertyOptional()
  share?: boolean = true;
  @ApiPropertyOptional()
  notificationType?: string;
  @ApiPropertyOptional()
  partner?: UpdatePartnerDto;
}
