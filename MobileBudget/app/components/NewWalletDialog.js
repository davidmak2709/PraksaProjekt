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

const { height, width } = Dimensions.get("window");

export default class NewWalletDialog extends Component {
	static token;

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: props.visible,
			euro: true,
			dollar: false,
			kuna: false,
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible) {
			this.setErrorDialogVisible(nextProps.visible);
		}
	}

	setErrorDialogVisible(visible) {
		if (this.state.modalVisible != visible)
			this.setState({ modalVisible: visible });
	}

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
					if (response.status == 201) {
						this.setState({ modalVisible: false });
						Alert.alert("New wallet created. Refresh! :)");
					} else {
						Alert.alert("Error");
					}
				})
				.catch(error => {
					console.error(error);
				});
		}
	}

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.modalVisible}
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
										this.setState({ euro: true, dollar: false, kuna: false })
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
										this.setState({ euro: false, dollar: true, kuna: false })
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
										this.setState({ euro: false, dollar: false, kuna: true })
									}
								/>
							</View>
						</View>
						<View style={styles.footer}>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setErrorDialogVisible(false)}
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

AppRegistry.registerComponent("NewWalletDialog", () => NewWalletDialog);
