import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as mimeTypes from 'mime-types';

@Injectable()
export class ImagesService {

    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) { }

    async fetchUploadPath(fileName: string) {
        const isLocal = this.configService.get<boolean>('IS_LOCAL_STORAGE');
        console.log('islocal: ', isLocal);

        if (isLocal) {
            const destination = this.configService.get<string>('UPLOADED_FILES_DESTINATION');

            const filePath = path.join(__dirname, '..', '..', '..', '..', destination, fileName);
            return filePath;
        }

        const destination = this.configService.get<string>('DOCKER_UPLOAD_DIR');

        return path.join(destination, fileName);
    }

    async getImageFile(filename: string) {

        const mimeType = mimeTypes.lookup(filename);

        // console.log(mimeType); // Output: image/png

        const fPath = await this.fetchUploadPath(filename);

        // console.log("fpath: ", fPath);

        return { filename, mimeType, fPath }
    }

}
