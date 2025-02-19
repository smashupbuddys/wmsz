export const ID_PATTERNS = {
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  AADHAR: /^[2-9]{1}[0-9]{11}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
};

export const validateId = (type: string, value: string): { isValid: boolean; error?: string } => {
  switch (type) {
    case 'GSTIN':
      if (!ID_PATTERNS.GSTIN.test(value)) {
        return {
          isValid: false,
          error: 'Invalid GSTIN format. Should be like: 27AAPFU0939F1ZV'
        };
      }
      break;

    case 'Aadhar':
      if (!ID_PATTERNS.AADHAR.test(value)) {
        return {
          isValid: false,
          error: 'Invalid Aadhar format. Should be 12 digits and not start with 0 or 1'
        };
      }
      break;

    case 'PAN':
      if (!ID_PATTERNS.PAN.test(value)) {
        return {
          isValid: false,
          error: 'Invalid PAN format. Should be like: ABCDE1234F'
        };
      }
      break;

    default:
      return { isValid: false, error: 'Invalid ID type' };
  }

  return { isValid: true };
};

// Format ID number for display
export const formatId = (type: string, value: string): string => {
  switch (type) {
    case 'GSTIN':
      return value.toUpperCase();
    case 'Aadhar':
      return value.replace(/(\d{4})/g, '$1 ').trim();
    case 'PAN':
      return value.toUpperCase();
    default:
      return value;
  }
};

// Sanitize input
export const sanitizeId = (type: string, value: string): string => {
  switch (type) {
    case 'GSTIN':
      return value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    case 'Aadhar':
      return value.replace(/\D/g, '');
    case 'PAN':
      return value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    default:
      return value;
  }
};
