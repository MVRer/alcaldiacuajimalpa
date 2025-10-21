import * as React from 'react';
import { usePermissions, Menu, DashboardMenuItem } from 'react-admin';

const MyMenu = (props) => {
  const { permissions } = usePermissions();

  const isAdmin = permissions?.includes('*');

  return (
    <Menu {...props}>
      {isAdmin && <DashboardMenuItem />}
      <Menu.ResourceItem name="my-reports" />
      <Menu.ResourceItem name="reports" />
      <Menu.ResourceItem name="turn-reports" />
      <Menu.ResourceItem name="users" />
      <Menu.ResourceItem name="subordinados" />
    </Menu>
  );
};

export default MyMenu;

