import Chart from "react-apexcharts";

const OBSERVED_COLOR = "#fc0345";
const ENSEMBLE_COLOR = "#185a87";

// Pure: derive the bar-chart model from a contract metric's histogram.
export function buildBarModel(metric) {
  const { bin_edges: edges, counts } = metric.ensemble.histogram;
  const pct = (x) => Math.round(x * 100);
  const categories = counts.map((_, i) => `${pct(edges[i])}-${pct(edges[i + 1])}%`);

  // bin containing `observed`: last edge whose left bound <= observed, clamped.
  let highlightIndex = 0;
  for (let i = 0; i < counts.length; i++) {
    if (metric.observed >= edges[i]) highlightIndex = i;
  }
  if (metric.observed < edges[0]) highlightIndex = 0;
  if (metric.observed >= edges[edges.length - 1]) highlightIndex = counts.length - 1;

  return { categories, counts, highlightIndex };
}

export default function IncumbentVariation({ metric }) {
  const { categories, counts, highlightIndex } = buildBarModel(metric);
  const data = counts.map((y, i) => ({
    x: categories[i],
    y,
    fillColor: i === highlightIndex ? OBSERVED_COLOR : ENSEMBLE_COLOR,
  }));

  const options = {
    chart: { type: "bar", height: 350, width: 400, toolbar: { show: false } },
    grid: { show: false },
    plotOptions: { bar: { columnWidth: "60%" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1, colors: ["#fff"] },
    tooltip: { shared: false, intersect: true },
    title: { text: metric.label, align: "center" },
    xaxis: { title: { text: "Change range (%)" }, labels: { rotate: -60 } },
    yaxis: { title: { text: "# plans" } },
  };

  return (
    <Chart options={options} series={[{ name: "Plans", data }]} type="bar" height={350} width={400} />
  );
}
