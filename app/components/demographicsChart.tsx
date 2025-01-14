'use client';

// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/boxplot
import { ResponsiveBar } from '@nivo/bar'
import { useState, useEffect } from 'react';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const DemographicsChart = () => {
    
    // set up variable to hold data
    const [demoData, setDemoData] = useState([]);

    // use useEffect to fetch data when componet is mounted
    useEffect(() => {
        fetch("/api/demographics", {cache: 'no-store'})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setDemoData(data);
        })
        .catch((error) => console.error("Error fetching country counts:", error));
    }, [])

    // Theme object for Nivo Calendar
    const theme = {
        "text":{
            "fontSize": 11,
            "fill": "var(--card-text-col)", // Changes axis text colour based on light or dark mode
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            
            {/* chart title */}
            <h2 style={{ textAlign: 'center', marginBottom: '-30px', marginTop: '5px' }}>
                Demographics Bar Chart
            </h2>

            <ResponsiveBar
                data={demoData}
                keys={['value']}
                indexBy="group"
                margin={{ top: 50, right: 50, bottom: 50, left: 90 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Group',
                legendPosition: 'middle',
                legendOffset: 32,
                }}
                axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Total Week Nights',
                legendPosition: 'middle',
                legendOffset: -60,
                }}
                theme={theme}
                tooltip={({ indexValue, value }) => (
                <strong>
                    {indexValue}: {value} week nights
                </strong>
                )}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 0]] }}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) {
                return e.id + ': ' + e.formattedValue + ' in group: ' + e.indexValue;
                }}
            />
        </div>
    )
}
export default DemographicsChart;