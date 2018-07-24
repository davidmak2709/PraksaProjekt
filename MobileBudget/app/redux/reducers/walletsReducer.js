const initialState = {
	wallets: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case "SET_WALLETS":
			return {
				wallets: action.payload
			};
    case "ADD_WALLET":
  			return {
          ...state,
          wallets: state.wallets.concat(action.payload)
  			};
		default:
			return state;
	}
};
