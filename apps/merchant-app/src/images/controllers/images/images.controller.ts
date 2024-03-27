import { Controller, Get, Param, Req, Res,  } from '@nestjs/common';
import { ImagesService } from '../../services/images/images.service';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
    constructor(
        private readonly imageService: ImagesService

    ) {

    }

    @Get(':filename')
    async getImageByFilename(
        @Res() res: Response,
        @Param('filename') fname: string
    ) {
        let fileData = await this.imageService.getImageFile(fname);
        res.attachment(fileData.filename);
        res.setHeader('Content-Type', fileData.mimeType);

        // Send the file
        res.sendFile(fileData.fPath);
    }

}
