import { View, Text } from "react-native"
import { Pressable, Animated } from "react-native";
import { Icon } from "react-native-elements";
import { useEffect, useRef, useState } from "react";

export default function Chip({ text, interestInputOpacity, saveOpacity, onChangeInterests, interests, index }) {
    const chipWidth = useRef(new Animated.Value(0)).current;
    const chipContentOpacity = useRef(new Animated.Value(0)).current;
    const chipOpacity = useRef(new Animated.Value(0)).current;

    const [showChip, setShowChip] = useState(false);
    const [timeForDel, setTimeForDel] = useState(false);

    const pressRef = useRef(null)
    const widthRef = useRef(null)

    return (<>
        <Pressable ref={pressRef} style={{ zIndex:0,position: 'absolute', flexDirection: 'row', alignItems: 'center', opacity: 0 }} onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout
            if (!timeForDel) {

                Animated.timing(chipOpacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false
                }).start()
                Animated.timing(chipWidth, {
                    toValue: width + 30,
                    duration: 300,
                    useNativeDriver: false
                }).start(() => {
                    setShowChip(true)
                    Animated.timing(chipContentOpacity, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: false
                    }).start()
                })
            }




        }}>
            <Text style={{ textAlign: 'center', color: 'rgba(111,111,111,1)', marginRight: 5, fontWeight: 'bold' }}>{text}</Text>
            <Icon size={18} name='close' color={'rgba(111,111,111,1)'}></Icon>
        </Pressable >
        <Animated.View key={index} style={{
            opacity: chipOpacity,
            borderRadius: 25, padding: 15, marginRight: 10, marginTop: 10, backgroundColor: '#e0e0e0', shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            // Android
            elevation: 3,
            width: chipWidth

        }}>
            <Pressable style={{  overflow: 'hidden',zIndex:3 }} onPress={() => {
                console.log('test')
                Animated.timing(interestInputOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false
                }).start()
                // const arr = JSON.parse(JSON.stringify(interests))
                // const i = arr.findIndex(item => item == text);
                // if (i > -1)
                //     arr.splice(i, 1)
                // console.log('DELETED', arr)
                // Animated.timing(chipContentOpacity, {
                //     toValue: 0,
                //     duration: 300,
                //     useNativeDriver: false
                // }).start(() => {
                //     setTimeForDel(true)
                //     setShowChip(false)

                //     Animated.timing(chipWidth, {
                //         toValue: 0,
                //         duration: 100,
                //         useNativeDriver: false
                //     }).start(() => {
                //         onChangeInterests(arr)
                //     })
                //     Animated.timing(chipOpacity, {
                //         toValue: 0,
                //         duration: 100,
                //         useNativeDriver: false
                //     }).start(() => {
                //     })
                // })

                // if (arr.length == 0) {
                //     Animated.timing(saveOpacity, {
                //         toValue: 0,
                //         duration: 250,
                //         useNativeDriver: false,

                //     }).start()
                // }
                const arr = JSON.parse(JSON.stringify(interests))
                const i = arr.findIndex(item => item == text);
                if (i > -1)
                    arr.splice(i, 1)
                onChangeInterests(arr)

            }}>
                <Animated.View style={[{ flexDirection: 'row', opacity: chipContentOpacity, alignItems: "center" }, !showChip && { display: 'none' }]}>
                    <Text style={{ textAlign: 'center', color: 'rgba(111,111,111,1)', marginRight: 5, fontWeight: 'bold', overflow: 'hidden' }}>{text}</Text>

                    <Icon size={18} name='close' color={'rgba(111,111,111,1)'}></Icon>
                </Animated.View>
            </Pressable >

        </Animated.View>
    </>)
}