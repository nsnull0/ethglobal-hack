import { UserRejectedRequestError } from "@binance-chain/bsc-connector"
import { Dialog, Menu, Transition } from "@headlessui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { Fragment, useEffect, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { chainNetworkNamer, getChainNetworkInformation, getChainNetworkInformationChainContent, getChainNetworkInformationChainType, NetworkChainType } from "@/utils/NetworkChainNamer"
import { WalletImage, WalletType } from "@/utils/NetworkList"
import { injected, resetWalletConnector, walletConnect } from "@/utils/Connector"
import { ethers } from "ethers"

type WalletModalComponent = {
    onClickClose: (() => void)
    isShown: boolean
}

const walletList = [
    {
        id: 1,
        walletType: WalletType.Metamask
    },
    {
        id: 2,
        walletType: WalletType.WalletConnect
    }
]

const WalletModalComponent = ({onClickClose, isShown}: WalletModalComponent) => {
    const [typeOfWallet, setTypeOfWallet] = useState(WalletType.Empty)
    const [selectedChainNetwork, setSelectedChainNetwork] = useState(NetworkChainType.Polygon)
    const flag = isShown

    const {active, account, library, error, chainId, activate, deactivate} = useWeb3React()

    const switchNetwork = async (nC: NetworkChainType) => {
        console.log("switchNetwork : " + `0x${Number(nC).toString(16)}`)
        try {
            await library.provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${Number(nC).toString(16)}` }]
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await library.provider.request({
                  method: "wallet_addEthereumChain",
                  params: [getChainNetworkInformationChainContent(nC)]
                });
              } catch (error) {
                console.log("error switch network:", ""+error)
              }
            }
            if (switchError.code == 4001) {
                setSelectedChainNetwork(getChainNetworkInformationChainType(chainId))
            }
          }
      };

    useEffect(() => {
        deactivate()
     }, [])
 
     useEffect(() => {
        if (!active) {
            setTypeOfWallet(WalletType.Empty)
        } else {
            let accountType: string = localStorage.getItem('provider') ?? WalletType.Empty
            // @ts-ignore
            setTypeOfWallet(accountType)
        }
        setSelectedChainNetwork(getChainNetworkInformationChainType(chainId))
    }, [active, chainId]) 

    useEffect(() => {
        console.log('now error', error)
        if (error instanceof UserRejectedRequestError) {
            disconnect()
        }
        if (error instanceof UnsupportedChainIdError) {
            setTypeOfWallet(WalletType.Unsupported)
            setSelectedChainNetwork(NetworkChainType.Empty)
        }
    }, [error])

   function disconnect() {
        try {
            deactivate()
            setTypeOfWallet(WalletType.Empty)
            localStorage.clear()
        } catch (ex) {
            console.log("[WalletComponent]"+ex)
        }
   }

    function selectedWalletConnect(connectorType: string) {
        try {
            switch (connectorType) {
                case WalletType.Metamask:
                    activate(injected)
                    return
                case WalletType.WalletConnect:
                    resetWalletConnector(walletConnect)
                    activate(walletConnect, undefined, true).catch( async () => {
                        disconnect()
                    })
                    return
                default:
                    return
            }
        } catch (exception) {
            console.log("[selectedWalletConnect]"+exception)
        }
    }

    const connectionWalletClick = (type: WalletType) => {
        localStorage.setItem('provider', type)
        selectedWalletConnect(type)
    }
 
    const statusLayout = () => {

        const disconnectButton = () => {
            if (active)  {
                return (
                    <div className="border border-[#FF0033]/90 rounded-md grid grid-cols-1 gap-4 place-content-center m-4 hover:bg-black mr-24"> 
                        <button className="grid grid-cols-1 gap-4 place-content-center mt-2 mb-2"> 
                            <div className="m-auto">
                                <p className=""> Disconnect Wallet </p>
                            </div>
                        </button> 
                    </div>
                )
            } else {
                return (
                    <></>
                )
            }
        }
        return (
           <div className="m-4" onClick={disconnect}>
               <div className={`text-right m-auto ${active ? "text-green-300": "text-red-400"}`}>
                   {active ? "Connected Wallet Address" : (typeOfWallet == WalletType.Unsupported) ? "Your Wallet Network Chain is not supported yet, please change the network chain on your wallet" : "Wallet Not Connected"}
                   <p className="font-bold break-all">{account ?? ""}</p>
               </div>
               {disconnectButton()}
           </div>
       )
   }

    return (
        <Transition.Root show={isShown ? isShown : false} as={Fragment}>
            <Dialog as="div" className="fixed z-10" onClose={onClickClose}>
            <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500/90 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel className="fixed top-10 transform overflow-visible border-2 border-[#FF0033] rounded-lg 
                        bg-gray-500 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-3/4 sm:max-w-sm sm:p-6">
                            <div>
                                <div className="text-white bg-transparent">
                                    <div className={`grid place-content-end ${ active ? 'block' : 'hidden' }`}> 
                                        <div className="mb-4 mt-4 mr-4">
                                            <Menu as="div" className="relative inline-block text-left z-[1]">
                                                <div>
                                                    <Menu.Button className={` border-2 border-[#FF0033]/90 inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-90 `}>
                                                        {getChainNetworkInformation(chainId)}
                                                        <ChevronDownIcon
                                                        className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                                        aria-hidden="true"
                                                        />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right 
                                                    divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
                                                    bg-sfblue">
                                                        <div className="flex grid grid-cols-1 max-h-12 z-99">
                                                            {
                                                                chainNetworkNamer.map((menu, menuIdx) => (
                                                                    <Menu.Item key={menuIdx} as="menu">
                                                                        <button className={` ${ selectedChainNetwork == menu.id ? 'font-bold': 'font-light'} group flex w-full items-center px-2 py-2 text-sm hover:bg-[#FF0033] bg-gray-500`}
                                                                        onClick={ async () => { 
                                                                            await switchNetwork(menu.id)
                                                                         }}
                                                                        >
                                                                            {menu.chainName}
                                                                        </button>
                                                                    </Menu.Item>
                                                                ))
                                                            }
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    { 
                                    walletList.map((item) => (
                                        
                                        <div className={`border border-[#FF0033]/90 rounded-md grid grid-cols-1 gap-4 place-content-center m-4 hover:bg-[#FF0033] 
                                        ${typeOfWallet == WalletType.Empty || typeOfWallet == WalletType.Unsupported ? '':'hidden'}`} key={item.id}> 
                                            <button className="grid grid-cols-4 gap-1 mt-2 mb-2" onClick={async () => connectionWalletClick(item.walletType)}> 
                                                <div className="m-4">
                                                    <p className="text-left"> { item.walletType.toString() } </p>
                                                </div>
                                                <div/>
                                                <div/>
                                                <div className="m-auto">
                                                    <WalletImage className="h-8 w-8" type={item.walletType}/>
                                                </div>
                                            </button> 
                                        </div>
                                    ))  }
                                    {statusLayout()}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition.Root>
    )
}

export default WalletModalComponent;