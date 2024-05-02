import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Animated, Dimensions } from 'react-native';
import transform from 'css-to-react-native';
import { useState, useRef, useEffect } from 'react';
import DropShadow from "react-native-drop-shadow";
import { LinearGradient } from 'expo-linear-gradient';
import { RadialGradient } from 'react-native-gradients';
export default function App() {
  const [buttonState, setButtonState] = useState(styles.initButton)

  const colorList = [
    { offset: '75%', color: '#00ff00', opacity: '1' },
    { offset: '100%', color: '#e0e0e0', opacity: '1' }
  ]
  const colorList3 = [
    { offset: '60%', color: '#ff5050', opacity: '1' },
    { offset: '100%', color: '#e0e0e0', opacity: '.08' }
  ]
  const shadow1width = useRef(new Animated.Value(5)).current;
  const shadow1height = useRef(new Animated.Value(5)).current;
  const shadow2width = useRef(new Animated.Value(-10)).current;
  const shadow2height = useRef(new Animated.Value(-10)).current;
  const stopOpacity = useRef(new Animated.Value(0)).current;
  const shadow2opacity = useRef(new Animated.Value(0)).current;

  const shadow1Radius = useRef(new Animated.Value(10)).current;
  const shadow1Color = useRef(new Animated.Value(0)).current;
  const color = shadow1Color.interpolate({
    inputRange: [0, 1],
    outputRange: ['#bebebe', '#00ff00']
  });
  const spinVal = useRef(new Animated.Value(0)).current;
  const spin = spinVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })
  let gshadow
  const AnimatedDropShadow = Animated.createAnimatedComponent(DropShadow);
  const startSpin = () => {
    Animated.timing(shadow2opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()

    gshadow = Animated.loop(
      Animated.sequence(

        [Animated.timing(shadow1Color, {
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }), Animated.timing(shadow1height, {
          toValue: -5,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(shadow1width, {
          toValue: -5,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(shadow1height, {
          toValue: 5,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(shadow1width, {
          toValue: 5,
          duration: 250,
          useNativeDriver: false,
        }),


        ]
      ))
    gshadow.start()
  };
  const startSpinOpp = () => {

    Animated.loop(
      Animated.sequence(

        [
          Animated.timing(shadow2height, {
            toValue: 10,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(shadow2width, {
            toValue: 10,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(shadow2height, {
            toValue: -10,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(shadow2width, {
            toValue: -10,
            duration: 250,
            useNativeDriver: false,
          }),


        ]
      )).start()
  };

  const stopButton = () => {
    gshadow.stop()

    Animated.timing(shadow2opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
    Animated.sequence(
      [Animated.timing(stopOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(stopOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),



      ]
    ).start()

  };
  return (
    <View style={styles.container}>
      <Pressable
        style={{

        }}
        onPress={() => {
          if (shadow2opacity._value > 0) {
            stopButton()
          }
          else {
            startSpin()
            startSpinOpp()

          }
        }}>
        <View style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

          <Animated.View style={styles.initButton}>

          </Animated.View>
        </View >

        <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

          <Animated.View style={[styles.buttonGreenlight, { top: shadow2height, left: shadow2width, opacity: shadow2opacity }]}>
            {shadow2opacity != 0 && <RadialGradient x="50%" y="50%" rx="50%" ry="50%" colorList={colorList} />}

          </Animated.View>
        </View >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

          <Animated.View style={[styles.buttonShadow, { top: shadow1height, left: shadow1width }]}>
            <LinearGradient
              // Background Linear Gradient
              locations={[1, 1]}
              colors={['rgba(0,0,0,0.2)', 'transparent']}
              style={styles.buttonShadow}
            />
          </Animated.View>

        </View >

        <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

          <Animated.View style={[styles.stopButton, { opacity: stopOpacity }]}>
            <RadialGradient x="50%" y="50%" rx="50%" ry="50%" colorList={colorList3} />

          </Animated.View>
        </View >

      </Pressable>

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  initButton: {
    backgroundColor: '#e0e0e0',
    width: .39 * Dimensions.get('screen').height,
    height: .39 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,
    position: "absolute",
    zIndex: 1

  },
  buttonShadow: {
    width: .40 * Dimensions.get('screen').height,
    height: .40 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,
    overflow: 'hidden',
    zIndex: 0,



  },
  buttonGreenlight: {
    backgroundColor: '#00ff00',
    width: .41 * Dimensions.get('screen').height,
    height: .41 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,
    overflow: 'hidden',
    zIndex: 0


  },
  searchButton: {
    backgroundColor: '#e0e0e0',
    width: .41 * Dimensions.get('screen').height,
    height: .41 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,
    shadowColor: "#00ff00",
    shadowRadius: 10,
    shadowOpacity: .5

  },
  stopButton: {
    backgroundColor: '#e0e0e0',
    width: .5 * Dimensions.get('screen').height,
    height: .5 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,

  },

});
