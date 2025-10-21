import { Layout } from "react-admin";
import MyMenu from "./menu";

const MyLayout = (props) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;