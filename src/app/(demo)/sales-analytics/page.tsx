import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductTile from "../_components/inventory/ProductTile";
import SectionWrapper from "../_components/Wrapper";
import Products from "../_components/inventory/Products";
import ProductPage from "../_components/inventory/ProductPage";
import ContentLayout from "@/components/admin-panel/content-layout";
import SalesPage from "../_components/sales-analytics/SalesPage";

export default function CategoriesPage() {
  return (
    <ContentLayout title="Sales Analytics">
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
            <BreadcrumbPage>Sales Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SectionWrapper>
        <SalesPage />
      </SectionWrapper>
    </ContentLayout>
  );
}
