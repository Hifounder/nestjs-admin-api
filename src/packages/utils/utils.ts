import { createHmac } from 'crypto';

export const MD5 = (message: string): string => {
  const algorithm = 'sha256';
  const inputEncoding = 'utf8';
  const outputEncoding = 'hex';
  const key = process.env.OFFICIAL_KEY;

  return createHmac(algorithm, key)
    .update(message, inputEncoding)
    .digest(outputEncoding);
};
