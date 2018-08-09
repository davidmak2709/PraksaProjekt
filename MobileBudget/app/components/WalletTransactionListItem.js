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
import { connect } from "react-redux";
import { updateWallet } from "../redux/actions";

class WalletTransactionsListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			transactionDialog: false,
			recurring: this.props.item.recurring
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
			.then(response =>{
					if(response.status == 204){
						this.setState({visible: false})
						this._getUpdatedStatus();
					}
			}).catch(error => {
				console.error(error);
			});
	};
	_setRecurringTransaction = () => {
			const recurring = !this.state.recurring;
			this.setState({recurring: recurring}, () => {
				fetch("http://46.101.226.120:8000/api/wallets/transactions/update/"+this.props.item.pk +"/", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Token " + this.props.token
					},
					body: JSON.stringify({
						wallet: this.props.item.wallet,
						name: this.props.item.name,
						amount: this.props.item.amount,
						currency: this.props.item.currency,
						date: this.props.item.date,
						category: this.props.item.category,
						recurring: recurring,
				}),
				}).then(response => {
						if(!response.ok){
							Alert.alert("Error.");
						}
				}).catch(error => {
						console.error(error);
				});
	});
};
	_getUpdatedStatus = () => {
		fetch("http://46.101.226.120:8000/api/wallets/"+ this.props.item.wallet +"/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + userToken
			}
		})
			.then(response =>response.json())
			.then(data => {

				this.props.updateWallet({
						pk: data.pk,
						balance: parseFloat(data.balance),
						currency: data.currency,
						name: data.name
				});
			})
			.catch(error => {
				console.error(error);
			});
	};


	render() {
		let transactionWallet = this.props.wallets.filter(
			x => parseInt(x.pk) === parseInt(this.props.item.wallet)
		);

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
								"Delete " + this.props.item.name + " transaction",
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
								<View style={{ width: width * 0.5, flexDirection: "row" }}>
									<Text h4 style={{flexWrap: "wrap", color: "green" }}>
										{this.props.item.name}
									</Text>
								</View>
								<Text style={{ margin: 5 }}>{this.props.item.date}</Text>
							</View>
							<View style={styles.content}>
							<View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
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
							<View style={{marginTop: 20, flexDirection: "row", justifyContent: "space-between" ,alignItems: "center"}}>
								<View style={{flexDirection: "row",}}>
								<Icon color="green" name= "account-balance-wallet" type= "material-icons"/>
								<Text style={{marginLeft: 7, fontSize: 18}}>{transactionWallet[0].name}</Text>
								</View>
								<TouchableOpacity
										activeOpacity={0.5}
										style={{padding: 10, borderWidth: 1, borderColor: "green", borderRadius: 100}}
										onPress= {this._setRecurringTransaction}
								>
								{ this.state.recurring  ?
									<Icon color="green" name= "sync" type= "material-icons" size={30}/>
								:
									<Icon color="lightgray" name= "sync" type= "material-icons" size={30}/>
								}
								</TouchableOpacity>
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
		height: 170,
		justifyContent: "center",
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

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}
export default connect(mapStateToProps,{ updateWallet })(WalletTransactionsListItem);
