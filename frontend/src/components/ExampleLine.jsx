import { ResponsiveLine } from '@nivo/line'

const MyResponsiveLine = ({data}) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 60, bottom: 70, left: 80 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto', 
            stacked: true,
            reverse: false
        }}
        yFormat=" >-$.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 50,
        }}
        colors="#2196f3"
        axisLeft={{
            orient: 'left',
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: 5,
            legend: '$ price',
            legendOffset: -60,
            legendPosition: 'middle'
        }}
        enableGridY={false}
        enableGridX={false}
        enablePoints={false}
        useMesh={true}
    />
)

export default MyResponsiveLine