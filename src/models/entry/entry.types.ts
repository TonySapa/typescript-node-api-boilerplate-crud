/** TS interface for "entry". With fields: field1, field2 and user.
 * @field field1 is a unique string between 3 and 254 characters
 * @field field2 is a number
 * @field user is a unique string with the user id
 */
export interface entryType {
  field1: string,
  field2?: number,
  user: string
}
