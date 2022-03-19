import { Recipe } from '@mickenhosrecipes/common';
import { AxiosResponse } from 'axios';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { buildAxiosBackendClient } from '../api/server-side-axios-client';
import { updateBookmarksRequest } from '../api/update-bookmarks';
import RecipeCard from '../components/RecipeCard';

interface HomeProps {
	recipes: Recipe[],
  bookmarks: Recipe[],
}

const Home: NextPage<HomeProps> = (props) => {
	
	const [bookmarkIds, setBookmarkIds] = useState<string[]>(props.bookmarks.map(recipe => recipe.id));


	const updateBookmarks = (id: string, marked: boolean) => {

		const bookmarksCopy = [...bookmarkIds];
		
		if(marked) {
			bookmarksCopy.push(id);
		} else {
			const index = bookmarksCopy.indexOf(id);
			index !== -1 && bookmarksCopy.splice(index,1);
		}
		updateBookmarksRequest(marked ? 'push' : 'pull', id);
		setBookmarkIds(bookmarksCopy);
	};
  
	return (
		<div>
			<div className="h-full w-full p-4 flex gap-y-4 gap-x-4 overflow-x-auto scroll-container">
				{!props.recipes.length && <p>No recipes are here</p>}
				{props.recipes.map(recipe => (
					<RecipeCard
						key={ recipe.id }
						recipe={ recipe }
						bookmarked={ bookmarkIds.includes(recipe.id) }
						handleBookmark={ (marked) => updateBookmarks(recipe.id, marked) }
					/>))}
      		</div>
    </div>);
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    
    const client = buildAxiosBackendClient(context.req.headers);
    let booksmarksResponse: AxiosResponse<Recipe[], unknown> | undefined;

    const recipesResponse = await client.get<Recipe[]>('api/recipes');

    if(Object.keys(context.req.cookies).length) {
      booksmarksResponse = await client.get<Recipe[]>('/api/recipes/bookmarks');
    }

    return {
        props: {
          recipes: recipesResponse.data,
          bookmarks: booksmarksResponse ? booksmarksResponse.data : [],
        },
    };
};

export default Home;
