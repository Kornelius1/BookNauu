export default function Unauthorized() {

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">

            <h1 className="text-3xl font-bold">
                Access Denied
            </h1>

            <p className="text-muted-foreground">
                You don't have permission to access this page.
            </p>

        </div>
    );
}