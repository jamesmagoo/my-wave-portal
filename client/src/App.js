import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';
import { useEffect, useState } from 'react';
import ABI from './utils/WavePortal.json';
import 'tailwindcss/tailwind.css';
import Footer from './Components/Footer';
import { Fragment } from 'react';
import Card from './Components/Card';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0x340cF2Bc1035Fd4deb26F068c64CAA8e89eD4718';
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
      <div className='flex flex-col items-center border-blue-600  mx-auto'>
        {!currentAccount && (
          <div className='flex flex-row items-left w-full ml-6'>
            <div className=''>
              <button className='waveButton' onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        <div className='flex flex-row mx-6 border-red-600 items-start justify-center my-8'>
          <img src='favicon-32x32.png' alt='logo' />
          <h1 class='text-center font-extralight text-3xl mx-3 '>HaikuPing</h1>
        </div>

        <div className='width text-left italic text-gray-700 mb-10 w-1/3'>
          Haiku (俳句), is a type of short form poetry originally from Japan.
          Traditional Japanese haiku consist of three phrases that contain a
          kireji, or "cutting word", with phonetic units similar to syllables in
          a 5, 7, 5 pattern, and a kigo, or seasonal reference.
        </div>

        <div className='items-center justify-center flex flex-col w-1/3'>
          <form onSubmit={onSubmit} className='items-center w-full'>
            <div>
              <input
                type='text'
                name='haiku'
                id='haiku'
                class='shadow-sm h-32 w-full border-black border-2 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-smrounded-md '
                placeholder='Write a Haiku'
                value={text}
                onChange={onChange}
              />
            </div>
            <div>
              <input
                type='submit'
                name='search'
                value='Send a haiku!!'
                className='waveButton'
              />
            </div>
          </form>
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div class='bg-white shadow sm:rounded-lg w-1/3 my-4' key={index}>
              <div class='px-4 py-5 sm:p-6 border-2 border-blue-500 rounded-lg'>
                <h3 class='text-lg leading-6 font-thin italic text-gray-900'>
                  {wave.message}
                </h3>
                <div class='mt-2 max-w-xl text-xs text-gray-500'>
                  <p>Address: {wave.address}</p>
                </div>
                <div class='mt-2 max-w-xl text-xs text-gray-500'>
                  <p>TimeStamp: {wave.timestamp.toString()} </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </Fragment>
  );
}
