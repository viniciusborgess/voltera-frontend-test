export async function load({ url, fetch }) {
	const name = url.searchParams.get('name');

	if (!name) {
		return { result: null };
	}

	const res = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name)}`);
	if (!res.ok) {
		return { result: null };
	}

	const data = await res.json();
	return { result: data };
} 