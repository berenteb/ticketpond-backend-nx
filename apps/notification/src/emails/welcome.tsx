import { Html, Section, Text } from '@react-email/components';
import { CustomerDto } from '../../../../libs/types/src';
import { Footer } from './footer';
import { Header } from './header';
import { ConfiguredTailwind } from './tailwind';

interface WelcomeProps {
  customer: CustomerDto;
}

export default function Welcome({ customer }: WelcomeProps) {
  return (
    <ConfiguredTailwind>
      <Html className="font-sans bg-slate-100 text-slate-700">
        <Header />
        <Section className="bg-white p-10 rounded-lg max-w-screen-lg">
          <Text className="font-bold">
            Üdvözlünk, {customer.lastName} {customer.firstName} 👋
          </Text>
          <Text>
            Köszönjük, hogy regisztráltál a Ticketpond-on! Ha bármilyen kérdésed
            van, ne habozz felvenni velünk a kapcsolatot.
          </Text>
          <Text>Kellemes időtöltést kívánunk a Ticketpond csapatától! 🎉</Text>
        </Section>
        <Footer />
      </Html>
    </ConfiguredTailwind>
  );
}

Welcome.PreviewProps = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
  },
};
