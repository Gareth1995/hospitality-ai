import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {Button} from "@heroui/button";

export default function LoginPage(){
    return (
        <main className="h-dvh flex flex-col items-center gap-6 text-4xl p-4">
            <h1>HospitalityAI</h1>
            <Button color="primary">
                <LoginLink>Sign In</LoginLink>
            </Button>
        </main>
    )
}



