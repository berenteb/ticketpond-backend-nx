import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DeepOrderItemDto } from '@ticketpond-backend-nx/types';
import * as fs from 'fs';
import { OverridablePassProps, PKPass } from 'passkit-generator';
import * as path from 'path';

import { ConfigService } from './config.service';
import { PassGeneratorInterface } from './pass-generator.interface';

const genFolder = path.resolve(__dirname, '../../static/passes/apple');

@Injectable()
export class AppleService implements PassGeneratorInterface {
  private readonly logger = new Logger(AppleService.name);

  constructor(private readonly configService: ConfigService) {
    this.createIfNotExists();
  }

  async generatePass(orderItem: DeepOrderItemDto) {
    this.logger.log(`Generating pass for ${orderItem.serialNumber}`);

    const certs = this.loadCerts();
    const passProps = this.getPassProps();
    passProps.description = orderItem.ticket.name;
    passProps.serialNumber = orderItem.serialNumber;
    passProps.organizationName = 'Merhcant of Ticketpond';

    const pass = new PKPass({}, certs, passProps);

    pass.type = 'eventTicket';

    pass.primaryFields.push({
      key: 'eventName',
      label: 'Esemény',
      value: orderItem.ticket.experience.name,
    });

    pass.headerFields.push({
      key: 'ticketName',
      label: 'Típus',
      value: orderItem.ticket.name,
    });

    pass.setBarcodes({
      message: orderItem.serialNumber,
      format: 'PKBarcodeFormatQR',
    });

    pass.auxiliaryFields.push({
      key: 'validFrom',
      label: 'Érvényesség kezdete',
      value: new Date(orderItem.ticket.validFrom).toLocaleDateString(),
    });

    pass.auxiliaryFields.push({
      key: 'validTo',
      label: 'Lejár',
      value: new Date(orderItem.ticket.validTo).toLocaleDateString(),
    });

    pass.backFields.push({
      key: 'serialNumber',
      label: 'Sorszám',
      value: orderItem.serialNumber,
    });

    pass.backFields.push({
      key: 'ticketDescription',
      label: 'Jegy leírás',
      value: orderItem.ticket.description,
    });

    pass.backFields.push({
      key: 'experienceDescription',
      label: 'Esemény leírás',
      value: orderItem.ticket.experience.description,
    });

    pass.props.relevantDate = new Date(
      orderItem.ticket.validFrom,
    ).toLocaleDateString();

    const identifier = orderItem.id;
    const passFileName = `${identifier}.pkpass`;
    try {
      const logoUrl = path.resolve(__dirname, 'assets', 'logo.png');
      const logo2Url = path.resolve(__dirname, 'assets', 'logo@2x.png');
      const iconUrl = path.resolve(__dirname, 'assets', 'icon.png');
      const icon2Url = path.resolve(__dirname, 'assets', 'icon@2x.png');

      pass.addBuffer('logo.png', fs.readFileSync(logoUrl));
      pass.addBuffer('icon.png', fs.readFileSync(iconUrl));
      pass.addBuffer('logo@2x.png', fs.readFileSync(logo2Url));
      pass.addBuffer('icon@2x.png', fs.readFileSync(icon2Url));

      await this.writePassToFile(pass, passFileName);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  private loadCerts() {
    return {
      wwdr: fs.readFileSync(path.resolve(__dirname, 'creds/wwdr.pem')),
      signerCert: fs.readFileSync(
        path.resolve(__dirname, 'creds/signerCert.pem'),
      ),
      signerKey: fs.readFileSync(
        path.resolve(__dirname, 'creds/signerKey.pem'),
      ),
      signerKeyPassphrase: this.configService.get('walletPassphrase'),
    };
  }

  private writePassToFile(pass: PKPass, passPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(genFolder)) fs.mkdirSync(genFolder);
      const fullPath = path.resolve(genFolder, passPath);
      fs.createWriteStream(fullPath).write(pass.getAsBuffer(), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(fullPath);
        }
      });
    });
  }

  private getPassProps(): OverridablePassProps {
    return {
      passTypeIdentifier: this.configService.get('walletPassTypeIdentifier'),
      teamIdentifier: this.configService.get('walletTeamIdentifier'),
      organizationName: this.configService.get('walletOrganizationName'),
      foregroundColor: 'rgb(97, 82, 204)',
      labelColor: 'rgb(160, 152, 224)',
      backgroundColor: 'rgb(248, 250, 252)',
    };
  }

  createIfNotExists() {
    if (!fs.existsSync(genFolder)) fs.mkdirSync(genFolder, { recursive: true });
  }
}
