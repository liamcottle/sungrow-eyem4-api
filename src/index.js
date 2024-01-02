const WebSocket  = require('ws');
const EventEmitter = require('events');

class Client extends EventEmitter {

    constructor(ip) {
        super();
        this.ip = ip;
        this.token = "";
        this.websocket = null;
        this.serviceCallbacks = {};
    }

    connect() {

        // create websocket
        this.websocket = new WebSocket(`ws://${this.ip}/ws/home/overview`);

        // handle error
        this.websocket.on('error', async (error) => {
            this.emit('error', error);
        });

        // handle open
        this.websocket.on('open', async () => {
            this.emit('connected');
        });

        // handle messages
        this.websocket.on('message', (data) => {

            // parse response
            const json = JSON.parse(data.toString());
            const serviceName = json?.result_data?.service;

            // find service callback
            const callback = this.serviceCallbacks[serviceName];
            if(callback != null){
                callback(json);
            }

            // clear callback
            this.serviceCallbacks[serviceName] = null;

        });

        // fire event when disconnected
        this.websocket.on('close', () => {
            this.emit('disconnected');
        });

    }

    disconnect() {
        try {
            this.websocket.terminate();
            this.websocket = null;
        } catch(_) {
            // ignore errors
        }
    }

    callService(serviceName, data) {
        return new Promise((resolve, reject) => {
            try {

                // set callback so we can resolve the promise later
                this.serviceCallbacks[serviceName] = (response) => {

                    // make sure result code successful
                    const resultCode = response.result_code;
                    if(resultCode !== 1){
                        reject(response.result_msg);
                        return;
                    }

                    // resolve with result data
                    resolve(response.result_data);

                };

                // send service request
                this.websocket.send(JSON.stringify({
                    lang: "en_us",
                    service: serviceName,
                    ...data,
                }));

            } catch(e) {
                reject(e);
            }
        });
    }

    async authenticate() {

        // authenticate
        const response = await this.callService("connect", {
            token: "", // empty token for initial connection
        });

        // update token from response
        this.token = response?.token;

        return true;

    }

    async getState() {
        return this.callService("state", {
            token: this.token,
        });
    }

    async getRuntime() {
        return this.callService("runtime", {
            token: this.token,
        });
    }

    async getStatistics() {
        return this.callService("statistics", {
            token: this.token,
        });
    }

    async getDeviceList(type = 0) {
        return this.callService("devicelist", {
            token: this.token,
            type: type,
            is_check_token: "0",
        });
    }

    async getDeviceRealtimeData(deviceId) {
        return this.callService("real", {
            token: this.token,
            dev_id: deviceId,
        });
    }

    async getDeviceDCData(deviceId) {
        return this.callService("direct", {
            token: this.token,
            dev_id: deviceId,
        });
    }

    async getFaults() {
        return this.callService("fault", {
            token: this.token,
        });
    }

    async getSystemInformation() {
        return this.callService("local", {
            token: this.token,
        });
    }

}

module.exports = Client;
