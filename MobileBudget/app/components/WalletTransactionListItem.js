import React, { Component } from "react";
import {
	Alert,
	Image,
	TouchableOpacity,
	StyleSheet,
	View,
	Modal
} from "react-native";
import { Text, Icon, Divider } from "react-native-elements";
import { width, height } from "../constants";
import { ICONS } from "../images";

class WalletTransactionsListItem extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: true,
			transactionDialog: false
		};
	}

	_deleteTransaction = () => {
		let url =
			"http://46.101.226.120:8000/api/wallets/transactions/" +
			this.props.item.pk +
			"/";

		this.setState({transactionDialog: false});
		fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + this.props.token
			}
		})
			.then(response => {
				if (response.status == 204) {
					this.setState({ visible: false });
				}
			})
			.catch(error => {
				console.error(error);
			});
	};

	render() {
		let color = "darkseagreen";
		let amount = this.props.item.amount;
		if (amount < 0) {
			color = "darkred";
		}

		if (this.state.visible) {
			return (
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.listItemContainer}
						onLongPress={() => 	Alert.alert(
								"Delete " + this.props.name + " transaction",
								"Are you sure?",
								[
									{ text: "No", style: "cancel" },
									{ text: "Yes", onPress: this._deleteTransaction.bind(this) }
								],
								{ cancelable: true }
							)}
					>
						<View style={styles.container}>
							<View style={styles.header}>
								<View style={{ width: width * 0.5 }}>
									<Text h4 style={{ flexWrap: "wrap", color: "green" }}>
										{this.props.item.name}
									</Text>
								</View>
								<Text style={{ margin: 5 }}>{this.props.item.date}</Text>
							</View>
							<View style={styles.content}>
								<Image
									style={styles.image}
									source={ICONS[this.props.item.category]}
								/>
								<View>
									<View
										style={{
											justifyContent: "flex-end",
											alignItems: "flex-end"
										}}
									>
										<Text h2 style={{ color: color }}>
											{parseFloat(amount).toFixed(2)}
										</Text>
										<Text h4 style={{ color: "rgb(45, 185, 45)" }}>
											{this.props.item.currency}
										</Text>
									</View>
								</View>
							</View>
						</View>
					</TouchableOpacity>

			);
		} else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	listItemContainer: {},
	container: {
		padding: 5,
		paddingTop: 5
	},
	header: {
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "green",
		borderTopColor: "darkgray",
		borderRightColor: "darkgray",
		borderLeftColor: "darkgray",
		borderTopWidth: 2,
		borderRightWidth: 2,
		borderLeftWidth: 2,
		paddingTop: 5,
		paddingRight: 15,
		paddingLeft: 15
	},
	content: {
		backgroundColor: "white",
		height: 150,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 5,
		borderBottomColor: "darkgray",
		borderRightColor: "darkgray",
		borderLeftColor: "darkgray",
		borderBottomWidth: 2,
		borderRightWidth: 2,
		borderLeftWidth: 2,
		paddingTop: 5,
		paddingRight: 15,
		paddingLeft: 15
	},
	image: {
		backgroundColor: "transparent",
		height: 50,
		width: 50
	}
});

export default WalletTransactionsListItem;
