import { Paper, Text } from "@mantine/core";
import { useRosTopic } from "hooks/useRosTopic";
// src/components/RosVideoFeed.tsx
import React from "react";
import { useRosStore } from "state/rosStore";

type Props = {
	width?: number;
	height?: number;
	connected: boolean;
};

export const RosVideoFeed = ({
	width = 640,
	height = 480,
	connected,
}: Props) => {
	const imageSrc = useRosStore((s) => s.image);

	return (
		<Paper
			withBorder
			p="xs"
			style={{
				width,
				height,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#000",
			}}
		>
			{connected && imageSrc ? (
				<img
					src={imageSrc}
					alt="ROS Video Feed"
					width={width}
					height={height}
					style={{ objectFit: "cover" }}
				/>
			) : (
				<Text c="gray">Waiting for video stream...</Text>
			)}
		</Paper>
	);
};
