import { Draggable, Droppable } from "@hello-pangea/dnd";
import lessionComponents from "@/constants/lessionComponents";

const LessionComponentHolder = () => {
  return (
    <div className="w-full flex flex-col">
      <Droppable droppableId="lession_components" isDropDisabled={true}>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {Object.entries(lessionComponents).map((component, index) => (
              <Draggable draggableId={component[0]} index={index} key={index}>
                {(provided, snapshot) => (
                  <>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="hover:border rounded-lg p-1"
                    >
                      {component[1]}
                    </div>
                    {snapshot.isDragging && (
                      <div className="[&~div]:transform-none p-1 border border-dashed rounded-lg">
                        {component[1]}
                      </div>
                    )}
                  </>
                )}
              </Draggable>
            ))}
            {/* {provided.placeholder} */}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default LessionComponentHolder;
