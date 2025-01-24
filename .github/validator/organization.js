/**
 * Validates if the organization input is in the list of supported
 * organizations.
 *
 * @param {string | string[] | {label: string; required: boolean }} field The input field.
 * @returns {Promise<string>} An error message or `'success'`
 */
export default async (field) => {
  if (typeof field !== 'string') return 'Field type is invalid'

  // The list of supported organizations is defined in the `ALLOWED_ORGS`
  // environment variable in the `promotion-workflow.yml` workflow file.
  const ALLOWED_ORGS = process.env.ALLOWED_ORGS?.split(/,\s?/) ?? []

  if (ALLOWED_ORGS.includes(field)) return 'success'
  else return `Organization '${field}' is not supported`
}
