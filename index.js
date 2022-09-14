/**
 * @format
 */

 import ReactNativeForegroundService from '@supersami/rn-foreground-service';
 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 

ReactNativeForegroundService.register();
ReactNativeForegroundService.start({
        id: 144,
        title: 'We use your location',
        message: 'Dont worry... everything is ok',
});
AppRegistry.registerComponent(appName, () => App);