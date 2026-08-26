import AuthPage from "@/components/AuthPage";

export const metadata = {
    // Sign-in page metadata.
    title: "Sign in | Routely",
};

export default function SigninPage() {
    // Render the shared sign-in experience.
    return <AuthPage mode="signin" />;
}
