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
		// child: o.children?.map(
		// 	c =>
		// 		internalSidebarOptionsToSidebarMenuOptions([
		// 			{
		// 				routeName: c,
		// 				label: "",
		// 				requiredPrivileges: [],
		// 			},
		// 		]) as any,
		// ),
	}));
