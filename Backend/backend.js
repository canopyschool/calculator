const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.use(bodyParser.json());

app.post('/send-message', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Send the message to Voiceflow
        const response = await fetch('https://general-runtime.voiceflow.com/state/user_id/interact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer your_voiceflow_api_key`, // Replace with your Voiceflow API key
            },
            body: JSON.stringify({
                request: {
                    type: 'text',
                    payload: userMessage,
                },
            }),
        });

        const responseData = await response.json();
        const replyMessage = responseData.response.text; // Adjust based on Voiceflow's response structure

        // Send the response back to the frontend
        res.json({ response: replyMessage });

    } catch (error) {
        console.error('Error communicating with Voiceflow:', error);
        res.status(500).json({ error: 'Error communicating with Voiceflow' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
