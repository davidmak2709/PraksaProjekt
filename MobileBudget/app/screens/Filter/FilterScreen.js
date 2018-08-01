import React, { Component } from "react";
import {
	AppRegistry,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	View,
	ScrollView,
	Picker
} from "react-native";
import { Icon, Text, CheckBox, Divider } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { height, width } from "../../constants/";

export default class FilterScreen extends Component<Props> {
	static navigationOptions = ({ navigation }) => {
		return {
			headerRight: (
				<TouchableOpacity
					activeOpacity={0.5}
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginRight: 20
					}}
					onPress={navigation.getParam("resetState")}
				>
					<Icon color="red" name="delete-sweep" size={40} />
				</TouchableOpacity>
			)
		};
	};

	constructor() {
		super();
		this.state = {
			response: [],
			category: "all",
			fromDate: "01-01-2010",
			toDate: moment(new Date()).format("DD-MM-YYYY"),
			dateDesc: true,
			nameAsc: true
		};

		this.defaultValues = this.state;
		this._getCategories();
	}

	componentDidMount() {
		this.props.navigation.setParams({ resetState: this._resetState });
	}

	_resetState = () => {
		this.setState(this.defaultValues);
	};

	_getCategories = () => {
		fetch("http://46.101.226.120:8000/api/wallets/transactions/categories/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({ response: responseJson });
			})
			.catch(error => {
				console.error(error);
			});
	};

	render() {
		let categoriesArray = this.state.response;
		let categories = [];
		categories.push(<Picker.Item label={"All"} value={"all"} key={0} />);
		for (var i = 0; i < categoriesArray.length; i++) {
			categories.push(
				<Picker.Item
					label={categoriesArray[i][1]}
					value={categoriesArray[i][0]}
					key={i + 1}
				/>
			);
		}

		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
					<Text h4 style={styles.categoryHeader}>
						Date
					</Text>
					<View style={styles.subContainer}>
						<View>
							<Text style={styles.categoryContentLabel}>From: </Text>
							<Text style={styles.categoryContentLabel}>To:</Text>
						</View>
						<View style={styles.categoryContent}>
							<DatePicker
								style={{ width: 200, margin: 10 }}
								date={this.state.fromDate}
								mode="date"
								placeholder="select date"
								format="DD-MM-YYYY"
								minDate="01-01-2010"
								maxDate={this.state.toDate}
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: {
										position: "absolute",
										left: 0,
										top: 4,
										marginLeft: 0
									},
									dateInput: {
										marginLeft: 36
									}
								}}
								onDateChange={date => {
									this.setState({ fromDate: date });
								}}
							/>
							<DatePicker
								style={{ width: 200, margin: 10 }}
								date={this.state.toDate}
								mode="date"
								placeholder="select date"
								format="DD-MM-YYYY"
								minDate="01-01-2010"
								maxDate={this.state.toDate}
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								customStyles={{
									dateIcon: {
										position: "absolute",
										left: 0,
										top: 4,
										marginLeft: 0
									},
									dateInput: {
										marginLeft: 36
									}
								}}
								onDateChange={date => {
									this.setState({ toDate: date });
								}}
							/>
						</View>
					</View>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row"
						}}
					>
						<CheckBox
							center
							checked={this.state.dateDesc}
							title="Descending"
							checkedIcon="sort-numeric-desc"
							uncheckedIcon="sort-numeric-desc"
							checkedColor="green"
							uncheckedColor="gray"
							containerStyle={styles.checkBoxContainer}
							onPress={() => this.setState({ dateDesc: true })}
						/>
						<CheckBox
							title="Ascending"
							center
							checked={!this.state.dateDesc}
							checkedIcon="sort-numeric-asc"
							uncheckedIcon="sort-numeric-asc"
							checkedColor="green"
							uncheckedColor="gray"
							containerStyle={styles.checkBoxContainer}
							onPress={() => this.setState({ dateDesc: false })}
						/>
					</View>
					<Text h4 style={styles.categoryHeader}>
						Category
					</Text>

					<View style={styles.subContainer}>
						<Picker
							selectedValue={this.state.category}
							style={styles.picker}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ category: itemValue })
							}
						>
							{categories}
						</Picker>
					</View>
					<Text h4 style={styles.categoryHeader}>
						Name
					</Text>
					<View style={styles.subContainer}>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "row"
							}}
						>
							<CheckBox
								title="Ascending"
								center
								checked={this.state.nameAsc}
								checkedIcon="sort-alpha-asc"
								uncheckedIcon="sort-alpha-asc"
								checkedColor="green"
								uncheckedColor="gray"
								containerStyle={styles.checkBoxContainer}
								onPress={() => this.setState({ nameAsc: true })}
							/>
							<CheckBox
								center
								checked={!this.state.nameAsc}
								title="Descending"
								checkedIcon="sort-alpha-desc"
								uncheckedIcon="sort-alpha-desc"
								checkedColor="green"
								uncheckedColor="gray"
								containerStyle={styles.checkBoxContainer}
								onPress={() => this.setState({ nameAsc: false })}
							/>
						</View>
					</View>
					<View style={[styles.subContainer,{borderTopWidth: 0, marginTop:20}]}>
						<TouchableOpacity
							activeOpacity={0.5}
							style={{
								flexDirection: "row",
								alignItems: "center",
								padding: 10,
								borderRadius:10,
								backgroundColor: "green"
							}}
						>
							<Icon color="white" name="done" size={30} />
							<Text style={{marginLeft: 5, color: "white", fontSize: 18}}>Confirm</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "white",
	},
	categoryHeader: {
		color: "green",
		marginLeft: 20,
		marginTop: 20
	},
	subContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "gray",
		flexDirection: "row"
	},
	categoryContent: {
		flexDirection: "column",
		marginTop: 20
	},
	categoryContentLabel: {
		margin: 10,
		fontSize: 18
	},
	checkBoxContainer: {
		backgroundColor: "transparent",
		marginTop: 20,
		width: 150,
		borderWidth: 1,
		borderColor: "lightgray"
	},
	picker: {
		height: 50,
		width: 320
	}
});
