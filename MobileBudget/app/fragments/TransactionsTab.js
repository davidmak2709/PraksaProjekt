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
import ActionButton from "react-native-action-button";

export default class TransactionsTab extends React.Component {
	static userToken;

	constructor() {
		super();
		this.state = {
			isLoading: true,
			currentPage: 1,
			data: [],
			next: "",
			filter: "&ordering=-date",
			refreshing: false
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
		fetch(
			"http://46.101.226.120:8000/api/wallets/transactions/?page=" +
				this.state.currentPage +
				this.state.filter,
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
		this.setState({ currentPage: 1, data: [] }, () => {
			this._getWalletTransactions();
		});
	};

	_setFilter = filter => {
		this.setState({ isLoading: true,filter: filter, data: [] }, () => {
			this._getWalletTransactions();
		});
	};

	_resetFilter = () => {
		this.setState({ isLoading: true,filter: "&ordering=-date", data: [] },() => {
			this._getWalletTransactions();
		});
	};

	_keyExtractor = (item, index) => item.pk.toString();

	_renderItem = ({ item }) => {
		return <WalletTransactionsListItem item={item} token={userToken} />;
	};

	_renderEmptyList = () => {
		return (
			<View
				style={{
					height: height - 150,
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<View
					style={{
						width: width * 0.7,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<Text style={{ fontSize: 18, color: "green" }}>
						You do not have any recorded{" "}
					</Text>
					<Text style={{ fontSize: 18, color: "green" }}>
						transaction, yet.
					</Text>
					<Text>Hit the button and create your </Text>
					<Text>first transaction.</Text>
				</View>
			</View>
		);
	};

	_renderFABIcon = () => {
		return <Icon name="list" color="white" style={styles.actionButtonIcon} />;
	};

	_handleRefresh = () => {
		this.setState({
			refreshing: true,
			currentPage: 1,
			data:[]
		},
		() => {
			this._getWalletTransactions();
		});
	}

	render() {
		if (this.state.isLoading) {
			return <LoadingDataDialog />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<FlatList
						contentContainerStyle={{
							flexDirection: "column",
							justifyContent: "center",
							paddingBottom: 85
						}}
						keyExtractor={this._keyExtractor}
						data={this.state.data}
						renderItem={this._renderItem}
						onEndReached={this._getOlderData.bind(this)}
						onEndTreshold={6}
						ListEmptyComponent={this._renderEmptyList}
						refreshing={this.state.refreshing}
						onRefresh= {this._handleRefresh}
					/>
					<ActionButton
						degrees={-20}
						buttonColor="green"
						renderIcon={this._renderFABIcon}
						buttonTextStyle={{ fontSize: 30 }}
					>
						<ActionButton.Item
							buttonColor="darkred"
							title="Reset filter"
							onPress={this._resetFilter.bind(this)}
						>
							<Icon
								name="delete-sweep"
								color="white"
								style={styles.actionButtonIcon}
							/>
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor="rgb(51, 153, 102)"
							title="Filter"
							onPress={() =>
								this.props.navigation.navigate("Filter", {
									setFilter: this._setFilter.bind(this)
								})
							}
						>
							<Icon
								name="filter-list"
								color="white"
								style={styles.actionButtonIcon}
							/>
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor="rgb(102, 153, 0)"
							title="New"
							onPress={() =>
								this.props.navigation.navigate("Transaction", {
									updateData: this._getUpdatedData.bind(this)
								})
							}
						>
							<Icon name="add" color="white" style={styles.actionButtonIcon} />
						</ActionButton.Item>
					</ActionButton>
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: "white"
	}
});
