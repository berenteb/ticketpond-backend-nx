import { Column, Hr, Html, Row, Section, Text } from '@react-email/components';
import { Fragment } from 'react';
import { DeepOrderDto } from '../../../../libs/types/src';
import { StyledButton } from './button';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface OrderSuccessProps {
  order: DeepOrderDto;
  walletBaseUrl: string;
  qrCodeBaseUrl: string;
}

export default function OrderSuccess({
  order,
  walletBaseUrl,
  qrCodeBaseUrl,
}: OrderSuccessProps) {
  return (
    <ConfiguredTailwind>
      <Html className="font-sans bg-slate-100 text-slate-700">
        <Header />
        <Section className="bg-white p-10 rounded-lg max-w-screen-lg">
          <Text className="font-bold">
            Sikeresen megrendelted a jegyeket! 🎉
          </Text>
          {order.items.map((item) => (
            <Fragment key={item.id}>
              <Row
                key={item.id}
                className="border-b-2 border-slate-200 mt-4 pt-4"
              >
                <Column>
                  <Text className="m-0 text-lg">{item.ticket.name}</Text>
                  <Text className="m-0 text-slate-500">
                    {item.ticket.experience.name}
                  </Text>
                </Column>
                <Column className="text-lg">{item.serialNumber}</Column>
                <Column className="text-lg">{item.price} Ft</Column>
                <Column>
                  <StyledButton
                    href={`${walletBaseUrl}/${item.serialNumber}.pkpass`}
                  >
                    Apple Wallet
                  </StyledButton>
                  <StyledButton
                    href={`${qrCodeBaseUrl}/${item.serialNumber}.png`}
                  >
                    QR-kód
                  </StyledButton>
                </Column>
              </Row>
              <Hr />
            </Fragment>
          ))}
          <Text>
            Kellemes kikapcsolódást kívánunk a Ticketpond csapatától! 🎉
          </Text>
        </Section>
        <Footer />
      </Html>
    </ConfiguredTailwind>
  );
}

OrderSuccess.PreviewProps = {
  walletBaseUrl: 'http://localhost/asset/passes/apple',
  qrCodeBaseUrl: 'http://localhost/asset/passes/image',
  order: {
    items: [
      {
        ticket: {
          name: 'Ticket name',
          experience: {
            name: 'Experience name',
          },
        },
        price: 123,
        serialNumber: 'TP-123456',
      },
      {
        ticket: {
          name: 'Ticket name',
          experience: {
            name: 'Experience name',
          },
        },
        price: 123,
        serialNumber: 'TP-123456',
      },
    ],
  },
};
