export const ActivityABIData = [
	"function generateQrCode() external onlyOwner",
	"function setActivityName(string memory _name) external onlyOwner",
	"function setPaymentToken(address _paymentToken) external onlyOwner",
    "function setPrice(uint256 _amount) external onlyOwner",
    "function getSubcribedPeopleCount() external view returns (uint256)",
    "function getCheckInPeopleCount() external view returns (uint256)",
    "function getQrCode() external view returns (uint256)",
    "function getActivityName() external view returns (string memory)",
    "function getAttendantName() external view returns (string memory)",
    "function getPrice() external view returns (uint256)",
    "function getPaymentTokenAddress() external view returns (address)",
    "function checkIntoThisActivity(uint256 _validationQrCode) external nonReentrant",
    "function getOwner() external view returns (bool)"
]

export const ActivityPoolABIData = [
    "function getListOfActivity() external view returns (address[] memory)",
    "function createActivity() external nonReentrant"
]

export const ContractActivityPoolLinea = "0x303CEcC32A5E7f652636056e677d46cf7ed814B3"
export const ContractActivityPoolTestCelo = "0x8B91A0a2E25BCff0e66f004732baE556Fa798A81"