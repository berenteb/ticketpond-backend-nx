import { ApiProperty } from '@nestjs/swagger';
import { ExperienceDto } from './experience.dto';
import { TicketDto } from './ticket.dto';

export class DeepTicketDto extends TicketDto {
  @ApiProperty()
  experience: ExperienceDto;
}
