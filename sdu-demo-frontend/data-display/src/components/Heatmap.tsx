import { useElementSize } from "@mantine/hooks";
import { backgroundColor, fontColor } from "colors";
import type * as Plotly from "plotly.js";
import Plot from "react-plotly.js";
import { useRosStore } from "state/rosStore";

export const SignalHeatmap = () => {
	const { ref, width, height } = useElementSize();
	const zData = useRosStore((s) => s.zData);

	const layout: Partial<Plotly.Layout> = {
		title: "Signal Heatmap",
		xaxis: { title: "Time index" },
		yaxis: { title: "Frame", showticklabels: false },
		width,
		height: height > 500 ? height : 500,
		margin: { l: 60, r: 20, t: 50, b: 40 },
	};

	const data: Partial<Plotly.Data>[] = [
		{
			z: zData,
			type: "heatmap",
			colorbar: {
				title: "Amplitude",
				titleside: "right",
			},
		},
	];

	return (
		<div ref={ref} style={{ width: "80vw%", height: "50vh" }}>
			<Plot
				data={data}
				layout={layout}
				config={{ responsive: true, displayModeBar: false }}
				useResizeHandler
			/>
		</div>
	);
};

export const getHeatmapLayout = (
	xlabel: string,
	ylabel: string,
	bgColor = "#111111",
): Partial<Plotly.Layout> => {
	return {
		plot_bgcolor: bgColor,
		font: {
			color: fontColor,
			size: 14,
		},
		xaxis: {
			title: xlabel,
			tickcolor: fontColor,
			showgrid: false,
			zerolinecolor: bgColor,
		},
		yaxis: {
			title: ylabel,
			tickcolor: fontColor,
			showgrid: false,
			zerolinecolor: bgColor,
		},
		paper_bgcolor: backgroundColor,
		margin: {
			t: 70,
		},
	};
};
