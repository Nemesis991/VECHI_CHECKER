// Mapping Cyrillic to Latin and vice versa for Bulgarian plates
const cyrillicToLatinMap: Record<string, string> = {
  'А': 'A', 'Б': 'B', 'В': 'B', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'J',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'H',
  'О': 'O', 'П': 'P', 'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Ф': 'F',
  'Х': 'X', 'Ц': 'C', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHT', 'Ъ': 'A', 'Ь': 'Y',
  'Ю': 'YU', 'Я': 'YA'
};

const latinToCyrillicPlateMap: Record<string, string> = {
  'A': 'А', 'B': 'В', 'E': 'Е', 'K': 'К', 'M': 'М', 'H': 'Н',
  'O': 'О', 'P': 'Р', 'C': 'С', 'T': 'Т', 'Y': 'У', 'X': 'Х'
};

/**
 * Auto-capitalizes, strips spaces, and strictly forces Cyrillic characters for BG Plates.
 */
export function sanitizePlateInput(input: string): string {
  if (!input) return '';
  let clean = input.toUpperCase().replace(/\s/g, '');
  
  // Convert Latin letters that look like Cyrillic to Cyrillic
  clean = clean.split('').map(char => latinToCyrillicPlateMap[char] || char).join('');
  
  // Keep only valid BG plate characters (Cyrillic letters used on plates + numbers)
  clean = clean.replace(/[^АВЕКМНОРСТУХ0-9]/g, '');
  return clean;
}

/**
 * Auto-capitalizes and strips spaces for VIN inputs.
 * Strictly forces Latin alphanumeric characters.
 */
export function sanitizeVINInput(input: string): string {
  if (!input) return '';
  let clean = input.toUpperCase().replace(/\s/g, '');
  
  // Convert any mistakenly cyrillicized characters to Latin
  clean = clean.split('').map(char => cyrillicToLatinMap[char] || char).join('');
  
  // Keep only alphanumeric characters (VIN excludes I, O, Q, but we can just allow A-Z0-9 for input flexibility)
  clean = clean.replace(/[^A-Z0-9]/g, '');
  return clean;
}

/**
 * Helper to convert any accidentally cyrillicized VIN characters back to Latin
 * for strict VIN validation and API fetching.
 */
export function cyrillicToLatin(input: string): string {
  return input.split('').map(char => cyrillicToLatinMap[char] || char).join('');
}

/**
 * Validates if the string is exactly a 17-character VIN.
 * Uses a normalized Latin string to check.
 */
export function isVIN(input: string): boolean {
  const latin = cyrillicToLatin(input);
  // VIN is 17 alphanumeric characters, omitting I, O, Q
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(latin);
}

/**
 * Formats a raw license plate string cleanly for display (e.g., "СА1234АВ" without spaces)
 */
export function formatPlateDisplay(raw: string): string {
  if (!raw) return '';
  return sanitizePlateInput(raw);
}

/**
 * Validates if the string loosely matches a Bulgarian license plate structure.
 */
export function isValidBulgarianPlate(plate: string): boolean {
  const clean = plate.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length < 5 || clean.length > 9) return false;
  // Basic BG plate regex check: 1 or 2 region letters + 4 digits + 1 or 2 series letters
  const bgPlateRegex = /^[A-ZА-Я]{1,2}\d{4}[A-ZА-Я]{1,2}$/;
  // Electric vehicles (E 12345)
  const evRegex = /^EA?\d{4,5}[A-ZА-Я]{1,2}$/;
  return bgPlateRegex.test(clean) || evRegex.test(clean);
}

/**
 * Calculate remaining days from current date (2026-07-22 simulated or runtime)
 */
export function getDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date();
  // normalize time
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Helper to get status type based on remaining days
 */
export function calculateStatusFromDays(days: number): 'valid' | 'expiring' | 'expired' {
  if (days < 0) return 'expired';
  if (days <= 14) return 'expiring';
  return 'valid';
}
