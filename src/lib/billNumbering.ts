interface BillNumberRange {
  start: number;
  end: number;
  date: Date;
}

interface SplitBillGroup {
  id: string;
  totalAmount: number;
  splits: {
    amount: number;
    billNumber: number;
    date: Date;
    status: 'pending' | 'generated'
  }[];
}

// Reserve bill numbers for split bills
export const reserveBillNumbers = async (splitCount: number) => {
  const currentBillNumber = await getCurrentBillNumber();
  const ranges: BillNumberRange[] = [];
  
  // Reserve every alternate number for regular bills
  for (let i = 0; i < splitCount; i++) {
    const billNumber = currentBillNumber + (i * 2); // Leave gaps for regular bills
    const date = new Date();
    date.setDate(date.getDate() + i); // Set future dates
    ranges.push({
      start: billNumber,
      end: billNumber,
      date
    });
  }

  return ranges;
};

// Store split bill information
export const createSplitBillGroup = async (totalAmount: number, splits: number[]) => {
  const ranges = await reserveBillNumbers(splits.length);
  
  const splitGroup: SplitBillGroup = {
    id: crypto.randomUUID(),
    totalAmount,
    splits: splits.map((amount, index) => ({
      amount,
      billNumber: ranges[index].start,
      date: ranges[index].date,
      status: 'pending'
    }))
  };

  // Store in database
  await db.execute(`
    INSERT INTO split_bill_groups (
      id,
      total_amount,
      splits_json,
      created_at
    ) VALUES (?, ?, ?, ?)
  `, [
    splitGroup.id,
    splitGroup.totalAmount,
    JSON.stringify(splitGroup.splits),
    new Date().toISOString()
  ]);

  return splitGroup;
};
