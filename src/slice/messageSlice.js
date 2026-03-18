import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const messageSlice = createSlice({
    name: 'message',
    initialState: [
        // {
        // id: 1,
        // type: "success",
        // title:"成功",
        // text: "test",
        // }
    ],
    reducers: {
        createMessage(state, action) {
        state.push({
        id: action.payload.id,
        type: action.payload.success ? "success" : "danger",
        title: action.payload.success ? "成功" : "失敗",
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex(
        (item) => item.id === action.payload
      );
      if (index !== -1) {
			  state.splice(index, 1);
		}
    },
  },
});
    

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(messageSlice.actions.createMessage({
      ...payload,
      id: requestId,
    }));

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 2000);
  }
);

export const { createMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
