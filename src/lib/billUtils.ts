import { db } from './db';

interface BillItem {
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

// Generate breakdown of items based on total amount
export const generateItemBreakdown = (totalAmount: number): BillItem[] => {
  const baseAmount = totalAmount / 1.03; // Remove GST
  let remaining = baseAmount;
  const items: BillItem[] = [];

  // Common rates for imitation jewelry
  const rates = [
    2000, 2050, 1500, 1050, 980, 870, 525, 500, 440, 450,
    455, 350, 340, 330, 290, 285, 260, 250, 150, 50, 45,
    40, 25, 20, 18, 15
  ];

  // For larger amounts, start with higher denominations
  if (baseAmount > 30000) {
    const highRateQty = Math.floor((remaining * 0.4) / 2000); // Use about 40% for 2000
    if (highRateQty > 0) {
      const amount = highRateQty * 2000;
      items.push({
        description: "Imitation Jewellery",
        hsn: "7117",
        gstRate: 3,
        quantity: highRateQty,
        rate: 2000,
        amount,
        total: amount * 1.03
      });
      remaining -= amount;
    }
  }

  // Distribute remaining among other rates
  const shuffledRates = [...rates].sort(() => Math.random() - 0.5);
  
  for (const rate of shuffledRates) {
    if (remaining >= rate) {
      const maxQty = Math.floor(remaining / rate);
      const minQty = Math.max(1, Math.floor(maxQty * 0.3));
      const qty = Math.floor(Math.random() * (maxQty - minQty + 1)) + minQty;
      
      if (qty > 0) {
        const amount = qty * rate;
        items.push({
          description: "Imitation Jewellery",
          hsn: "7117",
          gstRate: 3,
          quantity: qty,
          rate,
          amount,
          total: amount * 1.03
        });
        remaining -= amount;
      }
    }
  }

  return items;
};

// Calculate GST based on state
export const calculateGST = (items: BillItem[], customerState: string, companyState: string = 'Delhi'): BillItem[] => {
  const isInterState = customerState.toLowerCase() !== companyState.toLowerCase();
  
  return items.map(item => {
    const gstAmount = item.amount * (item.gstRate / 100);
    
    if (isInterState) {
      return {
        ...item,
        igst: gstAmount,
        total: item.amount + gstAmount
      };
    } else {
      return {
        ...item,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total: item.amount + gstAmount
      };
    }
  });
};

// Format currency in Indian format
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Distribute amount for split bills
export const distributeAmount = (totalAmount: number): number[] => {
  const baseAmount = totalAmount / 1.03; // Remove GST first
  const splits: number[] = [];
  let remaining = baseAmount;
  
  while (remaining > 0) {
    // For amounts less than min threshold
    if (remaining <= 42000) {
      splits.push(Math.ceil(remaining * 1.03)); // Add GST back
      break;
    }

    // Generate random amount between 42,000 and 49,500 (before GST)
    const splitBase = Math.floor(Math.random() * (48000 - 42000 + 1)) + 42000;
    const splitWithGST = Math.ceil(splitBase * 1.03);
    
    if (splitBase > remaining) {
      splits.push(Math.ceil(remaining * 1.03)); // Add GST back
      break;
    }

    splits.push(splitWithGST);
    remaining -= splitBase;
  }

  return splits;
};

// Generate bill
export const generateBill = async (data: {
  name: string;
  phone: string;
  state: string;
  idType: string;
  idNumber: string;
  amount: number;
  date: string;
  isPartOfSplit?: boolean;
  splitIndex?: number;
  totalSplits?: number;
}) => {
  const billId = crypto.randomUUID();
  const billNumber = await db.getNextBillNumber();
  
  // Generate items breakdown
  const items = generateItemBreakdown(data.amount);
  const itemsWithGST = calculateGST(items, data.state);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const gstTotal = itemsWithGST.reduce((sum, item) => {
    return sum + (item.igst || (item.cgst! + item.sgst!));
  }, 0);

  const billData = {
    id: billId,
    billNumber: `INV${billNumber.toString().padStart(6, '0')}`,
    customer: {
      name: data.name,
      phone: data.phone,
      state: data.state,
      idType: data.idType,
      idNumber: data.idNumber
    },
    items: itemsWithGST,
    amount: subtotal,
    gstType: data.state.toLowerCase() === 'delhi' ? 'CGST_SGST' : 'IGST',
    gstAmount: gstTotal,
    total: subtotal + gstTotal,
    date: data.date,
    isPartOfSplit: data.isPartOfSplit,
    splitIndex: data.splitIndex,
    totalSplits: data.totalSplits
  };

  // Save to database
  await db.createBill(billData);

  return billData;
};

// Export types
export type { BillItem };
