'use client';

import { ListWithCards } from '@/types'; 
import ListForm from './list-form';
import { useEffect, useState } from 'react';
import ListItem from './list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order';
import { useToast } from '@/components/ui/use-toast';
import { updateCardOrder } from '@/actions/update-card-order';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({
  boardId,
  data,
}: ListContainerProps) => {
  const { toast } = useToast();
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast({
        title: "List order updated",
      })
    },
    onError: (error) => {
      toast({
        title: error
      })
    }
  })

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast({
        title: "Card order updated",
      })
    },
    onError: (error) => {
      toast({
        title: error
      })
    }
  })

  useEffect(() => {
    setOrderedData(data);
    console.log(data)
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if(!destination) {
      return;
    }

    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.id
    ) {
      return;
    }

    // user moves a list
    if(type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    if(type === "card") {
      let newOrderData = [...orderedData];

      const sourceList = newOrderData.find(list => list.id === source.droppableId);
      const destList = newOrderData.find(list => list.id === destination.droppableId);

      if(!sourceList || !destList) {
        return;
      }

      // check if cards exists on the sourceList and destList
      if(!sourceList.cards) {
        sourceList.cards = [];
      }
      if(!destList.cards) {
        destList.cards = [];
      }

      // moving a card in the same list
      if(source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        })

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderData);
        executeUpdateCardOrder({
          items: reorderedCards,
          boardId: boardId,
        })
        // user moves the card to another list
      } else {
        //  remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderData);
        executeUpdateCardOrder({
          items: destList.cards,
          boardId: boardId,
        })
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1' />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ListContainer