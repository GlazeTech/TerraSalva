import { create } from "zustand";

type RosState = {
	signal: number[] | null;
	time: number[] | null;
	image: string | null;
	zData: number[][];

	setSignal: (data: number[] | null) => void;
	setTime: (data: number[] | null) => void;
	setImage: (imageData: string | null) => void;
	_appendZRow: (row: number[]) => void;
};

export const useRosStore = create<RosState>((set, get) => ({
	signal: null,
	time: null,
	image: null,
	zData: [],
	setSignal: (data) => {
		set({ signal: data });
		const time = get().time;
		if (data && time && time.length === data.length) {
			get()._appendZRow(data);
		}
	},
	setTime: (data) => set({ time: data }),
	setImage: (img) => set({ image: img }),
	_appendZRow: (row) => {
		set((state) => {
			const updated = [...state.zData, row];
			const maxRows = 60;
			return {
				zData: updated.length > maxRows ? updated.slice(-maxRows) : updated,
			};
		});
	},
}));
