import Chart from "react-apexcharts";

const BOX_UPPER = "#5eead4"; // teal-300
const BOX_LOWER = "#2dd4bf"; // teal-400
const OBSERVED_COLOR = "#fc0345";

// Pure: derive a box-and-whisker model from a contract metric's quantiles.
// quantiles are keyed by fraction: min / Q1 / median / Q3 / max.
export function buildBoxModel(metric) {
  const q = metric.ensemble.quantiles;
  return {
    category: metric.label,
    box: [q["0"], q["0.25"], q["0.5"], q["0.75"], q["1"]], // [min, Q1, median, Q3, max]
    observed: metric.observed,
    observedPercentile: metric.observed_percentile,
  };
}

export default function IncumbentVariation({ metric }) {
  const { category, box, observed, observedPercentile } = buildBoxModel(metric);
  const asPct = (v) => `${(v * 100).toFixed(1)}%`;
  const pctile = Math.round((observedPercentile ?? 0) * 100);

  const options = {
    chart: { type: "boxPlot", height: 260, width: 360, toolbar: { show: false } },
    title: { text: metric.label, align: "center", style: { fontSize: "13px" } },
    plotOptions: { boxPlot: { colors: { upper: BOX_UPPER, lower: BOX_LOWER } } },
    // enacted value drawn as a labeled line across the box so you can see where
    // the observed plan falls within the ensemble distribution.
    annotations: {
      yaxis: [
        {
          y: observed,
          borderColor: OBSERVED_COLOR,
          strokeDashArray: 4,
          label: {
            text: `enacted ${asPct(observed)} (${pctile}th pct)`,
            position: "left",
            textAnchor: "start",
            borderColor: OBSERVED_COLOR,
            style: { background: OBSERVED_COLOR, color: "#fff", fontSize: "11px" },
          },
        },
      ],
    },
    xaxis: { labels: { show: false } },
    yaxis: {
      labels: { formatter: (v) => `${Math.round(v * 100)}%` },
      title: { text: "variation" },
    },
    tooltip: { shared: false },
    legend: { show: false },
  };

  const series = [{ type: "boxPlot", data: [{ x: category, y: box }] }];

  return <Chart options={options} series={series} type="boxPlot" height={260} width={360} />;
}
