import { serialize } from "cookie";

export function setCookie(name: string, value: string, options: any = {}) {
	const {
		maxAge = 7 * 24 * 60 * 60,
		path = "/",
		httpOnly = true,
		secure = false,
	} = options;
	return serialize(name, value, {
		maxAge,
		path,
		httpOnly,
		secure,
		sameSite: "strict",
	});
}
