export interface Customer {
  name: string;
  phone: string;
  state: string;
  idType: 'GSTIN' | 'Aadhar' | 'PAN';
  idNumber: string;
  address?: string;
}

export interface BillItem {
  description: string;
  hsn: string;
  gstRate: number;
  quantity: number;
  rate: number;
  amount: number;
  igst?: number;
  cgst?: number;
  sgst?: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customer: Customer;
  items: BillItem[];
  amount: number;
  gstType: 'IGST' | 'CGST_SGST';
  gstAmount: number;
  total: number;
  date: string;
  splitGroupId?: string;
  splitIndex?: number;
  totalSplits?: number;
  createdAt: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SplitBill {
  amount: number;
  date: string;
  billNumber?: string;
  status: 'pending' | 'generated' | 'failed';
}
