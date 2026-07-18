import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { JSX } from "react";
import { App } from "./Pages/App/App.tsx";
import { Success } from "./Pages/Success/Success.tsx";

const routes: { path: string; element: JSX.Element }[] = [
    { path: "/", element: <App /> },
    { path: "/success", element: <Success /> },
]

export const Router = () => <RouterProvider router={createBrowserRouter(routes)} />;
