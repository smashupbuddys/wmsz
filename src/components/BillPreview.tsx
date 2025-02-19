
// ... previous imports
import { validateId, formatId, sanitizeId } from '../lib/validations';

const QuickBill: React.FC = () => {
  // ... previous state declarations

  const [idError, setIdError] = useState<string>('');

  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      idType: value,
      idNumber: '' // Reset ID number when type changes
    }));
    setIdError('');
    setGstinError('');
  };

  const handleIdNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const idType = formData.idType;
    
    if (!idType) {
      setIdError('Please select ID type first');
      return;
    }

    // Sanitize input based on ID type
    const sanitizedValue = sanitizeId(idType, value);
    
    setFormData(prev => ({
      ...prev,
      idNumber: sanitizedValue
    }));

    // Clear previous errors
    setIdError('');
    setGstinError('');

    // Validate as user types
    if (sanitizedValue.length > 0) {
      const { isValid, error } = validateId(idType, sanitizedValue);
      if (!isValid) {
        setIdError(error || 'Invalid format');
        return;
      }

      // If it's a complete GSTIN, verify it
      if (idType === 'GSTIN' && sanitizedValue.length === 15) {
        setIsVerifying(true);
        try {
          const response = await verifyGSTIN(sanitizedValue);
          if (response.success && response.data) {
            const { data } = response;
            setFormData(prev => ({
              ...prev,
              name: data.tradeName,
              state: data.state,
              address: data.address,
              gstinStatus: data.status
            }));
            
            if (data.status !== 'Active') {
              setGstinError('Warning: GSTIN is not Active');
            }
          } else {
            setGstinError(response.error || 'Invalid GSTIN');
          }
        } catch (error) {
          setGstinError('GSTIN verification failed');
        } finally {
          setIsVerifying(false);
        }
      }
    }
  };

  // Update the ID Number input field in the form
  return (
    // ... previous JSX
    <div>
      <label className="block text-sm font-medium text-gray-700">ID Type</label>
      <select 
        name="idType"
        value={formData.idType || ''}
        onChange={handleIdTypeChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        required
      >
        <option value="">Select ID Type</option>
        <option value="GSTIN">GSTIN</option>
        <option value="Aadhar">Aadhar</option>
        <option value="PAN">PAN</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">ID Number</label>
      <div className="relative">
        <input 
          type="text"
          name="idNumber"
          value={formData.idNumber || ''}
          onChange={handleIdNumberChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${
            (idError || gstinError) ? 'border-red-500' : ''
          }`}
          placeholder={
            formData.idType === 'GSTIN' ? '27AAPFU0939F1ZV' :
            formData.idType === 'Aadhar' ? '1234 5678 9012' :
            formData.idType === 'PAN' ? 'ABCDE1234F' : ''
          }
          required
        />
        {isVerifying && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {idError && (
        <p className="mt-1 text-sm text-red-600">{idError}</p>
      )}
      {gstinError && (
        <p className="mt-1 text-sm text-red-600">{gstinError}</p>
      )}
      {formData.idType && !idError && !gstinError && (
        <p className="mt-1 text-sm text-gray-500">
          {formData.idType === 'GSTIN' ? 'Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/digit + Z + 1 letter/digit' :
           formData.idType === 'Aadhar' ? 'Format: 12 digits' :
           formData.idType === 'PAN' ? 'Format: 5 letters + 4 digits + 1 letter' : ''}
        </p>
      )}
    </div>
    // ... rest of the JSX
  );
};
</boltArtifact>

Added:
1. Validation patterns for GSTIN, Aadhar, and PAN
2. Real-time validation as user types
3. Input sanitization (removing spaces, converting to uppercase)
4. Helpful format hints
5. Clear error messages
6. Auto-formatting for better readability
7. Reset validation on ID type change
8. Placeholder examples for each ID type

The validation will:
- GSTIN: Check format and verify with API
- Aadhar: Ensure 12 digits and proper format
- PAN: Verify 5 letters + 4 digits + 1 letter format

Should I proceed with implementing the database integration and other features?