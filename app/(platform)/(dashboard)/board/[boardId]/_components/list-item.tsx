'use client';

import { ListWithCards } from "@/types";
import ListHeader from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardFrom } from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

const ListItem = ({
  index,
  data,
}: ListItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }

  return (
    <li className="shrink-- h-full w-[272px] select-none">
      <div className="w-full rounded-sm bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader
          data={data}
          onAddCard={enableEditing}
        />
        <ol
          className={cn('mx-1 px-1 py-0.5 flex flex-col gap-y-2',
            data.cards.length > 0 ? "mt-2" : "mt-0"
          )}
        >
          {data.cards.map((card, index) => (
            <CardItem
              index={index}
              key={card.id}
              data={card}
            />
          ))}
        </ol>
        <CardFrom
          listId={data.id}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          ref={textareaRef}
        />
      </div>
    </li>
  )
}

export default ListItem