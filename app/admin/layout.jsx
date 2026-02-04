import AdminLayoutWrapper from "./AdminLayout";

export const metadata = {
    title: "Organizer Portal",
    description: "Created By TAS, Developer",
};

export default function AdminLayout({
    children,
}) {
    return (
        <AdminLayoutWrapper>
            {children}
        </AdminLayoutWrapper>
    );
}
