import React, { Component } from "react";
import {
	View,
	AppRegistry,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
	Modal
} from "react-native";
import { Text, Icon } from "react-native-elements";

const { height, width } = Dimensions.get("window");

export default class ErrorDialog extends Component {
	constructor(props) {
		super();
		this.state = {
			modalVisible: props.visible,
			errorMessage: ""
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible && nextProps.message != "") {
			this.setErrorDialogVisible(nextProps.visible);
			this.setState({ errorMessage: nextProps.message });
		}
	}

	setErrorDialogVisible(visible) {
		if (this.state.modalVisible != visible)
			this.setState({ modalVisible: visible });
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
							<Text h3 style={{ marginTop: 10 }}>
								Error
							</Text>
							<Icon
								containerStyle={{ marginTop: 5 }}
								name="alert-decagram"
								type="material-community"
								size={35}
								color="red"
							/>
						</View>
						<View style={styles.main}>
							<Text style={{ fontSize: 16 }}>{this.props.message} </Text>
						</View>
						<View style={styles.footer}>
							<TouchableHighlight
								onPress={() => {
									this.setErrorDialogVisible(false);
								}}
							>
								<Text style={{ color: "green", fontSize: 22 }}>CLOSE</Text>
							</TouchableHighlight>
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
		width: width * 0.8,
		height: height * 0.6,
		backgroundColor: "white"
	},
	header: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginLeft: 25,
		marginRight: 25
	},
	main: {
		flex: 2,
		justifyContent: "space-evenly",
		alignItems: "flex-start",
		marginLeft: 10,
		marginRight: 10,
		borderTopColor: "black",
		borderTopWidth: 1
	},
	footer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginRight: 50,
		marginBottom: 25
	}
});

AppRegistry.registerComponent("ErrorDialog", () => ErrorDialog);
