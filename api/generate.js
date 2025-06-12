// This is our secure, backend serverless function
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    // This is the call to the Replicate API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            // We get the secret key from the Vercel environment variables
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // The ID of the model version we want to use
            version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            input: { prompt: prompt },
        }),
    });

    if (response.status !== 201) {
        let error = await response.json();
        res.status(500).json({ detail: error.detail });
        return;
    }

    const prediction = await response.json();
    res.status(201).json(prediction);
}