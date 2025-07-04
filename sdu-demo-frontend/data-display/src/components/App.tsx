import { Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { Chart } from "chart.js";
import { ScatterPlot } from "components/ScatterPlot";
import { useRosTopic } from "hooks/useRosTopic";
import { useRef } from "react";
import { useRosStore } from "state/rosStore";
import { SignalHeatmap } from "./Heatmap";
import { HuskyJoystickButtons } from "./Joystick";
import { RosVideoFeed } from "./VideoFeed";

type Float32MultiArray = {
	layout: {
		dim: { label: string; size: number; stride: number }[];
		data_offset: number;
	};
	data: number[];
};

type CompressedImageMsg = {
	format: string;
	data: string; // base64-encoded image data
};

export const App = () => {
	const traceRef = useRef<Chart<"scatter">>();
	const ipAddress = "ws://192.168.0.192:9090";

	const setSignal = useRosStore((s) => s.setSignal);
	const setTime = useRosStore((s) => s.setTime);
	const setImage = useRosStore((s) => s.setImage);

	const { connected: signalConnected } = useRosTopic<number[]>({
		topicName: "/signal",
		messageType: "std_msgs/msg/Float32MultiArray",
		url: ipAddress,
		transformMessage: (msg: unknown) => (msg as Float32MultiArray).data,
		setter: setSignal,
	});

	const { connected: timeConnected } = useRosTopic<number[]>({
		topicName: "/time",
		messageType: "std_msgs/msg/Float32MultiArray",
		url: ipAddress,
		transformMessage: (msg: unknown) => (msg as Float32MultiArray).data,
		setter: setTime,
	});

	const { connected: videoConnected } = useRosTopic<string | null>({
		url: ipAddress,
		topicName: "/camera/image/compressed",
		messageType: "sensor_msgs/msg/CompressedImage",
		transformMessage: (msg: unknown) => {
			const { data, format } = msg as CompressedImageMsg;
			const mime = format.toLowerCase().includes("png")
				? "image/png"
				: "image/jpeg";
			return `data:${mime};base64,${data}`;
		},
		setter: setImage,
	});

	return (
		<Container size="md" py="md">
			<Group>
				{/* <HuskyJoystickButtons ipAddress={ipAddress} /> */}
				{/* <RosVideoFeed width={640} height={480} connected={videoConnected} /> */}
			</Group>
			<Stack>
				{/* <Title order={2}>Timetrace</Title> */}
				<Text>
					Status: {signalConnected ? "✅ Connected" : "❌ Disconnected"}
				</Text>
				<Text>
					Status: {timeConnected ? "✅ Connected" : "❌ Disconnected"}
				</Text>
				<Paper withBorder p="md" style={{ height: "400px" }}>
					<ScatterPlot traceRef={traceRef} />
				</Paper>
				<SignalHeatmap />
			</Stack>
		</Container>
	);
};
