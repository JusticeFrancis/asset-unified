import { RolesPermissionsForm } from "@/app/admin/components/roles-permissions-form";
export default async function ViewAdminUserPage({searchParams}:{searchParams:Promise<{id?:string}>}){const p=await searchParams;return <RolesPermissionsForm mode="view" adminId={p.id}/>;}
