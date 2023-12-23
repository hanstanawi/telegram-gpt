import type { Message } from '@prisma/client';

export function getMessagesCharacters(
  characterPrompt: string,
  messages: Message[],
) {
  const characterPromptLength = characterPrompt;
  const messagesCharsLength = messages.reduce((acc, currVal) => {
    return acc + currVal.text;
  }, '');

  return characterPromptLength + messagesCharsLength;
}
