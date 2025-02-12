import { Button } from "@heroui/button";
import Link from 'next/link';
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

export default function SplashPage() {
  return (
    <div>
      <h1>Welcome to Our App!</h1>
      <p>Your personalized journey starts here.</p>
      {/* <Button color="primary">
        <LoginLink>Sign In</LoginLink>
      </Button> */}
      <Link href="/login">
        <Button color="primary">Sign In</Button>
      </Link>
      
    </div>
  );
}

