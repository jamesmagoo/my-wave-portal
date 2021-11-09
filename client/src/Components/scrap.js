import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';
import { useEffect, useState } from 'react';
import ABI from './utils/WavePortal.json';
import 'tailwindcss/tailwind.css';
import Footer from './Components/Footer';
import { Fragment } from 'react';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0x608DC74d2908D2d7BD8DE98F9568DCB52304e7aF';
  const contractABI = ABI.abi;

  //Create a method that gets all waves from your contract
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check if wallet is connected
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
        getAllWaves();
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect wallet
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

  // Call wave function in smart contract
  const wave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave count...', count.toNumber());
        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message);
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);
        console.log('Retrieved total wave count...', count.toNumber());
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // initialise state using hook useState
  const [text, setText] = useState('');

  // onChange event function for  text input
  const onChange = (e) => setText(e.target.value);

  // onSubmit event function for  text input
  const onSubmit = (e) => {
    e.preventDefault();

    if (text === '') {
      alert('Enter some beautiful poetry');
    } else {
      wave(text);
      setText('');
    }
  };

  return (
    <Fragment>
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
            kireji, or "cutting word", with phonetic units similar to syllables
            in a 5, 7, 5 pattern, and a kigo, or seasonal reference.
          </div>

          <form onSubmit={onSubmit}>
            <textarea
              type='text'
              name='text'
              className='haikuInput'
              placeholder='Write a Haiku'
              value={text}
              row={3}
              onChange={onChange}
            />
            <div>
              <input
                type='submit'
                name='search'
                value='Send a haiku!!'
                className='waveButton'
              />
            </div>
          </form>

          {!currentAccount && (
            <button className='waveButton' onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'OldLace',
                  marginTop: '16px',
                  padding: '8px',
                }}
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}
