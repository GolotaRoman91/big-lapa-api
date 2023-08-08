import { Test, TestingModule } from '@nestjs/testing';
import { DogCardController } from './dog-card.controller';

describe('DogCardController', () => {
  let controller: DogCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogCardController],
    }).compile();

    controller = module.get<DogCardController>(DogCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
