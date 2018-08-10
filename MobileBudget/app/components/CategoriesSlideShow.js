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

class CategoriesSlideShow extends Component {
	static userToken;
	constructor() {
		super();
		this.state = {
			categories: [],
			isLoading: true,
			slides: []
		};

		this._getCategories();
	}


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
			this._getCategoryStatistics(x[0]);
		});
	};

	_getCategoryStatistics = category => {
		fetch(
			"http://46.101.226.120:8000/api/stats/categories/?category=" + category,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + this.props.token
				}
			}
		)
			.then(response => response.json())
			.then(data => {
				if (data[0].percentage_outcome != 0 || data[0].percentage_income != 0) {
					this.setState({ slides: [...this.state.slides, data[0]] });
				}

				//gluplje ne moze :)
				if(data[0].category == "other"){
					this.setState({isLoading: false})
				}
			})
			.catch(error => {
				console.error(error);
			});
	};

	_renderItem = data => {
		var string = data.category.replace("_", " ");
		string = string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();

		return (
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
	};

	render() {
		if (this.state.isLoading === false) {
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
								showsButtons={true}
								autoplay={true}
								autoplayTimeout={5}
								showsPagination={false}
								nextButton={<Text style={styles.buttonText}>›</Text>}
								prevButton={<Text style={styles.buttonText}>‹</Text>}
							>
								{this.state.slides.map(x => this._renderItem(x))}
							</Swiper>
						</View>
					</View>
				</View>
			);
		} else {
			return (
				<View
					style={{
						height: 280,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<View style={[styles.slide, { height: 250, width: width - 30 }]}>
						<ActivityIndicator size="large" />
						<Text>Loading...</Text>
					</View>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	wrapper: {},
	slide: {
		height: 250,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "darkgray"
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
	},
	buttonText: {
		color: "green",
		fontSize: 60
	}
});

export default CategoriesSlideShow;
