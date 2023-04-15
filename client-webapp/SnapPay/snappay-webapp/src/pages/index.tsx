import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useWeb3React } from '@web3-react/core'
import { chainNetworkNamer, getChainNetworkInformation, getChainNetworkInformationChainContent, getContractPoolAddress, NetworkChainType } from '../utils/NetworkChainNamer';
import QRCode from 'react-qr-code'
import { useEffect, useState } from 'react';
import { Contract } from "@ethersproject/contracts"
import { ActivityABIData, ActivityPoolABIData, ContractActivityPoolLinea } from '../../abis/ActivityPoolABI';
import { off } from 'process';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import InputText from './commons/InputText';
import { ethers } from 'ethers';

const inter = Inter({ subsets: ['latin'] })

type ActivityEvent = {
  price: number,
  activityName: string,
  qrCode: number,
  paymentToken: string,
  activityAddress: string
}

export default function Home() {
  const { chainId, active, account, library } = useWeb3React();
  const [activityList, setActivityList] = useState({
    price: 0,
    activityName: "",
    qrCode: 0,
    paymentToken: "",
    activityAddress: ""
  });

  const [price, setPrice] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [paymentToken, setPaymentToken] = useState("")
  const [loading, setLoading] = useState(false)

  /// only last activity for now (improvement later)
  const getAllActivity = async () => {
    const poolContract: Contract = new Contract(`${getContractPoolAddress(chainId)}`, ActivityPoolABIData, library)
    const readListActivities = await poolContract.getListOfActivity()

    var _activityList: ActivityEvent = {
      price: 0,
      activityName: "",
      qrCode: 0,
      paymentToken: "",
      activityAddress: ""
    }
    for (var i = 0; i<readListActivities.length; i++) {
      const activityContract: Contract = new Contract(`${readListActivities[i]}`, ActivityABIData, library)
      const isOwner = await activityContract.connect(library.getSigner()).getOwner()
      if (isOwner) {
        const price = await activityContract.connect(library.getSigner()).getPrice()
        const qrCode = await activityContract.connect(library.getSigner()).getQrCode()
        const activityName = await activityContract.connect(library.getSigner()).getActivityName()
        const paymentTokenAddress = await activityContract.connect(library.getSigner()).getPaymentTokenAddress()
        _activityList = {
          price: price,
          activityName: activityName,
          qrCode: qrCode,
          paymentToken: paymentTokenAddress,
          activityAddress: activityContract.address
        }
      }
    }
    setActivityList(_activityList)
  }
  
  const handleSubmision = async () => {
    console.log("activty address - " + activityList.activityAddress )
    const activityAddress: Contract = new Contract(`${activityList.activityAddress}`, ActivityABIData, library.getSigner());
    setLoading(true)
    let txClaimPrice = await activityAddress.connect(library.getSigner()).setPrice(price)
    let txClaimGenerateQrCode = await activityAddress.connect(library.getSigner()).generateQrCode()
    const _price = await activityAddress.connect(library.getSigner()).getPrice()
        const _qrCode = await activityAddress.connect(library.getSigner()).getQrCode()
        const _activityName = await activityAddress.connect(library.getSigner()).getActivityName()
        const _paymentTokenAddress = await activityAddress.connect(library.getSigner()).getPaymentTokenAddress()
        setActivityList({
          price: _price,
          activityName: _activityName,
          qrCode: _qrCode,
          paymentToken: _paymentTokenAddress,
          activityAddress: activityAddress.address
        })
    setLoading(false)
  }

  const onUpdatePriceValue = (value: string) => {
    const intValue = parseInt(value)
    setPrice(intValue)
    // updatePointsValue(intValue*rate)
}

  useEffect(() => {
    if (active) {
      getAllActivity()
    }
  }, [chainId])
  

  return (
    <div className={`lg:mx-auto bg ${ active ? '': 'h-screen'}`}>
      <div className="max-w-5xl mx-2 lg:mx-auto">
        <div className="flex p-5 border-2 border-[#FF0033] rounded-2xl grid grid-rows-1 shadow shadow-radius-2">
        <div className='flex grid grid-rows-1' key={activityList.qrCode}>
              {/* <div className="relative rounded-md border border-[#FF0033] px-3 py-2 shadow-sm focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4 mt-4">
               */}
              {/* <label
                  htmlFor="name"
                  className="absolute -top-2 left-2 -mt-px inline-block bg-[#FF0033]/[90%] px-1 text-xs font-small text-gray-100"
              >
                Set ticket Price {getChainNetworkInformationChainContent(chainId)?.nativeCurrency.name}
              </label>
              <input
                  type="text"
                  name="name"
                  id="name"
                  className={`block w-full border-0 p-2 text-black-200 placeholder-gray-500 mt-2 mb-2 outline-0 bg-transparent`}
                  placeholder={`${activityList.price}`}
                  disabled={false}
                  onChange={(v: any) => {setPrice(v.target.value)}}
                  autoCorrect="off"
                  autoComplete="off"
              /> */}
              {/* </div> */}
              <InputText onUpdate={onUpdatePriceValue} isDisabled={ false } title={`Set ticket Price ${getChainNetworkInformationChainContent(chainId)?.nativeCurrency.name}`} />
              <div className="relative rounded-md border border-[#FF0033] px-3 py-2 shadow-sm focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4 mt-4">
                  <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 -mt-px inline-block bg-[#FF0033]/[90%] px-1 text-xs font-small text-gray-100"
                  >
                    Set event / activity name
                  </label>
                  <input
                      type="text"
                      name="name"
                      id="name"
                      className={`block w-full border-0 p-2 text-black-200 placeholder-gray-500 mt-2 mb-2 outline-0 bg-transparent`}
                      placeholder={`${activityList.activityName}`}
                      disabled={false}
                      onChange={(v: any) => {setActivityName(v)}}
                  />
              </div>
              <div className="relative rounded-md border border-[#FF0033] px-3 py-2 shadow-sm focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4 mt-4">
                  <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 -mt-px inline-block bg-[#FF0033]/[90%] px-1 text-xs font-small text-gray-100"
                  >
                    Set payment token address
                  </label>
                  <input
                      type="text"
                      name="name"
                      id="name"
                      className={`block w-full border-0 p-2 text-black-200 placeholder-gray-500 mt-2 mb-2 outline-0 bg-transparent`}
                      placeholder={`${activityList.paymentToken}`}
                      disabled={false}
                      onChange={(v: any) => { setPaymentToken(v)}}
                  />
              </div>
              <div className="flex  items-center justify-center">
                {activityList.qrCode > 0 && (
                  <QRCode value={`${activityList.qrCode}`} className='w-64 h-64'/>
                )}
                
              </div>
              <button onClick={() => {handleSubmision()}} className=" rounded mt-4 py-4 font-bold text-xs text-white-500 rounded rounded-2xl mb-2 bg-[#FF0033] shadow shadow-radius-2" >
                <span className="text-white"> Update Informations </span>
              </button>
              {loading && (
                <Cog6ToothIcon className='h-24 w-24 animate-spin'/>
              )}
            </div>
          
        </div>
      </div>
    </div>
  )
}
