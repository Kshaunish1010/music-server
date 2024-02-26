import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { SQS } from 'aws-sdk';
import { DeleteMessageRequest, ReceiveMessageRequest, SendMessageRequest } from 'aws-sdk/clients/sqs';
import { AppService } from 'src/app.service';

@Injectable()
export class AnalyticsService {

  private readonly sqs: SQS;
  private readonly queueUrl: string;
  public logger = new Logger(AnalyticsService.name);

  constructor(private readonly configService: ConfigService,
    private readonly appService: AppService,
    @InjectRepository(Analytics) private readonly analyticsRepository: Repository<Analytics>) {

    this.sqs = new SQS(this.appService.getAWSConfig());
    this.queueUrl = configService.get<string>('Q_URL');
  }

  async create(createAnalyticsDto: CreateAnalyticsDto): Promise<any> {
    try {
      await this.sendMessage(createAnalyticsDto);
      return {
        statusCode: 201,
        message: "record is processing"
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMessage(messageBody: CreateAnalyticsDto): Promise<void> {
    const params: SendMessageRequest = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };
    await this.sqs.sendMessage(params).promise();
  }

  async init() {
    this.queueListener();
    this.logger.log('------The SQS queue listener is started-------');
  }

  async queueListener() {
    try {
      const receiveParams: ReceiveMessageRequest = {
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: this.configService.get<number>('MAX_MSG'),
        WaitTimeSeconds: this.configService.get<number>('Q_WAIT_TIME'),
      };

      const receiveResult = await this.sqs.receiveMessage(receiveParams).promise();

      if (receiveResult.Messages && receiveResult.Messages.length > 0) {
        this.logger.log('-------Received message from SQS queue---------');
        const messages = receiveResult.Messages;

        for (const message of messages) {
            this.onMessageReceived(message);
        }
      }

      this.queueListener();
    }
    catch (err) {
      this.logger.error(`-----------${err.message}---------------`);
    }
  }

  async onMessageReceived(message: SQS.Message) {
    const messageBody = JSON.parse(message.Body);

    await this.analyticsRepository.save(plainToClass(CreateAnalyticsDto, messageBody));
    this.logger.log('-------Inserted message into database---------');

    await this.deleteMessage(message, this.queueUrl);
    this.logger.log('-------Deleted message from SQS queue---------');
  }

  async deleteMessage(message: SQS.Message, queueUrl: string) {
    const deleteParams: DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    };
    await this.sqs.deleteMessage(deleteParams).promise();
  }

}
