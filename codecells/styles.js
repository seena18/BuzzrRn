import { StyleSheet, Platform } from 'react-native';

export const CELL_SIZE = 40;
export const CELL_BORDER_RADIUS = 110;
export const DEFAULT_CELL_BG_COLOR = '#e0e0e0';
export const NOT_EMPTY_CELL_BG_COLOR = 'rgba(111,111,111,0)';
export const ACTIVE_CELL_BG_COLOR = '#e0e0e0';

const styles = StyleSheet.create({
    codeFieldRoot: {
        height: CELL_SIZE,
        marginTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    cell: {
        marginHorizontal: 8,
        height: CELL_SIZE,
        width: CELL_SIZE,
        lineHeight: CELL_SIZE - 5,
        ...Platform.select({ web: { lineHeight: 65 } }),
        fontSize: 30,
        textAlign: 'center',
        borderRadius: 1000,
        color: 'rgba(111,111,111,1)',
        backgroundColor: '#fff',

        // IOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        // Android
        elevation: 3,
    },

    // =======================

    root: {
        minHeight: 800,
        padding: 20,
    },
    title: {
        paddingTop: 50,
        color: '#000',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 40,
    },
    icon: {
        width: 217 / 2.4,
        height: 158 / 2.4,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    subTitle: {
        paddingTop: 30,
        color: '#000',
        textAlign: 'center',
    },
    nextButton: {
        marginTop: 30,
        borderRadius: 1000,
        height: 60,
        backgroundColor: '#3557b7',
        justifyContent: 'center',
        minWidth: 300,
        marginBottom: 100,
    },
    nextButtonText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        fontWeight: '700',
    },
});

export default styles;