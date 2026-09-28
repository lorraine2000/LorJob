import type { ReactNode } from "react";

export type AuthContainerProps = {
	children: ReactNode;
	title?: string;
	subtitle?: string;
};

export function AuthContainer({ children, title, subtitle }: AuthContainerProps) {
	return (
		<div className="flex flex-col items-center w-full h-full px-6 sm:px-12 max-sm:bg-gray-700">
			<div className="my-auto flex flex-col items-center justify-center w-full max-w-[600px] sm:px-10 py-10 bg-gray-700 text-white sm:rounded-lg sm:shadow-lg">
				{title && <h1 className="text-2xl leading-snug font-semibold text-white mt-2 mb-4 text-center">{title}</h1>}
				{subtitle && <p className="text-base text-white mb-4 text-center">{subtitle}</p>}
				<div className="w-full mt-4">{children}</div>
			</div>
		</div>
	);
}
