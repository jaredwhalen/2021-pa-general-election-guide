export default function getCode(str) {
  return str.replace(/[^\w\s]/gi, '').replace(/ /g, '_').toLowerCase()
}
