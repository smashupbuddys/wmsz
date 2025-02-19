import { db } from './db';
import { generateBill } from './billUtils';

export const scheduleSplitBills = async (
  originalBillData: any,
  splits: { amount: number; date: string }[]
) => {
  const scheduledBills = splits.map((split, index) => ({
    id: crypto.randomUUID(),
    originalBillId: originalBillData.id,
    scheduledDate: split.date,
    amount: split.amount,
    customerData: {
      name: originalBillData.name,
      phone: originalBillData.phone,
      state: originalBillData.state,
      idType: originalBillData.idType,
      idNumber: originalBillData.idNumber,
      address: originalBillData.address
    },
    splitIndex: index + 1,
    totalSplits: splits.length + 1,
    status: 'pending'
  }));

  await db.createScheduledSplits(scheduledBills);
  return scheduledBills;
};

export const processScheduledBills = async () => {
  const today = new Date().toISOString().split('T')[0];
  const pendingBills = await db.getPendingBillsForDate(today);

  for (const bill of pendingBills) {
    try {
      const billNumber = await db.getNextBillNumber();
      
      const newBill = await generateBill({
        ...JSON.parse(bill.customerData),
        amount: bill.amount,
        date: today,
        billNumber,
        isPartOfSplit: true,
        originalBillId: bill.originalBillId,
        splitIndex: bill.splitIndex,
        totalSplits: bill.totalSplits
      });

      await db.createBill(newBill);

      await db.updateScheduledBillStatus(bill.id, 'generated', {
        generatedBillId: newBill.id,
        generatedBillNumber: billNumber
      });

    } catch (error) {
      console.error(`Failed to generate split bill ${bill.id}:`, error);
      await db.updateScheduledBillStatus(bill.id, 'failed', {
        errorMessage: error.message
      });
    }
  }
};
