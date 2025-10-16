import type { Rule } from 'antd/es/form'

// Common validation rules
export const validationRules = {
  required: (fieldName?: string): Rule => ({
    required: true,
    message: `Please enter ${fieldName || 'this field'}!`
  }),

  // Email validation
  email: (): Rule => ({
    type: 'email',
    message: 'Please enter a valid email address!'
  }),

  // Password validation
  password: (minLength: number = 6): Rule => ({
    min: minLength,
    message: `Password must be at least ${minLength} characters!`
  }),

  // Minimum length
  minLength: (length: number): Rule => ({
    min: length,
    message: `Minimum ${length} characters required!`
  }),

  // Maximum length
  maxLength: (length: number): Rule => ({
    max: length,
    message: `Maximum ${length} characters allowed!`
  }),

  // Number validation
  number: (min?: number, max?: number): Rule[] => {
    const rules: Rule[] = [
      {
        type: 'number',
        message: 'Please enter a valid number!'
      }
    ]

    if (min !== undefined) {
      rules.push({
        type: 'number',
        min: min,
        message: `Minimum value is ${min}!`
      })
    }

    if (max !== undefined) {
      rules.push({
        type: 'number',
        max: max,
        message: `Maximum value is ${max}!`
      })
    }

    return rules
  },

  // Phone number validation
  phone: (): Rule => ({
    pattern: /^[+]?[\d\s\-()]{10,}$/,
    message: 'Please enter a valid phone number!'
  }),

  // URL validation
  url: (): Rule => ({
    type: 'url',
    message: 'Please enter a valid URL!'
  }),

  // Confirm password validation
  confirmPassword: (passwordField: string): Rule => ({
    validator: (_, value) => {
      if (value !== passwordField) {
        return Promise.reject(new Error('Passwords do not match!'));
      }
      return Promise.resolve();
    },
    message: 'Passwords do not match!'
  }),

  // Custom pattern validation
  pattern: (pattern: RegExp, message: string): Rule => ({
    pattern,
    message
  }),

  // Username validation (alphanumeric + underscore, 3-20 chars)
  username: (): Rule => ({
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: 'Username must be 3-20 characters (letters, numbers, underscore only)!'
  })
}

// Pre-defined rule combinations for common use cases
export const commonRules = {
  email: [validationRules.required('email'), validationRules.email()],
  
  password: [validationRules.required('password'), validationRules.password()],
  
  username: [validationRules.required('username'), validationRules.username()],
  
  phone: [validationRules.required('phone'), validationRules.phone()],
  
  name: [validationRules.required('name'), validationRules.minLength(2), validationRules.maxLength(50)],
  
  age: [validationRules.required('age'), ...validationRules.number(1, 120)],
  
  url: [validationRules.required('URL'), validationRules.url()]
}

export default validationRules