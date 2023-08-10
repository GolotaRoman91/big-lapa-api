import { Module } from '@nestjs/common';
import { DogCardController } from './dog-card.controller';
import { DogCardService } from './dog-card.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { DogCard } from './models/dog-card.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: DogCard,
        schemaOptions: {
          collection: 'DogCards',
        },
      },
    ]),
  ],
  controllers: [DogCardController],
  providers: [DogCardService],
})
export class DogCardModule {}
