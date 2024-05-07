import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelData, ExcelDataSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExcelData.name, schema: ExcelDataSchema },
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule so it can be used in other modules
})
export class ExcelDataModule {}
