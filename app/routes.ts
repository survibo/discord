import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.jsx"),
    route("/dm/:id", "routes/dm.$id.jsx"),               
] satisfies RouteConfig;
