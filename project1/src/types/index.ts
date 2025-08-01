export interface ConvertRequest {
    url_gambar: string;
    persentase_kompresi: number;
}

export interface ConvertResponse {
    url_webp: string;
    ukuran_webp: string;
    status: 'success' | 'error';
    message: string;
}

export interface HealthResponse {
    status: 'success';
    message: string;
    timestamp: string;
}

export interface ErrorResponse {
    status: 'error';
    message: string;
}

export type ApiResponse = ConvertResponse | HealthResponse | ErrorResponse; 