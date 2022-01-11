import Wherewolf from "wherewolf"
const layers = require("../../data/topo.json")
let teenWolf = Wherewolf;
teenWolf.addAll(layers)

export default function getDistricsFromPoint(coordinates) {
  let results = teenWolf.find(coordinates);
  let districtCodes = []
  Object.keys(results).forEach(k => results[k] && districtCodes.push(results[k].districtCo))
  console.log(districtCodes)
  return districtCodes
}
