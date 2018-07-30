import React, { Component } from "react";
import { Text } from "react-native-elements";
import { AsyncStorage, FlatList, View, StyleSheet } from "react-native";
import WalletTransactionsListItem from "../../components/WalletTransactionListItem";
import LoadingDataDialog from "../../components/LoadingDataDialog";
import { withNavigation } from "react-navigation";

class WalletTransactions extends React.Component {
	static userToken;
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			currentPage: 1,
			data: [],
			next: ""
		};
		this._bootstrapAsync();
	}

	componentDidMount() {
		this._getWalletTransactions();
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	};

	_getWalletTransactions = () => {
		console.log(this.state.currentPage);
		fetch(
			"http://46.101.226.120:8000/api/wallets/transactions/?page="+this.state.currentPage+"&wallet="+this.props.navigation.getParam("pk"),
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
		let view;
		if (this.state.isLoading) {
			return <LoadingDataDialog />;
		} else {
			return (
				<FlatList
					contentContainerStyle={{
						flexDirection: "column",
						justifyContent: "center"
					}}
					keyExtractor={this._keyExtractor}
					data={this.state.data}
					renderItem={this._renderItem}
					onEndReached={this._getOlderData.bind(this)}
					onEndTreshold={6}
				/>
			);
		}
	}
}

const styles = StyleSheet.create({
	listItemContainer: {
		height: 100
	}
});

export default withNavigation(WalletTransactions);
