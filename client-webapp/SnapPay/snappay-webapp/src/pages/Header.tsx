import WalletComponent from "./WalletComponent";


const HeaderContainer = [
    'bg-gradient-to-r from-indigo50 via-sfblue to-indigo50',
    'text-white'
].join(" ");

type HeaderProps = {
    onClick: (() => void)
}

const Header = ({onClick}: HeaderProps) => {
    return (
        <header className={`${HeaderContainer}`} >
            <div className={`h-auto flex justify-between items-center mx-10 lg:m-auto pt-10`}>
                <div className="flex items-center m-auto">
                    <div className="text-xl font-bold text-[#FF0033]">SnapPay - Ticketing</div>
                </div>
                <WalletComponent onClick={onClick} className="m-auto"/>
            </div>
            <div className="mb-10"/>
        </header>
    )
}

export default Header;