import getCode from './getCode'

export default function getRaceCount(arr) {
  const result = [...arr.reduce((r, o) => {
    const key = o.districtCode + '-' + getCode(o.office);
    return r.set(key, key);
  }, new Map).values()];
  return result.length
}
