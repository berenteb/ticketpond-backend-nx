import { bootstrapService } from '@ticketpond-backend-nx/utils';

import { ExperienceModule } from './experience.module';

async function bootstrap() {
  return bootstrapService(ExperienceModule, 'experience');
}

bootstrap();
