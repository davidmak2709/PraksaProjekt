import React from "react";
import {
	ActivityIndicator,
	AsyncStorage,
	AppRegistry,
	StyleSheet,
	View,
	Text
} from "react-native";
import { connect } from "react-redux";
import { setWallets } from "../../redux/actions";

class AuthLoadingScreen extends React.Component {
	static userToken;
	constructor(props) {
		super(props);
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		userToken = await AsyncStorage.getItem("userToken");

		if (userToken) {
			this._getUserWallets();
			this.props.navigation.navigate("App");
		} else {
			this.props.navigation.navigate("Auth");
		}
	};

	_getUserWallets = () => {
		fetch("http://46.101.226.120:8000/api/wallets/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + userToken
			}
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.setWallets(responseJson);
			})
			.catch(error => {
				console.error(error);
			});
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 32, margin: 5, color: "green" }}>
					Mobile Budget
				</Text>
				<ActivityIndicator size="large" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

function mapStateToProps(state) {
	return {
		wallets: state.wallets
	};
}
export default connect(	mapStateToProps,	{ setWallets })(AuthLoadingScreen);
