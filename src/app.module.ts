import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsController } from './upload.controller';
import { UploadsService } from './upload.service';
import { ExcelDataModule } from './excel.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_STRING');
        Logger.log(`Retrieved MongoDB URI: ${uri}`);
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    ExcelDataModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
  ],
  controllers: [AppController, UploadsController],
  providers: [AppService, UploadsService],
})
export class AppModule {}
