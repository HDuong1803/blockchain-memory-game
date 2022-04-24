pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full  {
  
    constructor() ERC721Full("Memory Token", "MEMORY") public {
    }

    function mint(address _to, string memory _tokenURI) public returns(bool) {
       // there is an array store all tokens
       uint _tokenId = totalSupply().add(1); // increasing length of array 
       _mint(_to, _tokenId);
       _setTokenURI(_tokenId, _tokenURI); // push token to array
       return true;
    }
}