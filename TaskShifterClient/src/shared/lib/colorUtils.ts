// shared/lib/colorUtils.ts
/**
 * Конвертує десяткове число в HEX строку
 * @param decimal Десяткове число кольору
 * @returns HEX строка (наприклад, "#3b82f6")
 */
export const decimalToHex = (decimal: number): string => {
  const hex = decimal.toString(16).toLowerCase();
  return `#${hex.padStart(6, '0')}`;
};

/**
 * Конвертує HEX строку в десяткове число
 * @param hex HEX строка (наприклад, "#3b82f6" або "3b82f6")
 * @returns Десяткове число
 */
export const hexToDecimal = (hex: string): number => {
  const cleanHex = hex.replace('#', '');
  return parseInt(cleanHex, 16);
};

type ColorType = "tooDark" | "normal" | "tooLight";

/**
 * Визначає яскравість кольору
 * @param hexcolor HEX колір
 * @returns Тип кольору (tooDark, normal, tooLight)
 */
export const getBrightness = (hexcolor: string): ColorType => {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  if (brightness < 128) return "tooDark";    // Темні кольори - білий текст
  if (brightness > 192) return "tooLight";   // Світлі кольори - чорний текст
  return "normal";                           // Нормальні кольори - білий текст
};

/**
 * Хук для визначення оптимального кольору тексту для фону
 * @param backgroundColor HEX колір фону
 * @returns Колір тексту (#000000 для світлих фонів, #ffffff для темних)
 */
export const useAdaptiveTextColor = (backgroundColor: string): string => {
  const brightness = getBrightness(backgroundColor);
  
  // Для світлих фонів - чорний текст, для темних - білий
  return brightness === "tooLight" ? "#000000" : "#ffffff";
};