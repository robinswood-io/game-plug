import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EffectsController } from './effects.controller';
import { EffectsService } from './effects.service';

describe('EffectsController', () => {
  let controller: EffectsController;
  let service: EffectsService;

  const mockEffect = {
    id: 'effect-1',
    characterId: 'char-1',
    name: 'Poison',
    description: 'Takes damage over time',
    duration: 5,
    type: 'debuff',
    value: '1d6',
    appliedBy: 'gm-1',
    isActive: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EffectsController],
      providers: [
        {
          provide: EffectsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            findByCharacter: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EffectsController>(EffectsController);
    service = module.get<EffectsService>(EffectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new effect', async () => {
      const createDto = {
        characterId: 'char-1',
        type: 'debuff',
        name: 'Poison',
        description: 'Takes damage',
        duration: 5,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockEffect);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockEffect);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create effect with value', async () => {
      const createDto = {
        characterId: 'char-1',
        type: 'buff',
        name: 'Strength Buff',
        duration: 10,
        value: '+5',
      };

      const buffEffect = {
        ...mockEffect,
        name: 'Strength Buff',
        type: 'buff',
        value: '+5',
      };

      jest.spyOn(service, 'create').mockResolvedValue(buffEffect);

      const result = await controller.create(createDto);

      expect(result.name).toBe('Strength Buff');
      expect(result.value).toBe('+5');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle creation errors', async () => {
      const createDto = {
        characterId: 'char-1',
        type: 'buff',
        name: 'Test Effect',
      };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('update', () => {
    it('should update an effect', async () => {
      const updateDto = {
        duration: 10,
        description: 'Updated description',
      };

      const updatedEffect = {
        ...mockEffect,
        ...updateDto,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedEffect);

      const result = await controller.update('effect-1', updateDto);

      expect(result).toEqual(updatedEffect);
      expect(service.update).toHaveBeenCalledWith('effect-1', updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update effect value', async () => {
      const updateDto = {
        value: '+10',
      };

      const updatedEffect = {
        ...mockEffect,
        value: '+10',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedEffect);

      const result = await controller.update('effect-1', updateDto);

      expect(result.value).toBe('+10');
      expect(service.update).toHaveBeenCalledWith('effect-1', updateDto);
    });

    it('should handle effect not found', async () => {
      const updateDto = { duration: 5 };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Active effect effect-1 not found'));

      await expect(controller.update('effect-1', updateDto)).rejects.toThrow(NotFoundException);
      await expect(controller.update('effect-1', updateDto)).rejects.toThrow('Active effect effect-1 not found');
    });

    it('should update effect name', async () => {
      const updateDto = { name: 'New Effect Name' };
      const updatedEffect = { ...mockEffect, name: 'New Effect Name' };

      jest.spyOn(service, 'update').mockResolvedValue(updatedEffect);

      const result = await controller.update('effect-1', updateDto);

      expect(result.name).toBe('New Effect Name');
      expect(service.update).toHaveBeenCalledWith('effect-1', updateDto);
    });
  });
});
