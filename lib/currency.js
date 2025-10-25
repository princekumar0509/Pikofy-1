/**
 * Format amount in Indian Rupees (₹)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showSymbol = true) {
  const formatted = amount.toFixed(2);
  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format amount in Indian numbering system with commas
 * Example: 1,00,000.00 instead of 100,000.00
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted currency string in Indian format
 */
export function formatIndianCurrency(amount, showSymbol = true) {
  const formatted = amount.toFixed(2);
  const [integer, decimal] = formatted.split('.');
  
  // Indian numbering system: first 3 digits from right, then groups of 2
  let lastThree = integer.substring(integer.length - 3);
  const otherNumbers = integer.substring(0, integer.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + '.' + decimal;
  
  return showSymbol ? `₹${result}` : result;
}





