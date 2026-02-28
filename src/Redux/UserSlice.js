import { createSlice } from "@reduxjs/toolkit";

const InitialStateUserSlice = {
  id: "",
  name: "",
  photo: "",
  email: "",
  role: "",
};

const UserSlice = createSlice({
  name: "LoggedUser",
  initialState: InitialStateUserSlice,
  reducers: {
    setUserDetails: (state, action) => {
      const { id, name, photo, email, role } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.photo = photo;
      state.role = role;
    },
  },
});

export const { setUserDetails } = UserSlice.actions;
export default UserSlice.reducer;
