import React from "react";
import {
	ActivityIndicator,
	Alert,
	AsyncStorage,
	AppRegistry,
	StyleSheet,
	View,
	TextInput,
	StatusBar,
	TouchableOpacity,
	Picker,
	ScrollView
} from "react-native";
import {
	CheckBox,
	Text,
	FormInput,
	SocialIcon,
	Divider
} from "react-native-elements";
import { height, width } from "../../constants/";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

//TODO validacija

class TransactionScreen extends React.Component {
	static userToken = "";
	constructor(props) {
		super(props);
		this.state = {
			response : [],
			transactionType: true,
			dataFieldsVisible: false,
			euro: true,
			kuna: false,
			dollar: false,
			pound: false,
			franc: false,
			wallet: "",
			category: "paycheck",
			name: "",
			amount: 0,
		};


		this._getCategories();
		this._bootstrapAsync();
	}

	componentDidMount(){
		if(this.props.wallets.length > 0){
			this.setState({ wallet : this.props.wallets[0].pk })
		}
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
	}

	_getCategories = () => {
		fetch("http://46.101.226.120:8000/api/wallets/transactions/categories/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",

			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({response : responseJson});
			})
			.catch(error => {
				console.error(error);
			});

	};


	_newTransaction = () => {
		let amount = this.state.amount;
		if(this.state.transactionType ==  false){
			amount = amount * -1;
		}

		let currency = "";

		if (this.state.kuna) {
			currency = "HRK";
		} else if (this.state.dollar) {
			currency = "USD";
		} else if (this.state.euro) {
			currency = "EUR";
		} else if (this.state.pound) {
			currency = "GBP";
		} else {
			currency = "CHF";
		}


		fetch("http://46.101.226.120:8000/api/wallets/transactions/create/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + userToken
			},
			body: JSON.stringify({
					wallet : this.state.wallet,
					name : this.state.name,
					amount : amount,
					currency: currency,
					category:this.state.category,
			})
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.name) {
					Alert.alert("Name", responseJson.name[0]);
				}
			})
			.catch(error => {
				console.error(error);
			});
	};



	_setTransactionName = (name) => {
		this.setState({name : name});
	}

	_setTransactionAmount = (amount) => {
		this.setState({amount : parseFloat(amount)});
	}

	render() {
		let walletsArray = [];
		for (var i = 0; i < this.props.wallets.length; i++) {
			walletsArray.push(
				<Picker.Item label={this.props.wallets[i].name} value={this.props.wallets[i].pk} key = {i} />
			);

		}



		let categoriesArray = this.state.response;
		let categories = [];
		for (var i = 0; i < categoriesArray.length; i++) {
			categories.push(
				<Picker.Item label={categoriesArray[i][1]} value={categoriesArray[i][0]} key = {i} />
			);
		}



		let dataFields = null;
		if (this.state.dataFieldsVisible) {
			dataFields = (
				<View
					style={{
						width: width * 0.95,
						flexDirection: "column",
						justifyContent: "center"
					}}
				>
					<FormInput
						placeholder="Insert transaction name"
						containerStyle={[styles.input, { borderBottomColor: "green" }]}
						inputStyle={{ width: width * 0.8 * 0.95 }}
						underlineColorAndroid="transparent"
						blurOnSubmit={false}
						returnKeyType="next"
						onChangeText = {this._setTransactionName.bind(this)}
					/>

					<FormInput
						placeholder="Insert transaction amount"
						containerStyle={[styles.input, { borderBottomColor: "green" }]}
						inputStyle={{ width: width * 0.8 * 0.95 }}
						underlineColorAndroid="transparent"
						blurOnSubmit={false}
						returnKeyType="next"
						onChangeText = {this._setTransactionAmount.bind(this)}
					/>
					{/*odabir valute*/}
					<View
						style={{
							width: width,
							flexDirection: "row",
							justifyContent: "center",
							marginTop: 25
						}}
					>
						<CheckBox
							title="EUR"
							center
							iconRight={false}
							checkedIcon="euro"
							uncheckedIcon="euro"
							checkedColor="green"
							uncheckedColor="red"
							checked={this.state.euro}
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
					<View
						style={{
							width: width,
							flexDirection: "row",
							justifyContent: "center"
						}}
					>
						<CheckBox
							title="CHF"
							center
							checkedIcon="money"
							uncheckedIcon="money"
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

						<CheckBox
							center
							title="GBP"
							checkedIcon="gbp"
							uncheckedIcon="gbp"
							checked={this.state.pound}
							checkedColor="green"
							uncheckedColor="red"
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
					</View>

					{/*kraj odabira valute*/}
					<View
						style={{
							width: width * 0.88,
							flexDirection: "row",
							justifyContent: "flex-end"
						}}
					>
						<TouchableOpacity style={styles.TouchableOpacityStyle} onPress = {this._newTransaction.bind(this)}>
							<Ionicons name="ios-checkmark" size={35} color="green" />
							<Text style={{ color: "green", marginLeft: 10 }}>SAVE</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<ScrollView>
					{/*odabir tipa trošak ili prihod */}
					<View style={styles.subContainer}>
						<Text>Transaction type: </Text>
						<View
							style={{
								width: width,
								flexDirection: "row",
								justifyContent: "center"
							}}
						>
							<CheckBox
								title="Income"
								center
								checked={this.state.transactionType}
								checkedIcon="arrow-down"
								uncheckedIcon="arrow-down"
								checkedColor="green"
								uncheckedColor="gray"
								onPress={() => this.setState({ transactionType: true })}
							/>
							<CheckBox
								center
								title="Cost"
								checked={!this.state.transactionType}
								checkedIcon="arrow-up"
								uncheckedIcon="arrow-up"
								checkedColor="red"
								uncheckedColor="gray"
								onPress={() => this.setState({ transactionType: false })}
							/>
						</View>
					</View>
					{/*picker za odabir novčanika*/}
					<View style={styles.subContainer}>
						<Text>Wallet: </Text>
						<Picker
							selectedValue={this.state.wallet}
							mode="dialog"
							style={{ height: 50, width: width * 0.95 }}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ wallet: itemValue })
							}
						>
							{walletsArray}
						</Picker>
					</View>
					{/*picker za odabir kategoriju*/}
					<View style={styles.subContainer}>
						<Text>Category: </Text>
						<Picker
							selectedValue={this.state.category}
							style={{ height: 50, width: width * 0.95 }}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ category: itemValue })
							}
						>
							{categories}
						</Picker>
					</View>
					{/* odabir načina unosa parametara */}
					<View style={styles.subContainer}>
						<Text>Input mode: </Text>
						<View
							style={{
								width: width * 0.95,
								flexDirection: "row",
								justifyContent: "center"
							}}
						>
							<TouchableOpacity
								style={styles.TouchableOpacityStyle}
								onPress={() =>
									this.setState({
										dataFieldsVisible: !this.state.dataFieldsVisible
									})
								}
							>
								<Ionicons name="ios-create" size={35} color="green" />
							</TouchableOpacity>

							<Divider style={{ width: width * 0.1 }} />

							<TouchableOpacity style={styles.TouchableOpacityStyle}>
								<Ionicons name="ios-camera" size={35} color="green" />
							</TouchableOpacity>
						</View>

						{/*form input za trošak (ime, svota, valuta, save btn)*/}
						{dataFields}
						{/**/}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "baseline",
		margin: 10
	},
	subContainer: {
		flexDirection: "column"
	},
	TouchableOpacityStyle: {
		flexDirection: "row",
		backgroundColor: "white",
		width: width * 0.4 * 0.8,
		height: 50,
		marginTop: 20,
		marginBottom: 20,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 25
	},
	input: {
		width: width * 0.95 * 0.85,
		alignItems: "center",
		backgroundColor: "transparent",
		borderBottomWidth: 1
	}
});

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}
export default connect(	mapStateToProps,	null)(TransactionScreen);
