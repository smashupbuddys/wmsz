interface GSTINResponse {
  gstin: string;
  legal_business_name: string;
  trade_name: string;
  gstin_uin_status: string;
  principal_place_of_business: string;
}

const STATE_CODES: { [key: string]: string } = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh (New)',
  '38': 'Ladakh',
};

export const getStateFromGSTIN = (gstin: string): string => {
  const stateCode = gstin.substring(0, 2);
  return STATE_CODES[stateCode] || '';
};

export const verifyGSTIN = async (gstin: string): Promise<{ 
  success: boolean; 
  data?: {
    tradeName: string;
    status: string;
    address: string;
    state: string;
  };
  error?: string;
}> => {
  try {
    const response = await fetch(`https://app.signalx.ai/apps/gst-verification/gstin-overview/${gstin}`);
    const data: GSTINResponse = await response.json();

    if (data.gstin) {
      return {
        success: true,
        data: {
          tradeName: data.trade_name || data.legal_business_name,
          status: data.gstin_uin_status,
          address: data.principal_place_of_business,
          state: getStateFromGSTIN(gstin)
        }
      };
    }
    return { success: false, error: 'Invalid GSTIN' };
  } catch (error) {
    console.error('GSTIN verification failed:', error);
    return { success: false, error: 'GSTIN verification failed' };
  }
};

export const isValidGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};
