import { FC } from 'react';
import { Link } from 'wouter';

const Header: FC = () => (
  <div>
    <Link href="/">Home</Link>
    <Link href="/accounts">Accounts</Link>
    <Link href="/settings">Settings</Link>
  </div>
);

export default Header;
