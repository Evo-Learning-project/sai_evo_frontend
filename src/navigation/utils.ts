import { SidebarOption } from "./sidebar";

export const internalSidebarOptionsToSidebarMenuOptions = (opts: SidebarOption[]): any =>
	opts.map(o => ({
		href: {
			name: o.routeName ?? "",
			...(o.routeParams && { params: o.routeParams }),
		},
		title: o.label,
		icon: {
			element: "span",
			class: "material-icons-outlined",
			text: o.icon ?? "",
		},
		children: o.children?.map(c => ({
			href: {
				name: c,
			},
		})),
		// child: (o.children ?? []).flatMap(c =>
		// 	internalSidebarOptionsToSidebarMenuOptions([
		// 		{ routeName: c, label: "", requiredPrivileges: [] },
		// 	]),
		// ),
		// child: o.children?.map(c => ({
		// 	href: {
		// 		name: c,
		// 	},
		// })),
	}));
