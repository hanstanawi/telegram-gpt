import { Character } from '@prisma/client';

import { SELECTION_TYPE } from '../constants';
import { transformListToKeyboardButtons } from './telegram.utils';

describe('Telegram utility functions', () => {
  describe('Inline keyboard buttons', () => {
    it('should generate inline keyboard buttons from characters', () => {
      const mockCharacters: Character[] = [
        {
          id: '1',
          name: 'mock-character-1',
          prompt: 'mock prompt',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'mock-character-2',
          prompt: 'mock prompt-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const keyboardButtons = transformListToKeyboardButtons(
        mockCharacters,
        SELECTION_TYPE.CHARACTER,
      );

      expect(keyboardButtons).toEqual([
        {
          text: 'mock-character-1',
          callback_data: '{"data":"1","type":"character"}',
        },
        {
          text: 'mock-character-2',
          callback_data: '{"data":"2","type":"character"}',
        },
      ]);
    });
  });
});
