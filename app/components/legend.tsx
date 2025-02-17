// Color mapping for sentiments
const colorMap = {
    anger: "#e74c3c",      // Red 😡
    disgust: "#8e44ad",   // Purple 🤢
    fear: "#34495e",      // Dark Blue-Gray 😨
    joy: "#80ff00",       // Yellow 😀
    neutral: "#666600",   // Gray 😐
    sadness: "#3498db",   // Blue 😭
    surprise: "#e67e22",  // Orange 😲
    null: '#808080'
  };
const ChoroplethMapLegend = () => {
    return (
        <div className="relative bottom left-5 p-4">
            <h3 className="text-lg font-bold">Sentiment Legend</h3>
            <div className="space-y-2">
            {Object.entries(colorMap).map(([sentiment, color]) => (
                <div key={sentiment} className="flex items-center">
                <span
                    className="block w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                ></span>
                <span className="ml-2 capitalize">{sentiment}</span>
                </div>
            ))}
            </div>
        </div>
    );
}

export default ChoroplethMapLegend;



