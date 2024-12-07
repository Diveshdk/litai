'use client'
import { useState } from 'react';
import axios from 'axios';

const TransactionForm = () => {
  const [transactionData, setTransactionData] = useState('');
  const [signedTransaction, setSignedTransaction] = useState('');

  const handleTransaction = async () => {
    const { data } = await axios.post('/api/transaction', { transactionData });
    setSignedTransaction(data.signedTransaction);
  };

  return (
    <div>
      <h2>Sign a Transaction</h2>
      <textarea
        value={transactionData}
        onChange={(e) => setTransactionData(e.target.value)}
        placeholder="Enter transaction data..."
      />
      <button onClick={handleTransaction}>Sign</button>
      {signedTransaction && <p>Signed Transaction: {JSON.stringify(signedTransaction)}</p>}
    </div>
  );
};

export default TransactionForm;
