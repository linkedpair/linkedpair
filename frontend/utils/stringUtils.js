/**
 * Parses a comma-separated string into a lowercase, deduplicated array.
 * @param {string} input
 * @returns {string[]}
 */
export const parseToArray = (input) => {
  if (typeof input !== "string") return [];

  const arr = input
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  // Deduplicate
  return [...new Set(arr)];
};
