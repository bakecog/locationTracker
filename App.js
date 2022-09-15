/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react'; 
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Platform,
  StyleSheet
} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { PermissionsAndroid, AppRegistry, LogBox, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import Location from './Map';

// Ignore some annoying logs
LogBox.ignoreLogs(['LocationError: Location cancelled by another request']);
LogBox.ignoreLogs(['new NativeEventEmitter']);
 
export const deviceOS = Platform.OS;

let targetPermission = deviceOS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION


 export default function App(){

  const [isToggleOn, setToggle] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [permissionGranted,setPermissions] = useState(false);

 

  function getLocationHandler() {
    setToggle(!isToggleOn);
  }

   useEffect(() => {

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 1000000,
    })
    .then(location => {
        console.log(location);
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude
        });

    })
    

  check(targetPermission)
  .then(result => {
    switch (result) {

      case RESULTS.DENIED:
        console.log('LOCATION: Denied, requesting permission!')

        request(targetPermission).then(

          res => {
            if (res === 'granted') {
              console.log('LOCATION: Permission granted!')

              if (deviceOS === 'android' && Platform.Version > 28) {

                console.log('LOCATION: Android system detected -- requesting Background location')
                request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(bgRes => {

                  if (bgRes === 'granted') {
                    console.log("LOCATION: BG location granted!");
                    setPermissions(true);
                    

                  }
                }, bgErr => {
                  console.error(bgErr)
                })
              } else {
                setPermissions(true);
                console.log("going to start android background worker");
              }
            }
          },
          err => {
            console.error(err)
          }
        )
        break
      
      case RESULTS.GRANTED:
        console.log('LOCATION: Permission granted, hurray!')
        setPermissions(true);
        break

      case RESULTS.UNAVAILABLE:
        console.log('LOCATION: This feature is not available (on this device / in this context)');
        break;
        
      case RESULTS.LIMITED:
        console.log('LOCATION: The permission is limited: some actions are possible');
        break;
        
      case RESULTS.BLOCKED:
        console.log('LOCATION: The permission is denied and not requestable anymore');
        break;
          
      default:
        console.error('LOCATION: FAILED TO GET PERMISSION')
  }
}).catch(error => {
  console.error(error.message)
})

  }


   ,[])
 
   
   if (permissionGranted && isToggleOn === false){

    return (
      <View style={styles.container}>
        <Button
          onPress={() => setToggle(true)}
          title={"locate me"}
        />
      </View>
    );
   }

   else if (permissionGranted && userLocation){
    
   
      if (deviceOS === 'android')
      {
      /* works for Android only */
        ReactNativeForegroundService.add_task(
          () => {
          
          console.log('background task running');
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000000,
          })
          .then(location => {
              console.log(location);
              setUserLocation({
                latitude: location.latitude,
                longitude: location.longitude
              });

          })
          .catch(error => {
              const { code, message } = error;
              console.warn(code, message);
          }) }
          , {
          delay: 10000,
          onLoop: true,
          taskId: 'background_location_sniff',
          onError: (e) => console.log('Error logging:', e), 
        } 
      )
    }

    else {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 1000000,
      })
      .then(location => {
          console.log(location);
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude
          });

      })
      .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
      })
    }
    

    const region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };

    return (
      <View style={styles.container}>
        <View style={styles.image}>
          <Location  latitude={region.latitude} longitude={region.longitude} />
        </View>
        <View style={styles.actions}>
          <Button
            onPress={getLocationHandler}
            title={"Stop Locating me"}
          />
        </View>
      </View>
    ); 
  }

   return (
    <View style={styles.container}>
       <Button
        onPress={() => Linking.openSettings()}
        title={"Make Sure to set the correct permissions"}
       />
    </View>
   );
 };
 
 
 const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: "center"
  },
  image: {
    width: '100%',
    height: 600,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: 700,
  },
}); 
 
