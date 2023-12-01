import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const clientConfig = {
  apiKey: OPENAI_API_KEY,
};

const openai = new OpenAI(clientConfig);

export default openai;
