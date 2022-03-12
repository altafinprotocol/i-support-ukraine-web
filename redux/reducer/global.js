import get from 'lodash/get'

export default (state = {
  innerHeight: 0,
  innerWidth: 0,
  modal: {
    active: false,
    title: '',
    size: 'lg',
    hideClose: false,
    component: ''
  },
  currentAccount: '',
  currentNetwork: {},
  network: {
    ethereum: {
      endpoint: 'https://eth-mainnet.alchemyapi.io/v2/i-MwKrPQdGIFD3XMIn9uHfO7Twp7BjOC',
      contracts: {
        mint: '0xC17BbE9D9893Bf1a1a3652c865B9ca322915FaA5'
      },
      services: {
        mint: true
      }
    },
    ropsten: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    rinkeby: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    polygon: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    mumbai: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    bsc: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    avalanche: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    arbitrum: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    optimism: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    stacks: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    },
    solana: {
      endpoint: null,
      contracts: {
        mint: ''
      },
      services: {
        mint: false
      }
    }
  }
}, action) => {
  const { payload, type } = action
  switch (type) {
    case 'SET_CURRENT_ACCOUNT': {
      const {
        currentAccount
      } = payload
      const current = `network.${currentAccount.provider}`
      const currentNetwork = get(state, `${current}`)
      let address = currentAccount.account
      switch (true) {
        case get(currentAccount, 'account', '').length === 42: {
          address = address.substring(0, 5) + '...' + address.slice(currentAccount.account.length - 4)
          break
        }
        case get(currentAccount, 'account', '').length === 44: {
          address = address.substring(0, 5) + '...' + address.slice(currentAccount.account.length - 4)
          break
        }
        default: {}
      }
      return {
        ...state,
        currentAccount: {
          account: address,
          provider: currentAccount.provider
        },
        currentNetwork
      }
    }
    case 'CALCULATE_BROWSER_SIZE': {
      var h = (window.innerHeight)
      var w = (window.innerWidth)
      return { ...state, innerHeight: h, innerWidth: w }
    }
    case 'OPEN_MODAL': {
      const payload = action.payload
      const {
        title,
        component
      } = payload
      return {
        ...state,
        modal: {
          active: true,
          title: title,
          size: get(payload, 'size', state.modal.size),
          hideClose: get(payload, 'hideClose', state.modal.hideClose),
          component: component
        }
      }
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        modal: {
          active: false,
          title: '',
          size: 'lg',
          component: ''
        }
      }
    }
    default: return state
  }
}
