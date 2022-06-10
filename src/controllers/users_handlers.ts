export const validatePassword = (password: string) => {
  if (password.length < 8) {
    throw new Error('Password should be at least 8 characters long')
  } else if (password.length > 250) {
    throw new Error('Attempted to store a password longer than 250 characters')
  } else {
    return true
  }
}
