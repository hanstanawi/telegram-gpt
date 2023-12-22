import { Message } from '@prisma/client';

export function getMessagesCharacters(
  characterPrompt: string,
  messages: Message[],
) {
  const characterPromptLength = characterPrompt.length;
  const messagesCharsLength = messages.reduce((acc, currVal) => {
    return acc + currVal.text;
  }, '').length;

  return characterPromptLength + messagesCharsLength;
}
