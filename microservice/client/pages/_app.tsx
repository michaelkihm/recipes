import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import Header from '../components/Header';
import buildAxiosClient from '../api/build-client';
import { UserDoc } from '@mickenhosrecipes/common';
import { UserContextProvider } from '../context/user-context';

interface CurrentUser {
	currentUser: UserDoc | null;
}

interface Props extends AppProps, CurrentUser {}


const AppComponent = ({ Component, pageProps, currentUser }: Props): JSX.Element => {

  	return (
		<UserContextProvider currentUser={currentUser}>
			<Header />
			<Component {...pageProps} />
		</UserContextProvider>);

    
};

AppComponent.getInitialProps = async (context: AppContext) => {

	const client = buildAxiosClient(context.ctx);
	const { data } = await client.get<CurrentUser>('/api/users/currentuser');
  
	let pageProps = {};
	if (context.Component.getInitialProps) {
	  pageProps = await context.Component.getInitialProps(context.ctx);
	}
  
	return {
	  pageProps,
	  ...data
	};
  };


export default AppComponent;
