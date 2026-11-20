import { Menu, Item, useContextMenu } from "react-contexify";
import { createContext, useContext } from "react";
import "react-contexify/dist/ReactContexify.css";

const MenuContext = createContext();
const MENU_ID = "PAGE_MENU";

export function PageContextMenuProvider({ children }) {

  const { show } = useContextMenu({ id: MENU_ID });

  const openMenu = (event, data) => {
    event.preventDefault();
    show({ event, props: data });
  };

  return (
    <MenuContext.Provider value={openMenu}>
      {children}

      <Menu id={MENU_ID}>
        <Item onClick={({ props }) => alert("Open " + props?.title)}>Open</Item>
        <Item onClick={({ props }) => alert("Edit " + props?.title)}>Edit</Item>
        <Item onClick={({ props }) => alert("Delete " + props?.title)}>Delete</Item>
      </Menu>
    </MenuContext.Provider>
  );
}

// Hook to use in pages
export const usePageContextMenu = () => useContext(MenuContext);
