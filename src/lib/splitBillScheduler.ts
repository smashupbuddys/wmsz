interface ScheduledBill {
  id: string;
  originalBillId: string;
  customerData: any;
  amount: number;
  scheduledDate: string;
  status: 'pending' | 'generated' | 'failed';
  retryCount?: number;
  splitIndex: number;
  totalSplits: number;
}

export const scheduleSplitBills = async (
  totalAmount: number, 
  customerData: any,
  originalBillId: string
) => {
  const isDelhi = customerData.state === 'Delhi';
  const threshold = isDelhi ? 99900 : 49900;
  const splits = distributeAmount(totalAmount);
  
  // Create scheduled bills for remaining amounts (excluding first bill)
  const scheduledBills = splits.slice(1).map((amount, index) => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + (index + 1)); // Schedule for consecutive days

    return {
      id: crypto.randomUUID(),
      originalBillId,
      customerData,
      amount,
      scheduledDate: scheduledDate.toISOString().split('T')[0],
      status: 'pending',
      splitIndex: index + 1,
      totalSplits: splits.length
    };
  });

  // Store scheduled bills in database
  await db.execute(`
    INSERT INTO scheduled_bills (
      id,
      original_bill_id,
      customer_data,
      amount,
      scheduled_date,
      status,
      split_index,
      total_splits
    ) VALUES ${scheduledBills.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
  `, scheduledBills.flatMap(bill => [
    bill.id,
    bill.originalBillId,
    JSON.stringify(bill.customerData),
    bill.amount,
    bill.scheduledDate,
    bill.status,
    bill.splitIndex,
    bill.totalSplits
  ]));

  return scheduledBills;
};

// Function to check and generate scheduled bills
export const processScheduledBills = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get all pending bills scheduled for today or earlier
  const pendingBills = await db.execute(`
    SELECT * FROM scheduled_bills 
    WHERE status = 'pending' 
    AND scheduled_date <= ?
  `, [today]);

  for (const bill of pendingBills) {
    try {
      // Generate new bill
      const newBill = await generateBill({
        ...JSON.parse(bill.customer_data),
        amount: bill.amount,
        isPartOfSplit: true,
        originalBillId: bill.original_bill_id,
        splitIndex: bill.split_index,
        totalSplits: bill.total_splits
      });

      // Update scheduled bill status
      await db.execute(`
        UPDATE scheduled_bills 
        SET 
          status = 'generated',
          generated_bill_id = ?,
          generated_at = ?
        WHERE id = ?
      `, [newBill.id, new Date().toISOString(), bill.id]);

      // Send notification
      await sendBillNotification(newBill);

    } catch (error) {
      console.error(`Failed to generate scheduled bill ${bill.id}:`, error);
      
      // Update retry count and status
      await db.execute(`
        UPDATE scheduled_bills 
        SET 
          status = ?,
          retry_count = COALESCE(retry_count, 0) + 1,
          last_error = ?
        WHERE id = ?
      `, [
        bill.retry_count >= 3 ? 'failed' : 'pending',
        error.message,
        bill.id
      ]);
    }
  }
};
