import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'mcp-logs.jsonl');

export class Logger {
  static log(data: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data
    };
    
    const line = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(LOG_FILE, line, 'utf-8');
  }
}
