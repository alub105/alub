import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const MiniMap = ({ userList }) => {
  return (
    <Droppable droppableId="nameList" direction="horizontal">
      {(provided) => (
        <div
          className="nameList "
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {userList.map((member, idx) => {
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
