import React from "react";
import {
	ActivityIndicator,
	AsyncStorage,
	AppRegistry,
	StyleSheet,
	View,
	Text
} from "react-native";

export default class AuthLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		//za slučaj da se krivo ulogiras koristi ovo
		// AsyncStorage.removeItem("userToken");
		const userToken = await AsyncStorage.getItem("userToken");

		this.props.navigation.navigate(userToken ? "App" : "Auth");
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
