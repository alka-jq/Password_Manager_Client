import { PropsWithChildren } from 'react';
import App from '../../App';
import { Outlet } from 'react-router-dom';

const BlankLayout = ({ children }: PropsWithChildren) => {
    return (
        <App>
            <div className="text-black dark:text-white-dark min-h-screen"><Outlet></Outlet></div>
        </App>
    );
};

export default BlankLayout;
