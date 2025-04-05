import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import SectionWrapper from "../_components/Wrapper";
import AlertsProducts from "../_components/alerts-and-notifcations/AlertsProducts";
import AlertPage from "../_components/alerts-and-notifcations/AlertPage";
import ContentLayout from "@/components/admin-panel/content-layout";

export default function CategoriesPage() {
  return (
    <ContentLayout title="Alert & Notifications">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Alert & Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SectionWrapper>
        <AlertPage />
      </SectionWrapper>
    </ContentLayout>
  );
}
