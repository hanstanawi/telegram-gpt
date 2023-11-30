import OpenAI from 'openai';

const clientConfig = {
  apiKey: process.env.OPENAI_API_KEY as string,
};

const openai = new OpenAI(clientConfig);

export default openai;
