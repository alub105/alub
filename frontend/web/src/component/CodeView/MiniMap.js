import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const MiniMap = ({nameList}) => {

  return (
    <Droppable droppableId="nameList" direction="horizontal">
        {(provided) => (
          <div
            className="nameList "
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {nameList.map((member, idx) => {
              
              console.log(member.name + " : " + member)
              return (
                <Draggable
                  key={member.name}
                  draggableId={member.name}
                  index={idx}
                >
                  {(provided) => (
                    <div
                      className="draggName"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {member.name}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
  );
};

export default MiniMap;
