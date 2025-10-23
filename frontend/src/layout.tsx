import { Layout } from "react-admin";
import MyMenu from "./menu";

export default function layout(props) {
  return <Layout {...props} menu={MyMenu} />;
}
