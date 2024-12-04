import { IconButton } from "@material-tailwind/react";
import { Button } from "@mui/joy";
import { useState } from "react";
import { AddSession } from "../components/create_tour/addSession";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import DashboardBreadcrumb from "@/components/admin_dashboard/DashboardBreadcrumb";
import LessionHolder from "@/components/create_tour/LessionHolder";
import LessionComponentHolder from "@/components/create_tour/LessionComponentHolder";
import { useDispatch } from "react-redux";
import { addBlock, moveBlock } from "@/slices/editLessionSlice";
import { renderToStaticMarkup } from "react-dom/server";
import lessionComponents from "@/constants/lessionComponents";

const sessionInfo = [
  { id: 0, name: "Lecture" },
  { id: 1, name: "Assignment" },
  { id: 2, name: "Discussion" },
];
const Section = () => {
  // const [session, setSession] = useState(sessionInfo);

  // function addSessions() {
  //   const x = { id: session.length, name: "" };
  //   setSession([...session, x]);
  // }

  // const getAPI = () => {
  //   axios
  //     .get(`https://curcus-3-0.onrender.com/api/courses?page=0&size=20`)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // function handleOnDragEnd(result) {
  //   if (!result.destination) return;
  //   const items = Array.from(session);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);

  //   setSession(items);
  // }
  const dispatch = useDispatch();

  function onDragEnd(result) {
    console.log(result);

    if (result.destination == null) {
      return;
    }

    if (result.source.droppableId == "lession") {
      // console.log("move");
      dispatch(moveBlock(result.source.index, result.destination.index));
    } else if (result.source.droppableId == "lession_components") {
      // console.log("add");
      const content = renderToStaticMarkup(
        lessionComponents[result.draggableId]
      );
      dispatch(addBlock(result.destination.index, content));
    }
  }

  return (
    <div className="flex flex-col w-full ">
      <DashboardBreadcrumb homePath="/create" name="Edit Course" />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full shadow-md flex flex-row gap-4 mt-10 mb-28 p-6">
          <div className="flex-grow border">
            <LessionHolder />
          </div>
          <div className="w-72">
            <LessionComponentHolder />
          </div>
        </div>
      </DragDropContext>
      {/* <div className="flex-col justify-center ml-10 my-3 ">
          <div className="flex items-center mt-6 mb-5">
            <div className="text-xl mr-3 font-semibold">Add Session</div>
            <IconButton
              variant="text"
              className="rounded-full"
              size="sm"
              onClick={() => addSessions()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </IconButton>
          </div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <ul
                  className="characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {session.length != 0 ? (
                    session.map((item, idx) => {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={idx}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <AddSession
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                setFunc={setSession}
                                index={item.id}
                              />
                            </li>
                          )}
                        </Draggable>
                      );
                    })
                  ) : (
                    <div className="text-sm text-red-600">
                      *Hiện đang không có thông tin nào ở đây
                    </div>
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div> */}
      {/* <div className="ml-10 mb-16 mt-10">
          <Button>Submit</Button>
        </div> */}
    </div>
  );
};
export default Section;
