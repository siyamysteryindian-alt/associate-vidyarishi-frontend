import { createSlice } from "@reduxjs/toolkit";

const InitialStateStudentSlice = {
  id: "",
};

const StudentSlice = createSlice({
  name: "StudentForm",
  initialState: InitialStateStudentSlice,
  reducers: {
    setStudentDetails: (state, action) => {
      const { id } = action.payload;
      state.id = id;
    },
  },
});

export const { setStudentDetails } = StudentSlice.actions;
export default StudentSlice.reducer;
