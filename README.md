# locationTracker
locationTracker is a location tracker application made with react native. 

## Description
The application displays the map corresponding to the user's location.

I used MapView component from react-native-maps and RNLocation component from react-native-location to display the map and locate the user respectively.

I also used the react-native-permission library to request Permission for location tracking.

For background location tracking I used supersami/rn-foreground-service (which works for Android 11 or below)



## Development

```bash
sh +x jetify.sh
npm install
npx react-native run-android
```
I recommend development using actual android device by enabling usb debugging and connecting the mac with the phone.
