'use client';

import { Plus, X } from "lucide-react"
import ListWrapper from "./list-wrapper"
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { useToast } from "@/components/ui/use-toast";


const ListForm = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast({
        title: `List ${data.title} created`,
      })
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: error,
      })
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({ title, boardId });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === 'Escape') {
      disableEditing();
    };
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if(isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full rounded-md bg-white p-3 space-y-4 shadow-md"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   disableEditing();
          // }}
          >
            <FormInput
              ref={inputRef}
              id="title"
              errors={fieldErrors}
              className="text-sm px-2 h-7 py-1 font-medium border-t-transparent hover:border-input focus:border-input transition"
              placeholder="Enter list title..."
            />
            <input
              hidden
              value={params.boardId}
              name="boardId"
            />
            <div className="flex items-center gap-x-1">
              <FormSubmit>
                Add List
              </FormSubmit>
              <Button
                onClick={disableEditing}
                variant='ghost'
                size='sm'
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
      </ListWrapper>
    )
  }


  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  )
}

export default ListForm