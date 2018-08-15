import React, { Component } from "react";
import { Text, Icon, Button } from "react-native-elements";
import { AsyncStorage, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import WalletTransactionsListItem from "../../components/WalletTransactionListItem";
import LoadingDataDialog from "../../components/LoadingDataDialog";
import { withNavigation } from "react-navigation";

class WalletTransactions extends React.Component {
	static userToken;
	static navigationOptions = ({ navigation }) => {
	return {
		headerRight: (
			<TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("Filter", {
				 setFilter: navigation.getParam("setFilter"),
				 wallet: navigation.getParam("pk")
			})}
				style={{flexDirection:"row",alignItems: "center", marginRight: 20}}>
				<Icon color="green" name="filter-list" size={40} />
			</TouchableOpacity>
			),
		};
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			currentPage: 1,
			data: [],
			next: "",
			filter: "&ordering=-date",
			refreshing: false,
		};
		this._bootstrapAsync();
	}

	componentDidMount() {
		this._getWalletTransactions();
		this.props.navigation.setParams({ setFilter: this._setFilter.bind(this) });
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	};

	_getWalletTransactions = () => {
		let url ="http://46.101.226.120:8000/api/wallets/transactions/?page="+this.state.currentPage+"&wallet="+this.props.navigation.getParam("pk")+this.state.filter
		console.log(url);
		fetch( url,
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
					refreshing: false,
					next: responseJson.next
				});
			})
			.catch(error => {
				this.setState({
					isLoading: false,
					refreshing: false,
					});
					Alert.alert("Error","No Internet connection");
			});
	};

	_setFilter = (filter) =>{
			this.setState({filter: filter,data: []},()=> {
				this._getWalletTransactions();
			});
	};


	_getOlderData = () => {
		if (this.state.next != null) {
			this.setState({ currentPage: this.state.currentPage + 1 }, () => {
				this._getWalletTransactions();
			});
		}
	};

	_getUpdatedData = () => {
		this.setState({ currentPage: 1, data: []}, () => {
			this._getWalletTransactions();
		});
	}


	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return <WalletTransactionsListItem item={item} token={userToken} />;
	};

	_handleRefresh = () => {
		this.setState({
			refreshing: true,
			currentPage: 1,
			data: []
		},
		() => {
			this._getWalletTransactions();
		});
	}

	render() {
		let view;
		if (this.state.isLoading) {
			return <LoadingDataDialog />;
		} else {
			return (
				<View  style={{flex : 1}}>
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
						refreshing={this.state.refreshing}
						onRefresh= {this._handleRefresh}
					/>

				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	listItemContainer: {
		height: 100
	},

});

export default withNavigation(WalletTransactions);
