interface GSTINResponse {
  gstin: string;
  legal_business_name: string;
  trade_name: string;
  gstin_uin_status: string;
  principal_place_of_business: string;
}

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

export const getStateFromGSTIN = (gstin: string): string => {
  const stateCode = gstin.substring(0, 2);
  return STATE_CODES[stateCode] || '';
};

const STATE_CODES: { [key: string]: string } = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  // ... add all states
};
