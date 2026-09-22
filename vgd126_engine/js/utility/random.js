/**
 * Return a random number in [low, high).
 * @param {number} [low=0]
 * @param {number} [high=1]
 */
function rand(low = 0, high = 1) {
  return Math.random() * (high - low) + low;
}