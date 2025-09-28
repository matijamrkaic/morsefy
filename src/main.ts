import "./style.css";
import { MORSE_CODE_MAP, MorseCodePlayer } from "./morse";

class MorsefyApp {
	private document: Document;
	private textInput: string;
	private placeholder: HTMLElement;
	private placeholderVisible: boolean;
	private textOutput: HTMLElement;
	private morseOutput: HTMLElement;
	private visualFlash: HTMLElement;
	private morsePlayer: MorseCodePlayer;

	constructor() {
		this.document = document;
		this.textInput = "";
		this.placeholder = this.document.getElementById(
			"placeholder"
		) as HTMLElement;
		this.placeholderVisible = true;
		this.textOutput = document.getElementById("textOutput") as HTMLElement;
		this.morseOutput = document.getElementById("morseOutput") as HTMLElement;
		this.visualFlash = document.getElementById("visualFeedback") as HTMLElement;

		this.morsePlayer = new MorseCodePlayer(this.visualFlash);

		this.setupEventListeners();

		this.animatePlaceholder();
		setTimeout(() => {}, 2000);
	}

	private setupEventListeners(): void {
		this.document.addEventListener("keydown", (e) => {
			if (e.repeat || e.metaKey || e.ctrlKey) {
				return;
			}

			if (e.key === " " && this.textInput.slice(-1) === " ") {
				return;
			}

			const morseCode = MORSE_CODE_MAP[e.key.toUpperCase()];

			if (morseCode) {
				this.textInput += e.key;
				this.textOutput.textContent += e.key;
				this.morseOutput.textContent += morseCode + " ";
				this.morsePlayer.addToQueue(e.key);

				if (this.placeholderVisible) {
					this.placeholder.style.display = "none";
					this.placeholderVisible = false;
				}
			}
		});
	}

	private animatePlaceholder(): void {
		const values = ["-./.-.--.-.-/.-", "Start typing..."];

		const typeAnimation = () => {
			let index = 0;
			const changeText = () => {
				if (this.textInput) {
					return;
				}

				if (index < values.length) {
					const currentValue = values[index];
					const previousValue =
						index === 0 ? this.placeholder.textContent : values[index - 1];
					const maxLength = Math.max(currentValue.length, previousValue.length);
					let charIndex = 0;

					const typeChar = () => {
						if (charIndex < maxLength) {
							const newChar =
								charIndex < currentValue.length ? currentValue[charIndex] : " ";
							const currentText = this.placeholder.textContent;
							this.placeholder.textContent =
								currentText.substring(0, charIndex) +
								newChar +
								currentText.substring(charIndex + 1);
							charIndex++;
							setTimeout(typeChar, 70);
						} else {
							index++;
							setTimeout(changeText, 1500);
						}
					};

					if (this.placeholder.textContent.length < maxLength) {
						this.placeholder.textContent = this.placeholder.textContent.padEnd(
							maxLength,
							" "
						);
					}
					typeChar();
				} else {
					index = 0;
					changeText();
				}
			};

			changeText();
		};

		typeAnimation();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new MorsefyApp();
});
