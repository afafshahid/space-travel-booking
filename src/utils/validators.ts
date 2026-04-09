export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '')
  return /^\d{16}$/.test(cleaned)
}

export const validateExpiryDate = (expiry: string): boolean => {
  const [month, year] = expiry.split('/')
  if (!month || !year) return false
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10) + 2000
  if (monthNum < 1 || monthNum > 12) return false
  const now = new Date()
  const expiryDate = new Date(yearNum, monthNum - 1)
  return expiryDate > now
}

export const validateCVC = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc)
}

export const validateCardholderName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const validateReviewTitle = (title: string): string | null => {
  if (title.trim().length === 0) return 'Title is required'
  if (title.length > 200) return 'Title must be less than 200 characters'
  return null
}

export const validateReviewContent = (content: string): string | null => {
  if (content.trim().length === 0) return 'Review content is required'
  if (content.length > 500) return 'Review must be less than 500 characters'
  if (content.trim().length < 10) return 'Review must be at least 10 characters'
  return null
}
