// src/hooks/useHuskyTeleop.ts
import { useEffect, useRef, useState } from "react";
import ROSLIB from "roslib";

export function useHuskyTeleop(rosUrl: string) {
	const [connected, setConnected] = useState(false);
	const rosRef = useRef<ROSLIB.Ros>();
	const topicRef = useRef<ROSLIB.Topic>();

	useEffect(() => {
		const ros = new ROSLIB.Ros({ url: rosUrl });
		rosRef.current = ros;

		ros.on("connection", () => {
			setConnected(true);
			topicRef.current = new ROSLIB.Topic({
				ros,
				name: "/a300_00008/cmd_vel",
				messageType: "geometry_msgs/msg/TwistStamped",
			});
		});

		ros.on("error", (err) => {
			console.error("ROS connection error:", err);
			setConnected(false);
		});

		ros.on("close", () => {
			setConnected(false);
		});

		return () => {
			if (topicRef.current) {
				topicRef.current.unadvertise?.(); // Only needed if you're publishing
				topicRef.current = undefined;
			}

			if (rosRef.current?.isConnected) {
				rosRef.current.close();
				rosRef.current = undefined;
			}
		};
	}, [rosUrl]);

	const sendCommand = (linearX: number, angularZ: number) => {
		if (!topicRef.current) {
			console.warn("ROS topic not ready");
			return;
		}

		const msg = new ROSLIB.Message({
			twist: {
				linear: { x: linearX, y: 0, z: 0 },
				angular: { x: 0, y: 0, z: angularZ },
			},
		});

		topicRef.current.publish(msg);
	};

	return { sendCommand, connected };
}
