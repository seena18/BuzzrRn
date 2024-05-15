import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, Animated, Dimensions } from 'react-native';
import transform from 'css-to-react-native';
import { useState, useRef, useEffect } from 'react';
import DropShadow from "react-native-drop-shadow";
import { ActivityIndicator } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices, RTCSessionDescription, RTCIceCandidate, MediaStream } from 'react-native-webrtc-web-shim'

import api from './api';
import axios from 'axios';
import SocketIOClient from 'socket.io-client'
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { Defs, Stop, Svg, RadialGradient as SVGRadialGradient, Path, Circle } from 'react-native-svg'
import RadialGradient from 'react-native-radial-gradient';
// import auth from '@react-native-firebase/auth';

export default function Main() {


  const [peerId, setPeerId] = useState('');

  const [loggedIn, setLoggedIn] = useState(false)
  const [phoneNumber, onChangeNumber] = useState('');


  const [p, setPeer] = useState(undefined);

  const [theirMediaStream, setTheirMedia] = useState(undefined);
  const gshadow = useRef()
  const greenanim = useRef()
  const channel = useRef()

  const [load, setLoad] = useState(false);

  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const closeChannel = useRef();

  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    closeChannel.current = pc.current.createDataChannel('close');
    closeChannel.current.addEventListener('open', event => {
      Animated.timing(videoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start()
      Animated.timing(shadow2opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start()
      Animated.timing(shadow3opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start()
      console.log("Opened data channel")
    });
    closeChannel.current.addEventListener('close', event => {
      console.log("recieved close signal")
      stopButton()
    });

    setLocalStream(local);
    // setRemoteStream(remote);
    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
      pc.current.addTrack(track);
    });
    console.log(local)
    // Pull tracks from peer connection, add to remote video stream
    pc.current.ontrack = e => {
      const newStream = new MediaStream();
      console.log("e", e)
      newStream.addTrack(e.track)
      setRemoteStream(newStream);
    };

    pc.current.onaddstream = event => {
      if (remote._tracks.length == 2) {
        setRemoteStream(remote)
      }
    };
  };

  useEffect(() => {
    startWebcam()
  }, [])




  const startCall = async (channelDoc) => {
    console.log("creating room (startcall)")
    const offerCandidates = collection(channelDoc, 'offerCandidates');
    const answerCandidates = collection(channelDoc, 'answerCandidates');



    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(channelDoc, { offer })

    // Listen for remote answer
    onSnapshot(channelDoc,
      (snapshot => {
        const data = snapshot.data();
        if (!pc.current.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.current.setRemoteDescription(answerDescription);
        }
      }))

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates,
      (snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            pc.current.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }))
  };
  const joinCall = async (channel) => {
    console.log("joining room (joincall)")

    const channelDoc = doc((collection(db, 'channels')), channel)
    const offerCandidates = collection(channelDoc, 'offerCandidates')
    const answerCandidates = collection(channelDoc, 'answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const channelDocument = await getDoc(channelDoc);
    const channelData = channelDocument.data();
    const offerDescription = channelData.offer;
    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(channelDoc, { answer });

    onSnapshot(offerCandidates, (snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    }))
  };





  const colorList = [
    { offset: '75%', color: '#00ff00', opacity: '.1' },
    { offset: '100%', color: '#e0e0e0', opacity: '1' }
  ]
  const colorList3 = [
    { offset: '60%', color: '#ff5050', opacity: '1' },
    { offset: '100%', color: '#e0e0e0', opacity: '1' }
  ]
  const shadow1width = useRef(new Animated.Value(5)).current;
  const shadow1height = useRef(new Animated.Value(5)).current;
  const shadow2width = useRef(new Animated.Value(-10)).current;
  const shadow2height = useRef(new Animated.Value(-10)).current;
  const stopOpacity = useRef(new Animated.Value(0)).current;
  const videoOpacity = useRef(new Animated.Value(0)).current;
  const shadow3opacity = useRef(new Animated.Value(0)).current;

  const shadow2opacity = useRef(new Animated.Value(0)).current;
  const shadow1Radius = useRef(new Animated.Value(10)).current;
  const shadow1Color = useRef(new Animated.Value(0)).current;
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }


  const AnimatedDropShadow = Animated.createAnimatedComponent(DropShadow);
  const startSpin = () => {
    Animated.timing(shadow2opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()

    gshadow.current = Animated.loop(
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
      ));
    gshadow.current.start()
  };
  const startSpinOpp = () => {

    greenanim.current = Animated.loop(
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
      ))
    greenanim.current.start()
  };

  const stopButton = () => {
    signInAnonymously(auth)
      .then(async () => {
        axios.delete(`${api}rooms/${channel.current}`).then(res => {


        }).catch((error) => {
          if (error && error.response && error.response.data && error.response.data.message)
            alert(error.response.data.message)
          else if (error && error.message)
            alert(error.message)

        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message)
        // ...
      });
    Animated.timing(videoOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
    Animated.timing(shadow3opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
    // closeChannel.current.send('close')
    closeChannel.current.close()
    closeChannel.current = null
    pc.current.close()
    pc.current = null
    gshadow.current.stop()
    greenanim.current.stop()
    Animated.sequence([
      Animated.timing(shadow1height, {
        toValue: 5,
        duration: 0,
        useNativeDriver: false,
      }), Animated.timing(shadow1width, {
        toValue: 5,
        duration: 0,
        useNativeDriver: false,
      })]).start()
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
    startWebcam()
  };
  async function enterQueue() {
    console.log('notsignedin')

    signInAnonymously(auth)
      .then(async () => {
        console.log('signedin')
        // Signed in..
        let docRef
        docRef = await addDoc(collection(db, "channels"), {})
        channel.current = docRef.id
        axios.post(`${api}rooms/`, { peerId: docRef.id }).then(res => {
          console.log('data', res)
          if (res.data.connectTo != docRef.id) {
            deleteDoc(docRef)
            channel.current = res.data.connectTo
            joinCall(res.data.connectTo)
          }
          else startCall(docRef)

        }).catch((error) => {
          if (error && error.response && error.response.data && error.response.data.message)
            alert(error.response.data.message)
          else if (error && error.message)
            alert(error.message)

        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message)
        // ...
      });

  }
  return (
    <View style={styles.container}>
      {loggedIn ?
        <>
          <Pressable
            style={{
              zIndex: 1,
              position: "absolute",
              borderStyle: {
                borderColor: 'black',
                borderWidth: 1,
              }
            }}
            onPress={() => {

              if (shadow3opacity._value > 0 || shadow2opacity._value > 0) {
                stopButton()
              }
              else {
                startSpin()
                startSpinOpp()
                enterQueue()

              }
            }}>
            <View style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={styles.initButton}>

              </Animated.View>
            </View >

            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.buttonGreenlight, { top: shadow2height, left: shadow2width, opacity: shadow2opacity }]}>
                {shadow2opacity != 0 &&

                  <RadialGradient style={{ width: 200, height: 200, opacity: 0.5 }}
                    colors={['#350078', '#00FFFF', 'transparent']}
                    stops={[0, 0, 0.5]}
                    center={[100, 100]}
                    radius={100}>

                  </RadialGradient>
                }

              </Animated.View>
            </View >

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.buttonShadow, { top: shadow1height, left: shadow1width }]}>

              </Animated.View>

            </View >

            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.stopButton, { opacity: stopOpacity }]}>
                <Svg height="100%" width="100%" >
                  <Defs>
                    <SVGRadialGradient
                      id="grad"
                      rx='30%'
                      ry='30%'

                      gradientUnits="userSpaceOnUse">
                      <Stop offset="0" stopColor="#ff0000" stopOpacity="1" />
                      <Stop offset="1" stopColor="#ffffff00" stopOpacity=".3" />
                    </SVGRadialGradient>
                  </Defs>
                  <Circle cx="50%" cy="50%" r={.30 * Dimensions.get('screen').height} fill="url(#grad)" />
                </Svg>

              </Animated.View>
            </View >
            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.buttonGreenlight, { opacity: shadow3opacity }]}>
                <Svg height="100%" width="100%" >
                  <Defs>
                    <SVGRadialGradient
                      id="grad"
                      rx='50%'
                      ry='50%'

                      gradientUnits="userSpaceOnUse">
                      <Stop offset="0" stopColor="#0000ff" stopOpacity="1" />
                      <Stop offset="1" stopColor="#ffffff00" stopOpacity="0" />
                    </SVGRadialGradient>
                  </Defs>
                  <Circle cx="50%" cy="50%" r={.30 * Dimensions.get('screen').height} fill="url(#grad)" />
                </Svg>

              </Animated.View>
            </View >
          </Pressable>
          <Animated.View style={{ opacity: videoOpacity }}>
            {remoteStream && <View style={{ height: (.5 * (Dimensions.get('window').height)), width: (1 * (Dimensions.get('window').width)), overflow: 'hidden' }}>
              <RTCView

                style={{ flex: 2, borderColor: 'black' }}
                mirror={true}
                objectFit={'cover'}
                streamURL={remoteStream.toURL()}
                zOrder={1}
              />
            </View>}
            {localStream && <View style={{ height: (.5 * (Dimensions.get('window').height)), width: (1 * (Dimensions.get('window').width)), overflow: 'hidden' }}>
              <RTCView

                style={{ flex: 2, borderColor: 'black' }}
                mirror={true}
                objectFit={'cover'}
                streamURL={localStream.toURL()}
                zOrder={1}
              />
            </View>}

          </Animated.View >
        </> :

        < View style={styles.container} >




          <Text style={styles.logo}>Buzzr.</Text>
          <TextInput
            style={styles.input}
            onChangeText={(t) => txtChg(t)}
            value={phoneNumber}
            placeholder='Phone Number'
            placeholderTextColor='rgba(0, 0, 0, .5)'
            textAlign='center'
          />


          {load ? <ActivityIndicator style={{
            marginTop: (.025 * (Dimensions.get('window').width + 1400)),
          }} /> : <Pressable style={styles.button} onPress={() => {
            setLoggedIn(true)
          }}>
            <Text style={styles.loginButton}>Send Login Code.</Text>
          </Pressable>}




        </View >}

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

    backgroundColor: 'rgba(0,0,0,.2)',


  },
  buttonGreenlight: {
    width: .82 * Dimensions.get('screen').height,
    height: .82 * Dimensions.get('screen').height,




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
    width: 1 * Dimensions.get('screen').height,
    height: 1 * Dimensions.get('screen').height,
    borderRadius: 1 * Dimensions.get('screen').height,

  },
  input: {
    width: (.13 * (Dimensions.get('window').width + 1400)),
    fontSize: (.01 * (Dimensions.get('window').width + 1400)),
    marginTop: "3%",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,

    borderWidth: 2,
    padding: 10,
    color: 'black',
    borderColor: 'rgba(0, 0, 0, 1)',
  },
  loginButton: {
    marginTop: (.025 * (Dimensions.get('window').width + 1400)),

    fontSize: (.01 * (Dimensions.get('window').width + 1400)),
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'rgba(0,0,0,.5)',
  },
  logo: {
    marginBottom: (.02 * (Dimensions.get('window').width + 1400)),

    fontSize: (.03 * (Dimensions.get('window').width + 1400)),
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'rgba(0,0,0,.5)',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
