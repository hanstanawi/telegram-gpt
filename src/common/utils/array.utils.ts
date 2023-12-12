export function generateArrayChunk<T>(
  items: T[],
  chunkSize: number = 2,
): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }

  return result;
}
