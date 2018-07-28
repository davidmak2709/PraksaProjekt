import {
	SET_WALLETS,
	ADD_WALLET,
	UPDATE_WALLET,
	DELETE_WALLET
} from "../types";

const initialState = {
	wallets: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_WALLETS:
			return {
				...state,
				wallets: action.payload
			};
		case ADD_WALLET:
			return {
				...state,
				wallets: state.wallets.concat(action.payload)
			};
		case UPDATE_WALLET:
			return {
				...state,
				wallets: state.wallets.map(
					x =>
						parseInt(x.pk) == parseInt(action.payload.pk) ? action.payload : x
				)
			};
		case DELETE_WALLET:
			return {
				...state,
				wallets: state.wallets.filter(
					x => parseInt(x.pk) !== parseInt(action.payload)
				)
			};
		default:
			return state;
	}
};
