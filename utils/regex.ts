/**
 * Checks if the email is in a valid format (any domain)
 *
 * @param email - The email to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Checks if the password meets the following criteria:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 *
 * @param password - The password to validate
 * @returns True if the password is strong, false otherwise
 */
export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}
