import Page from "@/dashboard/page";
import NotFound from "@/view/NotFound";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: '/dashboard',
        Component: Page
    },
    {
        path: '*',
        Component: NotFound
    }
]);