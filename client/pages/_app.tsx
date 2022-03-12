import type { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import buildAxiosClient from '../api/build-client';
import Header from '../components/Header/Header';
import { CurrentUser, UserContextProvider } from '../context/user-context';
import '../styles/globals.css';


interface Props extends AppProps, CurrentUser {}


const AppComponent = ({ Component, pageProps, currentUser }: Props): JSX.Element => {

  	return (
		<UserContextProvider currentUser={ currentUser }>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<div className="h-screen w-screen overflow-hidden">
				<Header />
				<div className="h-page p-2 bg-app">
					<Component { ...pageProps } />
				</div>
			</div>
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
