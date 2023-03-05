import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AppConfigService } from './app-config.service';

interface IUploadFile {
    Bucket: string;
    ETag: string;
    key: string;
    Key: string;
    Location: string;
}
@Injectable()
export class S3Service {
    private AWS_S3_BUCKET;
    private AWS_S3_PRIVATE_BUCKET;
    private s3;

    constructor(private configService: AppConfigService) {
        this.AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
        this.AWS_S3_PRIVATE_BUCKET = this.configService.get('AWS_S3_PRIVATE_BUCKET');
        this.s3 = new S3({
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
            endpoint: this.configService.get('S3_ENDPOINT'),
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
            region: this.configService.get('AWS_S3_REGION'),
        });
    }

    async uploadFile(file: Express.Multer.File, path: string): Promise<IUploadFile> {
        const fileBuffer = file.buffer;
        return await this.s3UploadPublic(fileBuffer, this.AWS_S3_BUCKET, path, file.mimetype);
    }

    async uploadPrivateFile(file: Express.Multer.File, path: string): Promise<IUploadFile> {
        const fileBuffer = file.buffer;
        return await this.s3UploadPublic(fileBuffer, this.AWS_S3_PRIVATE_BUCKET, path, file.mimetype);
    }

    async uploadBase64File(file: string, path: string): Promise<any> {
        const buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        return await this.s3UploadPublic(buf, this.AWS_S3_BUCKET, path, 'image/png');
    }

    async getUrlPrivateFile(urlFile: string): Promise<string | null> {
        if (urlFile) {
            const signedUrlExpireSeconds = 60 * 5;
            const bucket = this.AWS_S3_PRIVATE_BUCKET;
            const url = await this.s3.getSignedUrl('getObject', {
                Bucket: bucket,
                Key: urlFile,
                Expires: signedUrlExpireSeconds,
            });

            return url;
        }

        return null;
    }

    private async s3UploadPublic(file, bucket, name, mimetype) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
        };

        try {
            const s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch (e) {
            console.log(e);
        }
    }

    async deletePublic(key: string): Promise<any> {
        try {
            return await this.s3
                .deleteObject({
                    Bucket: this.AWS_S3_BUCKET,
                    Key: key,
                })
                .promise();
        } catch (error) {
            console.log(error);
        }
    }

    async deletePrivate(key: string): Promise<any> {
        try {
            return await this.s3
                .deleteObject({
                    Bucket: this.AWS_S3_PRIVATE_BUCKET,
                    Key: key,
                })
                .promise();
        } catch (error) {
            console.log(error);
        }
    }

    // this function is used to upload private files (Contracts, Sales Contracts, Regulations...)
    async uploadBuffer(file: { fileName: string; content: Buffer }, path: string, mimetype: string): Promise<any> {
        const fileBuffer = file.content;
        return await this.s3UploadPublic(fileBuffer, this.AWS_S3_PRIVATE_BUCKET, path, mimetype);
    }

    // download private files
    async downloadPdfFromS3(key: string): Promise<any> {
        const params = {
            Bucket: this.AWS_S3_PRIVATE_BUCKET,
            Key: key,
        };
        try {
            const output = await this.s3.getObject(params).promise();
            return output;
        } catch (error) {
            console.log(error);
        }
    }
}
