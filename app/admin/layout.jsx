import AdminTabs from "./AdminComponents/AdminTabs";

export const metadata = {
    title: "Organizer Portal",
    description: "Created By TAS, Developer",
};

export default function AdminLayout({
    children,
}) {
    return (
        <div>
            <AdminTabs />
            {children}
        </div>
    );
}
