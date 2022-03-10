import axios, { AxiosResponse } from 'axios';

export const updateBookmarksRequest = async (method: 'push' | 'pull', recipeId: string): Promise<AxiosResponse<any, any>> =>
    axios.patch('/api/recipes/bookmarks',{ recipeId, method })
;