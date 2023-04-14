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
      
    })
  })

})