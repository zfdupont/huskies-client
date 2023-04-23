export function roundUpToFirstDecimal(number) {
  if (number <= 0) return 0;
  return Math.ceil(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
}

export function roundDownToFirstDecimal(number) {
  if (number <= 0) return 0;
  return Math.floor(number / 10 ** (Math.floor(Math.log10(number)) - 1)) * 10 ** (Math.floor(Math.log10(number)) - 1)
}

export function calculateHeatMapFeatureValues(min, max) {
  let start = roundDownToFirstDecimal(min)
  let end = roundUpToFirstDecimal(max)
  let variation = roundUpToFirstDecimal((end - start) / 5);
  return [start, start + variation, start + 2*variation, start + 3*variation, start + 4*variation, end]
}