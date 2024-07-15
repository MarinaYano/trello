'use client'

import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { Board } from "@prisma/client"
import { ElementRef, useRef, useState } from "react";

interface BoardTitleFormProps {
  data: Board;
}

const BoardTitleForm = ({
  data,
}: BoardTitleFormProps) => {
  const { toast } = useToast();
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast({
        title: `Board "${data.title}" updated`,
      });
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast({
        title: 'Error updating board',
      })
    }
  })

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    })
  }

  const disableEditing = () => {
    setIsEditing(false);
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;

    execute({
      title,
      id: data.id
    })
  }

  const onBlur = () => {
    formRef.current?.requestSubmit();
  }

  if(isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    )
  }
  
  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text0lg w-auto p-1 px-2"
    >
      {title}
    </Button>
  )
}

export default BoardTitleForm