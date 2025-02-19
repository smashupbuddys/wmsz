import { Customer, FormErrors } from '../types';

export const validateCustomerData = (data: Partial<Customer>): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.phone?.trim()) errors.phone = 'Phone is required';
  if (!data.state?.trim()) errors.state = 'State is required';
  if (!data.idNumber?.trim()) errors.idNumber = 'ID Number is required';

  // Phone validation
  if (data.phone && !/^\d{10}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number';
  }

  // ID validations
  if (data.idType && data.idNumber) {
    switch (data.idType) {
      case 'GSTIN':
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.idNumber)) {
          errors.idNumber = 'Invalid GSTIN format';
        }
        break;
      case 'Aadhar':
        if (!/^\d{12}$/.test(data.idNumber)) {
          errors.idNumber = 'Invalid Aadhar format';
        }
        break;
      case 'PAN':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.idNumber)) {
          errors.idNumber = 'Invalid PAN format';
        }
        break;
    }
  }

  return errors;
};

export const validateAmount = (amount: string): string | null => {
  if (!amount) return 'Amount is required';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) return 'Invalid amount';
  return null;
};
