/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App, {deviceOS} from './App';
 import {name as appName} from './app.json';
 import ReactNativeForegroundService from '@supersami/rn-foreground-service';
 
 if (deviceOS == 'android'){
    ReactNativeForegroundService.register();
    ReactNativeForegroundService.start({
            id: 144,
            title: 'We use your location',
            message: 'Dont worry... everything is ok',
    });
} 

AppRegistry.registerComponent(appName, () => App);