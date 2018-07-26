export const setWallets = data => {
	return {
		type: "SET_WALLETS",
		payload: data
	};
};

export const addWallet = data => {
	return {
		type: "ADD_WALLET",
		payload: data
	};
};

export const updateWallet = data => {
	return {
		type: "UPDATE_WALLET",
		payload: data
	};
};

export const deleteWallet = pk => {
	return {
		type: "DELETE_WALLET",
		payload: pk
	};
};
