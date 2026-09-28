import { FR, US } from "country-flag-icons/react/3x2";

export const staticNavigation = [
	{ name: "Home", href: "/dashboard" },
	{ name: "Mes candidatures", href: "/applications" },
	{ name: "Mes notifications", href: "/notifications" },
	{ name: "Profile", href: "/profile" },
	{ name: "Logout", href: "/logout" },
];

export const languages = {
	fr: { name: "Français", icon: <FR className="w-6 h-4" /> },
	en: { name: "English", icon: <US className="w-6 h-4" /> },
};
