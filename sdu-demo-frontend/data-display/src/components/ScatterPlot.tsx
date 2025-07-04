import {
	type Chart,
	Chart as ChartJS,
	type ChartOptions,
	LineElement,
	LinearScale,
	PointElement,
	ScatterController,
	Title,
	Tooltip,
} from "chart.js";
import { fontColor } from "colors";

import type React from "react";

ChartJS.register(
	PointElement,
	LineElement,
	LinearScale,
	Title,
	Tooltip,
	ScatterController,
);
import { Scatter } from "react-chartjs-2";
import { useRosStore } from "state/rosStore";

ChartJS.register(PointElement, LinearScale, Title, Tooltip);

type Props = {
	traceRef: React.MutableRefObject<Chart<"scatter"> | undefined>;
};

export const ScatterPlot = ({ traceRef }: Props) => {
	const x = useRosStore((s) => s.time);
	const y = useRosStore((s) => s.signal);
	if (!(x && y) || x.length === 0 || y.length === 0) {
		return <div>No data available</div>;
	}
	const traceColor = "#712957a6";
	const data = {
		datasets: [
			{
				label: "Signal",
				data: x.map((xVal, i) => ({ x: xVal, y: y[i] })),
				pointRadius: 2,
				backgroundColor: traceColor,
				showLine: true,
				borderColor: traceColor,
				borderWidth: 2.0,
			},
		],
	};

	return (
		<Scatter data={data} options={getDefaultScatterOptions()} ref={traceRef} />
	);
};

function getDefaultScatterOptions(): ChartOptions<"scatter"> {
	return {
		maintainAspectRatio: false,
		plugins: {
			title: {
				text: "",
				display: true,
				align: "start",
				color: fontColor,
				font: {
					size: 22,
				},
				padding: {
					bottom: 30,
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const raw = context.raw as { x: number; y: number }; // Type assertion here since raw is of type unknown (which it isnt)
						const xValue = raw.x.toPrecision(3);
						const yValue = raw.y.toPrecision(3);
						return `x: ${xValue}, y: ${yValue}`;
					},
				},
			},
		},
		animation: {
			duration: 0,
		},
		scales: {
			x: {
				grid: {
					color: "#cccccc",
				},
				ticks: {
					color: fontColor,
					callback: (value: string | number) => value,
				},
				title: {
					display: true,
					text: "Time [ps]",
					color: fontColor,
					align: "end",
					font: {
						size: 18,
					},
				},
			},
			y: {
				grid: {
					color: "#cccccc",
				},
				ticks: {
					color: fontColor,
				},
				title: {
					display: true,
					text: "Signal [a.u.]",
					color: fontColor,
					align: "end",
					font: {
						size: 18,
					},
				},
			},
		},
	};
}
