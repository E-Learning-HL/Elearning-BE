import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from '../../res.country/entities/country.entity';
import { PartnerTitle } from '../../res.partner.title/entities/partner.title.entity';
import { PartnerType } from '../types/partner.type';

export class UpdatePartnerDto {
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  street?: string;
  @ApiPropertyOptional()
  street2?: string;
  @ApiPropertyOptional()
  zip?: string;
  @ApiPropertyOptional()
  city?: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiPropertyOptional()
  phone?: string;
  @ApiPropertyOptional()
  mobile?: string;
  @ApiPropertyOptional()
  vat?: string;
  @ApiPropertyOptional()
  additionalInfo?: string;
  @ApiPropertyOptional()
  displayName?: string;
}
