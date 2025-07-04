import { Button, Group, Stack, Text } from "@mantine/core";
import { useHuskyTeleop } from "hooks/useHusky";
import { useRef } from "react";

export const HuskyJoystickButtons = ({ ipAddress }: { ipAddress: string }) => {
	const { sendCommand, connected } = useHuskyTeleop(ipAddress);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const startCommandLoop = (linear: number, angular: number) => {
		stopCommandLoop(); // prevent multiple intervals
		sendCommand(linear, angular);
		intervalRef.current = setInterval(() => {
			// console.log("going");
			sendCommand(linear, angular);
		}, 100); // 10 Hz
	};

	const stopCommandLoop = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		// console.log("stopping");
		sendCommand(0, 0);
	};
	// Helper to stop the robot
	// const stop = () => sendCommand(0, 0);
	const velocity = 0.1; // m/s
	return (
		<Stack align="center">
			<Text fw={500}>
				Status: {connected ? "✅ Connected" : "❌ Disconnected"}
			</Text>

			<Group>
				<Button
					onMouseDown={() => startCommandLoop(velocity, 0)}
					onMouseUp={stopCommandLoop}
					onTouchStart={() => startCommandLoop(velocity, 0)}
					onTouchEnd={stopCommandLoop}
					disabled={!connected}
				>
					Forward
				</Button>
			</Group>

			<Group>
				<Button
					onMouseDown={() => startCommandLoop(0, velocity)}
					onMouseUp={stopCommandLoop}
					onTouchStart={() => startCommandLoop(0, velocity)}
					onTouchEnd={stopCommandLoop}
					disabled={!connected}
				>
					Left
				</Button>
				<Button onMouseDown={stop} onTouchStart={stop} disabled={!connected}>
					Stop
				</Button>
				<Button
					onMouseDown={() => startCommandLoop(0, -velocity)}
					onMouseUp={stopCommandLoop}
					onTouchStart={() => startCommandLoop(0, -velocity)}
					onTouchEnd={stopCommandLoop}
					disabled={!connected}
				>
					Right
				</Button>
			</Group>

			<Group>
				<Button
					onMouseDown={() => startCommandLoop(-velocity, 0)}
					onMouseUp={stopCommandLoop}
					onTouchStart={() => startCommandLoop(-velocity, 0)}
					onTouchEnd={stopCommandLoop}
					disabled={!connected}
				>
					Backward
				</Button>
			</Group>
		</Stack>
	);
};
