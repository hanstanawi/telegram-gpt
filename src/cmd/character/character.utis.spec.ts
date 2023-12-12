import { Character } from '@prisma/client';

import { transformCharactersToKeyboardButtons } from './character.utils';

describe('Character command utility functions', () => {
  describe('Characters keyboard buttons', () => {
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

      const keyboardButtons =
        transformCharactersToKeyboardButtons(mockCharacters);

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
