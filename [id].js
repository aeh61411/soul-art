export default async function handler(req, res) {
    const response = await fetch(
        "https://api.replicate.com/v1/predictions/" + req.query.id, {
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    const prediction = await response.json();
    res.json(prediction);
}