import { Areas } from './Areas'
import { MapProvider } from './componets/stateManagement/MapProvider'

export const Index = (): JSX.Element => {
    return (
        
        <MapProvider>
            <Areas />
        </MapProvider>
        
    )
}