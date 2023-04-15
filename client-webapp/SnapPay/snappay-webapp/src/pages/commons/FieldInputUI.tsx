import { getChainNetworkInformationChainContent } from "@/utils/NetworkChainNamer"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { ActivityABIData } from "../../../abis/ActivityPoolABI"

export type ActivityEvent = {
    price: number,
    activityName: string,
    qrCode: string,
    paymentToken: string
  }

 const FieldInputUI = (address: string) => {
    const { chainId, library, active } = useWeb3React()
    const [ticketPrice, setTicketPrice] = useState("");
    const [qrCode, setQrcode] = useState("");
    const [paymentToken, setPaymentToken] = useState("")
    const [activityName, setActivityName] = useState("")

    const handleLoad = async () => {
        const activityContract: Contract = new Contract(`${address}`, ActivityABIData, library)
        const price = await activityContract.connect(library.getSigner()).getPrice()
        const qrCode = await activityContract.connect(library.getSigner()).getQrCode()
        const activityName = await activityContract.connect(library.getSigner()).getActivityName()
        const paymentTokenAddress = await activityContract.connect(library.getSigner()).getPaymentTokenAddress()
        setTicketPrice(price)
        setQrcode(qrCode)
        setActivityName(activityName)
        setPaymentToken(paymentTokenAddress)
    }

    useEffect(() => {
        if (active) {
            handleLoad()
        }
    }, [active])

    return (
            <div className='flex grid grid-rows-1'>
                <div className="relative rounded-md border border-[#FF0033] px-3 py-2 shadow-sm focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4 mt-4">
              <label
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
                  placeholder={`${ticketPrice}`}
                  disabled={false}
                  onChange={(v: any) => {setTicketPrice(v)}}
                  value={ticketPrice}
                  autoCorrect="off"
                  autoComplete="off"
              />
              </div>
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
                      placeholder={`${activityName}`}
                      disabled={false}
                      onChange={(v: any) => {setActivityName(v)}}
                      value={activityName}
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
                      placeholder={`${paymentToken}`}
                      disabled={false}
                      onChange={(v: any) => {setPaymentToken(v)}}
                      value={paymentToken}
                  />
              </div>
              <div className="flex  items-center justify-center">
                {qrCode.length > 0 && (
                  <QRCode value={`${qrCode}`} className='w-64 h-64'/>
                )}
              </div>
              <button onClick={() => {}} className=" rounded mt-4 py-4 font-bold text-xs text-white-500 rounded rounded-2xl mb-2 bg-[#FF0033] shadow shadow-radius-2" >
                <span className="text-white"> Update Informations </span>
              </button>
              
            </div>
        
    )
}

export default FieldInputUI
