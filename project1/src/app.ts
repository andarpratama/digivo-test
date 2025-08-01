import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import sharp from 'sharp';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { ConvertRequest, ConvertResponse, HealthResponse, ErrorResponse } from './types';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');
const SECRET_KEY: string = process.env.SECRET_KEY || 'your-secret-key-here';

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('uploads'));

const uploadsDir: string = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function verifyHMAC(req: Request, res: Response, next: NextFunction): void {
    const authHeader: string | undefined = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            status: 'error',
            message: 'Authorization header missing'
        } as ErrorResponse);
        return;
    }

    const bodyString: string = JSON.stringify(req.body);
    const expectedHash: string = crypto.createHmac('sha512', SECRET_KEY)
        .update(bodyString)
        .digest('hex');

    if (authHeader !== expectedHash) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid HMAC signature'
        } as ErrorResponse);
        return;
    }

    next();
}

app.post('/convert-to-webp', verifyHMAC, async (req: Request, res: Response): Promise<void> => {
    try {
        const { url_gambar, persentase_kompresi }: ConvertRequest = req.body;

        if (!url_gambar) {
            res.status(400).json({
                status: 'error',
                message: 'URL gambar tidak boleh kosong'
            } as ErrorResponse);
            return;
        }

        if (!persentase_kompresi || persentase_kompresi < 1 || persentase_kompresi > 100) {
            res.status(400).json({
                status: 'error',
                message: 'Persentase kompresi harus antara 1-100'
            } as ErrorResponse);
            return;
        }

        const response = await axios.get(url_gambar, {
            responseType: 'arraybuffer',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const imageBuffer: Buffer = Buffer.from(response.data);
        const quality: number = Math.round((100 - persentase_kompresi) * 0.6 + 40);
        const timestamp: number = Date.now();
        const filename: string = `webp_${timestamp}.webp`;
        const outputPath: string = path.join(uploadsDir, filename);

        await sharp(imageBuffer)
            .webp({ quality: quality })
            .toFile(outputPath);

        const stats: fs.Stats = fs.statSync(outputPath);
        const fileSizeInKB: number = Math.round(stats.size / 1024);

        const url_webp: string = `http://localhost:${PORT}/${filename}`;

        const responseData: ConvertResponse = {
            url_webp: url_webp,
            ukuran_webp: `${fileSizeInKB} KB`,
            status: 'success',
            message: 'Gambar berhasil dikonversi ke format WEBP'
        };

        res.json(responseData);

    } catch (error: any) {
        console.error('Error:', error.message);

        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(400).json({
                status: 'error',
                message: 'Gagal mengambil gambar dari URL yang diberikan'
            } as ErrorResponse);
            return;
        }

        if (error.response && error.response.status === 404) {
            res.status(400).json({
                status: 'error',
                message: 'Gambar tidak ditemukan pada URL yang diberikan'
            } as ErrorResponse);
            return;
        }

        if (error.message.includes('Input buffer contains unsupported image format')) {
            res.status(400).json({
                status: 'error',
                message: 'Format gambar tidak didukung'
            } as ErrorResponse);
            return;
        }

        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan dalam memproses gambar'
        } as ErrorResponse);
    }
});

app.get('/health', (req: Request, res: Response): void => {
    const healthResponse: HealthResponse = {
        status: 'success',
        message: 'Service is running',
        timestamp: new Date().toISOString()
    };
    res.json(healthResponse);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    } as ErrorResponse);
});

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
}); 