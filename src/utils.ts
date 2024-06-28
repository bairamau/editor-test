export function clsx(...conditions: (string | boolean)[]) {
	return conditions.filter(Boolean).join(' ');
}