'use client'

import FormInput from "./form-input";
import { create } from "@/actions/create-board"
import { useFormState } from "react-dom";
import FormButton from "./form-button";

const Form = () => {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(create, initialState);

  return (
    <>
      <form action={dispatch}>
        <div className="flex flex-col space-y-2">
          <FormInput errors={state?.errors} />
        </div>
        <FormButton />
      </form>
    </>
  )
}

export default Form