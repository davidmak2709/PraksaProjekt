import React from "react";
import {
	ActivityIndicator,
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

export default class TransactionScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			transactionType: true,
			language: "java"
		};
	}

	render() {
		
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
							selectedValue={this.state.language}
							mode="dialog"
							style={{ height: 50, width: width * 0.95 }}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ language: itemValue })
							}
						>
							<Picker.Item label="Java" value="java" />
							<Picker.Item label="JavaScript" value="js" />
						</Picker>
					</View>
					{/*picker za odabir kategoriju*/}
					<View style={styles.subContainer}>
						<Text>Category: </Text>
						<Picker
							selectedValue={this.state.language}
							style={{ height: 50, width: width * 0.95 }}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ language: itemValue })
							}
						>
							<Picker.Item label="Java" value="java" />
							<Picker.Item label="JavaScript" value="js" />
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
							<TouchableOpacity style={styles.TouchableOpacityStyle}>
								<Ionicons name="ios-create" size={35} color="green" />
							</TouchableOpacity>

							<Divider style={{ width: width * 0.1 }} />

							<TouchableOpacity style={styles.TouchableOpacityStyle}>
								<Ionicons name="ios-camera" size={35} color="green" />
							</TouchableOpacity>
						</View>

						{/*form input za trošak (ime, svota, valuta, save btn)*/}
						<View
							style={{
								width: width * 0.95,
								flexDirection: "column",
								justifyContent: "center"
							}}
						>
							<FormInput
								placeholder="Insert wallet name"
								containerStyle={[styles.input, { borderBottomColor: "green" }]}
								inputStyle={{ width: width * 0.8 * 0.95 }}
								underlineColorAndroid="transparent"
								blurOnSubmit={false}
								returnKeyType="next"
							/>

							<FormInput
								placeholder="Insert wallet name"
								containerStyle={[styles.input, { borderBottomColor: "green" }]}
								inputStyle={{ width: width * 0.8 * 0.95 }}
								underlineColorAndroid="transparent"
								blurOnSubmit={false}
								returnKeyType="next"
							/>
							{/*odabir valute*/}
							<View
								style={{
									width: width,
									flexDirection: "row",
									justifyContent: "center",
									marginTop : 25
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
										this.setState({ euro: true, dollar: false, kuna: false })
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
									onPress={() =>
										this.setState({ euro: false, dollar: false, kuna: true })
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
									checked={this.state.dollar}
									onPress={() =>
										this.setState({ euro: false, dollar: true, kuna: false })
									}
								/>

								<CheckBox
									center
									title="GBP"
									checkedIcon="money"
									uncheckedIcon="gbp"
									checked={this.state.kuna}
									checkedColor="green"
									uncheckedColor="red"
									onPress={() =>
										this.setState({ euro: false, dollar: false, kuna: true })
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
								<TouchableOpacity style={styles.TouchableOpacityStyle}>
									<Ionicons name="ios-checkmark" size={35} color="green" />
									<Text style={{ color: "green", marginLeft: 10 }}>SAVE</Text>
								</TouchableOpacity>
							</View>
						</View>
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
