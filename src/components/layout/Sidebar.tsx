import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>

          <li>
            <NavLink to="/books">Books</NavLink>
          </li>

          <li>
            <NavLink to="/users">Users</NavLink>
          </li>

          <li>
            <NavLink to="/loans">Loans</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
