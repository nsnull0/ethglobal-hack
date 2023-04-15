import '@/styles/globals.css'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app'
import { useState } from 'react';
import Header from './Header';
import MainLayout from './MainLayout';
import WalletModalComponent from './WalletModalComponent';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000
  return library
}

export default function App({ Component, pageProps }: AppProps) {
  const [walletMethodDisplayed, setWalletMethodDisplayed] = useState(false)
  const onClickWallet = () => {
    setWalletMethodDisplayed(true)
  }
  const onClickToClose = () => {
    setWalletMethodDisplayed(false)
  }
  return (
    <>
      <MainLayout>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Header onClick={onClickWallet}/>
          <WalletModalComponent onClickClose={onClickToClose} isShown={walletMethodDisplayed}/>
          <Component {... pageProps}/>
        </Web3ReactProvider>
      </MainLayout>
    </>
  )
}
