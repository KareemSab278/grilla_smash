// router for the app

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { JSX } from "react";
import { App } from "./Pages/App.tsx";

const routes: { path: string; element: JSX.Element }[] = [
    { path: "/", element: <App /> },
]

export const Router = () => <RouterProvider router={createBrowserRouter(routes)} />;
