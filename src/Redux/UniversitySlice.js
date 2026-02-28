import { createSlice } from "@reduxjs/toolkit";

const InitialStateUniversity = {
  id: "",
  name: "",
  isAvailable: "",
  photo: "",
  vertical: "",
  creatorType: "",
  whoCreated: "",
  departments: 0,
  specialization: 0,
  program: 0,
};

const UniversitySlice = createSlice({
  name: "University",
  initialState: InitialStateUniversity,
  reducers: {
    setUniversityDetails: (state, action) => {
      const {
        id,
        name,
        isAvailable,
        photo,
        vertical,
        creatorType,
        whoCreated,
        departments,
        specialization,
        program,
      } = action.payload;
      state.id = id;
      state.name = name;
      state.photo = photo;
      state.isAvailable = isAvailable;
      state.vertical = vertical;
      state.creatorType = creatorType;
      state.whoCreated = whoCreated;
      state.departments = departments;
      state.specialization = specialization;
      state.program = program;
    },
  },
});

export const { setUniversityDetails } = UniversitySlice.actions;
export default UniversitySlice.reducer;
