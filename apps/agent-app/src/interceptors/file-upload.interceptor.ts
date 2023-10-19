import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

let CustomFileInterceptor = ( fieldName: string, mimeTypes: string[]) => {

    const isLocal: boolean = process.env.IS_LOCAL_STORAGE === 'true';

    console.log("is Local storage in file interect: ", isLocal)

    
    const myUploadDirectory = isLocal ? process.env.UPLOADED_FILES_DESTINATION : process.env.DOCKER_UPLOAD_DIR;
    console.log('uupload dir: ', myUploadDirectory)
    
    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: myUploadDirectory,
            filename: (req, file, callback) => {
                // generate a unique filename with the original extension
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const originalName = file.originalname.split('.').slice(0, -1).join('.');
                const extension = file.originalname.split('.').pop();
                callback(null, `${originalName}-${uniqueSuffix}.${extension}`);
            },
        }),
        fileFilter: (req, file, callback) => {

            const allowedMimeTypes = mimeTypes;
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new Error('File type not allowed'), false);
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 3, // 3MB
        },
    })
}

export default CustomFileInterceptor;
