import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Settings } from 'react-native';
import ReportMenu from './reportmenu';
import transform from 'css-to-react-native';
import { useState, useRef, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices, RTCSessionDescription, RTCIceCandidate, MediaStream } from 'react-native-webrtc';
import { Icon } from 'react-native-elements'
import Chip from './chip';
import api from './api';
import axios from 'axios';

import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import GreenGlow from "./assets/green glow.svg"
import GreyGlow from "./assets/black glow.svg"
import RedGlow from "./assets/red glow.svg"
import BlueGlow from "./assets/blue glow.svg"
import InCallManager from 'react-native-incall-manager';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import CodeCells from './codecells/codecells';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button } from 'react-native';
import { AuthCredential } from 'firebase/auth';
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import SignInButton from './signinbutton';

import SettingsMenu from './settings';
export default function Main() {

  GoogleSignin.configure({
    webClientId: '711844652850-b3g9nrm7d1b0qbj78hosvers8g6hutlg.apps.googleusercontent.com',
  });
  const [peerId, setPeerId] = useState('');
  const [idle, setIdle] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false)
  const [phoneNumber, onChangeNumber] = useState('');
  const [name, onChangeName] = useState('');
  const [interests, onChangeInterests] = useState([]);
  const [interestText, onChangeInterestText] = useState("");
  const [newUser, setNewUser] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [logoutAnim, setLogoutAnim] = useState(false);

  const [formatted, onFormattedNumber] = useState('');


  const [p, setPeer] = useState(undefined);

  const [seconds, setSeconds] = useState(0);
  const gshadow = useRef()
  const greenanim = useRef()
  const bluelight = useRef()
  const secs = useRef()
  const timer = useRef()



  const channel = useRef()
  const theirstream = useRef()
  const mystream = useRef()

  const [load, setLoad] = useState(false);
  const [phone, setPhone] = useState(false);

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
      setSeconds(10)
      Animated.timing(darkShadowOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
      gshadow.current.stop()
      greenanim.current.stop()
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
      Animated.timing(blueLightSize, {
        toValue: .43 * Dimensions.get('screen').height,
        duration: 10000,
        useNativeDriver: false,
      }).start()
      console.log("Opened data channel")
    });
    closeChannel.current.addEventListener('close', event => {
      console.log("recieved close signal")
      stopButton()
    });

    mystream.current = local;
    // setRemoteStream(remote);
    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
      pc.current.addTrack(track);
      // if(track.kind=='audio'){
      //   local.removeTrack(track)
      // }
    });
    console.log(local)
    // Pull tracks from peer connection, add to remote video stream
    pc.current.ontrack = e => {
      const newStream = new MediaStream();
      console.log("e", e)
      newStream.addTrack(e.track)
      theirstream.current = newStream
    };

    // pc.current.onaddstream = event => {
    //   if (remote._tracks.length == 2) {
    //     setRemoteStream(remote)
    //   }
    // };
  };

  useEffect(() => {
    InCallManager.start({ media: 'audio' }); // audio/video, default: audio

    InCallManager.setSpeakerphoneOn(true)
    InCallManager.setForceSpeakerphoneOn(true)

    startWebcam()
  }, [])
  useEffect(() => {
    if (phone) {
      loginOff()
      backButtonOn()
      phoneOn()
    }
    else {

      backButtonOff();
      phoneOff();

    }

  }, [phone])
  useEffect(() => {
    if (logoutAnim) {
      compressMenu()
      hideSettings()
      hidemenu()
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
      ).start(() => {
        expandMenu(() => {
          setCode("")
          setMenuOpen(false)
          setNewUser(true)
          setPhone(false)
          setConfirm(false)
          setOpenSettings(false)
          setLoggedIn(false)
          logoOn()
          loginOn()
        })

      })

    }
    else {


    }

  }, [logoutAnim])

  useEffect(() => {
    if (seconds == 10) {
      secs.current = 10

      timer.current = setInterval(function run() {
        if (secs.current >= 0) {
          setSeconds(secs.current)
          secs.current = secs.current - 1
          console.log(secs.current)
        }
        else {
          Animated.timing(blueLightSize, {
            toValue: .3 * Dimensions.get('screen').height,
            duration: 1000,
            useNativeDriver: false,
          }).start()
          Animated.timing(physButtonSizeHeight, {
            toValue: .2 * Dimensions.get('screen').height,
            duration: 1000,
            useNativeDriver: false,
          }).start()
          Animated.timing(physButtonSizeWidth, {
            toValue: .2 * Dimensions.get('screen').height,
            duration: 1000,
            useNativeDriver: false,
          }).start()
          bluelight.current = Animated.loop(
            Animated.sequence(

              [Animated.timing(shadow3opacity, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
              }), Animated.timing(shadow3opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: false,
              }),



              ]
            ));
          bluelight.current.start()
          setLocalStream(mystream.current)
          setRemoteStream(theirstream.current)
          clearInterval(timer.current)
        }
      }, 1000)
    }
  }, [seconds])

  const startCall = async (channelDoc) => {
    console.log("creating room (startcall)")
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');



    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({ offer })
    // Listen for remote answer
    channelDoc.onSnapshot(
      (snapshot => {
        const data = snapshot.data();
        if (!pc.current.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.current.setRemoteDescription(answerDescription);
        }
      }))

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(
      (snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            pc.current.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }))
    setDisableButton(false)

  };
  const joinCall = async (channel) => {
    console.log("joining room (joincall)")

    const channelDoc = db.collection('channels').doc(channel)
    const offerCandidates = channelDoc.collection('offerCandidates')
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
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

    await channelDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    }))
    setDisableButton(false)

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
  const blueLightSize = useRef(new Animated.Value(0 * Dimensions.get('screen').height)).current;
  const physButtonSizeHeight = useRef(new Animated.Value(.39 * Dimensions.get('screen').height)).current;

  const physButtonSizeWidth = useRef(new Animated.Value(.39 * Dimensions.get('screen').height)).current;
  const physButtonRadius = useRef(new Animated.Value(1 * Dimensions.get('screen').height)).current;
  const physButtonOpacity = useRef(new Animated.Value(0)).current;

  const shadow2opacity = useRef(new Animated.Value(0)).current;
  const settingOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;

  const darkShadowOpacity = useRef(new Animated.Value(1)).current;
  const rect1pos = useRef(new Animated.Value(.5 * Dimensions.get('screen').height)).current;

  const shadow1Radius = useRef(new Animated.Value(10)).current;
  const shadow1Color = useRef(new Animated.Value(0)).current;

  const loginOpacity = useRef(new Animated.Value(0)).current;
  const phonenumOpacity = useRef(new Animated.Value(0)).current;
  const confirmCodeOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const backButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    var loop = Animated.loop(Animated.sequence([
      Animated.timing(blueLightSize, {
        toValue: .6 * Dimensions.get('screen').height,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(blueLightSize, {
        toValue: 0 * Dimensions.get('screen').height,
        duration: 1000,
        useNativeDriver: false,
      })
    ]
    ))
    loop.start()



    setTimeout(() => {
      loop.stop()
      expandMenu()
      logoOn()
      loginOn()
    }, 2000)


  }, [])
  function loginOff(user = undefined) {
    Animated.timing(loginOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {

    })

  }

  function loginOn() {
    Animated.timing(loginOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }
  function backButtonOff() {
    Animated.timing(backButtonOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  function backButtonOn() {
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  function logoOff() {
    Animated.timing(logoOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  function logoOn() {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }
  function phoneOff() {
    Animated.timing(phonenumOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  function phoneOn() {
    Animated.timing(phonenumOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  function confirmOff() {
    Animated.timing(confirmCodeOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  function confirmOn() {
    Animated.timing(confirmCodeOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  const [confirm, setConfirm] = useState(false);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      console.log("user", user)
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  useEffect(() => {
    if (!newUser) {
      console.log('show intro')
      compressMenu()
      setOpenSettings(null)
      showSettings()
    }
  }, [newUser]);
  useEffect(() => {

    if (loggedIn && loggedIn != true) {
      setLogoutAnim(false)
      loggedIn.user.getIdToken().then(token => {
        axios.get(`${api}users/${loggedIn.user.uid}`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => {
          console.log(res.data)
          onChangeName(res.data.user.name)
          onChangeInterests(res.data.user.interests)
          if (res.data.user.name == "") {

            setMenuOpen(true)
            setOpenSettings('settings')
            showmenu()
          }
          else {
            console.log('new user false')
            setNewUser(false)
          }
        }).catch(err => {
          alert(err)
        })
      }).catch(err => {
        alert(err)
      })


    }

  }, [loggedIn]);
  useEffect(() => {
    if (menuOpen) {
      expandMenu()
      showmenu()
      hideSettings()
    }
    else {
      compressMenu()
      setOpenSettings(null)

      hidemenu()


    }
  }, [menuOpen]);
  // Handle the button press
  async function phoneSignIn(phoneNumber) {

    auth().signInWithPhoneNumber(phoneNumber).then(confirmation => {
      console.log("confirmation", confirmation)
      phoneOff()
      backButtonOff()
      confirmOn()
      setConfirm(confirmation);
    })

  }

  async function confirmCode() {
    try {
      let user = await confirm.confirm(code);
      logoOff()
      confirmOff()   
      setTimeout(()=>{      setLoggedIn(user)
      },500) 
           
     
    } catch (error) {
      alert('Invalrid code.');
    }
  }



  function formatPhoneNumber(phoneNumberString) {
    if (phoneNumberString[phoneNumberString.length - 1] == '-') {
      if (phoneNumberString[phoneNumberString.length - 2] == ')') {
        onFormattedNumber(phoneNumberString.substr(1, 3))
      }
      else onFormattedNumber(phoneNumberString.substr(0, phoneNumberString.length - 1))
    }
    else if (phoneNumberString.length <= 14) {
      onChangeNumber(phoneNumberString)
      onFormattedNumber(phoneNumberString)

      if (phoneNumberString.length == 4) {

        onFormattedNumber('(' + phoneNumberString.substr(0, 3) + ')-' + phoneNumberString.substr(3)
        )

      }
      if (phoneNumberString.length == 10) {

        onFormattedNumber(phoneNumberString.substr(0, 9) + '-' + phoneNumberString.substr(9)
        )

      }




    }
  }



  const startSpin = () => {
    Animated.timing(shadow2opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
    Animated.timing(settingOpacity, {
      toValue: 0,
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

  const stopButton = async () => {

    setIdle(true)


    if (bluelight.current)
      bluelight.current.stop()
    clearInterval(timer.current)
    setRemoteStream(null)
    setLocalStream(null)
    Animated.timing(settingOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
    Animated.timing(blueLightSize, {
      toValue: .6 * Dimensions.get('screen').height,
      duration: 500,
      useNativeDriver: false,
    }).start()
    Animated.timing(physButtonSizeHeight, {
      toValue: .39 * Dimensions.get('screen').height,
      duration: 500,
      useNativeDriver: false,
    }).start()
    Animated.timing(physButtonSizeWidth, {
      toValue: .39 * Dimensions.get('screen').height,
      duration: 500,
      useNativeDriver: false,
    }).start()

    Animated.timing(videoOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
    Animated.timing(darkShadowOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start()
    Animated.timing(shadow3opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
    // closeChannel.current.send('close')
    if (closeChannel.current)
      closeChannel.current.close()
    closeChannel.current = null
    if (pc.current)
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
    channel.current.collection('answerCandidates').get().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });
    channel.current.collection('offerCandidates').get().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });

    channel.current.delete()
    channel.current = null
    startWebcam()
  };
  async function enterQueue() {
    setIdle(false)
    console.log('signedin')
    // Signed in..
    let docRef
    db.collection("channels")
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          //We know there is one doc in the querySnapshot
          const queryDocumentSnapshot = querySnapshot.docs[0];
          channel.current = queryDocumentSnapshot.ref

          joinCall(queryDocumentSnapshot.ref.id)
        } else {
          console.log("No document corresponding to the query!");
          db.collection('channels').add({}).then(ref => {
            channel.current = ref
            startCall(ref)

          }
          )

        }
      });

    // channel.current = docRef.id
    // axios.post(`${api}rooms/`, { peerId: docRef.id }).then(res => {
    //   console.log('data', res)
    //   if (res.data.connectTo != docRef.id) {
    //     docRef.delete()
    //     channel.current = res.data.connectTo
    //     joinCall(res.data.connectTo)
    //   }
    //   else startCall(docRef)

    // }).catch((error) => {
    //   if (error && error.response && error.response.data && error.response.data.message)
    //     alert(error.response.data.message)
    //   else if (error && error.message)
    //     alert(error.message)

    // });


  }
  async function onAppleButtonPress() {
    // Start the sign-in request
    console.log("appleauth")

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    console.log("appleauth", appleAuthRequestResponse)
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    console.log(appleCredential)

    // Sign the user in with the credential
    auth().signInWithCredential(appleCredential).then((user) => {
      logoOff()
      loginOff(user)
      setTimeout(() => setLoggedIn(user), 250)
    });
  }
  async function onGoogleButtonPress() {
    console.log("gooogle 1")
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    console.log("gooogle 2")

    GoogleSignin.signIn().then(idToken => {
      console.log("gooogle 3")
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log("gooogle 4")
      console.log(googleCredential)
      // auth().signInWithCredential(googleCredential).then(res => {
      //   console.log("gooogle 5")
      //   setLoggedIn(true)
      // }).catch(
      //   (err) => {
      //     console.log("gooogle 5 error")
      //     alert(err)
      //   }
      // )
      var updatedCred = JSON.parse(JSON.stringify(googleCredential))
      updatedCred.token = googleCredential.token.idToken
      console.log(updatedCred)
      auth().signInWithCredential(updatedCred).then((user) => {
        logoOff()
        loginOff(user)
        setTimeout(() => setLoggedIn(user), 250)
      });

    }).catch(error => {
      console.log("gooogle 3 error")

      console.log(error)
    })


    // Sign-in the user with the credential
  }
  function showmenu() {
    Animated.timing(menuOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()

  }
  function hidemenu() {
    Animated.timing(menuOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start()

  }
  function hideSettings() {
    Animated.timing(settingOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }
  function showSettings() {
    Animated.timing(settingOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }
  function expandMenu(callback = () => { }) {


    Animated.parallel([Animated.timing(physButtonRadius, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }),
    Animated.timing(physButtonSizeHeight, {
      toValue: 1 * Dimensions.get('screen').height,
      duration: 300,
      useNativeDriver: false,
    }),
    Animated.timing(physButtonSizeWidth, {
      toValue: 1 * Dimensions.get('screen').width,
      duration: 300,
      useNativeDriver: false,
    }),

    ]).start(
      callback()
    )



  }
  function compressMenu() {
    console.log('compress menu')

    Animated.timing(physButtonSizeHeight, {
      toValue: .39 * Dimensions.get('screen').height,
      duration: 500,
      useNativeDriver: false,
    }).start(),
      Animated.timing(physButtonSizeWidth, {
        toValue: .39 * Dimensions.get('screen').height,
        duration: 500,
        useNativeDriver: false,
      }).start()
    Animated.timing(physButtonRadius, {
      toValue: 1 * Dimensions.get('screen').height,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }
  return (<>

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
            disabled={menuOpen || newUser || disableButton}
            onPress={() => {

              if (shadow3opacity._value > 0 || shadow2opacity._value > 0) {
                if (channel.current)
                  stopButton()
              }
              else {
                if (!channel.current) {
                  setDisableButton()
                  startSpin()
                  startSpinOpp()
                  enterQueue()
                }


              }
            }}>
            <View style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.initButton, {
                alignItems: "center",
                height: physButtonSizeHeight, width: physButtonSizeWidth, shadowColor: '#000', borderRadius: physButtonRadius,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                // Android
                elevation: 3,
              }]}>
                {openSettings == 'settings' &&
                  <>{menuOpen && <SettingsMenu
                    setLogoutAnim={setLogoutAnim}
                    setLoggedIn={setLoggedIn}
                    showSettings={showSettings}
                    loggedIn={loggedIn}
                    setNewUser={setNewUser}
                    newUser={newUser}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    menuOpacity={menuOpacity}
                    onChangeInterestText={onChangeInterestText} onChangeInterests={onChangeInterests}
                    interests={interests}
                    name={name}
                    onChangeName={onChangeName}
                    interestText={interestText}
                  ></SettingsMenu>}</>}
                {openSettings == 'report' &&

                  <>{menuOpen && <ReportMenu
                    showSettings={showSettings}

                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    menuOpacity={menuOpacity}
                  ></ReportMenu>}</>
                }

              </Animated.View>
            </View >

            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.buttonGreenlight, { top: shadow2height, left: shadow2width, opacity: shadow2opacity }]}>

                <GreenGlow />


              </Animated.View>
            </View >

            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.regShadow, { top: shadow1height, left: shadow1width, opacity: darkShadowOpacity }]}>
                <GreyGlow />
              </Animated.View>


            </View >

            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[styles.stopButton, { opacity: stopOpacity }]}>
                <RedGlow />

              </Animated.View>
            </View >
            <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

              <Animated.View style={[{ height: blueLightSize, width: blueLightSize, opacity: shadow3opacity }]}>
                <BlueGlow />

              </Animated.View>


            </View >
            {/* <View style={{ zIndex: 1, }}>

              <Animated.View style={[{ bottom: rect1pos, left: "50%", height: blueLightSize, width: .3 * Dimensions.get('screen').height, backgroundColor: '#e0e0e0' }]}>


              </Animated.View>

            </View > */}
          </Pressable >
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

        <View style={styles.container} >
          {phone && !confirm &&
            <Animated.View style={{ zIndex: 2, width: 50, position: 'absolute', right: (.35 * Dimensions.get('window').width), top: 80, opacity: backButtonOpacity }} >< Pressable onPress={() => {
              backButtonOff();
              phoneOff();
              loginOn();
              setPhone(false);


            }}>
              <Icon
                color={'rgba(111,111,111,1)'}
                name={'chevron-left'}
                type="font-awesome"
              />
            </Pressable >
            </Animated.View>
          }




          <Animated.Text style={[styles.logo, { opacity: logoOpacity, zIndex: 3 }]}>Buzzr.</Animated.Text>
          {!phone ?
            <Animated.View style={{ position: 'absolute', top: '35%', opacity: loginOpacity, zIndex: 2 }}>
              <SignInButton icon={'hashtag'} bgColor="#e0e0e0" textColor={'rgba(111,111,111,1)'} text='Sign in with Phone' callback={() => { setPhone(true); loginOff(); phoneOn(); backButtonOn() }}></SignInButton>
              <SignInButton icon={'apple'} textColor="'rgba(80,80,80,1)" bgColor={'rgba(200,200,200,1)'} text='Sign in with Apple' callback={onAppleButtonPress}></SignInButton>

              <SignInButton icon={'google'} textColor="#e0e0e0" bgColor={'rgba(111,111,111,1)'} text='Sign in with Google' callback={onGoogleButtonPress}></SignInButton>
            </Animated.View > :
            <View style={{ position: 'absolute', top: '40%', zIndex: 2 }}>
              {!confirm ?
                <Animated.View style={{ opacity: phonenumOpacity }}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(t) => formatPhoneNumber(t)}
                    value={formatted}
                    placeholder='Phone Number'
                    placeholderTextColor='rgba(0, 0, 0, .5)'
                    textAlign='center'
                  />


                  {load ? <ActivityIndicator style={{
                    marginTop: (.025 * (Dimensions.get('window').width + 1400)),
                  }} /> : <Pressable style={styles.button} onPress={() => {
                    onChangeNumber('')
                    phoneSignIn('+1 916-705-8486')
                  }}>
                    <Text style={[styles.loginButton, { textAlign: 'center' }]}>Send Login Code.</Text>
                  </Pressable>}</Animated.View > :
                <Animated.View style={{ opacity: confirmCodeOpacity }}>
                  <CodeCells setCode={setCode} code={code}></CodeCells>
                  {load ? <ActivityIndicator style={{
                    marginTop: (.025 * (Dimensions.get('window').width + 1400)),
                  }} /> : <Pressable style={styles.button} onPress={() => {

                    confirmCode()
                  }}>
                    <Text style={[styles.loginButton, { textAlign: 'center' }]}>Confirm.</Text>
                  </Pressable>}</Animated.View >

              }
            </View>
          }

          <Animated.View style={[styles.initButton, {
            zIndex: 1,
            opacity: 1,
            flex: 1, alignItems: "center", justifyContent: 'center',
            height: physButtonSizeHeight, width: physButtonSizeWidth, shadowColor: '#000', borderRadius: physButtonRadius,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            // Android
            elevation: 3,
          }]}>


          </Animated.View>
          <Animated.View style={[{ height: blueLightSize, width: blueLightSize, opacity: 1, zIndex: 0, }]}>
            <BlueGlow />

          </Animated.View>

        </View >

      }
      < Animated.View style={{ zIndex: 1, opacity: settingOpacity, zIndex: 5, position: "absolute", top: 70, left: .1 * Dimensions.get('window').width, flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => setPhone(false)}>
        <Icon
          color={'rgba(150,150,150,1)'}
          name={'settings-outline'}
          type="ionicon"
          size={30}
          onPress={() => {
            hideSettings()
            setOpenSettings('settings');
            setMenuOpen(true)
          }}
          disabled={!idle || newUser || openSettings == 'report'}
          disabledStyle={{ backgroundColor: 'none' }}
        />
      </Animated.View  >
      < Animated.View style={{ zIndex: 1, opacity: settingOpacity, zIndex: 5, position: "absolute", top: 70, right: .1 * Dimensions.get('window').width, flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Icon
          color={'rgba(150,150,150,1)'}
          name={'flag-outline'}
          type="ionicon"
          size={30}
          onPress={() => {

            hideSettings()
            setOpenSettings('report');
            setMenuOpen(true)
          }}
          disabled={!idle || newUser || openSettings == 'settings'}
          disabledStyle={{ backgroundColor: 'none' }}
        />
      </Animated.View >
    </View >
  </>);
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
  regShadow: {
    width: .42 * Dimensions.get('screen').height,
    height: .42 * Dimensions.get('screen').height,




  },
  buttonGreenlight: {
    width: .44 * Dimensions.get('screen').height,
    height: .44 * Dimensions.get('screen').height,




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
    opacity: .5,
    width: .5 * Dimensions.get('screen').height,
    height: .5 * Dimensions.get('screen').height,
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
    color: 'rgba(111, 111, 111, 1)',
    borderColor: 'rgba(111, 111, 111, 1)',
  },
  loginButton: {
    marginTop: (.025 * (Dimensions.get('window').width + 1400)),

    fontSize: (.01 * (Dimensions.get('window').width + 1400)),
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'rgba(0,0,0,.5)',
  },
  logo: {
    position: 'absolute',
    top: '20%',

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
