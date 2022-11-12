export const twoSum = (nums, target) => {
  for (let i = 0; i < nums.length; i++) {
    const num1 = array[i];
    for (let j = nums.length; i < j; j--) {
      const num2 = array[j];
      if (num1 + num2 === target) return [num1, num2];
    }
  }
  return [0, 0]
};
