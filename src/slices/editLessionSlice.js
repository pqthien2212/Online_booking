import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseValue: {
    sectionName: "Lession 1",
    sectionId: 0,
    courseId: 0,
  },
  blocks: [
    '<div class="text-2xl">Est adipisicing pariatur deserunt ex.</div>',
    "<div>Id consectetur anim laborum esse aliqua excepteur laborum culpa irure. Lorem ullamco proident irure anim Lorem sint ut exercitation. Eiusmod nulla labore nisi laboris magna veniam enim Lorem excepteur nulla veniam ipsum.</div>",
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=SeqhDnxOADBayVNI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
  ],
  saved: true,
  loading: false,
};

const editLessionSlice = createSlice({
  name: "editLession",
  initialState,
  reducers: {
    changeName: {
      reducer: (state, action) => {
        state.baseValue.sectionName = action.payload.name;
        console.log(state.baseValue.sectionName);
      },
      prepare: (name) => {
        return { payload: { name } };
      },
    },
    addBlock: {
      reducer: (state, action) => {
        state.blocks.splice(action.payload.index, 0, action.payload.content);
      },
      prepare: (index, content) => {
        return { payload: { index, content } };
      },
    },
    moveBlock: {
      reducer: (state, action) => {
        const movedContent = state.blocks.splice(action.payload.from, 1)[0];
        state.blocks.splice(action.payload.to, 0, movedContent);
      },
      prepare: (from, to) => {
        return { payload: { from, to } };
      },
    },
    editBlock: {
      reducer: (state, action) => {
        state.blocks[action.payload.index] = action.payload.content;
      },
      prepare: (index, content) => {
        return { payload: { index, content } };
      },
    },
    deleteBlock: {
      reducer: (state, action) => {
        state.blocks.splice(action.payload.index, 1);
      },
      prepare: (index) => {
        return { payload: { index } };
      },
    },
  },
});

export const { changeName, addBlock, moveBlock, editBlock, deleteBlock } =
  editLessionSlice.actions;
export default editLessionSlice.reducer;
