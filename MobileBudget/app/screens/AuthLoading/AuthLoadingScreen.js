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
			.then(response => {
				const statusCode = response.status;
				const data = response.json();
				return Promise.all([statusCode, data]);
			})
			.then(([res, data]) => {
				if (res == 200) {
					this.props.setWallets(data);
					this.props.navigation.navigate("App");
				}
			})
			.catch(error => {
				Alert.alert("Error","No Internet connection");
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
		wallets: state.wallets,
	};
}
export default connect(
	mapStateToProps,
	{ setWallets }
)(AuthLoadingScreen);
