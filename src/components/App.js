import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'


const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]


function App() {
  const [account, setAccount] = useState('0x0')
  const [token, setToken] = useState({})
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokenURIs, setTokenURIs] = useState([])
  const [cardArray, setCardArray] = useState([])
  const [cardsChosen, setCardsChosen] = useState([])
  const [cardsChosenId, setCardsChosenId] = useState([])
  const [cardsWon, setCardsWon] = useState([])

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      } else {
        window.alert("Non-Ethereum browser deteced. You should consider trying MetaMask!")
      }
    }
  
    async function loadBlockchainData() {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      // load smart contract
      const networkId = await web3.eth.net.getId()
      const netWorkData =  MemoryToken.networks[networkId]
      if (netWorkData) {
        const address = netWorkData.address
        const abi = MemoryToken.abi
        const token = new web3.eth.Contract(abi, address)
        setToken(token)
        const totalSupply =  await token.methods.totalSupply().call()
        setTotalSupply(totalSupply)
        
        // load tokens ...
        let balanceOf = await token.methods.balanceOf(accounts[0]).call()
        let arrayTokenURI = []
        for (let i = 0; i < balanceOf; i++) {
          let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
          let tokenURI = await token.methods.tokenURI(id).call()
          arrayTokenURI.push(tokenURI)
        } 
        setTokenURIs([...tokenURIs, ...arrayTokenURI ])
      } else {
         window.alert("Smart contract not deployed to detected network.")
      }
    }

    function sortRandomCards() {
      const newCardArray = CARD_ARRAY.sort(() => 0.5 - Math.random())
      setCardArray(newCardArray)
    }

    loadWeb3()
    loadBlockchainData()
    sortRandomCards()
  },[])

  function handleChooseImage(cardIndex) {
    cardIndex = cardIndex.toString()
    if(cardsWon.includes(cardIndex)) {
      return window.location.origin + '/images/white.png'
    }
    else if(cardsChosenId.includes(cardIndex)) {
      return CARD_ARRAY[cardIndex].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  function checkForMatch(nextCardChosen, nextCardChosenId) {
    let optionOneId = cardsChosenId[0]
    let optionTwoId = nextCardChosenId
    if (optionOneId === optionTwoId) {
      alert("You have clicked the same image!")
    } else if (cardsChosen[0] === nextCardChosen) {
      alert("You find a match")
      token.methods.mint(
        account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: account })
      .on('transactionHash', (hash) => {
        setCardsWon([...cardsWon, optionOneId, optionTwoId])
      })

    } else {
      alert("Better next time")
    }
    setCardsChosen([])
    setCardsChosenId([])
    if (cardsWon.length === CARD_ARRAY.length) {
      alert("Congratulation! You found them all!")
    }
  }

  function hadnleFlipCard(cardId) {
    let alreadyChosen = cardsChosen.length
    setCardsChosen([...cardsChosen, cardArray[cardId].name])
    setCardsChosenId([...cardsChosenId, cardId])

    if (alreadyChosen === 1) {
      setTimeout(() => checkForMatch(cardArray[cardId].name, cardId), 100)
    }
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
        <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
        &nbsp; Memory Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-muted"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1 className="d-4">Edit this file in App.js!</h1>

              <div className="grid mb-4" >
                {
                  cardArray.map((item, index) => {
                    return (
                      <img 
                        key={Math.random()}
                        src={handleChooseImage(index)}
                        data-id={index}
                        onClick={(e) => {
                          let cardId = e.target.getAttribute('data-id')
                          if (!cardsWon.includes(cardId.toString())) {
                            hadnleFlipCard(cardId)
                          }
                        }}
                      />
                    )
                  })
                }
              </div>

              <div>
                <h5>Token collected: <span id="result">&nbsp; {tokenURIs.length}</span></h5>
                <div className="grid mb-4" >
                  {
                    tokenURIs.map((tokenURI => {
                      return (
                        <img 
                          key={Math.random()}
                          src={tokenURI}
                        />
                      )
                    }))
                  }
                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
