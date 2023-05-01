//let arr1 = [[1, 0], [0, 1], [2, 1], [1, 2]]
//let arr2 = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]];
let arr1 = ["11", "22", "33", "44"]
let arr2 = ["33", "44", "55", "66"]
//intersetction is [1, 0], [0, 1], [2, 1]
const filteredArray = arr1.filter(value => arr2.includes(value));
console.log(filteredArray)