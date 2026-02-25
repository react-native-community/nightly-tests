export default function getCleanPackageName(packageName: string) {
  return packageName.includes('@') && !packageName.startsWith('@')
    ? packageName.split('@')[0]
    : packageName;
}
