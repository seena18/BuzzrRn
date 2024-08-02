import { Pressable, Text } from "react-native"
import { Icon } from 'react-native-elements'

export default function SignInButton({ callback, bgColor, textColor, text, icon, iconColor }) {

    return (
        <Pressable style={{
            marginBottom: 20,
            backgroundColor: bgColor, shadowColor: '#000',
            width: 200,
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

            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        }} onPress={() => callback()}>
            <Icon
                color={textColor}
                name={icon}
                type="font-awesome"
                style={{ marginRight: 5 }}
            />
            <Text style={{
                textAlign: 'center',
                color: textColor,
                fontWeight: "bold"
            }}> {text}</Text>
        </Pressable>
    )
}