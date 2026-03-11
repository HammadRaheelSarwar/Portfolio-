const QUOTES_API = 'https://api.api-ninjas.com/v2/quotes?categories=success%2Cwisdom';
const API_NINJAS_KEY = 'oDewyrOa1m0xUe7RPxyixcyaIDas2DKKTa6WqrQR';

async function test() {
    try {
        const res = await fetch(QUOTES_API, { headers: { 'X-Api-Key': API_NINJAS_KEY } });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
