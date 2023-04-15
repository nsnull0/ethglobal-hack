const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Test Activity Item", () => {

  let ownerAccount
  let customerAccount
  let businessAccount
  let activityPool
  let activity
  let tokenPayment
  let mockPool

  beforeEach(async() => {
    [ ownerAccount, customerAccount, activityPool, activity, businessAccount ] = await ethers.getSigners();
    const _providerToken = await ethers.getContractFactory('ERC20PresetMinterPauser');
	tokenPayment = await _providerToken.deploy("TokenPayment", "TP");
    const _activityPool = await ethers.getContractFactory('ActivityPool');
    activityPool = await _activityPool.connect(ownerAccount).deploy();
    await activityPool.connect(businessAccount).createActivity();
    const _currentActivityList = await activityPool.connect(businessAccount).getListOfActivity();
    const _factory = await ethers.getContractFactory('Activity');
    activity = await _factory.attach(_currentActivityList[0]);
    const _mockPool = await ethers.getContractFactory('MockPool');
	mockPool = await _mockPool.connect(ownerAccount).deploy();
  })

  describe('Test Activity Creation', async () => {
    it('should return empty state value when start', async () => {
    	const _qrCode = await activity.connect(customerAccount).getQrCode();
    	expect(_qrCode).to.equal(0);
    	const _paymentToken = await activity.connect(customerAccount).getPaymentTokenAddress();
    	expect(_paymentToken).to.equal(ethers.constants.AddressZero);
    	const _activityName = await activity.connect(customerAccount).getActivityName();
    	expect(_activityName).to.equal("");
    	const _getAttendantName = await activity.connect(customerAccount).getAttendantName();
    	expect(_getAttendantName).to.equal("");
    	const _getAtttendantSubscribestatus = await activity.connect(customerAccount).getSubscribeStatus();
    	expect(_getAtttendantSubscribestatus).to.equal(false);
    	const _getAttendantCheckin = await activity.connect(customerAccount).getCheckInStatus();
    	expect(_getAttendantCheckin).to.equal(false);
    })
    it('value qrcode should be updated after set', async () => {
    	await expect(activity.connect(customerAccount).generateQrCode()).to.be.reverted;
    	await activity.connect(businessAccount).generateQrCode();
    	const _qrCode = await activity.connect(customerAccount).getQrCode();
    	expect(_qrCode).not.equal(0);
    })
    it('value price amount should be updated after set', async () => {
    	await expect(activity.connect(customerAccount).setPrice(10)).to.be.reverted;
    	await activity.connect(businessAccount).setPrice(10);
    	const _priceAmount = await activity.connect(customerAccount).getPrice();
    	expect(_priceAmount).not.equal(0);
    })
    it('value payment token should be updated after set', async () => {
    	await expect(activity.connect(customerAccount).setPaymentToken(tokenPayment.address)).to.be.reverted;
    	await activity.connect(businessAccount).setPaymentToken(tokenPayment.address);
    	const _paymentTokenAddress = await activity.connect(customerAccount).getPaymentTokenAddress();
    	expect(_paymentTokenAddress).to.equal(tokenPayment.address);
    })
  })

  describe('Test Activity Flow', async () => {
  	it('expected user to subcribed successfully', async () => {
  		await activity.connect(businessAccount).setPrice(10);
  		await activity.connect(businessAccount).setPaymentToken(tokenPayment.address);
    	await expect(activity.connect(customerAccount).subscribeThisActivity("ETHGlobal")).to.be.reverted;
    	await tokenPayment.mint(customerAccount.address, 100);
    	await tokenPayment.connect(customerAccount).approve(activity.address, 10);
    	await expect(activity.connect(customerAccount).subscribeThisActivity("ETHGlobal")).to.not.be.reverted; 
    	const _isSubcribed = await activity.connect(customerAccount).getSubscribeStatus();
    	expect(_isSubcribed).to.equal(true);
    })
    it('expected user to checkIn successfully', async () => {
    	await activity.connect(businessAccount).setPrice(10);
  		await activity.connect(businessAccount).setPaymentToken(tokenPayment.address);
    	await expect(activity.connect(customerAccount).subscribeThisActivity("ETHGlobal")).to.be.reverted;
    	await tokenPayment.mint(customerAccount.address, 100);
    	await tokenPayment.connect(customerAccount).approve(activity.address, 10);
    	await expect(activity.connect(customerAccount).checkIntoThisActivity()).to.be.reverted;
    	await expect(activity.connect(customerAccount).subscribeThisActivity("ETHGlobal")).to.not.be.reverted; 
    	await expect(activity.connect(customerAccount).checkIntoThisActivity()).to.not.be.reverted;
    	const _isSubcribed = await activity.connect(customerAccount).getSubscribeStatus();
    	const _isCheckin = await activity.connect(customerAccount).getCheckInStatus();
    	expect(_isSubcribed && _isCheckin).to.equal(true);
    })

  })

})