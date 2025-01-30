export class Slug {
	public value: string;

	constructor(value: string) {
		this.value = value;
	}

	/**
	 * Receives a text and normalizes it as a slug
	 *
	 * Example: "An example title" => "an-example-title"
	 * @param text {string}
	 */
	static createFromText(text: string): Slug {
		const slugText = text
			.normalize('NFKD')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/_/g, '-')
			.replace(/--+/g, '-')
			.replace(/-$/, '');
		return new Slug(slugText);
	}
}
