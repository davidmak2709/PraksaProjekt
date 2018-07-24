import React from "react";
import {
	Text,
	View,
	Dimensions,
	AsyncStorage,
	ActivityIndicator,
	ScrollView,
	Image,
	StyleSheet,
	TouchableOpacity,
	RefreshControl,
	FlatList
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { setWallets } from "../redux/actions";

import Wallet from "../components/Wallet";
import NewWalletDialog from "../components/NewWalletDialog";
import { height, width } from "../constants";

class WalletTab extends React.Component {
	constructor() {
		super();
		this.state = {
			walletModal: false
		};
	}

	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return (
			<Wallet
				name={item.name}
				balance={item.balance}
				token="{token}"
				currency={item.currency}
				pk={item.pk}
				user={item.user}
			/>
		);
	};

	render() {
		
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					keyExtractor={this._keyExtractor}
					data={this.props.wallets}
					extraData={this.props.wallets}
					renderItem={this._renderItem}
					contentContainerStyle={{
						paddingBottom: height * 0.2,
						alignItems: "center"
					}}
				/>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => this.setState({ walletModal: true })}
					style={styles.TouchableOpacityStyle}
				>
					<Icon color="white" name="add" size={30} />
				</TouchableOpacity>

				<NewWalletDialog visible={this.state.walletModal} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	TouchableOpacityStyle: {
		backgroundColor: "green",
		position: "absolute",
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 25,
		right: 30,
		bottom: 30
	}
});

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}
export default connect(	mapStateToProps,	{ setWallets })(WalletTab);
