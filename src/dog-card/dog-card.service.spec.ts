import { Test, TestingModule } from '@nestjs/testing';
import { DogCardService } from './dog-card.service';

describe('DogCardService', () => {
  let service: DogCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DogCardService],
    }).compile();

    service = module.get<DogCardService>(DogCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
