import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from '../../services/media/media.service';
import CustomFileInterceptor from 'apps/agent-app/src/interceptors/file-upload.interceptor';
import { SetAgentIdentificationDto } from 'apps/agent-app/src/dto/SetAgentIdentification.dto';
import { generateUniqueFilename } from '@app/utils/utils/file-upload';
import JwtAuthenticationGuard from 'apps/agent-app/src/auth/utils/JWTAuthGuard';
import { dirname, join } from 'path';
import { renameSync } from 'fs';
import { Response } from 'express';
import { SetAgentLogoDto } from 'apps/agent-app/src/dto/SetAgentLogo.dto';

import * as fs from 'fs';

@Controller('agents')
export class MediaController {
    constructor(
        private readonly agentService: MediaService,

    ) { }

    @Post(':agentId/set-id-card')
    @UseInterceptors(
        CustomFileInterceptor(
            'idDoc',
            ['image/jpeg', 'image/png', 'application/pdf']
        ),
    )
    async setAgentIdentification(
        @Req() req,
        @Body() setAgentID: SetAgentIdentificationDto,
        @UploadedFile() idDoc: Express.Multer.File,
        @Param('agentId') agentId: string,
    ) {
        if (!idDoc) {
            throw new HttpException('Means of ID not uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            console.log("ID Doc: ", idDoc);
            // Generate a unique filename
            let uFileName = await generateUniqueFilename("AG-ID", idDoc.filename);
            // let uFileName = idDoc.filename;

            // Get the directory of the original file
            const fileDir = dirname(idDoc.path);

            // Create the new file path by joining the original directory and the new filename
            const newFilePath = join(fileDir, uFileName);

            // Rename the uploaded file to the new filename while preserving the directory structure
            renameSync(idDoc.path, newFilePath);

            setAgentID.agentId = uFileName;
            setAgentID.IdMime = idDoc.mimetype;

            // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;
            // const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;


            const downloadUrl = `https://${req.headers.host}/agent-api/agents/${agentId}/id-card/mm/${setAgentID.IdMime}/${setAgentID.agentId}`;
            const previewUrl = `https://${req.headers.host}/agent-api/agents/${agentId}/id-card-preview/mm/${setAgentID.IdMime}/${setAgentID.agentId}`;

            console.log("in agent setID: ", previewUrl);
            // Save the merchant identification data to the database
            let data = await this.agentService.setAgentIdentification(agentId, setAgentID);

            // Return the download URL to the client
            return {
                message: "Agent ID Set Successfully",
                idType: data.idType,
                downloadUrl,
                previewUrl
            };
        } catch (error) {
            console.error('set ID error: ', error);
            // Delete the uploaded file if there is an error
            // unlinkSync(promoterIdDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':agentId/set-logo')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(
        CustomFileInterceptor(
            'logoDoc',
            ['image/jpeg', 'image/png',]
        ),

    )
    async setAgentLogo(
        @Req() req,
        @UploadedFile() logoDoc: Express.Multer.File,
        @Param('agentId') agentId: string,
    ) {
        if (!logoDoc) {
            throw new HttpException('Logo not uploaded', HttpStatus.BAD_REQUEST);
        }

        try {

            console.log("In logo set: ", logoDoc)
            let uFileName = await generateUniqueFilename("AG-LO", logoDoc.filename);

            // Get the directory of the original file
            const fileDir = dirname(logoDoc.path);

            // Create the new file path by joining the original directory and the new filename
            const newFilePath = join(fileDir, uFileName);

            console.log(`oldp: ${logoDoc.path} || newp: ${newFilePath}`)


            renameSync(logoDoc.path, newFilePath);

            
            let setLogoDto: SetAgentLogoDto = {
                logoPath: newFilePath,
                logoMime: logoDoc.mimetype
            }

            console.log('logodto: ', setLogoDto)

            const downloadUrl = `https://${req.headers.host}/agent-api/agents/${agentId}/logo`;
            const previewUrl = `https://${req.headers.host}/agent-api/agents/${agentId}/preview-logo`;
            // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/logo`;

            console.log('du: ', downloadUrl)
            console.log('prv: ', previewUrl)
            // Save the merchant identification data to the database
            await this.agentService.setAgentLogo(agentId, setLogoDto);

            // renameSync(logoDoc.path, uFileName);


            // Return the download URL to the client
            return {
                message: "Agent Logo Set Successfully",
                downloadUrl,
                previewUrl
            };
        } catch (error) {
            console.log('set Logo error: ', error);
            // Delete the uploaded file if there is an error
            // unlinkSync(logoDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Get(':agentId/logo')
    async getAgentLogo(
        @Param('agentId') agentId: string,
        @Res() res: Response,
    ) {
        try {

            // console.log("id: ", agentId)
            const fileData = await this.agentService.getAgentLogo(agentId);

            if (!fileData) {
                throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
            }


            // console.log("Filepath: ", fileData)

            res.attachment(fileData.fileName);
            res.setHeader('Content-Type', fileData.contentType);

            res.sendFile(fileData.filePath);
        } catch (error) {
            console.error('Error in getAgentLogo:', error);
            res.status(error.getStatus()).json({ message: error.message });
            // } else {
            //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            //         message: 'Internal server error',
            //     });
            // }
        }
    }


    @Get(':agentId/preview-logo')
    async getAgentLogoPreview(
        @Param('agentId') agentId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.agentService.getAgentLogo(agentId);

            if (!fileData) {
                throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
            }

            // console.log("Filepath: ", fileData)

            const fileStream = fs.createReadStream(fileData.filePath);

            res.setHeader('Content-Type', fileData.contentType);

            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming the file:', error);
                throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (error) {
            console.error('Error in get Merchant Logo Preview:', error);
            if (error instanceof HttpException) {
                res.status(error.getStatus()).json({ message: error.message });
            } else if (error instanceof HttpException) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error',
                });
            }
        }
    }



    @Get(':agentId/id-card/mm/:mime1/:mime2/:name')
    async getAgentIdentification(
        @Param('agentId') agentId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.agentService.getAgentIdentification(
                agentId,
            );

            if (!fileData) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            }

            const fileStream = fs.createReadStream(fileData.filePath);

            res.setHeader('Content-Type', fileData.contentType);

            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming the file:', error);
                throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (error) {
            console.error('Error in getAgentIdentificationPreview:', error);
            if (error instanceof HttpException) {
                res.status(error.getStatus()).json({ message: error.message });
            } else if (error instanceof HttpException) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error',
                });
            }
        }
    }

    @Get(':agentId/id-card-preview/mm/:mime1/:mime2/:name')
    async getAgentIdentificationPreview(
        @Param('agentId') agentId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.agentService.getAgentIdentification(
                agentId,
            );

            if (!fileData) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            }

            const fileStream = fs.createReadStream(fileData.filePath);

            res.setHeader('Content-Type', fileData.contentType);

            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming the file:', error);
                throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (error) {
            console.error('Error in getAgentIdentificationPreview:', error);
            if (error instanceof HttpException) {
                res.status(error.getStatus()).json({ message: error.message });
            } else if (error instanceof HttpException) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error',
                });
            }
        }
    }

}
