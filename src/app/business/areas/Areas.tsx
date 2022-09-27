import { faPlus, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Wrapper } from '@googlemaps/react-wrapper';
import { GeoPoint } from 'firebase/firestore';
import { MouseEventHandler, useEffect, useState } from 'react';

import { Form } from './componets/comon/form/Form';
import { ListAreas } from "../areas/componets/comon/list/List";

import { Map } from './componets/comon/map/Map';
import { Marker } from './componets/comon/map/Marker';
import { Polygon } from './componets/comon/map/Polygon';
import { useMap } from './componets/stateManagement/mapContext';

export interface Point {
  coors: google.maps.LatLng;
  id: number;
}

export interface Area {
  deliveryPrice: number;
  distributionArea: GeoPoint[];
  id: number;
  name: string;
  status: boolean;
  timeAtention: number;
}

const randomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  return '#' + randomColor;
};

export const Areas = (): JSX.Element => {
  const context = useMap();
  const [showList, setShowList] = useState(false);
  const [activeForm, setActiveForm] = useState(false);
  const [create, setCreate] = useState(false);

  const onClick = (e: google.maps.MapMouseEvent) => {
    if (!context?.idArea) {
      if (e.latLng) context?.savePoint(e.latLng);
    }
  };

  const hiddenForm: MouseEventHandler = () => {
    context?.clearPoints();
    context?.deselectArea();

    setActiveForm(false);
    setCreate(false);

    if (context?.idArea) {
      localStorage.removeItem(context.idArea + '');
    }
  };

  const showForm: MouseEventHandler = () => {
    setActiveForm(true);
    if (!context?.idArea) {
      setCreate(true);
    }
  };

  useEffect(() => {
    if (context?.idArea) setActiveForm(true);
  }, [context?.idArea]);

  return (
    <>
      <div className='mb-1 mt-[-1rem]'>
        {context?.areas && context.areas.length === 0 && (
          <p className='fs-5 text-danger fw-bold'>
            Aun no se han registrado areas a este comercio
          </p>
        )}
        <div className='w-full flex justify-between align-items-center '>
          <div>
            <button
              className='btn btn-success mr-3 btn-sm fw-bold mb-2'
              onClick={showForm}
              title='Crear nueva area'
            >
              <FontAwesomeIcon icon={faPlus} className='mr-2' />
              crear area
            </button>
            <button
              className='btn btn-info btn-sm fw-bold'
              onClick={() => setShowList(true)}
            >
              <FontAwesomeIcon icon={faTable} className='mr-2' />
              listado
            </button>
          </div>

          {activeForm && <Form hiddenForm={hiddenForm} />}
        </div>
      </div>

      <div className='grid grid-cols-12 w-full gap-4'>
        <div className={showList ? 'grid col-span-8' : '  col-span-12'}>
          <Wrapper apiKey='AIzaSyBz1qBkGOSE-aLC27FTsnmT9mFwy64xBxE'>
            <Map
              onClick={onClick}
              style={{
                flexGrow: '1',
                height: '76vh',
                width: '100%',
              }}
              center={context?.store}
              zoom={15}
              streetViewControl={false}
              mapTypeControl={false}
            >
              {/* STORE POSITION*/}
              {context?.store && (
                <Marker
                  position={{
                    lat: context.store.lat,
                    lng: context.store.lng,
                  }}
                  icon={
                    'http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png'
                  }
                />
              )}

              {/* RENDER AREAS */}
              {context?.areas?.map((area, index) => {
                const { distributionArea = [], id } = area;
                return (
                  <Polygon
                    strokeColor='#333'
                    strokeWeight={1}
                    fillColor={randomColor()}
                    key={index + 1}
                    paths={distributionArea.map((point: GeoPoint) => ({
                      lat: point.latitude,
                      lng: point.longitude,
                    }))}
                    editable={context.idArea ? context.idArea === id : false}
                    clickable={!create}
                    id={id}
                    zIndex={-(100 + index * 50)}
                  />
                );
              })}

              {/* CREATE NEW AREA */}
              {create &&
                context?.points.map(({ coors, id }, i) => (
                  <Marker key={i} position={coors} id={id} />
                ))}
              {create && (
                <Polygon
                  strokeColor='#000'
                  strokeWeight={2}
                  fillColor={randomColor()}
                  paths={context?.points.map(({ coors }) => ({
                    lat: coors.lat(),
                    lng: coors.lng(),
                  }))}
                  zIndex={1000}
                />
              )}
            </Map>
          </Wrapper>
        </div>
        <div className=' grid col-span-4'>
          {showList && <ListAreas handleShow={setShowList} />}
        </div>
      </div>
    </>
  );
};
