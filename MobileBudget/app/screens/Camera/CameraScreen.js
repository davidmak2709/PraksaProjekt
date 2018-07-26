import React, { Component } from "react";
import { AppRegistry, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Text, Button } from "react-native-elements";
import { RNCamera } from "react-native-camera";
import { width, height } from "../../constants";

export default class CameraScreen extends Component<Props> {
	constructor() {
		super();

		this.state = {
			currency: "",
			name: "",
			amount: "",
			scan: false
		};
	}

	_goBack = () => {
		this.props.navigation.state.params.returnData(
			this.state.name,
			parseFloat(this.state.amount),
			this.state.currency
		);
		this.props.navigation.goBack();
	};

	render() {
		let subView = null;
		if (this.state.scan) {
			subView = (
				<View>
					<View style={{ flexDirection: "row" }}>
						<Text style={[styles.capture, { color: "green" }]} h4>
							Name:
						</Text>
						<Text style={[styles.capture, { color: "black", fontSize: 18 }]}>
							{this.state.name}
						</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<Text style={[styles.capture, { color: "green" }]} h4>
							Currency:
						</Text>
						<Text style={[styles.capture, { color: "black", fontSize: 18 }]}>
							{this.state.currency}
						</Text>
					</View>
					<View style={{ flexDirection: "row" }}>
						<Text style={[styles.capture, { color: "green" }]} h4>
							Amount:
						</Text>
						<Text style={[styles.capture, { color: "black", fontSize: 18 }]}>
							{this.state.amount}
						</Text>
					</View>
					<View>
						<Button
							backgroundColor="white"
							buttonStyle={styles.confirmButton}
							containerStyle={{ borderRadius: 25, borderColor: "green" }}
							title="CONFIRM"
							color="green"
							fontSize={18}
							icon={{ name: "done", size: 20, color: "green" }}
							onPress={this._goBack.bind(this)}
						/>
					</View>
				</View>
			);
		} else {
			subView = (
				<View>
					<Text style={[styles.capture, { color: "black", fontSize: 18 }]}>
						Scanning...
					</Text>
          <View style = {{padding : 50}}>
            <ActivityIndicator size = "large" color = "green" />
          </View>
        </View>
			);
		}

		return (
			<View style={styles.container}>
				<RNCamera
					ref={ref => {
						this.camera = ref;
					}}
					style={styles.preview}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.off}
					permissionDialogTitle={"Permission to use camera"}
					permissionDialogMessage={
						"We need your permission to use your camera phone"
					}
					onBarCodeRead={this._barCode.bind(this)}
					barCodeTypes={[RNCamera.Constants.BarCodeType.pdf417]}
				/>
				<View
					style={{
						height: height * 0.5,
						width: width,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{subView}
				</View>
			</View>
		);
	}

	_barCode(e) {
		var array = e.data.split("\n");
		if (!this.state.scan)
			this.setState({
				currency: array[1],
				name: array[13],
				amount: parseInt(array[2]) / 100,
				scan: true
			});
	}
}

const styles = StyleSheet.create({
	container: {
		height: height * 0.5,
		flexDirection: "column"
	},
	preview: {
		height: height * 0.25,
		justifyContent: "flex-end",
		alignItems: "center"
	},
	capture: {
		backgroundColor: "transparent",
		borderRadius: 5,
		paddingHorizontal: 20,
		alignSelf: "center"
	},
	confirmButton: {
		height: 50,
		marginTop: 50,
		marginBottom: 20,
		borderRadius: 25,
		borderColor: "green",
		borderWidth: 1
	}
});
