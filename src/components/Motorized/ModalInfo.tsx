export const ModalInfo = () => {
    return (
        <div className="w-full h-full">
            <div className=" card-header border-b border-slate-300 py-[1rem] mt-[-1.5rem] ">
                <h3 className="card-title">Información del motorizado</h3>
            </div>
            <div className="card-body h-[20rem] mt-[-1.6rem] ml-[-2rem] my-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="card-title text-md mb-2">Datos del ranger</h4>
                        <p className="mb-2 font-medium text-md">DNI:</p>
                        <p className="mb-2 font-medium text-md">Nombre</p>
                        <p className="mb-2 font-medium text-md">Apellidos:</p>
                        <p className="mb-2 font-medium text-md">Datos en la APP:</p>
                        <p className="mb-2 font-medium text-md">Estado:</p>
                        <p className="mb-2 font-medium text-md">Fase:</p>
                        <p className="mb-2 font-medium text-md">Ubicación de trabajo:</p>
                        <p className="mb-3 font-medium text-md">Agencia:</p>
                    </div>
                    <div>
                        <h4 className="card-title text-md mb-2">Datos de movilidad</h4>
                        <p className="mb-2 font-medium text-md">Fecha de vencimiento del brevete:</p>
                        <p className="mb-3 font-medium text-md">Fecha de vencimiento del soat:</p>
                        <p className="mb-3 font-medium text-md">Marca:</p>
                        <p className="mb-3 font-medium text-md">Color:</p>
                        <p className="mb-3 font-medium text-md">Placa:</p>
                        <p className="mb-3 font-medium text-md">Tipo:</p>
                    </div>  
                </div>

            </div>
            <div className=" card-footer border-t border-slate-300 py-[1rem] mb-[-1.5rem]">
                <p className="font-mediun">Información del motorizado</p>
            </div>
        </div>
    );
}