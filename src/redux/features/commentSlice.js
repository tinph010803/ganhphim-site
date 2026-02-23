import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import CommentApi from "@/api/comment.api";

const initialState = {
    comments: [],
    total_comments: 0,
    hasMore: false,
    showReplyForm: null,
    likeIds: [],
    dislikeIds: [],
    isLoading: true,
    isLoadingMore: false,
    curTab: "comments",
    commentFocus: null
}

export const fetchComments = createAsyncThunk(
    'comment/fetchComments',
    async (filter, thunkAPI) => {
        const {result} = await CommentApi.list(filter)
        return result
    },
)

export const fetchMoreComments = createAsyncThunk(
    'comment/fetchMoreComments',
    async (filter, thunkAPI) => {
        const {result} = await CommentApi.list(filter)
        return result
    },
)

export const fetchCommentInfo = createAsyncThunk(
    'comment/fetchCommentInfo',
    async (id, thunkAPI) => {
        const {result} = await CommentApi.info(id)
        return result
    },
)

export const fetchVoteList = createAsyncThunk(
    'comment/fetchVoteList',
    async (movie_id, thunkAPI) => {
        try {
            const {result} = await CommentApi.voteList(movie_id)
            return result
        } catch (error) {
        }

        return false
    },
)

const _updateComment = (comment, updateData) => {
    if (updateData.total_children) updateData.total_children = comment.total_children + updateData.total_children
    if (updateData.total_like) updateData.total_like = comment.total_like + updateData.total_like
    if (updateData.total_dislike) updateData.total_dislike = comment.total_dislike + updateData.total_dislike
    if (comment?.replies) {
        if (updateData.replies) {
            updateData.replies = [...comment.replies, ...updateData.replies]
        }
    } else {
        if (updateData.replies) {
            updateData.replies = [...updateData.replies]
            updateData.total_children = updateData.replies.length
        }
    }

    return updateData
}

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setCurTab: (state, action) => {
            state.curTab = action.payload
        },
        setCommentFocus: (state, action) => {
            state.commentFocus = action.payload
        },
        setComments: (state, action) => {
            state.comments = action.payload
        },
        addComment: (state, action) => {
            state.comments = [action.payload, ...state.comments]
        },
        setShowReplyForm: (state, action) => {
            state.showReplyForm = action.payload
        },
        updateComment: (state, action) => {
            const {id, updateData} = action.payload

            if (state.commentFocus && id === state.commentFocus._id) {
                const data = _updateComment(state.commentFocus, updateData)
                state.commentFocus = {...state.commentFocus, ...data}
            } else {
                const index = state.comments.findIndex(el => el._id === id)
                const newArr = [...state.comments]
                const data = _updateComment(newArr[index], updateData)

                newArr[index] = {...newArr[index], ...data}

                state.comments = newArr
            }
        },
        updateReply(state, action) {
            const {comment, updateData} = action.payload

            if (state.commentFocus && comment.parent_id === state.commentFocus._id) {
                const replies = state.commentFocus.replies
                const index = replies.findIndex(el => el._id === comment._id)
                const data = _updateComment(replies[index], updateData)
                state.commentFocus.replies[index] = {...state.commentFocus.replies[index], ...data}
            } else {
                const parentIndex = state.comments.findIndex(el => el._id === comment.parent_id)
                const newArr = [...state.comments]
                const replies = newArr[parentIndex].replies
                const index = replies.findIndex(el => el._id === comment._id)
                const data = _updateComment(replies[index], updateData)
                newArr[parentIndex].replies[index] = {...replies[index], ...data}
                state.comments = newArr
            }
        },

        addLikeId: (state, action) => {
            state.likeIds = [...state.likeIds, action.payload]
            state.dislikeIds = state.dislikeIds.filter(id => id !== action.payload)
        },
        removeLikeId: (state, action) => {
            state.likeIds = state.likeIds.filter(id => id !== action.payload)
        },
        addDislikeId: (state, action) => {
            state.dislikeIds = [...state.dislikeIds, action.payload]
            state.likeIds = state.likeIds.filter(id => id !== action.payload)
        },
        removeDislikeId: (state, action) => {
            state.dislikeIds = state.dislikeIds.filter(id => id !== action.payload)
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchComments.fulfilled, (state, action) => {
            const payload = action.payload || {}
            if (state.commentFocus) {
                state.comments = (payload.items || []).filter(el => el._id !== state.commentFocus._id)
            } else {
                state.comments = payload.items || []
            }
            state.total_comments = payload.item_count ?? 0
            state.hasMore = payload.has_more ?? false
            state.isLoading = false
        })
        builder.addCase(fetchComments.pending, (state, action) => {
            state.comments = []
            state.isLoading = true
            state.hasMore = false
        })
        builder.addCase(fetchMoreComments.fulfilled, (state, action) => {
            const payload = action.payload || {}
            state.comments = [...state.comments, ...(payload.items || [])]
            state.hasMore = payload.has_more ?? false
            state.isLoadingMore = false
        })
        builder.addCase(fetchMoreComments.pending, (state, action) => {
            state.isLoadingMore = true
        })
        builder.addCase(fetchCommentInfo.fulfilled, (state, action) => {
            state.commentFocus = action.payload
        })
        builder.addCase(fetchVoteList.fulfilled, (state, action) => {
            if (action.payload) {
                state.likeIds = action.payload.like_ids
                state.dislikeIds = action.payload.dislike_ids
            }
        })
    }
})

export const {
    addComment,
    updateComment,
    updateReply,
    setShowReplyForm,
    addLikeId,
    addDislikeId,
    removeLikeId,
    removeDislikeId,
    setComments,
    setCurTab,
    setCommentFocus
} = commentSlice.actions
export default commentSlice.reducer