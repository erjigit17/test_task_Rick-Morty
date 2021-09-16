let arr = [ 1, 2, 3, 4, 5, 6]


Array.prototype.ownMap = function(callback) {
  let mappedArr = []
  for (let i = 0; i <this.length; i++) {
    mappedArr.push(callback(this[i]))
  }
  return mappedArr
}

let newArr = arr.ownMap(function(element) {
  return element +1
})

console.log('arr: ', arr)
console.log('newArr: ', newArr)