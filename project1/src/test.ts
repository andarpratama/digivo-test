import axios from 'axios';
import crypto from 'crypto';
import { ConvertRequest } from './types';

const BASE_URL: string = 'http://localhost:5000';
const SECRET_KEY: string = 'your-secret-key-here';

function generateHMAC(data: ConvertRequest): string {
    return crypto.createHmac('sha512', SECRET_KEY)
        .update(JSON.stringify(data))
        .digest('hex');
}

async function testImageConversion(): Promise<void> {
    const testData: ConvertRequest = {
        url_gambar: 'https://picsum.photos/800/600',
        persentase_kompresi: 60
    };

    const hmac: string = generateHMAC(testData);

    try {
        const response = await axios.post(`${BASE_URL}/convert-to-webp`, testData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': hmac
            }
        });

        console.log('Success:', response.data);
    } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
    }
}

async function testHealthCheck(): Promise<void> {
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        console.log('Health Check:', response.data);
    } catch (error: any) {
        console.error('Health Check Error:', error.response?.data || error.message);
    }
}

async function runTests(): Promise<void> {
    console.log('Testing Health Check...');
    await testHealthCheck();
    
    console.log('\nTesting Image Conversion...');
    await testImageConversion();
}

runTests(); 