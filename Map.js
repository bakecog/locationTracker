import MapView, { Marker } from 'react-native-maps'
import { StyleSheet,View,Text } from 'react-native';

export default function Location(props) {
    /* latitude,longitude,latitudeDelta,longitudeDelta */

    const region = {
        latitude: props.latitude,
        longitude: props.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };

    /* 
         <MapView.Marker
                    coordinate={{latitude: latitude,
                    longitude:longitude}}
                    title={"title"}
                    description={"description"}
        />
        <MapView style={styles.map} initialRegion={region}>
            </MapView>
    */
    return  (
        <MapView style={styles.map} initialRegion={region}>
            <Marker
                coordinate={{latitude: props.latitude, longitude: props.longitude}}
                title="patient"
                description="patient's location"
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
        height: 700,
    },
})