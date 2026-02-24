import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import CollectionApi from "@/api/collection.api";

const BATCH_SIZE = 4

// 📌 Fetch collections theo trang, bao gồm cả `groupCollections`
export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (page, {getState}) => {
    const {collections, totalPages} = getState().collection;

    if (collections[page] || (totalPages && page > totalPages)) return null; // Nếu trang đã có hoặc không còn trang, không fetch nữa.

    const {result} = await CollectionApi.list({page, limit: BATCH_SIZE});

    return {
      collections: result.collections.filter((el) => el.style !== 6 && !el.group), // Các collections thường
      groupCollections: result.collections.filter((el) => el.style === 6 || el.group), // `groupCollections`
      page,
      totalPages: result.totalPages,
    };
  }
);

export const fetchTopics = createAsyncThunk(
  "collections/fetchTopics",
  async (_, {getState}) => {
    const {topics} = getState().collection;
    if (topics.length > 0) return null; // Nếu đã có data, không gọi lại API.

    const {result} = await CollectionApi.homepageTopics();
    return {
      topics: result.items,
      more: result.more,
    };
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    collections: {}, // Lưu theo page { 1: [...], 2: [...] }
    groupCollections: [],
    currentPage: 1,
    totalPages: null,
    isLoading: false,
    topics: [],
    moreTopics: 0,
  },
  reducers: {
    resetCollections: (state) => {
      state.collections = {};
      state.groupCollections = [];
      state.currentPage = 1;
      state.totalPages = null;
      state.topics = [];
      state.moreTopics = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const {collections, groupCollections, page, totalPages} = action.payload;
          state.collections[page] = collections;
          state.currentPage = page;
          state.totalPages = totalPages || state.totalPages

          // Chỉ thêm `groupCollections` nếu chưa có (tránh trùng lặp)
          if (groupCollections.length > 0) {
            state.groupCollections = [...new Set([...state.groupCollections, ...groupCollections])];
          }
        }
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        if (action.payload) {
          const {topics, more} = action.payload
          state.topics = topics;
          state.moreTopics = more;
        }
      });
  },
});

export const {resetCollections} = collectionSlice.actions;
export default collectionSlice.reducer;
