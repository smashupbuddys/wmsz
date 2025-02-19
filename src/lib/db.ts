import Dexie, { Table } from 'dexie';

// Define interfaces for our database tables
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  state: string;
  idType: string;
  idNumber: string;
  address?: string;
  lastBillDate: string;
  totalBills: number;
  totalAmount: number;
  createdAt: string;
}

interface Bill {
  id: string;
  billNumber: string;
  customerData: string; // JSON string
  amount: number;
  items: string; // JSON string
  gstType: string;
  gstAmount: number;
  total: number;
  splitGroupId?: string;
  splitIndex?: number;
  totalSplits?: number;
  createdAt: string;
}

interface ScheduledSplitBill {
  id: string;
  originalBillId: string;
  scheduledDate: string;
  amount: number;
  customerData: string; // JSON string
  splitIndex: number;
  totalSplits: number;
  status: string;
  errorMessage?: string;
  generatedBillId?: string;
  generatedBillNumber?: string;
  generatedAt?: string;
  createdAt: string;
}

interface Settings {
  id: string;
  billNumberSequence: number;
}

// Define the database
class BillingDB extends Dexie {
  customers!: Table<Customer>;
  bills!: Table<Bill>;
  scheduledSplitBills!: Table<ScheduledSplitBill>;
  settings!: Table<Settings>;

  constructor() {
    super('BillingDB');
    
    this.version(1).stores({
      customers: 'id, phone, idNumber, lastBillDate',
      bills: 'id, billNumber, splitGroupId, createdAt',
      scheduledSplitBills: 'id, originalBillId, scheduledDate, status, createdAt',
      settings: 'id'
    });
  }
}

const dexieDb = new BillingDB();

// Initialize settings if not exists
const initializeSettings = async () => {
  const settings = await dexieDb.settings.get('main');
  if (!settings) {
    await dexieDb.settings.add({
      id: 'main',
      billNumberSequence: 1000
    });
  }
};

// Initialize the database
initializeSettings().catch(console.error);

// Export database operations
export const db = {
  async createBill(billData: any) {
    return dexieDb.bills.add({
      id: billData.id,
      billNumber: billData.billNumber,
      customerData: JSON.stringify(billData.customer),
      amount: billData.amount,
      items: JSON.stringify(billData.items),
      gstType: billData.gstType,
      gstAmount: billData.gstAmount,
      total: billData.total,
      splitGroupId: billData.splitGroupId,
      splitIndex: billData.splitIndex,
      totalSplits: billData.totalSplits,
      createdAt: new Date().toISOString()
    });
  },

  async createScheduledSplit(splitData: any) {
    return dexieDb.scheduledSplitBills.add({
      id: crypto.randomUUID(),
      originalBillId: splitData.originalBillId,
      scheduledDate: splitData.scheduledDate,
      amount: splitData.amount,
      customerData: JSON.stringify(splitData.customerData),
      splitIndex: splitData.splitIndex,
      totalSplits: splitData.totalSplits,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  },

  async getNextBillNumber() {
    return dexieDb.transaction('rw', dexieDb.settings, async () => {
      const settings = await dexieDb.settings.get('main');
      if (!settings) {
        await dexieDb.settings.add({
          id: 'main',
          billNumberSequence: 1000
        });
        return 1000;
      }
      
      const nextNumber = settings.billNumberSequence + 1;
      await dexieDb.settings.put({
        ...settings,
        billNumberSequence: nextNumber
      });
      
      return nextNumber;
    });
  },

  async getAllBills() {
    return dexieDb.bills
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },

  async getBillById(id: string) {
    return dexieDb.bills.get(id);
  },

  async searchBills(query: string) {
    return dexieDb.bills
      .filter(bill => {
        const customerData = JSON.parse(bill.customerData);
        return (
          customerData.name.toLowerCase().includes(query.toLowerCase()) ||
          customerData.phone.includes(query) ||
          bill.billNumber.toLowerCase().includes(query.toLowerCase())
        );
      })
      .toArray();
  },

  async getBillsByDateRange(startDate: string, endDate: string) {
    return dexieDb.bills
      .where('createdAt')
      .between(startDate, endDate)
      .reverse()
      .toArray();
  },

  async saveCustomer(customerData: any) {
    const existingCustomer = await dexieDb.customers
      .where('phone')
      .equals(customerData.phone)
      .first();

    if (existingCustomer) {
      return dexieDb.customers.update(existingCustomer.id, {
        ...existingCustomer,
        ...customerData,
        lastBillDate: new Date().toISOString(),
        totalBills: (existingCustomer.totalBills || 0) + 1,
        totalAmount: (existingCustomer.totalAmount || 0) + customerData.amount
      });
    } else {
      return dexieDb.customers.add({
        id: crypto.randomUUID(),
        ...customerData,
        lastBillDate: new Date().toISOString(),
        totalBills: 1,
        totalAmount: customerData.amount,
        createdAt: new Date().toISOString()
      });
    }
  },

  async getCustomerByPhone(phone: string) {
    return dexieDb.customers
      .where('phone')
      .equals(phone)
      .first();
  },

  async searchCustomers(query: string) {
    return dexieDb.customers
      .filter(customer => 
        customer.phone.includes(query) ||
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.idNumber.includes(query)
      )
      .toArray();
  }
};

// Export types
export type { Customer, Bill, ScheduledSplitBill, Settings };
