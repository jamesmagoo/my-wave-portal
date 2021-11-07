import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      //Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = () => {};

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <div className='header'>
          <img src='favicon-32x32.png' alt='logo' />
          <br></br>
          HaikuPing
        </div>

        <div className='bio'>
          Haiku (俳句), is a type of short form poetry originally from Japan.
          Traditional Japanese haiku consist of three phrases that contain a
          kireji, or "cutting word", with phonetic units similar to
          syllables in a 5, 7, 5 pattern, and a kigo, or seasonal reference.
        </div>

        <button className='waveButton' onClick={wave}>
          Send a Haiku !!!
        </button>

        {!currentAccount && (
          <button className='waveButton' onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
