// hooks/useRosTopic.js
import { useEffect, useRef, useState } from "react";
import ROSLIB from "roslib";

type UseRosTopicParams<T> = {
	url: string;
	topicName: string;
	messageType: string;
	transformMessage: (msg: unknown) => T;
	setter: (value: T | null) => void;
};

export function useRosTopic<T>({
	url,
	topicName,
	messageType,
	transformMessage,
	setter,
}: UseRosTopicParams<T>) {
	const [connected, setConnected] = useState(false);

	const rosRef = useRef<ROSLIB.Ros | null>(null);
	const topicRef = useRef<ROSLIB.Topic | null>(null);

	useEffect(() => {
		const ros = new ROSLIB.Ros({ url });
		rosRef.current = ros;

		ros.on("connection", () => setConnected(true));
		ros.on("error", (err) => {
			console.error("ROS error:", err);
			setConnected(false);
		});
		ros.on("close", () => {
			console.warn("ROS connection closed");
			setConnected(false);
		});

		const topic = new ROSLIB.Topic({
			ros,
			name: topicName,
			messageType,
		});
		topicRef.current = topic;

		topic.subscribe((msg: object) => {
			try {
				setter(transformMessage(msg));
			} catch (err) {
				console.error("Error in transformMessage:", err);
			}
		});

		return () => {
			topic.unsubscribe();
			topicRef.current = null;

			if (rosRef.current?.isConnected) {
				rosRef.current.close();
			}
			rosRef.current = null;
		};
	}, [url, topicName, messageType, transformMessage, setter]);

	return { connected };
}
