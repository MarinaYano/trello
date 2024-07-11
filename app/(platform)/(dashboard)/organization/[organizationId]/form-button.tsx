import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      Submit
    </Button>
  )
}

export default FormButton