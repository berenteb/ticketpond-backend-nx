import { ApiProperty } from '@nestjs/swagger';
import { ExperienceDto } from './experience.dto';
import { MerchantDto } from './merchant.dto';
import { TicketDto } from './ticket.dto';

export class DeepExperienceDto extends ExperienceDto {
  @ApiProperty()
  merchant: MerchantDto;
  @ApiProperty({ type: [TicketDto] })
  tickets: TicketDto[];
}
