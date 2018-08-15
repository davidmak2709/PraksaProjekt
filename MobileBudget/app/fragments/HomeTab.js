import React from "react";
import {
	Text,
	ScrollView,
	Dimensions,
	AsyncStorage,
	RefreshControl,
	View,
	Alert
} from "react-native";
import { StatusBar } from "react-native";
import CategoriesSlideShow from "../components/CategoriesSlideShow";
import WalletTransactionsListItem from "../components/WalletTransactionListItem";

class HomeTab extends React.Component {
	static userToken;
	constructor() {
		super();
		this.state = {
			lastTransaction: [],
			isLoading: true,
			refreshing: false
		};
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	};

	componentWillMount() {
		StatusBar.setHidden(true);
	}

	componentDidMount() {
		this._getLastTransaction();
	}

	_getLastTransaction = () => {

		fetch("http://46.101.226.120:8000/api/wallets/transactions/?page=1", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + userToken
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					lastTransaction: responseJson.results[0],
				});
			})
			.catch(error => {
				this.setState({
					isLoading: false,
					refreshing: false
				});

				Alert.alert("Error","No Internet connection");

			});

    this.setState({refreshing: false});
  };

	_onRefresh = () => {
			this.setState({ refreshing: true }, () => {
				this._getLastTransaction();
			});
	};

	render() {
		return (
			<View>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
						/>
					}
				>
					<CategoriesSlideShow token={userToken} />
					<WalletTransactionsListItem
						item={this.state.lastTransaction}
						token={userToken}
					/>
				</ScrollView>
			</View>
		);
	}
}


export default HomeTab;
