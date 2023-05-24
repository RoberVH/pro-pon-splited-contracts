const { expect } = require("chai")
const { describe, it } = require("mocha")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const test_pro_pon1 = {
    id: "CLI160511W1M",
    name: "Clionautacion",
    country: "MEX"
  }   

// addr1 address company data
const test_pro_pon2 = {
  id: "0455-3443",
  name: "Flexamatic Inc",
  country:"USA",
}     

// addr2 address company data
const test_pro_pon3 = {
  id: "243 SI344033424",
  name: "Courient llc",
  country:"CAN",
}     


  function convertDate(date)   {
    return unixdate=Math.floor(new Date(date).getTime()/1000)
  }


  async function deployPropon() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();
    const propon = await ethers.getContractFactory("pro_pon");
    const proponContract = await propon.deploy();
    // Fixtures can return anything you consider useful for your tests
    return { proponContract, owner, addr1, addr2 };
  }

 describe("********************** Company1.js ********************** \nCompany Creation", function () {
    it("Should create a company", async function () {
      const {  proponContract, owner } = await loadFixture(deployPropon);
      let txn = await proponContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      let company= await proponContract.getCompany(owner.address)
      expect(company.id).to.equal(test_pro_pon1.id);
    });
  });

  describe("Reject retrieving company with different address than creator", function () {
    it("1 Should fail to get company trhough different owner", async function () {
      const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      // try retrieving test_pro_pon1.id company with addr1 (not creator!)
      let company= await proponContract.getCompany(addr1.address)
      expect(company.id).to.not.equal(test_pro_pon1.id);
    });
  });

  describe("Retrieves Company created with owner address", function () {
    it("1 Should retrieve get company", async function () {
      const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      let company= await proponContract.getCompany(owner.address)
      expect(company.id).to.equal(test_pro_pon1.id);
    });
  });


  describe("Retrive empty Company Id when retrieving  trhough non creator address", function () {
    it("1 Should get empty Id if asked through non creator account", async function () {
      const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      // addr1  hasn't created any company
      let companyId= await proponContract.getCompanyId(addr1.address)
      expect(companyId).to.equal('');
    });
  });  

describe("Reusing Companies Ids", function () {
  it("1 Should reject create company with taken Id from same address", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // try reusing id for other company with same address
    await expect (proponContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('id_already_exists')
  })
  
  it("3 Should reject create company with taken Id from different address", async function () {
    // try creating other company with same address
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
    let companyId= await proponContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)   
    // reuse company Id when trying create another company from another address (addr1)
    await expect (proponContract.connect(addr1).createCompany(
      test_pro_pon1.id,   // already taken Id (taken for owner address)
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('id_already_exists') // rejects creating another company with same address
});
it("4 Should reject create company with an existing admin address", async function () {
  // try reusing Id with other address
  const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
  let txn = await proponContract.createCompany(
    test_pro_pon1.id,
    test_pro_pon1.name,
    test_pro_pon1.country,
    {value: ethers.utils.parseEther('0.0001')}
    )
  let companyId= await proponContract.getCompanyId(owner.address)
  expect(companyId).to.equal(test_pro_pon1.id)         
    await expect (proponContract.createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('address_already_admin_of_company')
  });
});  

describe("Test destroying contract", function () {
  it("1 Should denied destroying contract from non-owner request", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
    await expect(proponContract.connect(addr1).destroy()).to.be.revertedWith('Only_owner_allowed')
    //try to access it again and it must pass it through
    const idOwner= await proponContract.getCompanyId(owner.address)
    expect(idOwner).to.be.equal(test_pro_pon1.id)   // test_pro_pon1.id is Id of owner address who is the company admin
  });

  it("2 Should denied access after destroying contract", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
    await proponContract.destroy()
    //try to access it again
    await expect(proponContract.getCompanyId(owner.address)).to.be.reverted
  });

  it("3 Should denied withdraw contract funds to non owner of contract", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              ) 
    txn = await proponContract.connect(addr1).createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name,
      test_pro_pon2.country,
      {value: ethers.utils.parseEther('0.0001')}
      )               
    // now there are two companies created, contract has funds: 0.0002 matics
    // ttry to withdraw with other than owner address
    await expect(proponContract.connect(addr1).withdraw()).to.be.revertedWith('Only_owner_allowed')
    const balAddr= await ethers.provider.getBalance(addr1.address)
  });

  it("3 Should allow owner of contract to withdraw from contract", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              ) 
    txn = await proponContract.connect(addr1).createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name,
      test_pro_pon2.country,
      {value: ethers.utils.parseEther('0.0001')}
      )               
    // now there are two companies created, contract has funds: 0.0002 matics
    // try to withdraw with other than owner address
    let balAddr= await ethers.provider.getBalance(proponContract.address)
    expect(balAddr.toString()).to.be.equal('200000000000000')
    await proponContract.withdraw()
    balAddr= await ethers.provider.getBalance(proponContract.address)
    expect(balAddr.toString()).to.be.equal('0')
  });
});

describe("Test setting/getting prices", function () {
  it("1 Should allow owner set CreateCompanyPrice", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let companyPrice = await proponContract.CREATE_COMPANY_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=20.504
    let txn = await proponContract.setCreateCompanyPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponContract.CREATE_COMPANY_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("2 Should allow owner set CreateInvitationRfpPrice", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let companyPrice = await proponContract.CREATE_INVITATION_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=0.504
    let txn = await proponContract.setCreateInvitationRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponContract.CREATE_INVITATION_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("3 Should allow owner set RegisterOpenRfpPrice", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let companyPrice = await proponContract.REGISTER_OPEN_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=500
    let txn = await proponContract.setRegisterOpenRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponContract.REGISTER_OPEN_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    console.log('en matics:', precioMatic)
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("4 Should allow owner set CREATE_OPEN_RFP_PRICE", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    let companyPrice = await proponContract.CREATE_OPEN_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=10.504
    let txn = await proponContract.setCreateOpenRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponContract.CREATE_OPEN_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
    console.log('4. precio:',parseFloat(precioMatic))
  });

  it("5 Should allow owner set maxguest to open and invitation contests", async function () {
    const {  proponContract, owner, addr1 } = await loadFixture(deployPropon);
    const guests=17
    await proponContract.setMaxGuestOpenTender(guests)
    expect(await proponContract.MAX_GUEST_OPEN_TENDER())
      .to.be.equal(guests)
    await proponContract.setMaxGuestInvitationTender(guests)
    expect(await proponContract.MAX_GUEST_INVITATION_TENDER())
      .to.be.equal(guests)

    });
    
  });
 

