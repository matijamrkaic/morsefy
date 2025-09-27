import "./style.css";
import { MORSE_CODE_MAP, MorseCodePlayer } from "./morse";

class MorsefyApp {
	private document: Document;
	private textInput: string;
	// private h1: HTMLElement;
	// private originalH1: string;
	private textOutput: HTMLElement;
	private morseOutput: HTMLElement;
	private visualFlash: HTMLElement;
	private morsePlayer: MorseCodePlayer;

	constructor() {
		this.document = document;
		this.textInput = "";
		// this.h1 = this.document.querySelector("h1") as HTMLElement;
		// this.originalH1 = this.h1.textContent;
		this.textOutput = document.getElementById("textOutput") as HTMLElement;
		this.morseOutput = document.getElementById("morseOutput") as HTMLElement;
		this.visualFlash = document.getElementById("visualFeedback") as HTMLElement;

		this.morsePlayer = new MorseCodePlayer(this.visualFlash);

		this.setupEventListeners();

		// setTimeout(() => {
		// 	this.animateH1();
		// }, 2000);
	}

	private setupEventListeners(): void {
		this.document.addEventListener("keydown", (e) => {
			console.log(e);
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
			}
		});
	}

	// private animateH1(): void {
	// 	const values = ["Start typing...", "-./.-.--.-.-/.-", "-./ Morsefy /.-"];

	// 	const writeOriginal = () => {
	// 		const intervalId = setInterval(() => {
	// 			this.h1.textContent = this.h1.textContent.slice(0, -1);
	// 			if (this.h1.textContent.length === 0) {
	// 				typeAnimation();
	// 				clearInterval(intervalId);
	// 			}
	// 		}, 70);
	// 	};

	// 	const typeAnimation = () => {
	// 		let index = 0;
	// 		const changeText = () => {
	// 			if (this.textInput) {
	// 				writeOriginal();
	// 				return;
	// 			}

	// 			if (index < values.length) {
	// 				const currentValue = values[index];
	// 				const previousValue =
	// 					index === 0 ? this.h1.textContent : values[index - 1];
	// 				const maxLength = Math.max(currentValue.length, previousValue.length);
	// 				let charIndex = 0;

	// 				const typeChar = () => {
	// 					if (charIndex < maxLength) {
	// 						const newChar =
	// 							charIndex < currentValue.length ? currentValue[charIndex] : " ";
	// 						const currentText = this.h1.textContent;
	// 						this.h1.textContent =
	// 							currentText.substring(0, charIndex) +
	// 							newChar +
	// 							currentText.substring(charIndex + 1);
	// 						charIndex++;
	// 						setTimeout(typeChar, 70);
	// 					} else {
	// 						index++;
	// 						setTimeout(changeText, 1500);
	// 					}
	// 				};

	// 				if (this.h1.textContent.length < maxLength) {
	// 					this.h1.textContent = this.h1.textContent.padEnd(maxLength, " ");
	// 				}
	// 				typeChar();
	// 			} else {
	// 				index = 0;
	// 				changeText();
	// 			}
	// 		};

	// 		changeText();
	// 	};

	// 	const intervalId = setInterval(() => {
	// 		this.h1.textContent = this.h1.textContent.slice(0, -1);
	// 		if (this.h1.textContent.length === 0) {
	// 			typeAnimation();
	// 			clearInterval(intervalId);
	// 		}
	// 	}, 70);
	// }
}

document.addEventListener("DOMContentLoaded", () => {
	new MorsefyApp();
});
