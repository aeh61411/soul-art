// New api/generate.js using Hugging Face
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    // Call the Hugging Face API
    // We are using a popular Stable Diffusion model here.
    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            method: "POST",
            headers: {
                // Use the new environment variable
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }), // Note: it's "inputs", not "prompt"
        }
    );

    // Check for errors, especially if the model is loading
    if (!response.ok) {
        // If the model is loading, Hugging Face returns a 503 error
        if (response.status === 503) {
            const errorData = await response.json();
            return res.status(503).json({ detail: errorData.error });
        }
        return res.status(response.status).json({ detail: "Failed to generate image." });
    }

    // The response is the image data itself, not a URL.
    // We need to convert it to a format we can use in the browser.
    const imageBlob = await response.blob();
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${imageBlob.type};base64,${base64Image}`;

    res.status(200).json({ imageUrl: dataUrl });
}