/**
 * Formats bytes into a human-readable string (e.g., "2.05 MB").
 * @param bytes The size in bytes.
 * @param decimals The number of decimal places for rounding (default is 2).
 * @returns A formatted string with the appropriate unit.
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!(bytes satisfies number)) return '0 Bytes'; // Handle 0 bytes

  const base = 1024; // Base for binary units (KiB, MiB, etc., commonly labeled KB, MB)
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const dm = Math.max(decimals, 0); // Ensure non-negative decimals

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  // Prevents invalid index for extremely small non-zero values
  const finalIndex = Math.max(0, Math.min(unitIndex, units.length - 1));

  const value = (bytes / Math.pow(base, finalIndex)).toFixed(dm);

  return `${Number.parseFloat(value).toString()} ${units[finalIndex]}`;
}

export function formatDuration(seconds: number): string {
  if (seconds === 0) return '0s';

  const levels: [number, string][] = [
    [Math.floor(seconds / 86_400), 'd'],
    [Math.floor((seconds % 86_400) / 3600), 'h'],
    [Math.floor((seconds % 3600) / 60), 'm'],
    [Math.round(seconds % 60), 's'],
  ];

  return levels
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value.toString()}${unit}`)
    .join(' ');
}
