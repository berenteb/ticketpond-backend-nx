import { Button, ButtonProps } from '@react-email/components';

export function StyledButton({ className, ...props }: ButtonProps) {
  return <Button {...props} className={`text-primary-500 p-2 ${className}`} />;
}
