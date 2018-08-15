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
import { Icon, Button } from "react-native-elements";
import { connect } from "react-redux";
import { setWallets } from "../redux/actions";

import Wallet from "../components/Wallet";
import { height, width } from "../constants";

class WalletTab extends React.Component {
	static userToken;

	constructor() {
		super();
		this._bootstrapAsync();

	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	}


	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return (
			<Wallet
				name={item.name}
				balance={item.balance}
				token={userToken}
				currency={item.currency}
				pk={item.pk}
				user={item.user}
				navigation = {this.props.navigation}
			/>
		);
	};

	_renderEmptyList = () =>{
			return (
				<View style={{height:height-150,justifyContent: "center",alignItems: "center"}}>
					<View style={{width: width*0.7,justifyContent: "center",alignItems: "center"}}>
						<Text style={{fontSize: 18, color: "green"}}>You do not have a wallet, yet. </Text>
						<Text>Hit the button and create your </Text>
						<Text>first wallet.</Text>
					</View>
				</View>
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
						paddingBottom: 20,
						alignItems: "center"
					}}
					ListEmptyComponent={this._renderEmptyList}
				/>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => this.props.navigation.navigate("NewWalletDialog")}
					style={styles.TouchableOpacityStyle}
				>
					<Icon color="white" name="add" size={30} />
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	TouchableOpacityStyle: {
		backgroundColor: "green",
		position: "absolute",
		width: 55,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 27,
		right: 30,
		bottom: 30
	}
});

function mapStateToProps(state) {
	return {
		wallets: state.wallets.wallets
	};
}
export default connect(	mapStateToProps,	{ setWallets })(WalletTab);
