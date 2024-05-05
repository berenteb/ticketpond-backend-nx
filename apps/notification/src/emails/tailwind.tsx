import { Tailwind, TailwindProps } from '@react-email/components';

export function ConfiguredTailwind({
  config,
  children,
  ...props
}: TailwindProps) {
  return (
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          extend: {
            colors: {
              primary: {
                100: '#dfddf5',
                200: '#c0baeb',
                300: '#a098e0',
                400: '#8175d6',
                500: '#6153cc',
                600: '#4e42a3',
                700: '#3a327a',
                800: '#272152',
                900: '#131129',
              },
            },
          },
        },
        ...config,
      }}
      {...props}
    >
      {children}
    </Tailwind>
  );
}
