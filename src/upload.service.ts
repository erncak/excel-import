import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExcelData } from './schema'; // Update this path

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(ExcelData.name) private excelDataModel: Model<ExcelData>,
  ) {}
  async findLastElement(): Promise<ExcelData> {
    return await this.excelDataModel.findOne().sort({ _id: -1 }).exec();
  }
  async processExcelFile(file: Express.Multer.File): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];

    // Retrieve header row: the first row is considered as the header
    const headers = [];
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value.toString();
    });

    let testDetail = {};
    let testData = new this.excelDataModel({
      department: null, // Adjust the key according to your Excel structure
      date: null, // Ensure date format matches
      details: null,
    });
    // Start processing from the second row
    let objects = {};
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const rowValues = row.values;

      // Create details object by mapping headers to row values
      let details = {};

      headers.forEach((header, index) => {
        details[header] = rowValues[index + 1]; // Adjust index for 1-based array
      });

      // Extracting specific fields assuming fixed positions; adjust as necessary
      const excelData = new this.excelDataModel({
        // Adjust the key according to your Excel structure
        date: new Date(details['Date']), // Ensure date format matches
        details: details,
      });
      //console.log(excelData.details);
      objects[i - 1] = excelData;
      //await excelData.save();

      testData = excelData;
    }
    const excelDataArray = new this.excelDataModel({
      department: null,
      date: new Date(objects['Date']),
      details: objects,
    });
    await excelDataArray.save();

    console.log(objects);

    return {
      message: 'File processed successfully',
      processedRows: worksheet.rowCount - 1,
    };
  }
}
