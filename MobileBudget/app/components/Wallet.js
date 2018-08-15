import React, { Component } from "react";
import {
	View,
	AppRegistry,
	Dimensions,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	Alert,
	Keyboard
} from "react-native";
import {
	Text,
	Icon,
	Divider,
	FormInput,
	CheckBox
} from "react-native-elements";
import PropTypes from "prop-types";
import NewWalletDialog from "./NewWalletDialog";
import { width, height } from "../constants";
import { connect } from "react-redux";
import { updateWallet, deleteWallet } from "../redux/actions";

class Wallet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			editWallet: false,
			nameBorderColor: "green",
			balanceBorderColor: "green",
			balance: this.props.balance,
			name: this.props.name
		};
	}


	_deleteWallet() {
		let url = "http://46.101.226.120:8000/api/wallets/" + this.props.pk + "/";

		fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + this.props.token
			}
		})
			.then(response => {
				if (response.status == 204) {
					this.setState({ visible: false, editWallet: false });
					this.props.deleteWallet(this.props.pk);
				}
			})
			.catch(error => {
				Alert.alert("Error","No Internet connection");
			});
	}

	_updateWallet() {

		const name = this.state.name;
		const balance = this.state.balance;

		let nameError = false;
		let balanceError = false;

		if (name == "" || name.lenght < 5 || name.lenght > 50) {
			nameError = true;
			this.setState({ nameBorderColor: "red" });
			this.nameRef.shake();
		} else {
			nameError = false;
			this.setState({ nameBorderColor: "green" });
		}

		if (balance == "") {
			balanceError = true;
			this.setState({ balanceBorderColor: "red" });
			this.balanceRef.shake();
		} else {
			balanceError = false;
			this.setState({ balanceBorderColor: "green" });
		}

		if (nameError === false && balanceError === false) {
			fetch("http://46.101.226.120:8000/api/wallets/" + this.props.pk + "/", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + this.props.token
				},
				body: JSON.stringify({
					balance: balance,
					currency: this.props.currency,
					name: name
				})
			})
				.then(response => {
					if (response.status == 200) {
						Alert.alert("Updated. :)");
						this.props.updateWallet( {
							pk: this.props.pk,
							balance: balance,
							currency: this.props.currency,
							name: name
					});
					} else {
						Alert.alert("Error");
					}
				})
				.catch(error => {
					Alert.alert("Error","No Internet connection");
				});
		}
	}

	_goToDetailsPage = () => {
		this.props.navigation.navigate("WalletTransactions", {pk :  this.props.pk});
	}

	_editWallet = () => {
		this.setState({ editWallet: !this.state.editWallet, visible: !this.state.visible })
	}

	render() {
		let balance = this.props.balance;
		let color = "darkseagreen";
	 	let state = this.props.balance;
		if (state < 0) {
			color = "darkred";
		}
		if (this.state.visible) {
			return (
				<View style={[styles.main, {height: 200} ]}>
					<View style={styles.header}>
						<View
							style={{ flexDirection: "column", flex: 1, flexWrap: "wrap" }}
						>
							<Text h4>{this.props.name}</Text>
						</View>
						<View style={styles.iconsLayout}>
							<Icon color="green" name="list" size={30}  onPress = {this._goToDetailsPage.bind(this)}/>
							<Divider style={{ backgroundColor: "transparent", width: 20 }} />
							<Icon
								color="green"
								name="edit"
								size={30}
								onPress={this._editWallet.bind(this)}
							/>
							<Divider style={{ backgroundColor: "transparent", width: 20 }} />
							<Icon
								color="red"
								name="delete"
								size={30}
								onPress={() =>
									Alert.alert(
										"Delete " + this.props.name + " wallet",
										"Are you sure?",
										[
											{ text: "No", style: "cancel" },
											{ text: "Yes", onPress: this._deleteWallet.bind(this) }
										],
										{ cancelable: false }
									)
								}
							/>
						</View>
					</View>
					<View style={styles.content}>
						<Text h3>{this.props.currency}</Text>
						<Divider style={{ backgroundColor: "transparent", width: 20 }} />
						<Text h2 style={{ color: color }}>
							{parseFloat(state).toFixed(2)}
						</Text>
					</View>
				</View>
			);
		} else if (this.state.editWallet) {
			return (
				<View style={[styles.main, {height: 250} ]}>
					<View style={styles.header}>
						<View
							style={{ flexDirection: "column", flex: 1, flexWrap: "wrap" }}
						>
							<Text h4>Edit {this.props.name}</Text>
						</View>
						<View
							style={[
								styles.iconsLayout,
								{ justifyContent: "flex-end", alignItems: "flex-end" }
							]}
						>
							<Icon
								color="red"
								name="close"
								size={30}
								onPress={this._editWallet.bind(this)}
							/>
						</View>
					</View>
					<View>
					<Text style={{marginLeft: 10, marginTop: 10, color:"green"}}>Name:</Text>
						<FormInput
							placeholder="Insert wallet name"
							containerStyle={[
								styles.input,
								{ borderBottomColor: this.state.nameBorderColor }
							]}
							inputStyle={{ width: width * 0.8 * 0.95 }}
							underlineColorAndroid="transparent"
							selectionColor="orangered"
							blurOnSubmit={false}
							onChangeText={name => this.setState({name: name})}
							returnKeyType="next"
							ref={nameRef => (this.nameRef = nameRef)}
							onSubmitEditing={() => this.balanceRef.focus()}
							value={this.state.name}
						/>
						<Text style={{marginLeft: 10, marginTop: 10, color:"green"}}>Balance:</Text>
						<FormInput
							placeholder="Insert account balance "
							containerStyle={[
								styles.input,
								{ borderBottomColor: this.state.balanceBorderColor }
							]}
							inputStyle={{ width: width * 0.8 * 0.95 }}
							underlineColorAndroid="transparent"
							keyboardType="numeric"
							selectionColor="orangered"
							blurOnSubmit={false}
							onSubmitEditing={(balance) => Keyboard.dismiss()}
							onChangeText={balance => this.setState({balance: balance})}
							returnKeyType="done"
							ref={balanceRef => (this.balanceRef = balanceRef)}
						/>
						<View
							style={[
								styles.iconsLayout,
								{
									justifyContent: "center",
									alignItems: "center",
									margin: 10
								}
							]}
						>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={this._updateWallet.bind(this)}
							>
								<Text style={{ color: "green", fontSize: 22 }}>SAVE</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			);
		} else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	main: {

		width: width * 0.9,
		margin: 10,
		backgroundColor: "white",
		borderColor: "green",
		borderWidth: 1
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		height: height * 0.3 * 0.2,
		padding: 10,
	},
	iconsLayout: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	content: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		height: height * 0.3 * 0.7,
		padding: 10
	},
	input: {
		alignItems: "center",
		backgroundColor: "transparent",
		borderBottomWidth: 1
	},
	currencySelectorContainer: {
		flexDirection: "row",
		justifyContent: "center"
	},
	currencyOptionContainer: {
		backgroundColor: "transparent"
	}
});

Wallet.propTypes = {
	name: PropTypes.string.isRequired,
	currency: PropTypes.string.isRequired
};

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}

export default connect(	mapStateToProps,	{ updateWallet, deleteWallet })(Wallet);
