import validator from 'validator'

export const validateEmail = (email: string) => {
  if (!email) {
    throw new Error('Email is required')
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email')
  }
  return validator.isEmail(email)
}

export const validatePassword = (password: string) => {
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
    throw new Error('Password must contain at least one letter and one number')
  }
  return true
}
