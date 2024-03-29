# Sungrow-EyeM4-API

[![npm](https://img.shields.io/npm/v/%40liamcottle%2Fsungrow-eyem4-api)](https://www.npmjs.com/package/@liamcottle/sungrow-eyem4-api)
![GitHub License](https://img.shields.io/github/license/liamcottle/sungrow-eyem4-api)


This is a NodeJS library for interacting with the websocket server running on the [Sungrow EyeM4 Dongle](https://en.sungrowpower.com/productDetail/1008/intelligent-gateway-eyem4).

## Installing

```
npm install @liamcottle/sungrow-eyem4-api
```

## Features

- [x] `connect`
- [x] `disconnect`
- [x] `getAbout`
- [x] `getProduct`
- [x] `getDeviceTypes`
- [x] `getDeviceInfo(deviceId)`
- [x] `authenticate`
- [x] `getState`
- [x] `getRuntime`
- [x] `getStatistics`
- [x] `getFaults`
- [x] `getSystemInformation`
- [x] `getDeviceList(deviceType)`
- [x] `getDeviceRealtimeData(deviceId)`
- [x] `getDeviceDCData(deviceId)`

## Example

```javascript
const Client = require("@liamcottle/sungrow-eyem4-api");

(async () => {

    // create new client
    const client = new Client("192.168.1.175");

    // wait until connected
    client.on("connected", async () => {

        // authenticate
        await client.authenticate();

        // log state
        const state = await client.getState();
        console.log(state);

        // log runtime
        const runtime = await client.getRuntime();
        console.log(runtime);

        // log statistics
        const statistics = await client.getStatistics();
        console.log(statistics);

        // log faults
        const faults = await client.getFaults();
        console.log(faults);

        // log system information
        const systemInformation = await client.getSystemInformation();
        console.log(systemInformation);

        // log realtime data for each device
        const deviceList = await client.getDeviceList();
        console.log(deviceList);
        for(const device of deviceList.list){
            const realtimeDataResponse = await client.getDeviceRealtimeData(device.dev_id);
            console.log(realtimeDataResponse);
        }

        // we are done here
        client.disconnect();

    });

    // connect
    client.connect();

})();
```

## References

- https://en.sungrowpower.com/productDetail/1008/intelligent-gateway-eyem4
- https://service.sungrowpower.com.au/files/Web_Files/FAQ/TD_202006_EyeM4%20-WiFi-_Quick%20Guide%20for%20SG30-50-110CX%20Inverters_V1.1.pdf
