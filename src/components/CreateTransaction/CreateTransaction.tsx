import React, { useState } from 'react';
import './CreateTransaction.css'; // import the CSS file
import Button from '../Button/Button';

const Component = () => {
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');

  const handleRecipientsChange = (e: any) => {
    setRecipients(e.target.value);
  };

  const handleAmountsChange = (e: any) => {
    setAmounts(e.target.value);
  };

  const handleSubmit = () => {
    // add your logic to send the transactions here
    alert('Transactions sent!');
  };

  return (
    <div className="component">
      <div className="input-group">
        <label htmlFor="recipients">Recipients</label>
        <textarea
          id="recipients"
          value={recipients}
          onChange={handleRecipientsChange}
          placeholder="Enter list of addresses"
        />
      </div>
      <div className="input-group">
        <label htmlFor="amounts">Amounts</label>
        <textarea
          id="amounts"
          value={amounts}
          onChange={handleAmountsChange}
          placeholder="Enter list of amounts"
        />
      </div>
      <Button text={'Send'} onClick={handleSubmit} />
    </div>
  );
};

export default Component;
