'use client';

import { createCard } from "@/actions/create-list copy";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFromProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardFrom = forwardRef<HTMLTextAreaElement, CardFromProps>(({
  listId,
  isEditing,
  enableEditing,
  disableEditing,
}, ref) => {
  const { toast } = useToast();
  const params = useParams();
  
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast({
        title: `Card ${data.title} created`,
      })
      formRef.current?.reset();
    },
    onError: (error) => {
      toast({
        title: error,
      })
    }
  })

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  }

  useOnClickOutside(formRef, disableEditing);
  useEventListener('keydown', onKeyDown);

  const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const listId = formData.get("listId") as string;
    const boardId = params.boardId as string;

    execute({ title, listId, boardId });
  }

  if(isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="m-1 py-0.5 px-1 space-y-4"
      >
        <FormTextarea
          id="title"
          onKeyDown={onTextareaKeyDown}
          ref={ref}
          placeholder="Enter a title for this card..."
          errors={fieldErrors}
        />
        <input
          hidden
          id="listId"
          name="listId"
          value={listId}
        />
        <div className="flex items-center gap-x-1">
          {/* <FormSubmit>
            Add Card
          </FormSubmit> */}
          <Button
            onClick={disableEditing}
            className=""
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </form>
    )
  }
  // 8:13:50

  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        size="sm"
        variant="ghost"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </Button>
    </div>
  )
})

CardFrom.displayName = "CardFrom";