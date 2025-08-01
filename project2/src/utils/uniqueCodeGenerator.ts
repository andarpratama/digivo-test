import { Database } from './database';

export class UniqueCodeGenerator {
  private static instance: UniqueCodeGenerator;
  private database: Database;

  private constructor(database: Database) {
    this.database = database;
  }

  public static getInstance(database: Database): UniqueCodeGenerator {
    if (!UniqueCodeGenerator.instance) {
      UniqueCodeGenerator.instance = new UniqueCodeGenerator(database);
    }
    return UniqueCodeGenerator.instance;
  }

  public async generateUniqueCode(): Promise<string> {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const randomCode = Math.floor(Math.random() * 10) + 1;
      const codeString = randomCode.toString().padStart(2, '0');

      const existingOrder = await this.database.query(
        'SELECT id FROM orders WHERE kode_unik = ?',
        [codeString]
      );

      if (existingOrder.length === 0) {
        return codeString;
      }

      attempts++;
    }

    throw new Error('Unable to generate unique code after maximum attempts');
  }

  public async getExistingCodes(): Promise<string[]> {
    const result = await this.database.query<{ kode_unik: string }>(
      'SELECT kode_unik FROM orders ORDER BY kode_unik'
    );
    return result.map(row => row.kode_unik);
  }

  public async isCodeExists(code: string): Promise<boolean> {
    const result = await this.database.query(
      'SELECT id FROM orders WHERE kode_unik = ?',
      [code]
    );
    return result.length > 0;
  }

  public async getAvailableCodes(): Promise<string[]> {
    const existingCodes = await this.getExistingCodes();
    const allCodes = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    
    return allCodes.filter(code => !existingCodes.includes(code));
  }

  public async getCodeStatistics(): Promise<{
    totalCodes: number;
    usedCodes: number;
    availableCodes: number;
    usedCodesList: string[];
    availableCodesList: string[];
  }> {
    const existingCodes = await this.getExistingCodes();
    const allCodes = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const availableCodes = allCodes.filter(code => !existingCodes.includes(code));

    return {
      totalCodes: 10,
      usedCodes: existingCodes.length,
      availableCodes: availableCodes.length,
      usedCodesList: existingCodes,
      availableCodesList: availableCodes,
    };
  }
} 