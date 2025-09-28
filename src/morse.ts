export const MORSE_CODE_MAP: Record<string, string> = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	V: "...-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	"1": ".----",
	"2": "..---",
	"3": "...--",
	"4": "....-",
	"5": ".....",
	"6": "-....",
	"7": "--...",
	"8": "---..",
	"9": "----.",
	"0": "-----",
	".": ".-.-.-",
	",": "--..--",
	"?": "..--..",
	"'": ".----.",
	"!": "-.-.--",
	"/": "-..-.",
	"(": "-.--.",
	")": "-.--.-",
	"&": ".-...",
	":": "---...",
	";": "-.-.-.",
	"=": "-...-",
	"+": ".-.-.",
	"-": "-....-",
	_: "..--.-",
	'"': ".-..-.",
	$: "...-..-",
	"@": ".--.-.",
	" ": "/",
};

export class MorseCodePlayer {
	private audioContext: AudioContext;
	private currentlyPlaying = false;
	private playQueue: string[] = [];
	private visualElement: HTMLElement;

	private readonly DOT_DURATION = 100;
	private readonly DASH_DURATION = this.DOT_DURATION * 3;
	private readonly SYMBOL_PAUSE = this.DOT_DURATION;
	private readonly LETTER_PAUSE = this.DOT_DURATION * 3;
	private readonly WORD_PAUSE = this.DOT_DURATION * 7;
	private readonly FREQUENCY = 600; // Hz

	constructor(visualElement: HTMLElement) {
		this.audioContext = new (window.AudioContext ||
			(window as typeof window & { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext)();
		this.visualElement = visualElement;
	}

	textToMorse(text: string): string {
		return text
			.toUpperCase()
			.split("")
			.map((char) => MORSE_CODE_MAP[char] || "")
			.join(" ");
	}

	addToQueue(text: string): void {
		this.playQueue.push(...text.toUpperCase().split(""));
		this.processQueue();
	}

	clearQueue(): void {
		this.playQueue = [];
	}

	private async processQueue(): Promise<void> {
		if (this.currentlyPlaying || this.playQueue.length === 0) return;

		this.currentlyPlaying = true;

		while (this.playQueue.length > 0) {
			const char = this.playQueue.shift()!;
			await this.playCharacter(char);
		}

		this.currentlyPlaying = false;
	}

	private async playCharacter(char: string): Promise<void> {
		const morseCode = MORSE_CODE_MAP[char];

		if (!morseCode) {
			// Unknown character, just pause briefly
			await this.delay(this.SYMBOL_PAUSE);
			return;
		}

		if (char === " ") {
			// Word separator
			await this.delay(this.WORD_PAUSE);
			return;
		}

		// Play each dot or dash
		for (let i = 0; i < morseCode.length; i++) {
			const symbol = morseCode[i];

			if (symbol === ".") {
				await this.playTone(this.DOT_DURATION);
			} else if (symbol === "-") {
				await this.playTone(this.DASH_DURATION);
			}

			// Pause between symbols (except after the last one)
			if (i < morseCode.length - 1) {
				await this.delay(this.SYMBOL_PAUSE);
			}
		}

		// Pause between letters
		await this.delay(this.LETTER_PAUSE);
	}

	private async playTone(duration: number): Promise<void> {
		return new Promise((resolve) => {
			// Resume audio context if suspended
			if (this.audioContext.state === "suspended") {
				this.audioContext.resume();
			}

			// Create oscillator
			const oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			oscillator.frequency.setValueAtTime(
				this.FREQUENCY,
				this.audioContext.currentTime
			);
			oscillator.type = "sine";

			// Envelope to avoid clicks
			gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(
				0.3,
				this.audioContext.currentTime + 0.01
			);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				this.audioContext.currentTime + duration / 1000 - 0.01
			);

			// Visual feedback
			this.showVisualFlash(duration);

			oscillator.start(this.audioContext.currentTime);
			oscillator.stop(this.audioContext.currentTime + duration / 1000);

			oscillator.onended = () => resolve();
		});
	}

	private showVisualFlash(duration: number): void {
		this.visualElement.classList.add("flash");
		setTimeout(() => {
			this.visualElement.classList.remove("flash");
		}, duration);
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
