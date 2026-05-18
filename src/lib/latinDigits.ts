/**
 * Replaces Arabic-Indic (٠–٩) and Eastern Arabic / Persian (۰–۹) digits with ASCII 0–9.
 * Keeps pricing UI consistent if Intl/fonts emit non-Latin digits (e.g. after returning from a payment page).
 */
export function toLatinDigits(input: string): string {
  return input.replace(/[\u0660-\u0669\u06f0-\u06f9]/gi, (ch) => {
    const c = ch.charCodeAt(0);
    if (c >= 0x0660 && c <= 0x0669) return String(c - 0x0660);
    const e = ch.toLowerCase().charCodeAt(0);
    if (e >= 0x06f0 && e <= 0x06f9) return String(e - 0x06f0);
    return ch;
  });
}
