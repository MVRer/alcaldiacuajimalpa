import { Layout } from "react-admin";
import menu from "./menu";

export default function layout(props) {
  return <Layout {...props} menu={menu} />;
}
