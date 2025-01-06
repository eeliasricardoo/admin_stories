import { RedirectType, redirect } from "next/navigation"

export default async function Home() {
  redirect("/admin_stories", RedirectType.replace)
} 