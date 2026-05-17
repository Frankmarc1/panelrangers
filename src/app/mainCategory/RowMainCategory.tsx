import { MainCategory } from "../../types/mainCategory";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";

import { StatusHandler } from "../../common/statusHndler/StatusHandler";

type MainCategoryRow = MainCategory & {
  priority?: number;
  showInHome?: boolean;
  slug?: string;
};

export const RowMaincategory = ({ values }: { values: MainCategoryRow }) => {
  return (
    <tr>
      <td>
        {values.img ? (
          <img
            src={values.img}
            alt={values.name || "Categoría"}
            width={60}
            height={60}
            className="w-[60px] h-[60px] object-contain rounded bg-slate-100 border border-slate-200"
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
            Sin imagen
          </div>
        )}
      </td>

      <td>
        <div className="flex flex-col">
          <span className="font-medium">{values.name}</span>

          {values.slug && (
            <span className="text-xs text-slate-400">{values.slug}</span>
          )}
        </div>
      </td>

      <td>
        <span className="badge badge-outline font-bold">
          {values.priority ?? "-"}
        </span>
      </td>

      <td>
        {values.status ? (
          <span className="badge badge-success text-white">Activo</span>
        ) : (
          <span className="badge badge-error text-white">Inactivo</span>
        )}
      </td>

      <td>
        {values.showInHome ? (
          <span className="badge badge-info text-white">Sí</span>
        ) : (
          <span className="badge bg-slate-200 text-slate-600">No</span>
        )}
      </td>

      <td>
        <div className="flex items-center gap-3">
          <Link href={`categorias_principales/${values.id}`}>
            <button className="btn-sm text-primary text-xl" title="Editar">
              <FaPencilAlt />
            </button>
          </Link>

          <div>
            <StatusHandler collectionName="main_categories" data={values} />
          </div>
        </div>
      </td>
    </tr>
  );
};