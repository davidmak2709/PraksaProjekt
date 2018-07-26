import React, { Component } from "react";
import {
	View,
	AppRegistry,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Modal,
	AsyncStorage,
	Keyboard,
	Alert
} from "react-native";
import {
	Text,
	Icon,
	FormInput,
	CheckBox,
	Divider
} from "react-native-elements";
import { width, height } from "../constants";
import { connect } from "react-redux";
import { addWallet } from "../redux/actions";

class NewWalletDialog extends Component {
	static token;

	constructor(props) {
		super(props);
		this.state = {
			euro: true,
			dollar: false,
			kuna: false,
			pound: false,
			franc: false,
			name: "",
			balance: 0,
			nameBorderColor: "green",
			balanceBorderColor: "green"
		};
		this._getUserData();
	}

	_getUserData = async () => {
		const userToken = await AsyncStorage.getItem("userToken");
		token = userToken;
	};


	createNewWallet() {
		const name = this.state.name;
		const balance = this.state.balance;

		let nameError = false;
		let balanceError = false;

		let currency = "";

		if (this.state.kuna) {
			currency = "HRK";
		} else if (this.state.dollar) {
			currency = "USD";
		} else if (this.state.euro) {
			currency = "EUR";
		} else if (this.state.pound) {
			currency = "GBP";
		} else if (this.state.franc) {
			currency = "CHF";
		}

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
			fetch("http://46.101.226.120:8000/api/wallets/create/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + token
				},
				body: JSON.stringify({
					balance: balance,
					currency: currency,
					name: name
				})
			})
				.then(response => {
					const statusCode = response.status;
					const data = response.json();
					return Promise.all([statusCode, data]);
				})
				.then(([res, data]) => {
					if (res == 201) {
						this.props.addWallet(data);
						this.props.navigation.pop();
					} else {
						Alert.alert("Error");
					}
				})
				.catch(error => {
					console.error(error);
					return { name: "network error", description: "" };
				});
		}
	}

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
				onRequestClose={() => {
					console.log("Close.");
				}}
			>
				<View style={styles.container}>
					<View style={styles.contentContainer}>
						<View style={styles.header}>
							<Text h4>New wallet</Text>
							<Icon
								name="wallet"
								type="material-community"
								size={35}
								color="green"
							/>
						</View>
						<View style={styles.main}>
							<FormInput
								placeholder="Insert new wallet name"
								containerStyle={[
									styles.input,
									{ borderBottomColor: this.state.nameBorderColor }
								]}
								inputStyle={{ width: width * 0.8 }}
								underlineColorAndroid="transparent"
								selectionColor="orangered"
								blurOnSubmit={false}
								onChangeText={name => this.setState({ name: name })}
								returnKeyType="next"
								ref={nameRef => (this.nameRef = nameRef)}
								onSubmitEditing={() => this.balanceRef.focus()}
							/>

							<FormInput
								placeholder="Insert current account balance"
								containerStyle={[
									styles.input,
									{ borderBottomColor: this.state.balanceBorderColor }
								]}
								inputStyle={{ width: width * 0.8 }}
								underlineColorAndroid="transparent"
								keyboardType="numeric"
								selectionColor="orangered"
								blurOnSubmit={false}
								onSubmitEditing={() => Keyboard.dismiss()}
								onChangeText={balance => this.setState({ balance: balance })}
								returnKeyType="done"
								ref={balanceRef => (this.balanceRef = balanceRef)}
							/>

							<View style={styles.currencySelectorContainer}>
								<CheckBox
									title="EUR"
									center
									iconRight={false}
									checkedIcon="euro"
									uncheckedIcon="euro"
									checkedColor="green"
									uncheckedColor="red"
									checked={this.state.euro}
									containerStyle={styles.currencyOptionContainer}
									onPress={() =>
										this.setState({
											euro: true,
											dollar: false,
											kuna: false,
											pound: false,
											franc: false
										})
									}
								/>

								<CheckBox
									title="USD"
									center
									checkedIcon="dollar"
									uncheckedIcon="dollar"
									containerStyle={styles.currencyOptionContainer}
									checkedColor="green"
									uncheckedColor="red"
									checked={this.state.dollar}
									onPress={() =>
										this.setState({
											euro: false,
											dollar: true,
											kuna: false,
											pound: false,
											franc: false
										})
									}
								/>

								<CheckBox
									center
									title="HRK"
									checkedIcon="money"
									uncheckedIcon="money"
									checked={this.state.kuna}
									checkedColor="green"
									uncheckedColor="red"
									containerStyle={styles.currencyOptionContainer}
									onPress={() =>
										this.setState({
											euro: false,
											dollar: false,
											kuna: true,
											pound: false,
											franc: false
										})
									}
								/>
							</View>
							<View style={styles.currencySelectorContainer}>
								<CheckBox
									title="GBP"
									center
									iconRight={false}
									checkedIcon="gbp"
									uncheckedIcon="gbp"
									checkedColor="green"
									uncheckedColor="red"
									checked={this.state.pound}
									containerStyle={styles.currencyOptionContainer}
									onPress={() =>
										this.setState({
											euro: false,
											dollar: false,
											kuna: false,
											pound: true,
											franc: false
										})
									}
								/>

								<CheckBox
									title="CHF"
									center
									checkedIcon="money"
									uncheckedIcon="money"
									containerStyle={styles.currencyOptionContainer}
									checkedColor="green"
									uncheckedColor="red"
									checked={this.state.franc}
									onPress={() =>
										this.setState({
											euro: false,
											dollar: false,
											kuna: false,
											pound: false,
											franc: true
										})
									}
								/>
							</View>
						</View>
						<View style={styles.footer}>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.props.navigation.pop()}
							>
								<Text style={{ color: "green", fontSize: 22 }}>CLOSE</Text>
							</TouchableOpacity>

							<Divider style={{ width: 20, backgroundColor: "transparent" }} />

							<TouchableOpacity
								activeOpacity={0.5}
								onPress={this.createNewWallet.bind(this)}
							>
								<Text style={{ color: "green", fontSize: 22 }}>SAVE</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)"
	},
	contentContainer: {
		width: width * 0.925,
		height: height * 0.8,
		backgroundColor: "white"
	},
	header: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10
	},
	main: {
		flex: 6,
		justifyContent: "space-evenly",
		alignItems: "center",
		borderTopColor: "black",
		borderTopWidth: 1
	},
	footer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginRight: 50,
		marginBottom: 25
	},
	input: {
		alignItems: "center",
		// borderRadius : 50,
		backgroundColor: "transparent",
		borderBottomWidth: 1
		//  borderBottomColor : "green"
	},
	currencySelectorContainer: {
		flexDirection: "row",
		justifyContent: "center",
		width: width * 0.7
	},
	currencyOptionContainer: {
		backgroundColor: "transparent"
	}
});

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}

export default connect(	mapStateToProps,	{ addWallet })(NewWalletDialog);

AppRegistry.registerComponent("NewWalletDialog", () => NewWalletDialog);
