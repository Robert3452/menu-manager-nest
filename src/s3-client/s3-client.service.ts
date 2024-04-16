import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Duplex } from 'stream';
import { CreateS3ClientDto } from './dto/create-s3-client.dto';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class S3ClientService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    const { s3Manager } = configService;
    httpService.axiosRef.defaults.baseURL = s3Manager + '/api/files';
    httpService.axiosRef.defaults.headers.common = {
      'Access-Control-Origin': '*',
    };
  }

  bufferToStream(buffer) {
    const duplexStream = new Duplex();
    duplexStream.push(buffer);
    duplexStream.push(null);
    return duplexStream;
  }

  async deleteObject(url: string): Promise<boolean> {
    try {
      const {
        data: { success },
      } = await await firstValueFrom(
        this.httpService.delete('/image', { data: { url } }),
      );
      return success;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createObject(req: CreateS3ClientDto): Promise<string> {
    try {
      const formData = new FormData();
      // Create a Readable stream from the buffer

      const { bucket, file } = req;

      formData.append('bucket', bucket);
      formData.append(
        'file',
        new Blob([file.buffer], { type: file.mimetype }),
        file.originalname,
      );
      const {
        data: {
          data: { url },
        },
      } = await firstValueFrom(
        this.httpService.post('/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            enctype: 'multipart/form-data',
          },
        }),
      );
      return url;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
