import { TextInput, Animated, Pressable, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import axios from "axios";
import api from "./api";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Chip from "./chip";
import { db } from './firebase';
export default function SettingsMenu({ menuOpacity, onChangeName, onChangeInterestText, onChangeInterests, interestText, interests, name, menuOpen, setMenuOpen, newUser, loggedIn, setNewUser, showSettings, setLoggedIn, setLogoutAnim }) {
    const inputColor = useRef(new Animated.Value(0)).current;
    const interestsColor = useRef(new Animated.Value(0)).current;
    const [selectedScreen, setSelectedScreen] = useState('Account');
    const [feedback, onChangeFeedback] = useState('');
    const [showAccountSettings, setShowAccountSettings] = useState(false);

    const [ogName, setOgName] = useState(name);
    const [ogInterests, setOgInterests] = useState(interests);
    const nameHeight = useRef(new Animated.Value(.3 * Dimensions.get('window').height)).current;
    const interestsHeight = useRef(new Animated.Value(.3 * Dimensions.get('window').height)).current;
    const interestsOpacity = useRef(new Animated.Value(0)).current;
    const interestInputOpacity = useRef(new Animated.Value(1)).current;
    const ellipsesOpacity = useRef(new Animated.Value(1)).current;
    const ellipsesButtonOpacity = useRef(new Animated.Value(0)).current;

    const accountSettingsHeight = useRef(new Animated.Value(.22 * Dimensions.get('window').height)).current;
    const accountSettingsSize = useRef(new Animated.Value(40)).current;
    const accountSettingsOpacity = useRef(new Animated.Value(0)).current;



    const navX = useRef(new Animated.Value(.4 * Dimensions.get('window').width)).current;
    const navWidth = useRef(new Animated.Value(.4 * Dimensions.get('window').width)).current;

    const saveOpacity = useRef(new Animated.Value(0)).current;

    const icolorloop = useRef(null);
    useEffect(() => {
        if (selectedScreen == 'Account') {
            Animated.timing(navX, {
                toValue: .4 * Dimensions.get('window').width,
                duration: 200,
                useNativeDriver: false
            }).start()
            Animated.timing(ellipsesButtonOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }).start()
            Animated.sequence([
                Animated.timing(navWidth, {
                    toValue: .55 * Dimensions.get('window').width + 5,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(navWidth, {
                    toValue: .4 * Dimensions.get('window').width + 5,
                    duration: 100,
                    useNativeDriver: false
                }),
            ]).start()
        } else if (selectedScreen == 'Feedback') {
            Animated.timing(navX, {
                toValue: 5,
                duration: 250,
                useNativeDriver: false
            }).start()
            Animated.sequence([
                Animated.timing(navWidth, {
                    toValue: .55 * Dimensions.get('window').width + 5,
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(navWidth, {
                    toValue: .4 * Dimensions.get('window').width + 5,
                    duration: 100,
                    useNativeDriver: false
                }),
            ]).start()
        }
    }, [selectedScreen])
    function enterField(field, height) {
        Animated.timing(field, {
            toValue: height * Dimensions.get('window').height,
            duration: 250,
            useNativeDriver: false,

        }).start()
    }
    function saveAppear() {
        Animated.timing(saveOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,

        }).start()
    }
    function hideEllipseButton() {
        Animated.timing(ellipsesButtonOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
        }).start()
    }
    var color = inputColor.interpolate({
        inputRange: [0, 300],
        outputRange: ['rgba(111, 111, 111, .5)', 'rgba(222, 150, 150, 1)']
    });
    var icolor = interestsColor.interpolate({

        inputRange: [0, 300],
        outputRange: ['rgba(111, 111, 111, .5)', 'rgba(222, 150, 150, 1)']
    });

    function closeAccountSettings() {
        {
            Animated.timing(accountSettingsHeight, {
                toValue: .22 * Dimensions.get('window').height,
                duration: 200,
                useNativeDriver: false
            }).start()
            Animated.timing(accountSettingsSize, {
                toValue: 40,
                duration: 200,
                useNativeDriver: false
            }).start()
            Animated.timing(ellipsesOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            }).start()
            // Animated.timing(ellipsesButtonOpacity, {
            //     toValue: 0,
            //     duration: 200,
            //     useNativeDriver: false
            // }).start()
            Animated.timing(accountSettingsOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start()
            Animated.timing(menuOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            }).start()
            setShowAccountSettings(false)
        }
    }

    return (<>
        {!newUser && <Animated.View style={{ opacity: menuOpacity, flexDirection: 'row', position: 'absolute', top: .07 * Dimensions.get('window').height, borderWidth: 1, borderColor: 'rgba(111,111,111,1)', borderRadius: 20, padding: 5 }}>
            <Animated.View style={[{ right: navX, borderRadius: 20, backgroundColor: '#e0e0e0', height: .08 * Dimensions.get('window').height, flexDirection: 'row', alignItems: 'center', width: navWidth, alignContent: 'center', justifyContent: 'center', },
            {
                position: 'absolute',
                top: 5,
                zIndex: 1,
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,


                // Android
                elevation: 3,
            }
            ]} ></Animated.View>

            <Pressable style={[{ zIndex: 2, borderRadius: 20, height: .08 * Dimensions.get('window').height, flexDirection: 'row', alignItems: 'center', width: .4 * Dimensions.get('window').width, alignContent: 'center', justifyContent: 'center', }
            ]} onPress={() => {
                setSelectedScreen('Account')
            }}>
                <Icon
                    color={'rgba(111,111,111,1)'}
                    name={'person-outline'}
                    type="ionicon"
                    style={{ marginRight: 5 }}
                />
                <Text style={{
                    textAlign: 'center',
                    color: 'rgba(111,111,111,1)',
                    fontWeight: "bold"
                }}> Account </Text>
            </Pressable>
            <Pressable style={[{ zIndex: 1, borderRadius: 20, flexDirection: 'row', alignItems: 'center', width: .4 * Dimensions.get('window').width, justifyContent: 'center', }]}
                onPress={() => {
                    setSelectedScreen('Feedback')
                }}
            >
                <Icon
                    color={'rgba(111,111,111,1)'}
                    name={'chatbubble-ellipses-outline'}
                    type="ionicon"
                    style={{ marginRight: 5 }}
                />
                <Text style={{
                    textAlign: 'center',
                    color: 'rgba(111,111,111,1)',
                    fontWeight: "bold"
                }}> Feedback</Text>
            </Pressable>
        </Animated.View >}
        {
            selectedScreen == 'Account' && <>{
                !newUser &&
                <Animated.View style={{
                    zIndex: 2,
                    backgroundColor: "#e0e0e0", shadowColor: '#000',
                    width: accountSettingsSize,
                    height: accountSettingsSize,
                    opacity: ellipsesButtonOpacity,

                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    borderRadius: 50,
                    // Android
                    elevation: 3,

                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',

                    bottom: accountSettingsHeight,

                }} >

                    <Animated.View style={{
                        opacity: ellipsesOpacity, flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'center', position: 'absolute',


                    }}>
                        <Icon

                            color={'rgba(111,111,111,1'}
                            name={'ellipsis-vertical-outline'}
                            type="ionicon"
                            size={15}

                        />
                    </Animated.View>
                    <Pressable style={[{
                        zIndex: 2,

                        // Android
                        elevation: 3,

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '15%',
                        left: '15%',

                    }, !showAccountSettings && { display: 'none' }]}
                        onPress={() => {
                            closeAccountSettings()
                        }}
                    >
                        <Icon

                            color={'rgba(111,111,111,1'}
                            name={'close'}
                            type="ionicon"
                            size={20}

                        />
                    </Pressable>
                    <Animated.View style={[{
                        zIndex: 3,
                        flexDirection: 'column', opacity: accountSettingsOpacity,
                        position: 'absolute',
                        top: '30%'
                    }, !showAccountSettings && { display: 'none' }]}>
                        <Pressable style={{
                            zIndex: 4,
                            border: 2,
                            borderColor: 'black',
                            width: 120,
                            // Android
                            elevation: 3,

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                            onPress={() => {
                                closeAccountSettings()
                                setLogoutAnim(true)
                                hideEllipseButton()
                                onChangeName(ogName); onChangeInterests(ogInterests);
                            }}
                        >
                            <View style={{ transform: [{ rotate: '180deg' }] }}>
                                <Icon

                                    color={'rgba(111,111,111,1'}
                                    name={'log-out-outline'}
                                    type="ionicon"
                                    size={15}


                                />
                            </View>
                            <Text style={{ fontWeight: 'bold' }}> Logout</Text>
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[{
                        zIndex: 3,
                        flexDirection: 'column', opacity: accountSettingsOpacity,
                        position: 'absolute',
                        bottom: '30%'
                    }, !showAccountSettings && { display: 'none' }]}>

                        <Pressable style={{
                            zIndex: 4,
                            border: 2,
                            borderColor: 'black',
                            width: 120,
                            // Android
                            elevation: 3,

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',


                        }}
                            onPress={() => {
                                loggedIn.user.getIdToken().then(token =>
                                    axios.delete(`${api}users/${loggedIn.user.uid}`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
                                        closeAccountSettings()
                                        setLogoutAnim(true)
                                        hideEllipseButton()
                                        onChangeName(ogName);
                                        onChangeInterests(ogInterests);
                                    }))
                            }
                            }>
                            <Icon

                                color={'rgba(222, 100, 100, 1)'}
                                name={'trash'}
                                type="ionicon"
                                size={15}


                            />
                            <Text style={{ color: 'rgba(222, 100, 100, 1)', fontWeight: 'bold' }}> Delete Account</Text>
                        </Pressable>
                    </Animated.View>

                    <Pressable style={{
                        width: '100%',
                        height: '100%'
                    }} onPress={() => {
                        setShowAccountSettings(true)
                        Animated.timing(accountSettingsHeight, {
                            toValue: .40 * Dimensions.get('window').height,
                            duration: 200,
                            useNativeDriver: false
                        }).start()
                        Animated.timing(accountSettingsSize, {
                            toValue: .3 * Dimensions.get('window').height,
                            duration: 200,
                            useNativeDriver: false
                        }).start()
                        Animated.timing(ellipsesOpacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false
                        }).start()

                        Animated.timing(accountSettingsOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: false
                        }).start()
                        Animated.timing(menuOpacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false
                        }).start()

                    }}>


                    </Pressable>

                </Animated.View >
            }

                <Animated.View style={{ zIndex: 3, opacity: menuOpacity, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: '7%' }}>
                    {!newUser && <Pressable style={{
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
                        borderRadius: 50,
                        // Android
                        elevation: 3,


                        flexDirection: 'row',
                        alignItems: 'center',
                    }} onPress={() => {
                        showSettings()
                        setMenuOpen(false)
                        onChangeName(ogName); onChangeInterests(ogInterests);
                    }}>
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
                    </Pressable>}
                    <Animated.View style={{ zIndex: 3, opacity: newUser ? saveOpacity : 1 }}>
                        <Pressable style={{
                            backgroundColor: "rgba(111,111,111,1)", shadowColor: '#000',
                            width: 100,
                            padding: 20,
                            marginLeft: (newUser ? 0 : 10),
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            borderRadius: 50,
                            // Android
                            elevation: 3,


                            flexDirection: 'row',
                            alignItems: 'center',
                        }} onPress={() => {
                            if (name != '' && interests.length > 0) {
                                loggedIn.user.getIdToken().then(token =>
                                    axios.patch(`${api}users/${loggedIn.user.uid}`, { name: name, interests: interests }, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
                                        showSettings()

                                        setMenuOpen(false);
                                        setNewUser(false)
                                    }))


                            }
                            else {
                                if (name == '')
                                    Animated.loop(Animated.sequence([Animated.timing(inputColor, {
                                        toValue: 300,
                                        duration: 1000,
                                        useNativeDriver: false,
                                    }), Animated.timing(inputColor, {
                                        toValue: 0,
                                        duration: 1000,
                                        useNativeDriver: false,
                                    })])).start()
                                if (interests.length == 0) {
                                    icolorloop.current = Animated.loop(Animated.sequence([Animated.timing(interestsColor, {
                                        toValue: 300,
                                        duration: 1000,
                                        useNativeDriver: false,
                                    }), Animated.timing(interestsColor, {
                                        toValue: 0,
                                        duration: 1000,
                                        useNativeDriver: false,
                                    })]))
                                    icolorloop.current.start()
                                }


                            }

                        }}>
                            <Icon
                                color={'#e0e0e0'}
                                name={'save'}
                                type="font-awesome"
                                style={{ marginRight: 5 }}
                            />
                            <Text style={{
                                textAlign: 'center',
                                color: '#e0e0e0',
                                fontWeight: "bold"
                            }}> Save</Text>
                        </Pressable>
                    </Animated.View>

                </Animated.View ></>
        }
        {
            selectedScreen == 'Account' && <Animated.View style={{ opacity: menuOpacity, position: 'absolute', top: 0, alignItems: 'center', }}>
                <Animated.View style={{
                    backgroundColor: '#e0e0e0',
                    borderWidth: 0, borderColor: color, borderRadius: 20, alignItems: 'center', position: 'absolute', top: newUser ? nameHeight : .22 * Dimensions.get('window').height, zIndex: 1, shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: .2,
                    shadowRadius: 2.22,
                    borderRadius: 30,
                    // Android
                    elevation: 3,
                    padding: 5
                }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeName}
                        value={name}
                        placeholder='First Name'

                        textAlign='center'
                        disabled={!menuOpen}
                        onSubmitEditing={() => {
                            enterField(nameHeight, .15)
                            Animated.timing(interestsOpacity, {
                                toValue: 1,
                                duration: 250,
                                useNativeDriver: false,

                            }).start()
                        }}

                    />
                </Animated.View>
                <Animated.View style={{ alignItems: 'center', position: 'absolute', top: newUser ? interestsHeight : .36 * Dimensions.get('screen').height, opacity: newUser ? interestsOpacity : 1, zIndex: 0 }}>

                    <Text style={{ marginBottom: 25, fontWeight: 'bold', color: 'rgba(111,111,111,1)' }}>Enter up to 5 interests</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width, marginBottom: 10, }}>

                        {interests.map((i, index) => <Chip key={index} index={index} text={i} interests={interests} onChangeInterests={onChangeInterests} saveOpacity={saveOpacity} interestInputOpacity={interestInputOpacity}></Chip>)}
                    </View>
                    <Animated.View style={{ opacity: interestInputOpacity }}>
                        <Animated.View style={{ borderBottomWidth: 3, borderBottomColor: icolor }}>
                            <TextInput
                                style={styles.input}
                                placeholder='Interests'
                                textAlign='center'
                                maxLength={15}
                                editable={interests.length != 5}
                                onSubmitEditing={() => {
                                    if (interests.length < 5 && !interests.includes(interestText) && interestText != '') {
                                        var arr = interests.concat([interestText])
                                        // onChangeInterests(arr)
                                        onChangeInterestText('')

                                        saveAppear()
                                        if (arr.length == 5) {
                                            Animated.timing(interestInputOpacity, {
                                                toValue: 0,
                                                duration: 250,
                                                useNativeDriver: false
                                            }).start(() => {
                                                onChangeInterests(arr)
                                            })
                                        }
                                        else {
                                            onChangeInterests(arr)
                                            Animated.timing(interestInputOpacity, {
                                                toValue: 1,
                                                duration: 500,
                                                useNativeDriver: false
                                            }).start()
                                        }

                                    }



                                }}
                                onChangeText={onChangeInterestText}
                                value={interestText} />

                        </Animated.View>

                    </Animated.View>

                </Animated.View>

            </Animated.View >
        }
        {
            selectedScreen == 'Feedback' &&
            <View style={{ position: 'absolute', top: .25 * Dimensions.get('screen').height, alignItems: 'center' }}>
                <Animated.View style={{
                    backgroundColor: '#e0e0e0',
                    borderWidth: 0, borderColor: color, borderRadius: 20, alignItems: 'center', height: 200, zIndex: 1, shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: .2,
                    shadowRadius: 2.22,
                    borderRadius: 30,
                    // Android
                    elevation: 3,
                    padding: 10

                }}>
                    <TextInput
                        style={[styles.input, { height: 200 }]}
                        multiline={true}
                        placeholder='Feedback'
                        disabled={true}
                        textAlign="center"
                        maxLength={200}
                        blurOnSubmit={true}
                        onChangeText={onChangeFeedback}
                        value={feedback}
                    />

                </Animated.View>
                <Pressable style={{

                    backgroundColor: "rgba(111,111,111,1)", shadowColor: '#000',
                    width: 130,

                    padding: 20,
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    borderRadius: 50,
                    // Android
                    elevation: 3,

                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 40
                }} onPress={() => {
                    db.collection('feedback').add({ feedback }).then(ref => {
                        showSettings()
                        setMenuOpen(false)
                        onChangeName(ogName); onChangeInterests(ogInterests);
                    }
                    )

                }}>
                    <Icon
                        color={'#e0e0e0'}
                        name={'checkmark-outline'}
                        type="ionicon"
                        style={{ marginRight: 5 }}
                    />
                    <Text style={{
                        textAlign: 'center',
                        color: '#e0e0e0',
                        fontWeight: "bold"
                    }}> Submit </Text>
                </Pressable>
            </View >
        }
    </>)
}
const styles = StyleSheet.create({
    input: {
        width: (.13 * (Dimensions.get('window').width + 1400)),
        fontSize: (.01 * (Dimensions.get('window').width + 1400)),

        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,

        padding: 10,
        color: 'rgba(111, 111, 111, 1)',

    },
})