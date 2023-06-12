
import { ConfigService } from '@nestjs/config';

// export async function fetchUploadPath(fileName: string) {
//     const isLocal = this.configService.get<boolean>('IS_LOCAL_STORAGE');
//     console.log('islocal: ', isLocal);

//     if (isLocal) {
//         const destination = this.configService.get<string>('UPLOADED_FILES_DESTINATION');

//         const filePath = path.join(__dirname, '..', '..', '..', '..', destination, fileName);
//         return filePath;
//     }

//     const destination = this.configService.get<string>('DOCKER_UPLOAD_DIR');

//     return path.join(destination, fileName);

// }


