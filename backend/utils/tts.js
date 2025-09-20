import textToSpeech from '@google-cloud/text-to-speech';
import dotenv from 'dotenv';
dotenv.config();
const client = new textToSpeech.TextToSpeechClient({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
export async function synthesizeSpeech({ text, language='en' }) {
  const request = {
    input: { text },
    voice: { languageCode: language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}
