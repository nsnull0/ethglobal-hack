const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Test Activity Pool", () => {

  let ownerAccount
  let customerAccount
  let businessAccount
  let activityPool

  beforeEach(async() => {
    [ownerAccount, customerAccount, businessAccount, activityPool] = await ethers.getSigners();
    const _activityPool = await ethers.getContractFactory('ActivityPool');
    activityPool = await _activityPool.connect(ownerAccount).deploy();
  })

  describe('Test List Of Activity', async () => {
    it('return list of correct activity', async () => {
      await expect(activityPool.connect(businessAccount).activities.length).to.equal(0);
      await activityPool.connect(businessAccount).createActivity();
      const _currentActivityCount = await activityPool.connect(businessAccount).getListOfActivity();
      await expect(_currentActivityCount.length).to.equal(1);
    })
  })

})