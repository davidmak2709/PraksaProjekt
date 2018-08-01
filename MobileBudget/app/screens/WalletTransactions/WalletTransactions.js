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
			<TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("Filter")}
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

//+this.props.navigation.getParam("pk")
	_getWalletTransactions = () => {
		fetch(
			"http://46.101.226.120:8000/api/wallets/transactions/?page="+this.state.currentPage+"&ordering=-date&wallet="+this.props.navigation.getParam("pk"),
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

	_getUpdatedData = () => {
		this.setState({ currentPage: 1, data: []}, () => {
			this._getWalletTransactions();
		});
	}


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
					/>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() =>
							this.props.navigation.navigate("Transaction",{
								updateData: this._getUpdatedData.bind(this)
							})
					}
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
	listItemContainer: {
		height: 100
	},
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

export default withNavigation(WalletTransactions);
