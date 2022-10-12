import { WinstonModuleOptionsFactory } from 'nest-winston';
import { format, LoggerOptions, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

export class WinstonConfigService implements WinstonModuleOptionsFactory {
  createWinstonModuleOptions(): LoggerOptions | Promise<LoggerOptions> {
    const config: LoggerOptions = {
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    };

    config.transports = [];

    if (process.env.NODE_ENV === 'development') {
      config.transports.push(
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.prettyPrint(),
            format.colorize({ all: true }),
          ),
        }),
      );
    } else {
      config.transports.push(
        new ElasticsearchTransport({
          indexPrefix: process.env.ELASTIC_APM_SERVICE_NAME,
          indexSuffixPattern: 'YYYY-MM-DD',
          clientOpts: {
            cloud: {
              id: process.env.ELASTIC_SEARCH_CLOUDID,
            },
            auth: {
              apiKey: process.env.ELASTIC_SEARCH_APIKEY,
            },
          },
          format: format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
              return `${timestamp} ${level} ${message}`;
            }),
          ),
        }),
      );
    }

    return config;
  }
}
