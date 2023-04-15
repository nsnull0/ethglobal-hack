import { getChainNetworkInformation } from "@/utils/NetworkChainNamer";
import { useWeb3React } from "@web3-react/core";


const walletContainer = [
    'border-2 rounded w-auto h-9 text-gray-900 border-[#FF0033] transition-all ease-in-out delay-50 px-2',
].join(' '); 

type WalletComponentProps = {
    onClick: (() => void),
    className?: string
}

const WalletComponent = ({onClick, className}: WalletComponentProps) => {

    const { active, account, chainId } = useWeb3React()

    return (
        <div className={`flex ${className}`}> 
            <button className={`${walletContainer} truncate max-w-[150px]`} onClick={onClick}>
            {active ? account:"Connect"}
            </button>
        </div>
    )
}

export default WalletComponent;