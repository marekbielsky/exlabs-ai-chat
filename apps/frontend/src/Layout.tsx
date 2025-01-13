import {Outlet} from 'react-router';
import Header from "./components/Header.tsx";

function Layout() {
  return (
    <>
      <Header />
      <main className='main-container'>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;