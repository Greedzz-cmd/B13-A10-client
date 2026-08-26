import AuthPage from "@/components/AuthPage";

export const metadata = {
    // Account creation page metadata.
    title: "Create account | Routely",
};

export default function SignupPage() {
    // Render the shared signup experience.
    return <AuthPage mode="signup" />;
}
