import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { App } from "components/App";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
	<React.StrictMode>
		<MantineProvider>
			<App />
		</MantineProvider>
	</React.StrictMode>,
);
