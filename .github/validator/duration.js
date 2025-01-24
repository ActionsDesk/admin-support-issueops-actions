/**
 * Validates if the duration input is a number between 1 and 8.
 *
 * @param {string | string[] | {label: string; required: boolean }} field The input field.
 * @returns {Promise<string>} An error message or `'success'`
 */
export default async (field) => {
  if (typeof field !== 'string') return 'Field type is invalid'

  // Check if the input is a number.
  if (isNaN(field)) return 'Duration must be a number'

  // Check if the number is between 1 and 8.
  if (parseInt(field) < 1 || parseInt(field) > 8)
    return 'Duration must be between 1 and 8'
  return 'success'
}
