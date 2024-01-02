# Sungrow-EyeM4-API

This is a nodejs library for interacting with the websocket server running on the [Sungrow EyeM4 Dongle](https://service.sungrowpower.com.au/files/Web_Files/FAQ/TD_202006_EyeM4%20-WiFi-_Quick%20Guide%20for%20SG30-50-110CX%20Inverters_V1.1.pdf).

## Installing

```
npm install @liamcottle/sungrow-eyem4-api
```

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

        // log system information
        const systemInformation = await client.getSystemInformation();
        console.log(systemInformation);

        // we are done here
        client.disconnect();

    });

    // connect
    client.connect();

})();
```
