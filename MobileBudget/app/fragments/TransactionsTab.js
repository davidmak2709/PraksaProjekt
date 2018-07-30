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
	FlatList,
  StatusBar
} from "react-native";
import { Icon, Button } from "react-native-elements";
import WalletTransactionsListItem from "../components/WalletTransactionListItem";
import LoadingDataDialog from "../components/LoadingDataDialog";
import { height, width } from "../constants";

export default class TransactionsTab extends React.Component {
	static userToken;

	constructor() {
		super();
		this.state = {
			isLoading: true,
			currentPage: 1,
			data: [],
			next: ""
		};
		this._bootstrapAsync();
	}

  componentDidMount(){
    this._getWalletTransactions();
  }

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	};

	_getWalletTransactions = () => {
		console.log(this.state.currentPage);
		fetch(
			"http://46.101.226.120:8000/api/wallets/transactions/?page=" +
				this.state.currentPage,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + userToken
				}
			}
		)
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					data: [...this.state.data, ...responseJson.results],
					isLoading: false,
					next: responseJson.next
				});
				console.log(this.state.next);
			})
			.catch(error => {
				console.error(error);
			});
	};

	_getOlderData = () => {
		if (this.state.next != null) {
			this.setState({ currentPage: this.state.currentPage + 1 }, () => {
				this._getWalletTransactions();
			});
		}
	};

	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return <WalletTransactionsListItem item={item} token={userToken} />;
	};

	render() {
		if (this.state.isLoading) {
			return (<LoadingDataDialog />);
		} else {
			return (
				<View  style={{flex : 1}}>
					<FlatList
						contentContainerStyle={{
							flexDirection: "column",
							justifyContent: "center",
						}}
						keyExtractor={this._keyExtractor}
						data={this.state.data}
						renderItem={this._renderItem}
						onEndReached={this._getOlderData.bind(this)}
						onEndTreshold={6}
					/>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => this.props.navigation.navigate("Transaction")}
						style={styles.TouchableOpacityStyle}
					>
						<Icon color="white" name="add" size={30} />
					</TouchableOpacity>
				</View>
			);
		}
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
