export function formatPrice(amount) {
  return `RWF ${(amount * 1000).toLocaleString()}`;
}
