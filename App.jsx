import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	TextInput,
	Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { TabBar, TabView } from 'react-native-tab-view';
import { Picker } from '@react-native-community/picker';
import convert from 'convert-units';
import { SimpleLineIcons } from '@expo/vector-icons';

const measures = convert().measures();
const mainColor = '#052F5F';

const unCamelCase = (value) => {
	return value.replace(/([A-Z])/g, ' $1');
};

// MeasureView component
const MeasureView = ({ measure, value, setValue }) => {
	const units = convert().possibilities(measure);
	const [fromUnit, setFromUnit] = useState(units[0]);
	const [toUnit, setToUnit] = useState(units[1]);

	const [valueConverted, setValueConverted] = useState(0);

	useEffect(() => {
		setValueConverted(convert(value).from(fromUnit).to(toUnit).toFixed(2));
	}, [value, fromUnit, toUnit]);

	return (
		<View style={styles.scene}>
			{/* From Unit Container */}
			<View style={styles.row}>
				<Picker
					style={styles.column}
					selectedValue={fromUnit}
					onValueChange={setFromUnit}
				>
					{units.map((unit, index) => {
						return <Picker.Item label={unit} value={unit} key={index} />;
					})}
				</Picker>
				<View style={styles.column}>
					<TextInput
						style={styles.input}
						value={value}
						onChangeText={setValue}
					/>
				</View>
			</View>
			<SimpleLineIcons
				name='arrow-down-circle'
				size={40}
				color={mainColor}
				style={{ alignSelf: 'center' }}
			/>
			{/* To unit container */}
			<View style={styles.row}>
				<Picker
					style={styles.column}
					selectedValue={toUnit}
					onValueChange={setToUnit}
				>
					{units.map((unit, index) => {
						return <Picker.Item label={unit} value={unit} key={index} />;
					})}
				</Picker>
				<View style={styles.column}>
					<Text style={[styles.input, { fontSize: 40, fontWeight: 'bold' }]}>
						{valueConverted}
					</Text>
				</View>
			</View>
		</View>
	);
};

// Main Application component
const App = () => {
	const [index, setIndex] = useState(0);
	const [value, setValue] = useState('0');
	const [routes] = useState(
		measures.map((measure) => ({ key: measure, title: unCamelCase(measure) }))
	);

	const renderScene = ({ route }) => (
		<MeasureView measure={route.key} value={value} setValue={setValue} />
	);

	return (
		<View style={[styles.scene, { marginTop: Constants.statusBarHeight }]}>
			<Text style={styles.title}>Unit converter</Text>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: Dimensions.get('window').width }}
				renderTabBar={(props) => {
					return (
						<TabBar
							{...props}
							scrollEnabled
							tabStyle={{ width: 'auto' }}
							indicatorStyle={{ backgroundColor: 'white' }}
							style={{ backgroundColor: mainColor }}
						/>
					);
				}}
			></TabView>
			<StatusBar style='auto' />
		</View>
	);
};

export default App;

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	},
	title: {
		padding: 15,
		fontWeight: 'bold',
		color: mainColor,
		fontSize: 20,
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	column: {
		flex: 1,
		marginLeft: 20,
		marginRight: 20,
	},
	input: {
		height: 40,
		borderColor: mainColor,
		borderBottomWidth: 1,
		fontSize: 30,
		textAlign: 'center',
	},
});
