import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';

@Injectable()
export class SpacesService {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            endpoint: process.env.SPACES_ENDPOINT,
            accessKeyId: process.env.SPACES_ACCESS_KEY,
            secretAccessKey: process.env.SPACES_SECRET_KEY,
            region: process.env.SPACES_REGION,
        });
    }

    async uploadFile(buffer: Buffer, filename: string): Promise<string> {

        try {
            // console.log("Spaces bname: ", process.env.SPACES_BUCKET_NAME);
            // console.log("File Buffer: ", buffer);
            const params = {
                Bucket: process.env.SPACES_BUCKET_NAME,
                Key: filename,
                Body: buffer,
                ACL: 'public-read',
            };
            const { Location } = await this.s3.upload(params).promise();
            return Location;

        } catch (error) {

            throw new Error("Error uploading file to Spaces: " + error)
        }


    }
}

