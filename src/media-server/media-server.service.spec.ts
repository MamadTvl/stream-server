import { Test, TestingModule } from '@nestjs/testing';
import { MediaServerService } from './media-server.service';

describe('MediaServerService', () => {
    let service: MediaServerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MediaServerService],
        }).compile();

        service = module.get<MediaServerService>(MediaServerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
