import { generateArrayChunk } from './array.utils';

describe('Array utility functions', () => {
  describe('Array chunk', () => {
    it('should generate chunk of arrays from an array', () => {
      const chunks = generateArrayChunk([1, 2, 3, 4]);

      expect(chunks).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('should generate chunk of arrays depend on chunk size', () => {
      const chunks = generateArrayChunk(
        [
          { name: 'John Doe', email: 'johndoe@email.com' },
          { name: 'Kevin Doe', email: 'kevindoe@email.com' },
          { name: 'Jane Doe', email: 'janedoe@email.com' },
          { name: 'Jones Doe', email: 'jonesdoe@email.com' },
          { name: 'Michael Doe', email: 'michaeldoe@email.com' },
          { name: 'Jessica Doe', email: 'jessicadoe@email.com' },
        ],
        3,
      );

      expect(chunks).toEqual([
        [
          { name: 'John Doe', email: 'johndoe@email.com' },
          { name: 'Kevin Doe', email: 'kevindoe@email.com' },
          { name: 'Jane Doe', email: 'janedoe@email.com' },
        ],
        [
          { name: 'Jones Doe', email: 'jonesdoe@email.com' },
          { name: 'Michael Doe', email: 'michaeldoe@email.com' },
          { name: 'Jessica Doe', email: 'jessicadoe@email.com' },
        ],
      ]);
    });
  });
});
