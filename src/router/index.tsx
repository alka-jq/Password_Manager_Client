import { useRoutes } from "react-router-dom"
import { navigateRoute } from "./routes"

const NavigationRoutes = () => {
    const routes = useRoutes(navigateRoute)
    return routes
}

export default NavigationRoutes;