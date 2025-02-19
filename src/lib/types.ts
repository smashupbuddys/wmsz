export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  idType: 'GSTIN' | 'Aadhar' | 'PAN';
  idNumber: string;
  state: string;
  pincode?: string;
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
  id?: string;
  billNumber: string;
  date: Date;
  dueDate?: Date;
  customer: Customer;
  items: BillItem[];
  amount: number;
  gstType: 'IGST' | 'CGST_SGST';
  gstAmount: number;
  total: number;
  splitGroup?: string;
  isPartOfSplit?: boolean;
  splitIndex?: number;
  totalSplits?: number;
}
