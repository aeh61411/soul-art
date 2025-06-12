        // ... (this is inside the generateBtn.addEventListener('click', ...))

        try {
            // --- 4. Call Our Secure Backend Function ---
            // The new API is much simpler! No more polling.
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const result = await response.json();

            if (!response.ok) {
                // If there's an error from our API, display it
                throw new Error(result.detail || 'An unknown error occurred.');
            }

            // --- 5. Display the Final Image ---
            // The API now directly returns a data URL for the image
            const imageUrl = result.imageUrl;
            artContainer.innerHTML = `<img src="${imageUrl}" alt="Your SoulArt">`;

        } catch (error) {
            // A special check for the "model is loading" error from Hugging Face
            if (error.message.includes('is currently loading')) {
                 artContainer.innerHTML = `<p class="loading-text">The AI model is waking up... Please try again in 20 seconds.</p>`;
            } else {
                 artContainer.innerHTML = `<p class="loading-text">Error: ${error.message}</p>`;
            }
        }