import { ContractActivityPoolLinea, ContractActivityPoolTestCelo } from "../../abis/ActivityPoolABI"

export enum NetworkChainType {
    BSC = 56,
    Polygon = 137,
    Ethereum = 1,
    Celo = 42220,
    Linea = 59140,
    CeloTestnet = 44787,
    BNBTestNet = 97,
    Empty = 0
} 

export const chainNetworkNamer = [
    {
        id: NetworkChainType.BSC,
        chainName: "BSC",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.BSC).toString(16)}`,
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"], 
                iconUrls: []
        },
        contractPoolAddress: ""
    },
    {
        id: NetworkChainType.Polygon,
        chainName: "Polygon",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.Polygon).toString(16)}`,
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"], 
                iconUrls: []
        },
        contractPoolAddress: ""
    },
    {
        id: NetworkChainType.Ethereum,
        chainName: "Ethereum",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.Ethereum).toString(16)}`,
                chainName: "Ethereum Mainnet",
                nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18
                },
                rpcUrls: ["https://mainnet.infura.io/v3/"],
                blockExplorerUrls: ["https://etherscan.io"], 
                iconUrls: []
        },
        contractPoolAddress: ""
    },
    {
        id: NetworkChainType.Celo,
        chainName: "Celo Mainnet",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.Celo).toString(16)}`,
                chainName: "Celo Mainnet",
                nativeCurrency: {
                    name: "CELO",
                    symbol: "CELO",
                    decimals: 18
                },
                rpcUrls: ["https://celo-mainnet.infura.io"],
                blockExplorerUrls: ["https://celoscan.io"], 
                iconUrls: []
        },
        contractPoolAddress: ""
    },
    {
        id: NetworkChainType.Linea,
        chainName: "Linea Goerli test network",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.Linea).toString(16)}`,
                chainName: "Linea Goerli test network",
                nativeCurrency: {
                    name: "LineaETH",
                    symbol: "LineaETH",
                    decimals: 18
                },
                rpcUrls: ["https://rpc.goerli.linea.build"],
                blockExplorerUrls: ["https://explorer.goerli.linea.build"], 
                iconUrls: []
        },
        contractPoolAddress: ContractActivityPoolLinea
    },
    {
        id: NetworkChainType.CeloTestnet,
        chainName: "Celo Test Net",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.CeloTestnet).toString(16)}`,
                chainName: "ACELO TESTNET",
                nativeCurrency: {
                    name: "A-CELO",
                    symbol: "A-CELO",
                    decimals: 18
                },
                rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
                blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"], 
                iconUrls: []
        },
        contractPoolAddress: ContractActivityPoolTestCelo
    },
    {
        id: NetworkChainType.BNBTestNet,
        chainName: "BNB Test Net",
        infoNetwork: {
            chainId: `0x${Number(NetworkChainType.BNBTestNet).toString(16)}`,
                chainName: "BNB Testnet",
                nativeCurrency: {
                    name: "BNB TESTNET",
                    symbol: "BNB TESTNET",
                    decimals: 18
                },
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                blockExplorerUrls: ["https://testnet.bscscan.com/"], 
                iconUrls: []
        },
        contractPoolAddress: ""
    }
]

export function getChainNetworkInformation(chainId: number | undefined): String {
    const filteredNetwork = chainNetworkNamer.filter((item) => {
        return item.id == chainId
    })
    return filteredNetwork.pop()?.chainName ?? "Unsupported Network"
  }

export function getChainNetworkInformationChainType(chainId: number | undefined): NetworkChainType {
    const filteredNetwork = chainNetworkNamer.filter((item) => {
        return item.id == chainId
    })
    return filteredNetwork.pop()?.id ?? NetworkChainType.CeloTestnet
  }

export function getChainNetworkInformationChainContent(chainId: number | undefined): any {
    const filteredNetwork = chainNetworkNamer.filter((item) => {
        return item.id == chainId
    })
    return filteredNetwork.pop()?.infoNetwork
}

export function getContractPoolAddress(chainId: number | undefined): string {
    const filteredNetwork = chainNetworkNamer.filter((item) => {
        return item.id == chainId
    })
    return filteredNetwork.pop()?.contractPoolAddress ?? ""
}




