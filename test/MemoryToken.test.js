const { assert } = require('chai');

const MemoryToken = artifacts.require('./MemoryToken.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Memory Token', (accounts) => {
  let token;

  before(async() => {
    token = await MemoryToken.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = token.address
      // make sure address is exist
      assert.notEqual(address, 0xFF);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Memory Token");
    });

    it("has a symbol", async () => {
      const symbol = await token.symbol();
      assert.equal(symbol, "MEMORY");
    })
  })

  describe('token distribution', () => {
    let result;

    it("mints tokens", async () => {
      await token.mint(accounts[0], "https://www.facebook.com/huytung.novers");
      // It should increase the total supply
      result = await token.totalSupply();
      assert.equal(result.toString(), "1", "Total supply is correct");

      // It increase owner balance;
      result = await token.balanceOf(accounts[0]);
      assert.equal(result.toString(), "1", "balanceOf is correct");

      // Token should belong to owner
      result = await token.ownerOf("1");
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct');
      result = await token.tokenOfOwnerByIndex(accounts[0], 0);
      
      // Owner can see all tokens
      let balanceOf = await token.balanceOf(accounts[0]);
      let tokenIds = [];
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.tokenOfOwnerByIndex(accounts[0], i);
        tokenIds.push(id.toString());
      }

      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), "tokenIds are correct");

      // Token URI Correct;
      let tokenURI = await token.tokenURI("1");
      assert.equal(tokenURI, "https://www.facebook.com/huytung.novers");
    });


  });
  
})
