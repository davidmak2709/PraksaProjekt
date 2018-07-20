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
import Wallet from "../components/Wallet";
import NewWalletDialog from "../components/NewWalletDialog";

const { height, width } = Dimensions.get("window");

export default class WalletTab extends React.Component {
	constructor() {
		super();
		this._getUserWallets();
		this.state = {
			response: [],
			loading: true,
			walletModal: false,
			refreshing: false
		};
	}

	_getUserWallets = async () => {
		const userToken = await AsyncStorage.getItem("userToken");
		token = userToken;
		this.setState({ refreshing: true });
		fetch("http://46.101.226.120:8000/api/wallets/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + token
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					response: responseJson,
					loading: false,
					refreshing: false
				});
			})
			.catch(error => {
				console.error(error);
			});
	};

	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return (
			<Wallet
				name={item.name}
				balance={item.balance}
				token={token}
				currency={item.currency}
				pk={item.pk}
				user={item.user}
			/>
		);
	};

	_onRefresh = () => {
		this.setState({ refreshing: true, walletModal: false });
		this._getUserWallets();
	};

	render() {
		if (this.state.loading) {
			return (
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<ActivityIndicator size="large" color="green" />
				</View>
			);
		} else {
			return (
				<View style={{ flex: 1 }}>
					<FlatList
						keyExtractor={this._keyExtractor}
						data={Object.values(this.state.response)}
						extraData={Object.values(this.state.response)}
						renderItem={this._renderItem}
						refreshControl={
							<RefreshControl
								colors={["green", "lightgreen"]}
								refreshing={this.state.refreshing}
								onRefresh={this._onRefresh}
							/>
						}
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
