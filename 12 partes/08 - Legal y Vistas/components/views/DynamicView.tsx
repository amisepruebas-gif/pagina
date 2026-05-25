import type { ViewModule } from "@/lib/sample-view";
import { ViewSlider }     from "./ViewSlider";
import { ViewProducts }   from "./ViewProducts";
import { ViewPromo }      from "./ViewPromo";
import { ViewBanners }    from "./ViewBanners";
import { ViewCategories } from "./ViewCategories";
import { ViewVideo }      from "./ViewVideo";

export interface DynamicViewProps {
  modules: ViewModule[];
}

/**
 * DynamicView — orquesta la renderización de módulos en orden.
 * Switch sobre `module.type` selecciona el componente adecuado.
 */
export function DynamicView({ modules }: DynamicViewProps) {
  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-20">
      {modules.map((m, i) => {
        switch (m.type) {
          case "slider":     return <ViewSlider     key={i} {...m} />;
          case "products":   return <ViewProducts   key={i} {...m} />;
          case "promo":      return <ViewPromo      key={i} {...m} />;
          case "banners":    return <ViewBanners    key={i} {...m} />;
          case "categories": return <ViewCategories key={i} {...m} />;
          case "video":      return <ViewVideo      key={i} {...m} />;
          default:           return null;
        }
      })}
    </main>
  );
}
