import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  loadingMessage: string | null;
  navigationLoading: boolean;
}

const initialState: UIState = {
  loading: false,
  loadingMessage: null,
  navigationLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingMessage: (state, action: PayloadAction<string | null>) => {
      state.loadingMessage = action.payload;
      state.loading = action.payload !== null;
    },
    setNavigationLoading: (state, action: PayloadAction<boolean>) => {
      state.navigationLoading = action.payload;
    },
  },
});

export const { setLoading, setLoadingMessage, setNavigationLoading } = uiSlice.actions;
export default uiSlice.reducer;

