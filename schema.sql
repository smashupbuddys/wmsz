CREATE TABLE scheduled_split_bills (
  id TEXT PRIMARY KEY,
  original_bill_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  amount REAL NOT NULL,
  customer_data TEXT NOT NULL,
  split_index INTEGER NOT NULL,
  total_splits INTEGER NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  generated_bill_id TEXT,
  generated_bill_number INTEGER,
  generated_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(original_bill_id) REFERENCES bills(id)
);

CREATE INDEX idx_split_bills_date ON scheduled_split_bills(scheduled_date, status);
CREATE INDEX idx_split_bills_original ON scheduled_split_bills(original_bill_id);
