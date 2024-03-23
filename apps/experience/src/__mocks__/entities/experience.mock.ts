import { Experience } from '@prisma/client';

export const ExperienceMock: Experience = {
  bannerImage: 'experience-banner-image',
  description: 'experience-description',
  endDate: new Date('2024-01-01T00:00:00.000Z'),
  id: 'experience-id',
  merchantId: 'merchant-id',
  name: 'experience-name',
  startDate: new Date('2024-01-01T00:00:00.000Z'),
};
