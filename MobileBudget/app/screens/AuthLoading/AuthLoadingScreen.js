import React from "react";
import {
	ActivityIndicator,
	AsyncStorage,
	AppRegistry,
	StatusBar,
	StyleSheet,
	View
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
				<ActivityIndicator />
				<StatusBar barStyle="default" />
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
