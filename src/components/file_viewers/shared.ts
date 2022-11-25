export const fileViewerProps = {
	// base64 source of the file
	source: {
		type: String, //Object as PropType<Blob>,
		default: "" as const,
	},
	// url to fetch the file - alternative to the source prop depending on the viewer
	url: {
		type: String,
		default: "" as const,
	},
	filename: {
		type: String,
		required: true as const,
	},
	downloading: {
		type: Boolean,
		default: false as const,
	},
	id: {
		type: String,
		default: "" as const,
	},
};
