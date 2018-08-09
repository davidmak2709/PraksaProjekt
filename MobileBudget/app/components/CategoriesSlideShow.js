import React, { Component } from "react";
import {
	View,
	AppRegistry,
	Dimensions,
	AsyncStorage,
	StyleSheet,
	ActivityIndicator,
	Image
} from "react-native";
import { Button, Divider, Text } from "react-native-elements";
import { height, width } from "../constants";
import { ICONS } from "../images";
import Swiper from "react-native-swiper";


export default class CategoriesSlideShow extends Component {
	static userToken;
	constructor() {
		super();
		this.state = {
			categories: [],
			isLoading: true,
			slides: []
		};
		this._bootstrapAsync();
		this.inArray = [];
	}

	componentWillMount() {
		this._getCategories();
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");
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
				this.setState({ categories: responseJson }, () => {
					this._statistic();
				});
			})
			.catch(error => {
				console.error(error);
			});
	};

	_statistic = () => {
		this.state.categories.map(x => {
			this._getCategoryStatistics(x[0], "in");
		});

		this.setState({ isLoading: false });
	};

	_getCategoryStatistics = (category, type) => {
		fetch(
			"http://46.101.226.120:8000/api/stats/categories/?category=" + category,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + userToken
				}
			}
		)
			.then(response => response.json())
			.then(data => {
				if (data[0].percentage_outcome != 0 || data[0].percentage_income != 0) {
					this._renderItem(data[0]);
				}
			})
			.catch(error => {
				console.error(error);
			});
	};

	_renderItem = data => {
		var string = data.category.replace("_", " ");
		string = string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();

		const item = (
			<View style={styles.slide} key={data.category}>
				<Text h4 style={{ color: "green" }}>
					{string}
				</Text>
				<Divider
					style={{
						width: 1,
						height: 30,
						backgroundColor: "transparent"
					}}
				/>
				<Image style={styles.image} source={ICONS[data.category]} />
				<View style={{ flexDirection: "row" }}>
					<View style={{ margin: 15, alignItems: "center" }}>
						<Text>Income</Text>
						<Text style={styles.textIn}>
							{parseFloat(data.percentage_income).toFixed(1)} %
						</Text>
					</View>
					<View style={{ margin: 15, alignItems: "center" }}>
						<Text>Outcome</Text>
						<Text style={styles.textOut}>
							{parseFloat(data.percentage_outcome).toFixed(1)} %
						</Text>
					</View>
				</View>
			</View>
		);
		this.setState({ slides: [...this.state.slides, item] });
	};

	render() {
		let content = <ActivityIndicator />;

		if (this.state.isLoading === false) {
			content = this.state.slides;
		}
		return (
			<View>
				<View
					style={{
						height: 280,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<View style={{ height: 250, width: width - 30 }}>
						<Swiper
							style={styles.wrapper}
							showsButtons={false}
							autoplay={true}
							autoplayTimeout={1}
							showsPagination={false}
						>
							{content}
						</Swiper>
					</View>
				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {},
	slide: {
		height: 250,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff"
	},
	textOut: {
		color: "red",
		fontSize: 30,
		fontWeight: "bold"
	},
	textIn: {
		color: "green",
		fontSize: 30,
		fontWeight: "bold"
	},
	image: {
		backgroundColor: "transparent",
		height: 70,
		width: 70
	}
});
