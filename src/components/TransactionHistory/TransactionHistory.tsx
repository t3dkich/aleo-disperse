import { useEffect, useState } from 'react';
// import './Wallet.css';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useRequestTransactionHistory } from '../../hooks/useRequestTransactionHistory';

const TransactionHistory = () => {
    const { publicKey, getExecution } = useWallet()
  const [txs, setTxs] = useState([]);
  const { txHistory, loading, error } = useRequestTransactionHistory()
  
  useEffect(() => {
    if (!publicKey || loading || error || !txHistory || txHistory.length === 0 || !getExecution) return
    
    console.log('txHistory', txHistory);
    console.log(JSON.stringify(txHistory.map((t: any) => t)[2]) );
    // Promise.all()
    getExecution(txHistory[0].id)
        .then((data: any) => {
            console.log('data', data);
            
        })
        .catch((e: any) => {
            console.log('e', e);
            
        })
  }, [txHistory])

  return (
    <div className="tx-history">
        <label>tx history</label>
    </div>
  );
};

export default TransactionHistory;
