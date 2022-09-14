import Link from 'next/link';

import { Dashboard } from "../../layout/Dashboard/Dashboard";
const LandingPage = () => {
    return (
        <Dashboard>
            <>
                <div className="card border border-slate-300 rounded dounded-md">
                    <div className="card-body m-0 p-5">
                        <div className="form-control w-full m-0 p-0 ">
                            <label className="input-group ">
                                <span className="flex text-medium" ><p className="mr-2">Sobre</p> Nosotros</span>
                                <textarea placeholder="Escribe ...!" className="input input-bordered w-full h-[4rem]" />
                            </label>
                        </div>
                    </div>
                </div>
                <Link href="lp/add/">
                    <a>
                        <button
                            type="button"
                            className="mt-3 ml-1 inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                            <p className="font-medium text-[1rem]">Crear Servicio</p>
                        </button>
                    </a>
                </Link>
            </>
        </Dashboard>
    );

}
export default LandingPage;