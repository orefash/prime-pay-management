import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SetAgentIdentificationDto } from 'apps/agent-app/src/dto/SetAgentIdentification.dto';
import { SetAgentLogoDto } from 'apps/agent-app/src/dto/SetAgentLogo.dto';
import { Agent, ResetToken } from 'apps/agent-app/src/typeorm';
import * as path from 'path';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
    constructor
        (
            @InjectRepository(Agent)
            private readonly agentRepository: Repository<Agent>,
            // @Inject(ThirdPartyDataService)
            // private readonly thirdPartDataService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService,
            @Inject(JwtService)
            private readonly jwtService: JwtService,
            @InjectRepository(ResetToken)
            private readonly tokenRepository: Repository<ResetToken>,
            // @Inject(PaystackService)
            // private readonly paystackService: PaystackService,
        ) { }


    async fetchUploadPath(fileName: string) {
        const isLocal = this.configService.get<string>('IS_LOCAL_STORAGE') === 'true';
        // console.log('in fetcher - islocal: ', isLocal);
        // console.log('islocal - type: ', typeof isLocal);

        if (isLocal) {
            const destination = this.configService.get<string>('UPLOADED_FILES_DESTINATION');

            const filePath = path.join(__dirname, '..', '..', '..', destination, fileName);
            // console.log("FilePath: ", filePath);
            return filePath;
        }

        const destination = this.configService.get<string>('DOCKER_UPLOAD_DIR');

        const filePath: string = path.join(destination, fileName);

        // console.log('in file path manager fp: ', filePath)
        return filePath;
    }

    async setAgentLogo(id: string, setLogo: SetAgentLogoDto) {
        await this.agentRepository.update(id, setLogo);
        const updatedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedAgent) {
            const { password, ...agent } = updatedAgent;
            return {
                id: agent.id,
                message: "Agent Logo Set"
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }


    // async getAgentLogo(agentId: string) {
    //     const docs = await this.agentRepository.findOne({
    //         where: {
    //             id: agentId
    //         },
    //         select: ['id', 'logoUrl', 'logoMime', '],

    //     });

    //     console.log("dic: ", docs)

    //     if (docs?.logoPath) {

    //         const fileName = path.basename(docs.logoPath);
    //         console.log('fn: ', fileName)
    //         const filePath = await this.fetchUploadPath(fileName);

    //         const contentType = docs.logoMime;
    //         return { fileName, contentType, filePath: filePath }
    //     }

    //     throw new HttpException('Agent Logo not found', HttpStatus.NOT_FOUND);

    // }


    async setAgentIdentification(id: string, editAgentID: SetAgentIdentificationDto) {

        await this.agentRepository.update(id, editAgentID);
        const updatedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedAgent) {
            const { password, ...agent } = updatedAgent;
            return {
                id: updatedAgent.id,
                idType: updatedAgent.IdType,
                message: "AGent Identification Set"
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }



    // async getAgentIdentification(agentId: string) {
    //     const docs = await this.agentRepository.findOne({
    //         where: {
    //             id: agentId
    //         },
    //         select: ['id', 'agentCode', 'IdType', 'agentId', 'IdMime'],
    //     });

    //     // console.log('pID: ', docs);
    //     if (docs?.agentId) {

    //         const fileName = path.basename(docs.agentId);

    //         const contentType = docs.IdMime;

    //         const filePath = await this.fetchUploadPath(fileName);
    //         return { fileName, contentType, filePath: filePath, idType: docs.IdType }
    //     }


    //     throw new HttpException('Agent ID Card not found', HttpStatus.NOT_FOUND);
    // }


    // async getAgentIdentificationURL(agentId: string) {
    //     const docs = await this.agentRepository.findOne({
    //         where: {
    //             id: agentId
    //         },
    //         select: ['id', 'agentCode', 'IdType', 'agentId', 'IdMime'],
    //     });

    //     console.log('pID: ', docs);

    //     if (docs.agentId) {

    //         const fileName = path.basename(docs.agentId);

    //         const contentType = docs.IdMime;

    //         const filePath = await this.fetchUploadPath(fileName);
    //         console.log('fp: ', fileName)
    //         return { fileName, contentType, filePath: filePath }
    //     }


    //     throw new HttpException('Agent ID Card not found', HttpStatus.NOT_FOUND);
    // }

}
