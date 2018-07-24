export const setWallets = (data) => {
  return {
    type : "SET_WALLETS",
    payload : data
  }
}

export const addWallet = (data) => {
  return {
    type : "ADD_WALLET",
    payload : data
  }
}
