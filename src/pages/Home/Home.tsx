import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header'; // change this to your header component path
import './Home.css'; // import the CSS file
import CreateTransaction from '../../components/CreateTransaction/CreateTransaction'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import Wallet from '../../components/Wallet/Wallet';
import { useRequestCredits } from '../../hooks/useRequestCredits';
import { Button } from '../../components/Button/Button';

const Home = () => {
  const { wallet, publicKey } = useWallet();
  const [showCreateTx, setCreateTx] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const handleCreateNewTransaction = () => {
    setCreateTx(!showCreateTx);
  };

  useEffect(() => {
    setShowWallet(publicKey ? true : false)
  }, [publicKey])

  return (
    <div className="home">
      <Header />
      <div className="container">
        <h1 className="title">Aleo Transfers</h1>
        <p className="subtitle">A blockchain-based asset transfer app with user-friendly interface.</p>
        <div className="center">
          <Button text='Create New Transaction' onClick={handleCreateNewTransaction} />
        </div>
        {showCreateTx && <CreateTransaction />}
        {showWallet && <Wallet />}
      </div>
    </div>
  );
};

export default Home;
