import { changeName, deleteBlock, editBlock } from "@/slices/editLessionSlice";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import ContentEditable from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import { DragIndicator, Delete } from "@mui/icons-material";

const LessionHolder = () => {
  const dispatch = useDispatch();
  const editLessionData = useSelector((state) => state.editLession);

  function handleEditName(event) {
    dispatch(changeName(event.target.value));
  }

  function handleEdit(index, event) {
    dispatch(editBlock(index, event.target.value));
  }

  function handleDelete(index) {
    dispatch(deleteBlock(index));
  }

  function handlePaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }

  return (
    <div className="w-full flex-row mt-4 text-pretty break-words">
      <input
        type="text"
        className="text-3xl text-bold w-full"
        onInput={handleEditName}
        value={editLessionData.baseValue.sectionName}
      ></input>
      <Droppable droppableId="lession">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full h-full flex flex-col min-h-24"
          >
            {editLessionData.blocks.map((block, index) => (
              <Draggable
                draggableId={"block" + index.toString()}
                disableInteractiveElementBlocking={false}
                index={index}
                key={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="relative hover:min-h-11 hover:border rounded-lg [&>:first-child]:hover:visible"
                  >
                    <div className="absolute top-1 right-1 flex flex-row gap-1 invisible">
                      <button
                        className="flex w-8 h-8 border rounded-lg bg-red-500"
                        onClick={() => handleDelete(index)}
                      >
                        <Delete className="m-auto" />
                      </button>
                      <div
                        {...provided.dragHandleProps}
                        className="flex w-8 h-8 border rounded-lg bg-white"
                      >
                        <DragIndicator className="m-auto" />
                      </div>
                    </div>
                    <ContentEditable
                      html={block}
                      className="flex-grow p-1 hover:min-h-10"
                      onChange={(event) => {
                        handleEdit(index, event);
                      }}
                      onPaste={handlePaste}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default LessionHolder;
