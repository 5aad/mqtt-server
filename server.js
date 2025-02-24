const express = require('express');
const mqtt = require('mqtt');
const app = express();
const port = 5000; 

app.use(express.json());

const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('connect',() => {
    console.log('Connected to MQTT server');
    mqttClient.subscribe('temp', (err) => {
        if (err) {
            console.log(err);
        }
    })
})

mqttClient.on('error', (err) => {
    console.log(err);
})

mqttClient.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
})

app.post('/api/publish', (req, res) => {
    const { topic, message } = req.body;
    mqttClient.publish(topic, message);
    res.send(`Published message ${message} to topic ${topic}`);
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})