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
import ProductTile from "../_components/inventory/ProductTile";
import SectionWrapper from "../_components/Wrapper";
import Products from "../_components/inventory/Products";
import ProductPage from "../_components/inventory/ProductPage";
import ContentLayout from "@/components/admin-panel/content-layout";

export default function CategoriesPage() {
  return (
    <ContentLayout title="Inventory">
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
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SectionWrapper>
        <ProductPage />
      </SectionWrapper>
    </ContentLayout>
  );
}
