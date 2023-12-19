export function parseJson<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch (err) {
    console.error('parsing error on ', { value });
    return undefined;
  }
}
