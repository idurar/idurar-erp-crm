import React, { useState } from "react";
import { menu } from "./Menu";
import { icon } from "./Helper";

import { useLocation } from "react-router";

function Navigation() {
  const currentPath = useLocation().pathname;
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <a href="/">
        <div className="logo"></div>
      </a>
      <ul className="navMenu">
        {menu.map((item, index) => (
          <li
            key={index}
            className={item.submenu ? "toggle" : ""}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {item.submenu && (
              <>
                <p>{item.title}</p>
                <ul className={open === true ? "subMenu show" : "subMenu"}>
                  {item.submenu.map((submenu, index) => (
                    <li key={index}>
                      <a
                        href={submenu.slug}
                        className={
                          currentPath === submenu.slug ? "nav__active" : ""
                        }
                      >
                        <p>{submenu.title}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!item.submenu && (
              <a
                href={item.slug}
                className={currentPath === item.slug ? "nav__active" : ""}
              >
                <p>{item.title}</p>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
