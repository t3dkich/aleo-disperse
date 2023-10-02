import React, { ChangeEvent, MouseEvent, useState } from 'react';
import './CreateTransaction.css'; // import the CSS file
import Button from '../Button/Button';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { useRecordsContext } from '../../state/context';
import { AddressesInput } from '../../types/program';
import { createAddressesInput, createAmountsInput } from '../../utils/programInput';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';

const Component = () => {
  const { wallet, publicKey, requestTransaction } = useWallet()
  const [recipients, setRecipients] = useState<string>();
  const [amounts, setAmounts] = useState<string>();
  const [transactionId, setTransactionId] = useState<string>()
  const { records } = useRecordsContext()!

  const handleRecipientsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRecipients(e.target.value);
  };

  const handleAmountsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAmounts(e.target.value);
  };

  const checkValidInputs = (): [string[], string[], (Error | undefined)] => {
    let _recipients: string[] = []
    let _amounts: string[] = []
    let error: Error | undefined
    if (!recipients || !amounts) {
      error = new Error("checkValidInputs1")
      return [_recipients, _amounts, error]
    }
    _recipients = recipients.split(",").map(r => r.trim());
    _amounts = amounts.split(",").map(n => n.trim());
    if (_recipients.length !== _amounts.length ||
      _recipients.length > 15 ||
      _amounts.length > 15) {
        error = new Error("checkValidInputs2")
        return [_recipients, _amounts, error]
      } 
    for (let i = 0; i < _recipients.length; i++) {
      const recipient = _recipients[i];
      const amount = parseInt(amounts[i]);
      if (!/^aleo1[a-z0-9]{58}$/.test(recipient)) {
        error = new Error("checkValidInputs3")
        return [_recipients, _amounts, error]
      }
      if (isNaN(amount) || amount < 0) {
        error = new Error("checkValidInputs4")
        return [_recipients, _amounts, error]
      }
    }
    return [_recipients, _amounts, error]
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();
    console.log(records);
    const [_recipients, _amounts, error] = checkValidInputs()
    if (error) throw error
    const fullSendAmount = _amounts.map(e => parseInt(e)).reduce((acc, cur) => acc + cur);
    const amountRecords = records.map(r => parseInt(r.data.microcredits.replace('u64.private', '')))
    console.log(_recipients, _amounts, fullSendAmount, amountRecords);
    // let recordToSend = `{"id":"0cffac49-db2b-5c4c-96e0-20b17479db09","owner":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","program_id":"credits.aleo","spent":false,"recordName":"credits","data":{"microcredits":"4896500u64.private"}}`
    let recordToSend
    for (let i = 0; i < records.length; i++) {
      const amountRec = amountRecords[i]
      if (amountRec < fullSendAmount) continue
      recordToSend = records[i] 
    }
    if (!recordToSend) return new Error('cannot find record with enought amount')
    // console.log(JSON.stringify(createAmountsInput(_amounts)));
    // const one = `{"address1":"aleo1glx6qauqmjejkj9v79rcl46vu089rcen759dznjn69jhhwkx25gqa03hnz","address2":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address3":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address4":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address5":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address6":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address7":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address8":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address9":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address10":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address11":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address12":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address13":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address14":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9","address15":"aleo1dfcshh08exxrljt68t5he8ynwt20hfh9yqudukg2r4n5mpljpqzs9ggxw9"}`.replaceAll('"','')
    // const two = `{"amount1":"1000000u64","amount2":"0u64","amount3":"0u64","amount4":"0u64","amount5":"0u64","amount6":"0u64","amount7":"0u64","amount8":"0u64","amount9":"0u64","amount10":"0u64","amount11":"0u64","amount12":"0u64","amount13":"0u64","amount14":"0u64","amount15":"0u64"}`.replaceAll('"','')

    const inputs = [
      recordToSend, 
      JSON.stringify(createAddressesInput(_recipients, publicKey)).replaceAll('"',''), 
      JSON.stringify(createAmountsInput(_amounts)).replaceAll('"','')
    ]
    console.log('inputs', inputs);
    
    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      'disperse_all_fifteen.aleo',
      // 'disperse_milion_test.aleo',
      'main',
      inputs,
      500000
    );

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';
    // if (event.target?.value) {
    //   event.target.elements[0].value = '';
    // }
    setTransactionId(txId);
    console.log('txId', txId);
    

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
