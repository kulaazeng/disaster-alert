import { Injectable } from '@nestjs/common'
import * as winston from 'winston';
import { Logger } from 'winston';

import { ConfigService } from '@nestjs/config'
import { ElasticsearchTransport, TransformedData } from 'winston-elasticsearch'
import { ElasticsearchTransformer } from 'winston-elasticsearch'
import { LogData } from 'winston-elasticsearch'

@Injectable()
export class LoggingService {
	constructor(private readonly configService: ConfigService) {}

	private esTransformer(logData: LogData): TransformedData {
		return ElasticsearchTransformer(logData);
	}

	winstonLogger(name: string, level: string) {
		const options = {
			console: {
				level,
				handleExceptions: true,
				json: false,
				colorize: true
			},
			elasticsearch: {
				level,
				transformer: this.esTransformer,
				clientOpts: {
					node: this.configService.get<string>('ELASTIC_SEARCH_URL'),
					log: level,
					maxRetries: 2,
					requestTimeout: 10000,
					sniffOnStart: false
				}
			}
		};

		const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
		const logger: Logger = winston.createLogger({
			exitOnError: false,
			defaultMeta: { service: name },
			transports: [new winston.transports.Console(options.console), esTransport]
		});
		return logger;
	}
}
