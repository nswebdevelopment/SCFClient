class Validator {
    // Validate email format
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    // Validate phone number format (example for US phone numbers)
    static validatePhoneNumber(phoneNumber) {
      const phoneRegex = /^\+?1?\d{10,15}$/; // Adjust the regex based on your requirements
      return phoneRegex.test(phoneNumber);
    }
  }
  
  export default Validator;
  