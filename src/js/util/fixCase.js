export default function fixCase(str) {
  return str.replace('us senator', 'U.S. Senator').replace('U.s. senator', 'U.S. Senator')
}
