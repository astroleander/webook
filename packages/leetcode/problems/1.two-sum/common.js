export const twoSum = (nums, target) => {
  const mat = {};
  for (let i = 0; i < nums.length; i++) {
    if (mat[nums[i]] !== undefined) {
      return [mat[nums[i]], i];
    }
    mat[target - nums[i]] = i;
  } 
}