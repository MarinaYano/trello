import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' |'primary' | 'secondary';
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = "primary",
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      variant={variant}
      size='sm'
      className={cn(className)}
    >
      {children}
    </Button>
  )
}
