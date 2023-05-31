/**
 * Test pro_ponData and pro_ponLogic Company, Constants & Value functions contracts
 */
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
    const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    // const propon = await ethers.getContractFactory("pro_pon");
    // const proponContract = await propon.deploy();
    // console.log('proponContract',proponContract.address)
    
    // console.log('Deployer address (owner)', owner.address)
    const proponData = await ethers.getContractFactory("pro_ponData");
    const proponDataContract = await proponData.deploy();
    // console.log('proponDataContract',proponDataContract.address)
    // console.log('owner of proponDataContract', await proponDataContract.getOwner());

    const proponLogic = await ethers.getContractFactory("pro_ponLogic");
    const proponLogicContract = await proponLogic.deploy(proponDataContract.address);

    // console.log('proponLogicContract', proponLogicContract.address)
    // console.log('Setting Datacontract owner')
    await proponDataContract.setOwner(proponLogicContract.address)

    // const proponMAnager = await ethers.getContractFactory("pro_ponManager");
    // const proponManagerContract = await proponMAnager.deploy(proponDataContract.address);
    // // set manager 


    // Fixtures can return anything you consider useful for your tests
    return { proponDataContract, proponLogicContract, owner, addr1, addr2, addr3, addr4, addr5 };
  }

 describe("********************** Company1.js ********************** \nCompany Creation", function () {
    it("1 Should have assigned proponLogicContract as owner of proponDataContract", async function () {
      const { proponDataContract, proponLogicContract} = await loadFixture(deployPropon);
      const ownerofContractData = await proponDataContract.getOwner()
      expect(ownerofContractData).to.equal(proponLogicContract.address)
    });

  it("2 Should have assigned owner address  as manager of proponDataContract", async function () {
    const { proponDataContract,  owner} = await loadFixture(deployPropon);
    const managerofContractData = await proponDataContract.getManager()
    expect(managerofContractData).to.equal(owner.address)
  });

  it("3 Should let assign manager addressof proponDataContract", async function () {
    const { proponDataContract,  owner, addr1} = await loadFixture(deployPropon);
    await proponDataContract.setManager(addr1.address)
    const managerofContractData = await proponDataContract.getManager()
    expect(managerofContractData).to.not.equal(owner.address)
    expect(managerofContractData).to.equal(addr1.address)
  });  
});

  describe("********************** Company1.js ********************** \nCompany Creation", function () {
    it("2 Should create a company", async function () {
      const {  proponDataContract, proponLogicContract, owner } = await loadFixture(deployPropon);
      let txn = await proponLogicContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
       let company= await proponDataContract.getCompany(owner.address)
       expect(company.id).to.equal(test_pro_pon1.id);
       const ownerofContractData = await proponDataContract.getOwner()
       expect(ownerofContractData).equal(proponLogicContract.address)
    });
  });

  describe("Reject retrieving company with different address than creator", function () {
    it("3 Must retrieve correct company by admin address", async function () {
      const {  proponDataContract, proponLogicContract, owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponLogicContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      txn = await proponLogicContract.connect(addr1).createCompany(
        test_pro_pon2.id,
        test_pro_pon2.name,
        test_pro_pon2.country,
        {value: ethers.utils.parseEther('0.0001')}
        )                   
      //  Retrieve addr1 company test_pro_pon2.id company with addr1 (its creator!)
      let company= await proponDataContract.getCompany(addr1.address)
      // expect the Id of company is not the same as owner address company test_pro_pon1.id 
      expect(company.id).to.not.equal(test_pro_pon1.id);
    });
  });

  describe("Retrieves Company created with owner address", function () {
    it("4 Should retrieve get company", async function () {
      const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponLogicContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      let company= await proponDataContract.getCompany(owner.address)
      expect(company.id).to.equal(test_pro_pon1.id);
    });
  });


  describe("Retrive empty Company Id when retrieving  through non creator address", function () {
    it("1 Should get empty Id if asked through non creator account", async function () {
      const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
      let txn = await proponLogicContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
      // addr1  hasn't created any company
      let companyId= await proponDataContract.getCompanyId(addr1.address)
      expect(companyId).to.equal('');
    });
  });  

describe("Reusing Companies Ids", function () {
  it("1 Should reject create company with taken Id from same address", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // try reusing id for other company with same address
    await expect (proponLogicContract.createCompany(
      test_pro_pon1.id,
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('id_already_exists')
  })
  
  it("2 Should reject create company with taken Id from different address", async function () {
    // try creating other company with same address
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
                test_pro_pon1.id,
                test_pro_pon1.name,
                test_pro_pon1.country,
                {value: ethers.utils.parseEther('0.0001')}
                )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)   
    // reuse company Id when trying create another company from another address (addr1)
    await expect (proponLogicContract.connect(addr1).createCompany(
      test_pro_pon1.id,   // already taken Id (taken for owner address)
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('id_already_exists') // rejects creating another company with same address
});
it("3 Should reject create company with an existing admin address", async function () {
  // try reusing Id with other address
  const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
  let txn = await proponLogicContract.createCompany(
    test_pro_pon1.id,
    test_pro_pon1.name,
    test_pro_pon1.country,
    {value: ethers.utils.parseEther('0.0001')}
    )
  let companyId= await proponDataContract.getCompanyId(owner.address)
  expect(companyId).to.equal(test_pro_pon1.id)         
    await expect (proponLogicContract.createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name, // other name
      test_pro_pon2.country, // other country
      {value: ethers.utils.parseEther('0.0001')}
      )).to.be.revertedWith('address_already_admin_of_company')
  });
});  

describe("Test destroying contract", function () {
  it("1 Should denied destroying Data contract from non-manager request", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(

              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
    await expect(proponDataContract.connect(addr1).destroy()).to.be.revertedWith('only_manager_allowed')
    //try to access it again and it must pass it through
    const idOwner= await proponDataContract.getCompanyId(owner.address)
    expect(idOwner).to.be.equal(test_pro_pon1.id)   // test_pro_pon1.id is Id of owner address who is the company admin
  });

  it("2 Should allow destroy data contract from manager address and  denied access after destroying contract", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
     await proponDataContract.destroy()  //sent from default owner address, that is manager as we haven't changed Data Contract constructor assginemt
    //try to access it again
    // const compa= await  proponDataContract.getCompanyId(owner.address)
    expect(proponDataContract.getCompanyId(owner.address) ).to.be.reverted
    //await expect(proponDataContract.getCompanyId(owner.address)).to.be.revertedWith('function call to a non-contract account');
    //await expect(proponDataContract.getCompanyId(owner.address)).to.be.throw;

  });

  it("3 Should denied non owner to destroy Logic contract", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
    expect(proponLogicContract.connect(addr1).destroy()).to.be.revertedWith('Only_owner_allowed')
    //try some access  again that shouldn't work
    let balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    //console.log('balance antes:', balAddr.toString())
    await proponLogicContract.withdraw()
    balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    //console.log('balance despues:', balAddr.toString())
  });

  it("4 Should allow Logic owner to destroy Logic contract", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              )
    let companyId= await proponDataContract.getCompanyId(owner.address)
    expect(companyId).to.equal(test_pro_pon1.id)
    // Alright contract exist, let's destroy it
    await  proponLogicContract.destroy()
    //try some access  again that shouldn't work
    let balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    // console.log('balance antes:', balAddr.toString())
    expect(proponLogicContract.withdraw()).to.be.reverted
    balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    // console.log('balance despues:', balAddr.toString())
  });

  it("5 Should denied withdraw contract funds to no owner of contract", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              ) 
    txn = await proponLogicContract.connect(addr1).createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name,
      test_pro_pon2.country,
      {value: ethers.utils.parseEther('0.0001')}
      )               
    // now there are two companies created, contract has funds: 0.0002 matics
    // ttry to withdraw with other than owner address
    await expect(proponLogicContract.connect(addr1).withdraw()).to.be.revertedWith('Only_owner_allowed')
    const balAddr= await ethers.provider.getBalance(addr1.address)
  });

  it("6 Should allow owner of Logic contract to withdraw from Logic contract", async function () {
    const {  proponLogicContract,  addr1 } = await loadFixture(deployPropon);
    let txn = await proponLogicContract.createCompany(
              test_pro_pon1.id,
              test_pro_pon1.name,
              test_pro_pon1.country,
              {value: ethers.utils.parseEther('0.0001')}
              ) 
    txn = await proponLogicContract.connect(addr1).createCompany(
      test_pro_pon2.id,
      test_pro_pon2.name,
      test_pro_pon2.country,
      {value: ethers.utils.parseEther('0.0001')}
      )               
    // now there are two companies created, contract has funds: 0.0002 matics
    // try to withdraw with other than owner address
    let balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    expect(balAddr.toString()).to.be.equal('200000000000000') // from the two creation paid 0.0001 each
    await proponLogicContract.withdraw()
    balAddr= await ethers.provider.getBalance(proponLogicContract.address)
    expect(balAddr.toString()).to.be.equal('0')
  });
});

