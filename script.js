document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultDiv = document.getElementById('result');
    const artContainer = document.getElementById('art-container');

    generateBtn.addEventListener('click', async () => {
        // --- 1. Get User Inputs ---
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const emojis = document.getElementById('emojis').value;
        const style = document.getElementById('style').value;
        
        if (!description) {
            alert('Please talk about yourself to generate your SoulArt.');
            return;
        }

        // --- 2. Show Loading State ---
        resultDiv.classList.remove('hidden');
        artContainer.innerHTML = '<p class="loading-text">The universe is painting your soul... please wait (this can take up to a minute).</p>';

        // --- 3. Construct the AI Prompt ---
        // This is the most important part! We combine all inputs into a detailed prompt for the AI.
        const nameText = name ? `${name}'s soul.` : 'A person\'s soul.';
        const prompt = `
            ${style} of a soul, inspired by these words: "${description}". 
            The art should visually represent the core themes and feelings. 
            Subtly incorporate these symbols: ${emojis}. 
            At the bottom right, add the text "${nameText}" in a discrete, elegant font.
            High detail, 8k, trending on artstation.
        `;

        try {
            // --- 4. Call Our Secure Backend Function ---
            // This is a 'poll' function because the AI takes time. We ask for the image, get a URL to check its status, and keep checking until it's ready.
            const initialResponse = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            let prediction = await initialResponse.json();

            if (initialResponse.status !== 201) {
                throw new Error(prediction.detail);
            }

            // --- 5. Wait for the Image to be Ready ---
            while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                const statusResponse = await fetch(`/api/status/${prediction.id}`); // We need to create this new endpoint
                prediction = await statusResponse.json();
            }

            if (prediction.status === 'failed') {
                throw new Error('Image generation failed. Please try a different prompt.');
            }
            
            // --- 6. Display the Final Image ---
            const imageUrl = prediction.output[0];
            artContainer.innerHTML = `<img src="${imageUrl}" alt="Your SoulArt">`;

        } catch (error) {
            artContainer.innerHTML = `<p class="loading-text">Error: ${error.message}</p>`;
        }
    });

    // NOTE: For step 5 to work, we need one more API file to check the status.
});