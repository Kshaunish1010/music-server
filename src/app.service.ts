import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as https from 'https';

@Injectable()
export class AppService {

  constructor(private readonly configService:ConfigService) { }

  getAWSConfig() {
    const certs = [
      fs.readFileSync('certs/ZscalerRootCertificate-2048-SHA256.pem'),
      fs.readFileSync('certs/AmazonRootCA1.pem'),
    ];

    const awsConfig = {
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      httpOptions: {
        agent: new https.Agent({
          rejectUnauthorized: true,
          ca: certs,
        })
      }
    }

    return awsConfig;
  }
}
