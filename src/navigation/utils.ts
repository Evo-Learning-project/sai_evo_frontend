import { SidebarOption } from "./sidebar";

export const internalSidebarOptionsToSidebarMenuOptions = (opts: SidebarOption[]) =>
	opts.map(o => ({
		href: { name: o.routeName ?? "" },
		title: o.label,
		icon: {
			element: "span",
			class: "material-icons-outlined",
			text: o.icon ?? "",
		},
		//child: [{ href: { name: "ExerciseSolutionThread" }, title: "Discussione esercizio" }],
		// badge: {
		// 	text: "99+",
		// 	class: "vsm--badge_default",
		// 	// attributes: {}
		// 	// element: 'span'
		// },
	}));
