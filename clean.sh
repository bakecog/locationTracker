#!/bin/bash

watchman watch-del-all && killall -9 node && rm -rf yarn.lock package-lock.json node_modules ios/Pods ios/Podfile.lock android/app/build && npm install && cd ios && pod update && cd .. 