describe("Test setting/getting prices on Manager Contract", function () {
  it("1 Should allow manager address set CreateCompanyPrice", async function () {
    const {  proponDataContract,  } = await loadFixture(deployPropon);
    let companyPrice = await proponDataContract.CREATE_COMPANY_PRICE() // manager is owner address by deployment default
    // console.log('Price antes', companyPrice.toString())
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=20.504
    let txn = await proponDataContract.setCreateCompanyPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponDataContract.CREATE_COMPANY_PRICE()
    // console.log('Price despues', companyPrice.toString())
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("2 Should deny no  manager address set CreateCompanyPrice", async function () {
    const {  proponDataContract,  addr3} = await loadFixture(deployPropon);
    let companyPrice = await proponDataContract.CREATE_COMPANY_PRICE() // manager is owner address by deployment default
    // console.log('Price antes', companyPrice.toString())
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=20.504
    expect (proponDataContract.connect(addr3).setCreateCompanyPrice(ethers.utils.parseUnits(price.toString())))
      .to.be.revertedWith('only_manager_allowed')

    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
  });

  it("3 Should allow manager set CreateInvitationRfpPrice", async function () {
    const {  proponDataContract } = await loadFixture(deployPropon);
    let companyPrice = await proponDataContract.CREATE_INVITATION_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=0.504
    let txn = await proponDataContract.setCreateInvitationRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponDataContract.CREATE_INVITATION_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("4 Should allow a newly set manager set RegisterOpenRfpPrice", async function () {
    const {  proponDataContract, owner, addr1, addr3 } = await loadFixture(deployPropon);
    let companyPrice = await proponDataContract.REGISTER_OPEN_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=500
    // 
    await proponDataContract.setManager(addr3.address)
    let txn = await proponDataContract.connect(addr3).setRegisterOpenRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponDataContract.REGISTER_OPEN_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    // console.log('en matics:', precioMatic)
    expect(parseFloat(precioMatic)).to.equal(price)
  });

  it("5 Should allow owner set CREATE_OPEN_RFP_PRICE", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    let companyPrice = await proponDataContract.CREATE_OPEN_RFP_PRICE()
    // set the price in Matics that are converted to wei. Set price to 20 matics
    const price=10.504
    let txn = await proponDataContract.setCreateOpenRfpPrice(ethers.utils.parseUnits(price.toString())) 
    companyPrice = await proponDataContract.CREATE_OPEN_RFP_PRICE()
    const precioMatic= ethers.utils.formatUnits(companyPrice,"ether")
    expect(parseFloat(precioMatic)).to.equal(price)
    console.log('4. precio:',parseFloat(precioMatic))
  });

  it("6 Should allow owner set maxguest to open and invitation contests", async function () {
    const {  proponDataContract, proponLogicContract,  owner, addr1 } = await loadFixture(deployPropon);
    const guests=17
    await  proponDataContract.setMaxGuestOpenTender(guests)
    expect(await  proponDataContract.MAX_GUEST_OPEN_TENDER())
      .to.be.equal(guests)
    await  proponDataContract.setMaxGuestInvitationTender(guests)
    expect(await  proponDataContract.MAX_GUEST_INVITATION_TENDER())
      .to.be.equal(guests)
    });
    
  });
 

