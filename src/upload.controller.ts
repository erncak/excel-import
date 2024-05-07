import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './upload.service';
import { Express } from 'express';
import { ExcelData, ExcelDataDocument } from './schema';
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Get('last-element')
  async getLastElement(): Promise<any> {
    try {
      const lastElement = await this.uploadsService.findLastElement();
      if (!lastElement) {
        throw new HttpException('No element found', HttpStatus.NOT_FOUND);
      }
      return lastElement;
    } catch (error) {
      throw new HttpException(
        'Failed to retrive element',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(@UploadedFile() file: Express.Multer.File) {
    console.log('controller');
    return this.uploadsService.processExcelFile(file);
  }
}
