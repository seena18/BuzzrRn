import { TextInput, Animated, Pressable, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import RadioGroup from 'react-native-radio-buttons-group';
import { useMemo, useState } from "react";
export default function ReportMenu({ menuOpacity, menuOpen, setMenuOpen, showSettings }) {
    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Option 1',
            value: 'option1'
        },
        {
            id: '2',
            label: 'Option 2',
            value: 'option2'
        }, {
            id: '3',
            label: 'Option 3',
            value: 'option3'
        }, {
            id: '4',
            label: 'Option 4',
            value: 'option4'
        }
    ]), []);
    const [selectedId, setSelectedId] = useState();

    return (<><Animated.View style={{ opacity: menuOpacity, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: '10%' }}>
        <Pressable style={{
            backgroundColor: "#e0e0e0", shadowColor: '#000',
            width: 100,
            marginRight: 10,
            padding: 20,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            borderRadius: 10,
            // Android
            elevation: 3,


            flexDirection: 'row',
            alignItems: 'center',
        }} onPress={() => { setMenuOpen(false); showSettings() }}>
            <Icon
                color={'rgba(111,111,111,1)'}
                name={'close'}
                type="font-awesome"
                style={{ marginRight: 5 }}
            />
            <Text style={{
                textAlign: 'center',
                color: 'rgba(111,111,111,1)',
                fontWeight: "bold"
            }}> Close</Text>
        </Pressable>
        <Pressable style={{
            backgroundColor: "rgba(111,111,111,1)", shadowColor: '#000',
            width: 125,
            padding: 20,
            marginLeft: 10,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            borderRadius: 10,
            // Android
            elevation: 3,


            flexDirection: 'row',
            alignItems: 'center',
        }} onPress={() => {
            compressMenu();

        }}>
            <Icon
                color={'#e0e0e0'}
                name={'flag'}
                type="ion-icons"
                style={{ marginRight: 5 }}
            />
            <Text style={{
                textAlign: 'center',
                color: '#e0e0e0',
                fontWeight: "bold"
            }}> Report</Text>
        </Pressable>
    </Animated.View>
        <Animated.View style={{ opacity: menuOpacity, flexDirection: 'column', position: 'absolute', top: '5%', padding: 30, justifyContent: 'center' }}>
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                color: 'rgba(111,111,111,1)'
            }}>Report the last user you connected with?</Text>
            <Text style={{
                marginTop: 20,
                fontSize: 16,
                color: 'rgba(111,111,111,1)'
            }}>This will submit a report for the following user:</Text>

            <Text style={{
                marginTop: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: 'rgba(111,111,111,1)'
            }}>(INSERT USER NAME)</Text>
            <View style={{ flexDirection: 'column' }}>
                <Text style={{
                    marginTop: 30,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: 'rgba(111,111,111,1)'
                }}>Report user for: </Text>
                <RadioGroup
                    containerStyle={{ alignItems: 'baseline', marginTop: 20, marginLeft: 20 }}
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                />
            </View>
        </Animated.View>
    </>)
}
const styles = StyleSheet.create({
    input: {
        width: (.13 * (Dimensions.get('window').width + 1400)),
        fontSize: (.01 * (Dimensions.get('window').width + 1400)),
        marginTop: "3%",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,

        borderWidth: 2,
        padding: 10,
        color: 'rgba(111, 111, 111, 1)',
        borderColor: 'rgba(111, 111, 111, 1)',
    }
})