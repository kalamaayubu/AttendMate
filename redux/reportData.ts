import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportDataState {
  data: any | null;
  courseId: string | null;
}

const initialState: ReportDataState = {
  data: null,
  courseId: null,
};

const reportDataSlice = createSlice({
  name: "reportData",
  initialState,
  reducers: {
    setReportData: (
      state,
      action: PayloadAction<{ courseId: string; data: any }>
    ) => {
      state.courseId = action.payload.courseId;
      state.data = action.payload.data;
    },

    clearReportData: (state) => {
      state.courseId = null;
      state.data = null;
    },
  },
});

export const { setReportData, clearReportData } = reportDataSlice.actions;
export default reportDataSlice.reducer;
