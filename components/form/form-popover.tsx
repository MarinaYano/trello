'use client';

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { useToast } from "../ui/use-toast";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

export const FormPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast({
        title: 'Board created',
      });
      closeRef.current?.click();
      router.push(`/board/${data.id}`)
    },
    onError: (error) => {
      toast({
        title: `${error}`,
      });
    }
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;

    execute({ title, image });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create Board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 h-auto w-auto p-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker
              id='image'
              errors={fieldErrors}
            />
            <FormInput
              id='title'
              label="Board Title"
              type='text'
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">
            Create Board
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
