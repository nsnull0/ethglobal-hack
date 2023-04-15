import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { chainNetworkNamer, NetworkChainType } from "./NetworkChainNamer";

export const injected = new InjectedConnector({
    supportedChainIds: [56, 137, 1, 42220, 59140, 44787, 97]
})

export const walletConnect = new WalletConnectConnector({
    rpc: {
        56: "https://bsc-dataseed.binance.org/",
        137: "https://polygon-rpc.com/",
        1: "https://mainnet.infura.io/v3/",
        42220: "https://celo-mainnet.infura.io",
        59140: "https://rpc.goerli.linea.build",
        44787: "https://alfajores-forno.celo-testnet.org",
        97: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
    bridge: "https://bridge.walletconnect.org/",
    qrcode: true
})

export async function resetWalletConnector(connector: any) {
	if (connector && connector instanceof WalletConnectConnector) {
		connector.walletConnectProvider = undefined
	}
}

