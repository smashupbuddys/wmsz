import { BillItem } from '../types';

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
    const highRateQty = Math.floor((remaining * 0.4) / 2000);
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

export const calculateGST = (items: BillItem[], customerState: string): BillItem[] => {
  const isInterState = customerState.toLowerCase() !== 'delhi';
  
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

export const distributeAmount = (totalAmount: number): number[] => {
  const baseAmount = totalAmount / 1.03;
  const splits: number[] = [];
  let remaining = baseAmount;
  
  while (remaining > 0) {
    if (remaining <= 42000) {
      splits.push(Math.ceil(remaining * 1.03));
      break;
    }

    const splitBase = Math.floor(Math.random() * (48000 - 42000 + 1)) + 42000;
    const splitWithGST = Math.ceil(splitBase * 1.03);
    
    if (splitBase > remaining) {
      splits.push(Math.ceil(remaining * 1.03));
      break;
    }

    splits.push(splitWithGST);
    remaining -= splitBase;
  }

  return splits;
};
