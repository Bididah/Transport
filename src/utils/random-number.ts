import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

const min = 100000; // Smallest 6-digit number
const max = 999999; // Largest 6-digit number

export function generateRandomNum(): number {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

export function generateUUID() {
  // Generate 16 random bytes (128 bits)
  const uuid = randomUUID();
  // Format the UUID
  return uuid.toUpperCase();
}

export function groupByField<T>(array: T[], field: string): Record<string, T[]> {
  return array.reduce(
    (acc, obj) => {
      const key = obj[field];
      acc[key] = acc[key] || [];
      acc[key].push(obj);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function createDtoForMatching(MID: string, codeExp: string, span: number) {
  const mid = parseInt(MID.replace(/\D/g, ''), 10);
  const codeExpo = parseInt(codeExp.replace(/\D/g, ''), 10);
  const createDto = {
    MID: mid,
    codeExp: codeExpo,
    match: mid === codeExpo ? true : false,
    timeSpan: span,
  };
  return createDto;
}

export function generateTrackingNumber(uuid: string) {
  const prefix = 'JD'; // ton code transporteur
  const zone = String(Math.floor(Math.random() * 99)).padStart(2, '0'); // 2 chiffres
  const range = String(Math.floor(Math.random() * 999999)).padStart(6, '0'); // 6 chiffres

  // 9 chiffres dérivés de l'UUID
  const hash = createHash('sha256').update(uuid).digest('hex');
  const bigNumber = BigInt('0x' + hash);
  const unique = (bigNumber % BigInt(1_000_000_000)).toString().padStart(9, '0');

  return `${prefix}${zone}${range}${unique}`;
}
